package models

import (
	"context"
	"errors"
	"fetch"
	"logger"
	"time"
	"timescale"

	"gorm.io/gorm/clause"
)

type UtxoDigests struct {
	utxoDigests []UtxoDigest
	next        time.Duration
}

// Execute implements fetch.LiveDataSource.
func (u *UtxoDigests) Execute(ctx context.Context) error {

	u.utxoDigests = make([]UtxoDigest, 0, 20)

	var lastID int64
	if err := timescale.GetPostgresGormTypedDB(ctx, &UtxoDigest{}).
		Order("id DESC").
		Limit(1).
		Pluck("id", &lastID).Error; err != nil {
		return err
	}

	var err error
	for i := lastID + 1; i <= lastID+20; i++ {
		var digest string
		digest, err = GetNeptuneClient().GetUtxoDigest(ctx, i)
		if err != nil {
			u.next = time.Second * 5
			logger.Error("GetUtxoDigest", "err", err)
			break
		}
		if digest == "" {
			u.next = time.Minute
			err = errors.New("no utxo digest")
			break
		}
		u.utxoDigests = append(u.utxoDigests, UtxoDigest{
			Id:     i,
			Digest: digest,
		})
	}

	if err == nil {
		u.next = 0
	}

	return u.Save(ctx)
}

// WaitNextRound implements fetch.LiveDataSource.
func (u *UtxoDigests) WaitNextRound() {
	if u.next == 0 {
		return
	}
	time.Sleep(u.next)
}

type UtxoDigest struct {
	Id     int64  `json:"id" gorm:"primary_key"`
	Digest string `json:"digest" gorm:"index"`
}

// Fetch implements fetch.DataSource.
func (u *UtxoDigests) Fetch(ctx context.Context, block *Block) error {
	return nil
}

// Name implements fetch.DataSource.
func (u *UtxoDigests) Name() string {
	return "utxo_digest"
}

// Save implements fetch.DataSource.
func (u *UtxoDigests) Save(ctx context.Context) error {
	if len(u.utxoDigests) == 0 {
		return nil
	}
	if err := timescale.GetPostgresGormTypedDB(ctx, &UtxoDigest{}).Clauses(clause.OnConflict{UpdateAll: true}).CreateInBatches(u.utxoDigests, 1).Error; err != nil {
		return err
	}
	return nil
}

// TableName implements timescale.Table.
func (u *UtxoDigest) TableName() string {
	return "utxo_digest"
}

var _ timescale.Table = (*UtxoDigest)(nil)
var _ fetch.LiveDataSource = (*UtxoDigests)(nil)
