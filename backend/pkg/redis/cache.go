package redis

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/bsm/redislock"
)

func GetOrUpdateCache[T any](ctx context.Context, key string, duration time.Duration,
	callback func(ctx context.Context) (T, error)) (T, error) {

	res, err := GetCache[T](ctx, key)
	if err == nil {
		return res, nil
	} else if !errors.Is(err, ErrNil) {
		return res, err
	}

	locker, err := GetRedisLocker().Obtain(ctx, "lock"+key, time.Second*10, &redislock.Options{
		RetryStrategy: redislock.LinearBackoff(time.Millisecond * 50),
	})

	if err != nil {
		return res, fmt.Errorf("obtain redis lock: %w", err)
	}
	//nolint: errcheck
	defer locker.Release(ctx)

	// get cache again
	res, err = GetCache[T](ctx, key)
	if err == nil {
		return res, nil
	}

	var value T

	value, err = callback(ctx)
	if err != nil {
		return value, fmt.Errorf("failed to get value: %w", err)
	}

	bytes, err := json.Marshal(value)
	if err != nil {
		return value, fmt.Errorf("failed to marshal value: %w", err)
	}

	GetRedisClient().Set(ctx, key, bytes, duration)
	return value, nil
}

func GetOrUpdateCacheUseStale[T any](ctx context.Context, key string, duration time.Duration,
	callback func(ctx context.Context) (T, error)) (T, error) {

	res, err := GetCache[T](ctx, key)
	if err == nil {
		du := GetRedisClient().TTL(ctx, key)
		if du.Err() == nil {
			if du.Val() < duration*2 { // use stale

				go func(ctx context.Context) {

					locker, err := GetRedisLocker().Obtain(ctx, "lock"+key, time.Second*10, &redislock.Options{
						RetryStrategy: redislock.NoRetry(),
					})

					if err != nil {
						return
					}
					//nolint: errcheck
					defer locker.Release(ctx)

					var value T

					value, err = callback(ctx)
					if err != nil {
						return
					}

					bytes, err := json.Marshal(value)
					if err != nil {
						return
					}

					GetRedisClient().Set(ctx, key, bytes, duration*3)
				}(context.Background())
			}
			return res, nil
		}
	} else if !errors.Is(err, ErrNil) {
		return res, err
	}

	locker, err := GetRedisLocker().Obtain(ctx, "lock"+key, time.Second*10, &redislock.Options{
		RetryStrategy: redislock.LinearBackoff(time.Millisecond * 50),
	})

	if err == nil {
		//nolint: errcheck
		defer locker.Release(ctx)
	}

	// get cache again
	res, err = GetCache[T](ctx, key)
	if err == nil {
		return res, nil
	}

	var value T

	value, err = callback(ctx)
	if err != nil {
		return value, fmt.Errorf("failed to get value: %w", err)
	}

	bytes, err := json.Marshal(value)
	if err != nil {
		return value, fmt.Errorf("failed to marshal value: %w", err)
	}

	GetRedisClient().Set(ctx, key, bytes, duration*3)
	return value, nil
}

func GetCache[T any](ctx context.Context, key string) (T, error) {
	res := GetRedisClient().Get(ctx, key)
	var t T
	if res.Err() != nil {
		return t, fmt.Errorf("get cache: %w", res.Err())
	}
	value, err := res.Bytes()
	if err != nil {
		return t, fmt.Errorf("failed to read value: %w", err)
	}

	err = json.Unmarshal(value, &t)
	if err != nil {
		return t, fmt.Errorf("failed to unmarshal value: %w", err)
	}

	return t, nil
}
