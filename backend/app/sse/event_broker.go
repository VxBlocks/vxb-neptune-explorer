package sse

import (
	"errors"
	"fmt"
	"log"
	"slices"
	"sync"
)

// Broker store all subscriptions
type Broker struct {
	Subscriptions map[string]*Subscription
	mu            sync.Mutex
}

var EventBroker = Broker{
	Subscriptions: make(map[string]*Subscription),
}

// Subscription consists of topic-name & client
type Subscription struct {
	Event     string
	Clients   []Client
	LastEvent Event
}

// Client consists of auto-generated ID & connection
type Client = chan Event

func NewClient() Client {
	return make(chan Event, 5)
}

// WSMessage type for a valid message.
type WSMessage struct {
	Action  string `json:"action"`
	Topic   string `json:"topic"`
	Message string `json:"message"`
}

func (s *Broker) Send(client Client, event Event) error {
	select {
	case client <- event:
	default:
		return fmt.Errorf("ws send message %w", errors.New("connection is closed"))
	}

	return nil
}

func (s *Broker) RemoveClient(client Client) {
	// Read all subs

	s.mu.Lock()
	defer s.mu.Unlock()

	for _, sub := range s.Subscriptions {
		s.removeClientFromSubscription(sub, client)
		if len(sub.Clients) == 0 {
			delete(s.Subscriptions, sub.Event)
		}
	}
}
func (s *Broker) Publish(event Event) {
	var clients []Client

	var currentSub *Subscription

	s.mu.Lock()
	defer s.mu.Unlock()

	if sub, ok := s.Subscriptions[event.Event]; ok {
		currentSub = sub
		clients = sub.Clients
	} else { //add an empty sub
		newClient := []Client{}

		currentSub = &Subscription{
			Event:   event.Event,
			Clients: newClient,
		}

		s.Subscriptions[event.Event] = currentSub
	}

	currentSub.LastEvent = event

	// send to clients
	for _, client := range clients {
		_ = s.Send(client, event)
	}
}

func (s *Broker) Subscribe(client Client, event string, sendLast bool) {
	s.mu.Lock()
	defer s.mu.Unlock()

	sub, ok := s.Subscriptions[event]
	if ok {
		sub.Clients = append(sub.Clients, client)
		if sendLast && !sub.LastEvent.IsEmpty() {
			err := s.Send(client, sub.LastEvent) //send last event
			if err != nil {
				log.Println(err)
			}
		}
		err := s.Send(client, sub.LastEvent) //send last event
		if err != nil {
			log.Println(err)
		}
	} else { // else, add new topic & add client to that topic
		newClient := []Client{client}

		newTopic := &Subscription{
			Event:   event,
			Clients: newClient,
		}

		s.Subscriptions[event] = newTopic
	}
}

func (s *Broker) Unsubscribe(client Client, event string) {
	// Read all topics

	s.mu.Lock()
	defer s.mu.Unlock()

	if sub, ok := s.Subscriptions[event]; ok {
		s.removeClientFromSubscription(sub, client)
		if len(sub.Clients) == 0 {
			delete(s.Subscriptions, event)
		}
	}
}

func (s *Broker) removeClientFromSubscription(sub *Subscription, client Client) {
	for i := range sub.Clients {
		if client == sub.Clients[i] {
			sub.Clients = slices.Delete(sub.Clients, i, i+1)
			close(client)
			break
		}
	}
}
