package events

import (
	"go.uber.org/fx"
	"wikreate/fimex/internal/domain/interfaces"
	"wikreate/fimex/internal/infrastructure/listeners"
)

var Module = fx.Module("events",
	fx.Provide(
		fx.Annotate(
			NewEventListenerImplImpl,
			fx.As(new(interfaces.EventPublisher)),
		),
	),

	fx.Invoke(bindEventListeners),
)

func bindEventListeners(
	publisher interfaces.EventPublisher,
	pusherListener *listeners.PusherListener,
	bestSaleListener *listeners.BestSaleListener,
) {
	publisher.Bind(pusherListener)
	publisher.Bind(bestSaleListener)
}
