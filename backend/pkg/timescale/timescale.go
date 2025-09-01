package timescale

import (
	"context"
	"fmt"
	"reflect"
	"sync"
	"time"

	slog "github.com/charmbracelet/log"

	"gorm.io/gorm"
)

var onces sync.Map

func GetPostgresGormTypedDB(ctx context.Context, model Table) *gorm.DB {
	if reflect.ValueOf(model).Kind() != reflect.Pointer {
		panic("model must be a pointer")
	}

	table := model

	// get table from aggregate view
	for t, ok := table.(AggregateView); ok; t, ok = table.(AggregateView) {
		table = t.SourceTable()
	}

	once, _ := onces.LoadOrStore(table.TableName(), new(sync.Once))
	once.(*sync.Once).Do(func() {
		err := init_table(table)
		if err != nil {
			panic(err)
		}
		slog.Info("created table", "name", table.TableName())
	})

	if ctx == nil {
		return GetPostgresGormDB().Model(model)
	}

	return GetPostgresGormDB().Model(model).WithContext(ctx)
}

func init_table(model Table) error {

	db := GetPostgresGormDB()
	err := db.AutoMigrate(model)
	slog.Info("migrate table", "name", model.TableName())
	if err != nil {
		return fmt.Errorf("error migrate table :%w", err)
	}

	if t, ok := model.(HyperTable); ok {
		slog.Info("create_hypertable")
		err := create_hypertable(db, t)
		if err != nil {
			return fmt.Errorf("error create hypertable :%w", err)
		}
	}

	for aggregate := model; true; {
		if t, ok := aggregate.(Aggregatable); ok {
			slog.Info("create_aggregateView", "name", t.AggregateView().TableName())
			err := create_aggregateView(db, t.AggregateView())
			if err != nil {
				return fmt.Errorf("error create aggregateView :%w", err)
			}
			aggregate = t.AggregateView()
		} else {
			break
		}
	}

	if t, ok := model.(CompressInterface); ok {
		slog.Info("create_compressStrategy")
		err := create_compressStrategy(db, t)
		if err != nil {
			return fmt.Errorf("error create aggregateView :%w", err)
		}
	}

	return nil

}

func continuousAggregateViewExists(db *gorm.DB, viewName string) (bool, error) {
	var count int64
	//nolint: lll
	query := fmt.Sprintf(`SELECT COUNT(*) FROM timescaledb_information.continuous_aggregates WHERE view_name = '%s';`, viewName)
	err := db.Raw(query).Scan(&count).Error
	if err != nil {
		return false, err
	}

	return count > 0, nil
}

type CompressInterface interface {
	HyperTable
	Compress_Interval() string
}

const compress = false

func create_compressStrategy(db *gorm.DB, table CompressInterface) error {

	if !compress {
		return nil
	}

	if table.Compress_Interval() == "" {
		return nil
	}

	var count int64
	err := db.Select("*").Table("timescaledb_information.compression_settings").
		Where("hypertable_name = ?", table.TableName()).Count(&count).Error
	if err != nil {
		return fmt.Errorf("check compress setting: %w", err)
	}

	if count == 0 {
		err = db.Exec(fmt.Sprintf("ALTER TABLE %s SET (timescaledb.compress = true)", table.TableName())).Error
		if err != nil {
			return fmt.Errorf("enable compress: %w", err)
		}
	}

	return db.Exec(`
	select add_compression_policy(?,
	INTERVAL ?,
	if_not_exists => true
)
`, table.TableName(), table.Compress_Interval()).Error
}

func create_hypertable(db *gorm.DB, table HyperTable) error {
	return db.Exec(`
	SELECT create_hypertable(?,
	by_range(?),
	if_not_exists => TRUE)
`, table.TableName(), table.TimeColum()).Error
}

type Table interface {
	TableName() string
}

type HyperTable interface {
	Table
	TimeColum() string
}

type Aggregatable interface {
	AggregateView() AggregateView
}

func create_aggregateView(db *gorm.DB, view AggregateView) error {
	if view.CreateAggregateViewSql() == "" {
		return nil
	}
	exists, err := continuousAggregateViewExists(db, view.TableName())
	if err != nil {
		return err
	}

	if !exists {
		err := db.Exec(view.CreateAggregateViewSql()).Error
		if err != nil {
			return fmt.Errorf("create aggregateView error: %w", err)
		}

		err = db.Exec(`
		select add_continuous_aggregate_policy(?,
		start_offset => INTERVAL ?,
		end_offset => INTERVAL ?,
		schedule_interval => INTERVAL ?
	)
	`, view.TableName(), view.StartInterval(), view.EndInterval(), view.ScheduleInterval()).Error
		if err != nil {
			db.Exec("DROP MATERIALIZED VIEW quorum_daily")
			return fmt.Errorf("create aggregate policy: %w", err)
		}
	}

	for _, sql := range view.AggregateViewIndexesSql() {
		err := db.Exec(sql).Error
		if err != nil {
			return fmt.Errorf("create aggregateView index error: %w", err)
		}
	}

	return nil
}

type AggregateView interface {
	HyperTable

	// refresh stragety
	EndInterval() string
	StartInterval() string
	ScheduleInterval() string

	// sql AggregateView
	CreateAggregateViewSql() string
	AggregateViewIndexesSql() []string
	SourceTable() HyperTable
}

func DaysAgo(startTime time.Time, days int) time.Time {
	nDaysAgo := startTime.AddDate(0, 0, -1*days)
	return time.Date(nDaysAgo.Year(), nDaysAgo.Month(), nDaysAgo.Day(), 0, 0, 0, 0, time.UTC)
}

func HoursAgo(startTime time.Time, hours int) time.Time {
	nDaysAgo := startTime.Add(-1 * time.Duration(hours) * time.Hour)
	return time.Date(nDaysAgo.Year(), nDaysAgo.Month(), nDaysAgo.Day(), nDaysAgo.Hour(), 0, 0, 0, time.UTC)
}
