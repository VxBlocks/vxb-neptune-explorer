package api

import (
	"context"
	"fmt"
	"models"
	"time"
	"timescale"
)

// GetTrendTarget implements StrictServerInterface.
func (s *Server) GetTrendTarget(ctx context.Context, request GetTrendTargetRequestObject) (GetTrendTargetResponseObject, error) {
	block, err := getBlockAtHeight(ctx, 1)
	if err != nil {
		return nil, err
	}
	startTime := block.Time
	timeBucket := "1d"
	switch request.Params.Duration {
	case All:
		timeBucket = "1d"
	case Day:
		if timescale.HoursAgo(time.Now(), 24).After(startTime) {
			startTime = timescale.HoursAgo(time.Now(), 24)
		}
		timeBucket = "30m"
	case Week:
		if timescale.DaysAgo(time.Now(), 7).After(startTime) {
			startTime = timescale.DaysAgo(time.Now(), 7)
		}
		timeBucket = "1h"
	case Month:
		if timescale.DaysAgo(time.Now(), 30).After(startTime) {
			startTime = timescale.DaysAgo(time.Now(), 30)
		}
		timeBucket = "1d"
	}

	var results []ChartPoint
	err = timescale.GetPostgresGormTypedDB(ctx, &models.Block{}).
		Select(fmt.Sprintf("time_bucket('%s', time) AS interv", timeBucket), "avg(difficulty) AS value", "last(height,time) AS height").
		Group("interv").
		Where("time >= ? AND time < ?", startTime, time.Now()).Order("interv").
		Scan(&results).Error

	if err != nil {
		return nil, err
	}

	return GetTrendTarget200JSONResponse{
		Success: true,
		Chart:   results,
	}, nil

}

// GetTrendReward implements StrictServerInterface.
func (s *Server) GetTrendReward(ctx context.Context, request GetTrendRewardRequestObject) (GetTrendRewardResponseObject, error) {
	timeBucket := "1d"

	block, err := getBlockAtHeight(ctx, 1)
	if err != nil {
		return nil, err
	}
	startTime := block.Time

	switch request.Params.Duration {
	case GetTrendRewardParamsDurationAll:
		timeBucket = "1d"
	case GetTrendRewardParamsDurationDay:
		if timescale.HoursAgo(time.Now(), 24).After(startTime) {
			startTime = timescale.HoursAgo(time.Now(), 24)
		}
		timeBucket = "30m"
	case GetTrendRewardParamsDurationWeek:
		if timescale.DaysAgo(time.Now(), 7).After(startTime) {
			startTime = timescale.DaysAgo(time.Now(), 1)
		}
		timeBucket = "1h"
	case GetTrendRewardParamsDurationMonth:
		if timescale.DaysAgo(time.Now(), 30).After(startTime) {
			startTime = timescale.DaysAgo(time.Now(), 30)
		}
		timeBucket = "1d"
	}

	var results []ChartRewardPoint
	err = timescale.GetPostgresGormTypedDB(ctx, &models.Block{}).
		Select(fmt.Sprintf("time_bucket('%s', time) AS interv", timeBucket), "sum(coinbase_amount) AS value", "sum(fee) AS fee", "last(height,time) AS height").
		Group("interv").
		Where("time >= ? AND time < ?", startTime, time.Now()).Order("interv").
		Scan(&results).Error

	if err != nil {
		return nil, err
	}

	return GetTrendReward200JSONResponse{
		Success: true,
		Chart:   results,
	}, nil

}

// GetTrendReward implements StrictServerInterface.
func (s *Server) GetTrendFee(ctx context.Context, request GetTrendFeeRequestObject) (GetTrendFeeResponseObject, error) {
	timeBucket := "1d"

	block, err := getBlockAtHeight(ctx, 1)
	if err != nil {
		return nil, err
	}
	startTime := block.Time

	switch request.Params.Duration {
	case GetTrendFeeParamsDurationAll:
		timeBucket = "1d"
	case GetTrendFeeParamsDurationDay:
		if timescale.HoursAgo(time.Now(), 24).After(startTime) {
			startTime = timescale.HoursAgo(time.Now(), 24)
		}
		timeBucket = "30m"
	case GetTrendFeeParamsDurationWeek:
		if timescale.DaysAgo(time.Now(), 7).After(startTime) {
			startTime = timescale.DaysAgo(time.Now(), 1)
		}
		timeBucket = "1h"
	case GetTrendFeeParamsDurationMonth:
		if timescale.DaysAgo(time.Now(), 30).After(startTime) {
			startTime = timescale.DaysAgo(time.Now(), 30)
		}
		timeBucket = "1d"
	}

	var results []ChartPoint
	err = timescale.GetPostgresGormTypedDB(ctx, &models.Block{}).
		Select(fmt.Sprintf("time_bucket('%s', time) AS interv", timeBucket), "sum(fee) AS value", "last(height,time) AS height").
		Group("interv").
		Where("time >= ? AND time < ?", startTime, time.Now()).Order("interv").
		Scan(&results).Error

	if err != nil {
		return nil, err
	}

	return GetTrendFee200JSONResponse{
		Success: true,
		Chart:   results,
	}, nil

}

func getBlockAtHeight(ctx context.Context, height int64) (models.Block, error) {
	var block models.Block
	err := timescale.GetPostgresGormTypedDB(ctx, &models.Block{}).
		Where("height = ?", height).
		Scan(&block).Error

	return block, err
}

func getBlockByDigest(ctx context.Context, digest string) (models.Block, error) {
	var block models.Block
	err := timescale.GetPostgresGormTypedDB(ctx, &models.Block{}).
		Where("digest = ?", digest).
		Take(&block).Error

	return block, err
}
