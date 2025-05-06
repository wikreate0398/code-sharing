package events

import (
	"context"
	"fmt"
	"reflect"
	"wikreate/fimex/internal/domain/interfaces"
)

type jobQueue struct {
	listener interfaces.Listener
	event    interfaces.Event
}

func (j jobQueue) Run(ctx context.Context, chanErr chan<- error) {
	if err := j.listener.Notify(ctx, j.event); err != nil {
		chanErr <- fmt.Errorf("failed to notify event %s of %s: %w",
			j.event.EventName(),
			reflect.TypeOf(j.listener).Name(),
			err,
		)
	}
}
