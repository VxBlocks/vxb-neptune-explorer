package fetch

import (
	"context"
	"time"
)

type Chain[B Block] interface {
	// fetch oneblock, if block not exist,return nil
	FetchBlock(ctx context.Context, height int64) (BlockDataSource[B], error)
	BlockSaved(ctx context.Context, height int64) (bool, error)
	BlockCache() chan BlockDataSource[B]
	LiveDataSources() []LiveDataSource
}

type Block interface {
	GetId() any
	GetHeight() int64
	GetTime() time.Time
}

type BlockDataSource[B Block] interface {
	PreProcess(ctx context.Context) error
	Process(ctx context.Context, prev B) error
	Save(ctx context.Context) error
	GetBlock() B
	DataSources() []DataSource[B]
}

type DataSource[B Block] interface {
	Name() string
	Fetch(ctx context.Context, block B) error
	PreProcess(ctx context.Context, block B) error
	Process(ctx context.Context, block B) error
	Save(ctx context.Context, block B) error
}

// LiveDataSource is a data source that can be fetched in real time
// liveDataSource is running in loop, and have to manage fetching and store by itself
type LiveDataSource interface {
	Name() string
	// main loop, this will be called in a loop
	Execute(ctx context.Context) error
	WaitNextRound()
}
