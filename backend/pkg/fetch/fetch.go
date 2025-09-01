package fetch

import (
	"context"
	"database/sql"
	"fmt"
	"logger"
	"time"
	"timescale"

	"github.com/avast/retry-go"
)

func FetchBlock[B Block](chain Chain[B], start, end int64, refresh bool) {

	go fetchFrom(chain, start, end, refresh)

	var prev B
	for data := range chain.BlockCache() {
		logger.Info("got block", "height", data.GetBlock().GetHeight())
		block := data.GetBlock()

		err := retry.Do(func() error {
			ctx := timescale.NewTx(sql.LevelReadUncommitted)
			err := insertdata(ctx, data, prev)
			if err != nil {
				logger.Error("insertdata error", "err", err, "height", data.GetBlock().GetHeight())
				return err
			}
			return ctx.Tx().Commit().Error
		}, retry.Attempts(10), retry.MaxDelay(time.Second*30))
		if err != nil {
			logger.Error("insertdata error", "err", err, "height", data.GetBlock().GetHeight())
			select {}
		}
		prev = block
	}
}

func ConcurrentFetchBlock[B Block](chain Chain[B], start, end int64, refresh bool) {
	fetcher := NewFetcher(chain)
	go fetcher.Fetch(0, -1)

	var prev B

	for {
		data := fetcher.ReadBlock()
		logger.Info("got block", "height", data.GetBlock().GetHeight())
		block := data.GetBlock()

		err := retry.Do(func() error {
			ctx := timescale.NewTx(sql.LevelReadUncommitted)
			err := insertdata(ctx, data, prev)
			if err != nil {
				logger.Error("insertdata error", "err", err, "height", data.GetBlock().GetHeight())
				return err
			}
			return ctx.Tx().Commit().Error
		}, retry.Attempts(10), retry.MaxDelay(time.Second*30))
		if err != nil {
			logger.Error("insertdata error", "err", err, "height", data.GetBlock().GetHeight())
			select {}
		}

		prev = block
	}
}

func find_start_height[B Block](chain Chain[B], ctx context.Context) (int64, error) {
	var current_height int64
	for {
		ok, err := chain.BlockSaved(ctx, current_height)
		if ok {
			if current_height%100 == 0 {
				logger.Info("skip block", "height", current_height)
			}

			// try to skip 300 blocks
			if ok, _ = chain.BlockSaved(ctx, current_height+300); ok {
				current_height += 300
			} else {
				current_height++
			}

			continue
		} else {
			if err != nil {
				time.Sleep(time.Second)
				logger.Error("failed to find block", current_height, err)
				continue
			} else {
				break
			}
		}
	}

	return current_height, nil
}

func fetchFrom[B Block](
	chain Chain[B],
	start, end int64,
	refresh bool,
) {
	start_height := start
	var current_height int64 = start_height

	logger.Info("fetch blocks", "start", start_height)
	for {
		ctx := context.Background()

		if !refresh {
			ok, err := chain.BlockSaved(ctx, current_height)
			if ok {
				if current_height%100 == 0 {
					logger.Info("skip block", "height", current_height)
				}

				// try to skip 300 blocks
				if ok, _ = chain.BlockSaved(ctx, current_height+300); ok {
					current_height += 300
				} else {
					current_height++
				}

				continue
			} else {
				if err != nil {
					time.Sleep(time.Second)
					logger.Error("failed to find block", current_height, err)
					continue
				}
			}
		}

		block, err := fetchOneBlock(ctx, chain, current_height)
		if err != nil || block == nil {
			time.Sleep(time.Second)
			continue
		}

		chain.BlockCache() <- block
		if current_height == end {
			select {}
		}
		current_height++
	}

}

func fetchOneBlock[B Block](ctx context.Context, chain Chain[B], current_height int64) (BlockDataSource[B], error) {

	block, err := chain.FetchBlock(ctx, current_height)
	if err != nil {
		return nil, err
	}
	if block == nil {
		return nil, nil
	}

	err = block.PreProcess(ctx)
	if err != nil {
		logger.Error("failed to PreProcess block", "height", current_height, "err", err)
		return nil, err
	}

	for i := 0; i < len(block.DataSources()); {
		d := block.DataSources()[i]
		block := block.GetBlock()
		err := d.Fetch(ctx, block)
		if err != nil {
			logger.Error("failed to fetch data", "height", current_height, "source", d.Name(), "err", err)
			return nil, err
		}
		err = d.PreProcess(ctx, block)
		if err != nil {
			logger.Error("failed to PreProcess data", "height", current_height, "source", d.Name(), "err", err)
			return nil, err
		}
		i += 1
	}

	return block, nil
}

func insertdata[B Block](ctx context.Context, block BlockDataSource[B], prev B) error {
	err := block.Process(ctx, prev)
	if err != nil {
		return fmt.Errorf("failed to process block : %w", err)
	}
	for _, d := range block.DataSources() {
		block := block.GetBlock()
		err = d.Process(ctx, block)
		if err != nil {
			return fmt.Errorf("failed to process %s : %w", d.Name(), err)
		}
		err = d.Save(ctx, block)
		if err != nil {
			return fmt.Errorf("failed to save %s : %w", d.Name(), err)
		}
	}

	err = block.Save(ctx)
	if err != nil {
		return fmt.Errorf("failed to save block : %w", err)
	}

	return nil

}

func RunLiveSource[B Block](chain Chain[B]) {
	for _, source := range chain.LiveDataSources() {
		go func(source LiveDataSource) {
			for {
				func(source LiveDataSource) {
					defer func() {
						if r := recover(); r != nil {
							logger.Error("panic in live source", "source", source.Name(), "err", r)
							time.Sleep(time.Second * 10)
						}
					}()
					if err := source.Execute(context.Background()); err != nil {
						logger.Error("failed to execute live source", "source", source.Name(), "err", err)
						time.Sleep(time.Second * 10)
					}
					source.WaitNextRound()
				}(source)
			}
		}(source)
	}
}
