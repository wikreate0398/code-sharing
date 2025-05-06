package interfaces

import "context"

type EventPublisher interface {
	Bind(listener Listener)
	GetBindings() map[string][]Listener
	DispatchAllSync(ctx context.Context, events []Event) error
	DispatchAllAsync(events []Event)
}

type Event interface {
	EventName() string
}

type EventObservable interface {
	Register(event Event)
	GetEvents() []Event
	ClearEvents()
}

type Listener interface {
	Subscribe() []string
	Notify(ctx context.Context, event Event) error
}
