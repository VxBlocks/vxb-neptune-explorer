package sse

import (
	"context"
	"fmt"
	"net/http"
	"time"
)

type Event struct {
	Event string
	Data  []byte
}

func (e Event) IsEmpty() bool {
	return e.Event == "" && e.Data == nil
}

type SSEServer struct {
	ctx    context.Context
	events <-chan Event
	writer http.ResponseWriter
}

func NewSSEServer(ctx context.Context, writer http.ResponseWriter, events <-chan Event) *SSEServer {
	return &SSEServer{
		ctx:    ctx,
		events: events,
		writer: writer,
	}
}

func (s *SSEServer) WriteEvent(event Event) error {
	if event.IsEmpty() {
		if _, err := s.writer.Write([]byte(":\n\n")); err != nil {
			return err
		}
	} else {
		if _, err := fmt.Fprintf(s.writer, "event: %s\ndata: %s\n\n", event.Event, event.Data); err != nil {
			return err
		}
	}

	if flusher, ok := s.writer.(http.Flusher); ok {
		flusher.Flush()
	}

	return nil
}

func (s *SSEServer) Start() {
	s.writer.Header().Set("Content-Type", "text/event-stream")
	s.writer.Header().Set("Cache-Control", "no-cache")
	s.writer.Header().Set("Connection", "keep-alive")
}

func (s *SSEServer) Run() {

	for {
		select {
		case <-s.ctx.Done():
			return
		case <-time.Tick(time.Second * 15):
			if err := s.WriteEvent(Event{}); err != nil {
				return
			}
		case event := <-s.events:
			if err := s.WriteEvent(event); err != nil {
				return
			}
		}
	}
}
