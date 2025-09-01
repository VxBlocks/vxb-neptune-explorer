package models

import (
	"context"
	"fetch"
	"logger"
	"time"
	"timescale"
)

type Neptune struct {
	cache   chan fetch.BlockDataSource[*Block]
	mempool MemPool
	utxo    UtxoDigests
}

func NewEthChain() Neptune {
	cache := make(chan fetch.BlockDataSource[*Block], 10)

	return Neptune{
		cache: cache,
	}
}

// BlockCache implements fetch.Chain.
func (z *Neptune) BlockCache() chan fetch.BlockDataSource[*Block] {
	if z.cache == nil {
		z.cache = make(chan fetch.BlockDataSource[*Block], 10)
	}
	return z.cache
}

// BlockSaved implements fetch.Chain.
func (z *Neptune) BlockSaved(ctx context.Context, height int64) (bool, error) {
	var count int64
	err := timescale.GetPostgresGormTypedDB(ctx, &Block{}).
		Where("height = ?", height).
		Count(&count).Error
	if err != nil {
		return false, err
	}

	return count > 0, nil
}

// FetchBlock implements fetch.Chain.
func (z *Neptune) FetchBlock(ctx context.Context, height int64) (fetch.BlockDataSource[*Block], error) {
	now := time.Now()
	b, err := GetNeptuneClient().GetBlockByHeight(ctx, height)
	if err != nil {
		return nil, err
	}
	if b == nil {
		return nil, nil
	}

	logger.Info("Fetched block", "height", height, "outputs", b.NumOutputs, "duration", time.Since(now))

	datasource := BlockDataSource{
		Block: BlockFromRpcType(b),
	}

	return &datasource, nil
}

func (z *Neptune) LiveDataSources() []fetch.LiveDataSource {
	return []fetch.LiveDataSource{
		&z.mempool,
		&z.utxo,
	}
}

var _ fetch.Chain[*Block] = &Neptune{}
