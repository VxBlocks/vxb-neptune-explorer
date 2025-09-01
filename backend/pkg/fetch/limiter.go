package fetch

import (
	"sync"
	"sync/atomic"
)

// a goroutine limiter that limits the number of goroutines,and receives results in order
type GoroutineLimiter[T any, K comparable] struct {
	maxConcurrency  int32
	cond            *sync.Cond
	doneCond        *sync.Cond
	resultChan      chan T
	get_primary_key func(T) K
	next_pk         K

	_concurrency int32
}

func NewGoroutineLimiter[T any, K comparable](maxConcurrency int32, get_primary_key func(T) K) GoroutineLimiter[T, K] {
	return GoroutineLimiter[T, K]{
		maxConcurrency:  maxConcurrency,
		cond:            sync.NewCond(&sync.Mutex{}),
		doneCond:        sync.NewCond(&sync.Mutex{}),
		resultChan:      make(chan T, maxConcurrency),
		get_primary_key: get_primary_key,
	}
}

func (l *GoroutineLimiter[T, K]) SetNextPrimaryKey(k K) {
	l.next_pk = k
}

func (l *GoroutineLimiter[T, K]) Concurrency() int32 {
	return l._concurrency
}

func (l *GoroutineLimiter[T, K]) Wait() {
	l.cond.L.Lock()
	for atomic.LoadInt32(&l._concurrency)+1 > l.maxConcurrency {
		l.cond.Wait()
	}
	atomic.AddInt32(&l._concurrency, 1)
	l.cond.L.Unlock()
}

func (l *GoroutineLimiter[T, K]) Done(data T, next_pk K) {
	l.doneCond.L.Lock()
	pk := l.get_primary_key(data)
	for pk != l.next_pk {
		l.doneCond.Wait()
	}
	l.resultChan <- data
	atomic.AddInt32(&l._concurrency, -1)
	l.cond.Signal() // wake up goroutine waitting as this goroutine finished
	l.next_pk = next_pk
	l.doneCond.Broadcast() // wake up other checks as next_pk changed
	l.doneCond.L.Unlock()
}

func (l *GoroutineLimiter[T, K]) GetResult() T {
	return <-l.resultChan
}

func (l *GoroutineLimiter[T, K]) ChangeMaxConcurrency(maxConcurrency int32) {
	l.maxConcurrency = maxConcurrency
}

func (l *GoroutineLimiter[T, K]) Close() {
	close(l.resultChan)
}
