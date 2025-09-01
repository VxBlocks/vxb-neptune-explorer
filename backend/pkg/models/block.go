package models

import (
	"config"
	"context"
	"encoding/json"
	"fetch"
	"fmt"
	"logger"
	"math/big"
	"models/types"
	"os"
	"redis"
	"slices"
	"time"
	"timescale"

	"github.com/lib/pq"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type Block struct {
	//ADD
	Height           int64     `json:"height" gorm:"index:height,sort:desc;index:height_fork"`
	Time             time.Time `json:"time" gorm:"primaryKey"`
	TransactionCount int       `json:"transactionCount"`
	//ADD

	Digest                 string         `json:"digest" gorm:"index;primaryKey"`
	PrevBlockDigest        string         `json:"prev_block_digest"`
	Nonce                  string         `json:"nonce"`
	CumulativeProofOfWork  types.Big      `json:"cumulative_proof_of_work" gorm:"type:numeric"`
	Difficulty             types.Big      `json:"difficulty" gorm:"type:numeric"`
	NumInputs              int            `json:"num_inputs"`
	NumOutputs             int            `json:"num_outputs"`
	Inputs                 pq.StringArray `json:"inputs" gorm:"-"`
	Outputs                pq.StringArray `json:"outputs" gorm:"-"`
	NumPublicAnnouncements int            `json:"num_public_announcements"`
	CoinbaseAmount         types.Big      `json:"coinbase_amount" gorm:"type:numeric"`
	Fee                    types.Big      `json:"fee" gorm:"type:numeric"`
	IsCanonical            bool           `json:"is_canonical" gorm:"index:height_fork"`
	SiblingBlocks          pq.StringArray `json:"sibling_blocks" gorm:"type:text[]"`
}

type Inputs struct {
	Id          string `json:"id" gorm:"primaryKey"`
	Height      int64  `json:"height" gorm:"index"`
	BlockDigest string `json:"block_digest" gorm:"index"`
	Txid        string `json:"txid" gorm:"index"`
}

func (Inputs) TableName() string {
	return "inputs"
}

type Outputs struct {
	Id          string `json:"id" gorm:"primaryKey"`
	Height      int64  `json:"height" gorm:"index"`
	BlockDigest string `json:"block_digest" gorm:"index"`
	Txid        string `json:"txid" gorm:"index"`
}

func (Outputs) TableName() string {
	return "outputs"
}

// TimeColum implements timescale.HyperTable.
func (b Block) TimeColum() string {
	return "time"
}

// TableName implements timescale.HyperTable.
func (b Block) TableName() string {
	return "block"
}

// Height implements fetch.Block.
func (b *Block) GetHeight() int64 {
	return b.Height
}

// Time implements fetch.Block.
func (b *Block) GetTime() time.Time {
	return b.Time
}

// Id implements fetch.Block.
func (b *Block) GetId() any {
	return b.Digest
}

func BlockFromRpcType(rpcBlock *RPCBlock) *Block {

	return &Block{
		Height:           rpcBlock.Height,
		Time:             time.UnixMilli(rpcBlock.Timestamp),
		TransactionCount: 0, //TODO:

		Digest:                 rpcBlock.Digest,
		PrevBlockDigest:        rpcBlock.PrevBlockDigest,
		Nonce:                  rpcBlock.Nonce,
		CumulativeProofOfWork:  types.NewBigInt(u32sliceToBigint(rpcBlock.CumulativeProofOfWork)),
		Difficulty:             types.NewBigInt(u32sliceToBigint(rpcBlock.Difficulty)),
		NumInputs:              rpcBlock.NumInputs,
		NumOutputs:             rpcBlock.NumOutputs,
		Inputs:                 rpcBlock.Inputs,
		Outputs:                rpcBlock.Outputs,
		NumPublicAnnouncements: rpcBlock.NumPublicAnnouncements,
		CoinbaseAmount:         types.NewBigInt(rpcBlock.CoinbaseAmount.Rsh(rpcBlock.CoinbaseAmount, 2)),
		Fee:                    types.NewBigInt(rpcBlock.Fee.Rsh(rpcBlock.Fee, 2)),
		IsCanonical:            rpcBlock.IsCanonical,
		SiblingBlocks:          rpcBlock.SiblingBlocks,
	}

}

var _ fetch.Block = &Block{}

var _ timescale.Table = Block{}

var _ timescale.HyperTable = Block{}

type WebsocketBlock struct {
	Height  int64     `json:"height"`
	Time    time.Time `json:"timestamp"`
	Inputs  int       `json:"inputs"`
	Outputs int       `json:"outputs"`
}

func PublishWebsocketBlock(ctx context.Context, block *Block) {
	if time.Since(block.Time) > time.Minute*20 {
		return
	}
	marshal, _ := json.Marshal(WebsocketBlock{
		Height:  block.Height,
		Time:    block.Time,
		Inputs:  block.NumInputs,
		Outputs: block.NumOutputs,
	})

	err := redis.GetRedisClient().LPush(ctx, config.RedisBlockQueue, marshal).Err()
	if err != nil {
		logger.Error("PublishWebsocketBlock", "err", err)
	}
}

func u32sliceToBigint(in []uint32) *big.Int {
	var bigint = big.NewInt(0)
	slices.Reverse(in)
	for _, v := range in {
		bigint = bigint.Lsh(bigint, 32)
		bigint.Add(bigint, big.NewInt(int64(v)))
	}
	return bigint
}

type BlockDataSource struct {
	Block         *Block
	Sum           Sum           `json:"-" gorm:"-"`
	UtxoDigests   UtxoDigests   `json:"-" gorm:"-"`
	SiblingBlocks SiblingBlocks `json:"-" gorm:"-"`
}

// DataSources implements fetch.BlockDataSource.
func (b *BlockDataSource) DataSources() []fetch.DataSource[*Block] {
	return []fetch.DataSource[*Block]{
		&b.Sum,
		&b.SiblingBlocks,
	}
}

// GetBlock implements fetch.BlockDataSource.
func (b *BlockDataSource) GetBlock() *Block {
	return b.Block
}

// PreProcess implements fetch.BlockDataSource.
func (b *BlockDataSource) PreProcess(ctx context.Context) error {
	return nil
}

// Process implements fetch.BlockDataSource.
func (b *BlockDataSource) Process(ctx context.Context, prev *Block) error {
	tx := ctx.(*timescale.Context)

	var prevDigest string
	if prev == nil || (b.Block.Height != 0 && prev.Height != b.Block.Height-1) {
		logger.Warn("cache mismatch, trying to fetch prev", "height", b.Block.Height)

		err := tx.GetTxTypedDB(ctx, b.Block).Scopes(ScopeIsCanonical).Where("height = ?", b.Block.Height-1).Pluck("digest", &prevDigest).Error
		if err != nil {
			return fmt.Errorf("failed to fetch prev block: %w", err)
		}
		logger.Warn("update prev digest", "digest", prevDigest)
	} else {
		prevDigest = prev.Digest
	}

	if b.Block.Height != 0 && prevDigest != b.Block.PrevBlockDigest { //this is a fork
		logger.Warn("Fork detected, will exit", "height", b.Block.Height, "digest", prevDigest)

		if err := tx.GetTxTypedDB(ctx, b.Block).Where("height > ?", max(0, b.Block.Height-10)).Delete(&Block{}).Error; err != nil {
			logger.Error("failed to delete fork", "err", err)
		}

		var sum struct {
			Fee         types.Big
			TotalReward types.Big
		}

		if err := tx.GetTxTypedDB(ctx, &Block{}).
			Select("sum(fee) as fee", "sum(coinbase_amount) as total_reward").
			Where("is_canonical = true").Take(&sum).Error; err != nil {
			logger.Error("failed to fetch sum", "err", err)
		}

		if err := WriteSum(tx.Tx(), SumKeyFee, sum.Fee); err != nil {
			logger.Error("failed to write sum", "err", err)
		}
		if err := WriteSum(tx.Tx(), SumKeyReward, sum.TotalReward); err != nil {
			logger.Error("failed to write sum", "err", err)
		}

		tx.Tx().Commit()

		os.Exit(1)
	}

	PublishWebsocketBlock(ctx, b.Block)

	b.Sum.blockReward = b.Block.CoinbaseAmount
	b.Sum.fee = b.Block.Fee

	return nil
}

// Save implements fetch.BlockDataSource.
func (b *BlockDataSource) Save(ctx context.Context) error {
	tx := ctx.(*timescale.Context)

	if err := tx.GetTxTypedDB(ctx, b.Block).Create(b.Block).Error; err != nil {
		return err
	}

	if len(b.Block.Inputs) != 0 {
		var inputs = make([]Inputs, len(b.Block.Inputs))
		for i, v := range b.Block.Inputs {
			inputs[i] = Inputs{
				Id:          v,
				Height:      b.Block.Height,
				BlockDigest: b.Block.Digest,
				Txid:        "",
			}
		}
		if err := tx.GetTxTypedDB(ctx, &Inputs{}).Clauses(clause.OnConflict{
			Columns: []clause.Column{{Name: "id"}},
			DoUpdates: clause.Assignments(map[string]any{
				"height":       b.Block.Height,
				"block_digest": b.Block.Digest,
			}),
		}).CreateInBatches(inputs, 1).Error; err != nil {
			return fmt.Errorf("failed to create inputs: %w", err)
		}
	}

	if len(b.Block.Outputs) != 0 {
		var outputs = make([]Outputs, len(b.Block.Outputs))
		for i, v := range b.Block.Outputs {
			outputs[i] = Outputs{
				Id:          v,
				Height:      b.Block.Height,
				BlockDigest: b.Block.Digest,
				Txid:        "",
			}
		}
		if err := tx.GetTxTypedDB(ctx, &Outputs{}).Clauses(clause.OnConflict{
			Columns: []clause.Column{{Name: "id"}},
			DoUpdates: clause.Assignments(map[string]any{
				"height":       b.Block.Height,
				"block_digest": b.Block.Digest,
			}),
		}).CreateInBatches(outputs, 1).Error; err != nil {
			return fmt.Errorf("failed to create outputs: %w", err)
		}
	}

	return nil
}

var _ fetch.BlockDataSource[*Block] = &BlockDataSource{}

func ScopeIsCanonical(db *gorm.DB) *gorm.DB {
	return db.Where("is_canonical = true")
}

func ScopeIsFork(db *gorm.DB) *gorm.DB {
	return db.Where("is_canonical = false")
}
