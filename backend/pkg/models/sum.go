package models

import (
	"context"
	"fetch"
	"fmt"
	"models/types"
	"timescale"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type Sum struct {
	Key   string    `json:"key" gorm:"primaryKey"`
	Value types.Big `json:"value" gorm:"type:numeric"`

	blockReward types.Big
	fee         types.Big
}

// Fetch implements fetch.DataSource.
func (s *Sum) Fetch(ctx context.Context, block *Block) error {
	return nil
}

// Name implements fetch.DataSource.
func (s *Sum) Name() string {
	return "sum"
}

// PreProcess implements fetch.DataSource.
func (s *Sum) PreProcess(ctx context.Context, block *Block) error {
	return nil
}

// Process implements fetch.DataSource.
func (s *Sum) Process(ctx context.Context, block *Block) error {
	return nil
}

// Save implements fetch.DataSource.
func (s *Sum) Save(ctx context.Context, block *Block) error {
	tx := ctx.(*timescale.Context)

	db := tx.GetTxTypedDB(ctx, s)

	if err := IncreaseOrCreateSum(db, SumKeyReward, s.blockReward); err != nil {
		return err
	}
	if err := IncreaseOrCreateSum(db, SumKeyFee, s.fee); err != nil {
		return err
	}

	return nil
}

// TableName implements timescale.Table.
func (s Sum) TableName() string {
	return "sums"
}

var _ fetch.DataSource[*Block] = &Sum{}

var _ timescale.Table = Sum{}

type SumKey string

const (
	SumKeyReward SumKey = "total_reward"
	SumKeyFee    SumKey = "total_fee"
)

func ReadSum(db *gorm.DB, key SumKey) (val types.Big, err error) {
	var res Sum
	err = db.Model(&res).Where("key = ?", string(key)).Take(&res).Error
	if err != nil {
		return
	}

	return res.Value, nil
}

func WriteSum(db *gorm.DB, key SumKey, value types.Big) error {
	return db.Save(&Sum{
		Key:   string(key),
		Value: value,
	}).Error
}

func IncreaseSum(db *gorm.DB, key SumKey, value types.Big) error {
	return db.Model(&Sum{}).Where("key = ?", string(key)).
		Update("value", gorm.Expr("value + ?", value)).
		Error
}

func IncreaseOrCreateSum(db *gorm.DB, key SumKey, value types.Big) error {
	return db.Model(&Sum{}).Clauses(clause.OnConflict{
		Columns: []clause.Column{{Name: "key"}},
		DoUpdates: clause.Assignments(map[string]any{
			"value": gorm.Expr(fmt.Sprintf("%s.value + ?", Sum{}.TableName()), value),
		}),
	}).Create(&Sum{
		Key:   string(key),
		Value: value,
	}).Error
}
