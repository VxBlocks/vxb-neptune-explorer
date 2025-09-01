package fetch

import (
	"context"
	"logger"
	"time"
)

type Fetcher[B Block] struct {
	concurrentChan GoroutineLimiter[BlockDataSource[B], int64]
	chain          Chain[B]
}

func NewFetcher[B Block](chain Chain[B]) *Fetcher[B] {
	return &Fetcher[B]{
		concurrentChan: NewGoroutineLimiter(10, func(block BlockDataSource[B]) int64 { return (block).GetBlock().GetHeight() }),
		chain:          chain,
	}
}

func (f *Fetcher[B]) Fetch(start, end int64) {
	if start == 0 {
		var err error
		start, err = find_start_height(f.chain, context.Background())
		if err != nil {
			logger.Fatal("find_start_height", "err", err)
		}
	}

	var current_height = start
	f.concurrentChan.SetNextPrimaryKey(current_height)

	logger.Info("fetch blocks", "start", start)
	for {
		f.concurrentChan.Wait()
		go f.FetchBlock(context.Background(), current_height)
		if current_height == end {
			f.concurrentChan.Close()
			return
		}
		current_height++
		continue
	}
}

func (f *Fetcher[B]) FetchBlock(ctx context.Context, height int64) {
	for {
		block, err := fetchOneBlock(ctx, f.chain, height)
		if err != nil {
			logger.Error("failed to read block: ", "height", height, "err", err)
			time.Sleep(time.Second * 10)
			continue
		} else if block == nil {
			time.Sleep(time.Second)
			f.concurrentChan.ChangeMaxConcurrency(1)
			continue
		} else {
			f.concurrentChan.Done(block, block.GetBlock().GetHeight()+1)
			logger.Debug("queued block", "height", height)
			if time.Since(block.GetBlock().GetTime()) > time.Second*900 {
				f.concurrentChan.ChangeMaxConcurrency(10)
			}
			return
		}
	}
}

func (f *Fetcher[B]) ReadBlock() BlockDataSource[B] {
	return f.concurrentChan.GetResult()
}
