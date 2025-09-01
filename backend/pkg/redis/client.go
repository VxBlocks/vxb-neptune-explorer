package redis

import (
	"sync/atomic"

	"config"

	"github.com/bsm/redislock"
	redis "github.com/redis/go-redis/v9"
)

var GetRedisClient = OnceValue(func() *redis.Client {
	return redis.NewClient(&redis.Options{
		Addr:     config.C.Redis.URI,
		Username: config.C.Redis.User,
		Password: config.C.Redis.Password, // no password set
		DB:       config.C.Redis.DB,       // use default DB
	})
})

var GetRedisLocker = OnceValue(func() *redislock.Client {
	return redislock.New(GetRedisClient())
})

const ErrNil = redis.Nil

func OnceValue[T any](f func() T) func() T {
	var (
		done uint32
		mu   uint32
		res  T
	)
	return func() T {
		if atomic.LoadUint32(&done) == 0 {
			defer atomic.StoreUint32(&done, 1)
			if atomic.CompareAndSwapUint32(&mu, 0, 1) {
				res = f()
			}
		}
		return res
	}
}
