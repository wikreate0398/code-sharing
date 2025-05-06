package events

import (
	"context"
	"fmt"
	"go.uber.org/fx"
	"reflect"
	"sync"
	"wikreate/fimex/internal/domain/interfaces"
)

var _ interfaces.EventPublisher = (*EventPublisherImpl)(nil)

type Params struct {
	fx.In

	Logger  interfaces.Logger
	Workers interfaces.WorkerPool
}

type EventPublisherImpl struct {
	*Params
	bindings map[string][]interfaces.Listener
	mtx      *sync.RWMutex
}

func NewEventListenerImplImpl(params Params) *EventPublisherImpl {
	return &EventPublisherImpl{
		Params:   &params,
		bindings: make(map[string][]interfaces.Listener),
		mtx:      &sync.RWMutex{},
	}
}

func (l *EventPublisherImpl) GetBindings() map[string][]interfaces.Listener {
	return l.bindings
}

func (l *EventPublisherImpl) Bind(listener interfaces.Listener) {
	l.mtx.Lock()
	defer l.mtx.Unlock()

	// Prevent identical events in the same listner
	for _, event := range listener.Subscribe() {
		if listeners, ok := l.bindings[event]; ok {
			for _, item := range listeners {
				if item == listener {
					return
				}
			}
		}

		if l.bindings[event] == nil {
			l.bindings[event] = []interfaces.Listener{}
		}

		l.bindings[event] = append(l.bindings[event], listener)
	}
}

func (l *EventPublisherImpl) DispatchAllSync(ctx context.Context, events []interfaces.Event) error {
	for _, event := range events {
		if err := l.dispatchSync(ctx, event); err != nil {
			return err
		}
	}

	return nil
}

func (l *EventPublisherImpl) DispatchAllAsync(events []interfaces.Event) {
	go func(events []interfaces.Event) {
		for _, event := range events {
			l.dispatchAsync(event)
		}
	}(events)
}

func (l *EventPublisherImpl) dispatchAsync(event interfaces.Event) {
	l.mtx.RLock()
	defer l.mtx.RUnlock()

	for _, listener := range l.bindings[event.EventName()] {
		l.Workers.AddJob(jobQueue{listener: listener, event: event})
	}
}

func (l *EventPublisherImpl) errorName(listener interfaces.Listener, event interfaces.Event, err error) error {
	return fmt.Errorf("failed to notify event %s of %s: %w",
		event.EventName(),
		reflect.TypeOf(listener).Name(),
		err,
	)
}

func (l *EventPublisherImpl) dispatchSync(ctx context.Context, event interfaces.Event) error {
	l.mtx.RLock()
	defer l.mtx.RUnlock()

	for _, listener := range l.bindings[event.EventName()] {
		if err := listener.Notify(ctx, event); err != nil {
			return l.errorName(listener, event, err)
		}
	}

	return nil
}
