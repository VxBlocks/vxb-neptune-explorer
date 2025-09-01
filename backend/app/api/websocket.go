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

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

type WsResponse struct {
	Key  string                `json:"key"`
	Data models.WebsocketBlock `json:"data"`
}

type WsSubscribeRequest struct {
	Action string `json:"action"`
	Topic  string `json:"topic"`
}

func BlockWebsocketHandler(ctx *gin.Context) {
	// trust all origin to avoid CORS
	upgrader.CheckOrigin = func(r *http.Request) bool {
		return true
	}

	// upgrades connection to websocket
	conn, err := upgrader.Upgrade(ctx.Writer, ctx.Request, nil)
	if err != nil {
		ctx.Status(http.StatusInternalServerError)
		return
	}
	//goland:noinspection ALL
	defer conn.Close()

	var client = sse.NewClient()
	sse.EventBroker.Subscribe(client, config.RedisBlockQueue, true)

	// greet the new client
	initMessage := "Server: Welcome! "
	conn.WriteMessage(1, []byte(initMessage))

	go func() {
		for data := range client {

			var block models.WebsocketBlock

			if err := json.Unmarshal(data.Data, &block); err != nil {
				continue
			}

			message, _ := json.Marshal(WsResponse{
				Key:  data.Event,
				Data: block,
			})

			if err := conn.WriteMessage(1, message); err != nil {
				sse.EventBroker.Unsubscribe(client, config.RedisBlockQueue)
				_ = conn.Close()
			}
		}
	}()

	// message handling
	for {
		messageType, payload, err := conn.ReadMessage()
		if err != nil {
			_ = conn.Close()
			return
		}
		if messageType == 1 && string(payload) == "ping" {
			_ = conn.WriteMessage(1, []byte("pong"))
		}
	}
}

func SubscribeBlock() {

	for {
		res := redis.GetRedisClient().BLPop(context.Background(), time.Minute*10, config.RedisBlockQueue)

		if res.Err() != nil {
			if !errors.Is(res.Err(), redis.ErrNil) {
				logger.Error("failed to pop messages", "err", res.Err())
			}
		}

		if len(res.Val()) < 2 {
			continue
		}

		if json.Valid([]byte(res.Val()[1])) {
			sse.EventBroker.Publish(sse.Event{Event: config.RedisBlockQueue, Data: []byte(res.Val()[1])})
		}
	}
}
