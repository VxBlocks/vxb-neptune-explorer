package timescale

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"time"

	"gorm.io/gorm"
	gormlogger "gorm.io/gorm/logger"
	"gorm.io/gorm/utils"
)

type GormLogger struct {
	LogLevel                  gormlogger.LogLevel
	IgnoreRecordNotFoundError bool
	SlowThreshold             time.Duration
}

// Error implements logger.Interface.
func (l *GormLogger) Error(ctx context.Context, msg string, data ...any) {
	if l.LogLevel >= gormlogger.Error {
		slog.Error(msg, append([]any{utils.FileWithLineNum()}, data...)...)
	}
}

// Info implements logger.Interface.
func (l *GormLogger) Info(ctx context.Context, msg string, data ...any) {
	if l.LogLevel >= gormlogger.Warn {
		slog.Error(msg, append([]any{utils.FileWithLineNum()}, data...)...)
	}
}

// Warn implements logger.Interface.
func (l *GormLogger) Warn(ctx context.Context, msg string, data ...any) {
	if l.LogLevel >= gormlogger.Warn {
		slog.Warn(msg, append([]any{utils.FileWithLineNum()}, data...)...)
	}
}

// LogMode implements logger.Interface.
func (g *GormLogger) LogMode(gormlogger.LogLevel) gormlogger.Interface {
	return g
}

// Trace implements logger.Interface.
func (l *GormLogger) Trace(ctx context.Context, begin time.Time, fc func() (sql string, rowsAffected int64), err error) {
	if l.LogLevel <= gormlogger.Silent {
		return
	}
	elapsed := time.Since(begin)
	switch {
	case err != nil && l.LogLevel >= gormlogger.Error && (!errors.Is(err, gorm.ErrRecordNotFound) || !l.IgnoreRecordNotFoundError):
		sql, rows := fc()
		if rows == -1 {
			slog.Error("sql error", "target", "gorm", "line", " "+utils.FileWithLineNum(), "err", err, "elapsed", float64(elapsed.Nanoseconds())/1e6)
		} else {
			slog.Error("sql error", "target", "gorm", "line", " "+utils.FileWithLineNum(), "err", err, "elapsed", float64(elapsed.Nanoseconds())/1e6, "row", rows)
		}
		slog.Error(sql)
	case elapsed > l.SlowThreshold && l.SlowThreshold != 0 && l.LogLevel >= gormlogger.Warn:
		sql, rows := fc()
		slowLog := fmt.Sprintf("SLOW SQL >= %v", l.SlowThreshold)
		if rows == -1 {
			slog.Warn(slowLog, "target", "gorm", "line", " "+utils.FileWithLineNum(), "elapsed", float64(elapsed.Nanoseconds())/1e6)
		} else {
			slog.Warn(slowLog, "target", "gorm", "line", " "+utils.FileWithLineNum(), "elapsed", float64(elapsed.Nanoseconds())/1e6, "row", rows)
		}
		slog.Warn(sql)
	case l.LogLevel == gormlogger.Info:
		sql, rows := fc()
		if rows == -1 {
			slog.Debug("executed sql", "target", "gorm", "line", " "+utils.FileWithLineNum(), "elapsed", float64(elapsed.Nanoseconds())/1e6)
		} else {
			slog.Debug("executed sql", "target", "gorm", "line", " "+utils.FileWithLineNum(), "elapsed", float64(elapsed.Nanoseconds())/1e6, "row", rows)
		}
		slog.Info(sql)
	}
}

var _ gormlogger.Interface = &GormLogger{}
