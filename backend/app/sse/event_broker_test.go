package sse

import (
	"testing"
	"time"
)

func TestBroker(t *testing.T) {
	var client1 = Client(make(chan Event, 10))
	var client2 = Client(make(chan Event, 10))

	go func() {
		for data := range client1 {
			t.Log("cli1 receive data:: ", string(data.Data))
		}
	}()

	go func() {
		for data := range client2 {
			t.Log("cli2 receive data:: ", string(data.Data))
		}
	}()

	EventBroker.Subscribe(client1, "test", true)
	t.Log("publish")
	EventBroker.Publish(Event{Event: "test", Data: []byte("test")})
	t.Log("Unsubscribe")
	EventBroker.Unsubscribe(client1, "test")
	EventBroker.Publish(Event{Event: "test", Data: []byte("testmesg2")})
	EventBroker.Subscribe(client2, "test", true)

	t.Log("finish")

	time.Sleep(5 * time.Second)
}
