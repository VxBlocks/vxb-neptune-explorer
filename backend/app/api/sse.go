package api

import (
	"app/sse"
	"config"
	"context"
	"encoding/json"
	"errors"
	"logger"
	"models"
	"net/http"
	"redis"
	"time"
)

// GetBlockEvent implements StrictServerInterface.
func (s *Server) GetBlockEvent(ctx context.Context, request GetBlockEventRequestObject) (GetBlockEventResponseObject, error) {
	return NewBlockEventResponse(ctx), nil
}

type blockSSEResponse struct {
	ctx context.Context
}

func NewBlockEventResponse(ctx context.Context) GetBlockEventResponseObject {
	return &blockSSEResponse{ctx: ctx}
}

func (s *blockSSEResponse) VisitGetBlockEventResponse(w http.ResponseWriter) error {

	const topic = config.RedisBlockQueue

	var client = sse.NewClient()
	sse.EventBroker.Subscribe(client, topic, true)
	defer sse.EventBroker.Unsubscribe(client, topic)

	var sseServer = sse.NewSSEServer(s.ctx, w, client)
	sseServer.Start()
	sseServer.Run()
	return nil
}

// GetBlockMempool implements StrictServerInterface.
func (s *Server) GetBlockMempool(ctx context.Context, request GetBlockMempoolRequestObject) (GetBlockMempoolResponseObject, error) {
	return NewMempoolEventResponse(ctx), nil
}

type memPoolSSEResponse struct {
	ctx context.Context
}

func NewMempoolEventResponse(ctx context.Context) GetBlockMempoolResponseObject {
	return &memPoolSSEResponse{ctx: ctx}
}

func (s *memPoolSSEResponse) VisitGetBlockMempoolResponse(w http.ResponseWriter) error {

	const topic = "update_mempool"

	var client = sse.NewClient()
	sse.EventBroker.Subscribe(client, topic, false)
	defer sse.EventBroker.Unsubscribe(client, topic)

	var sseServer = sse.NewSSEServer(s.ctx, w, client)
	sseServer.Start()

	current, _ := models.GetNeptuneClient().GetMempoolTransactions(s.ctx)

	data, _ := json.Marshal(current)

	sseServer.WriteEvent(sse.Event{Event: "current_mempool", Data: data})

	sseServer.Run()
	return nil
}

func SubscribeMempool() {
	time.Sleep(time.Second)
	for {
		res := redis.GetRedisClient().BLPop(context.Background(), time.Minute*10, models.RedisMempoolQueue)

		if res.Err() != nil {
			if !errors.Is(res.Err(), redis.ErrNil) {
				logger.Error("failed to pop messages", "err", res.Err())
			}
		}

		if len(res.Val()) < 2 {
			continue
		}

		if json.Valid([]byte(res.Val()[1])) {
			sse.EventBroker.Publish(sse.Event{Event: "update_mempool", Data: []byte(res.Val()[1])})
		}
	}
}
