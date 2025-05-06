package observer

import (
	"sync"
	"wikreate/fimex/internal/domain/interfaces"
)

type EventObservableImpl struct {
	events []interfaces.Event
	mtx    *sync.RWMutex
}

func NewEventObservable() *EventObservableImpl {
	return &EventObservableImpl{mtx: &sync.RWMutex{}}
}

func (o *EventObservableImpl) Register(event interfaces.Event) {
	o.mtx.Lock()
	defer o.mtx.Unlock()

	if o.events == nil {
		o.events = make([]interfaces.Event, 0)
	}

	o.events = append(o.events, event)
}

func (o *EventObservableImpl) GetEvents() []interfaces.Event {
	o.mtx.RLock()
	defer o.mtx.RUnlock()

	if len(o.events) == 0 {
		return []interfaces.Event{}
	}

	return o.events
}

func (o *EventObservableImpl) ClearEvents() {
	o.mtx.Lock()
	defer o.mtx.Unlock()
	o.events = nil
}
