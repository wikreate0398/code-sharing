package rbbtmq

import (
	"go.uber.org/fx"
)

var Module = fx.Module("rbbtmq",
	fx.Provide(
		fx.Private,

		NewGenerateProductsNamesConsumer,
		NewRecalcHistoryBallanceConsumer,
		NewSortProductsConsumer,
		NewGenerateBestProductConsumer,
	),

	fx.Invoke(handleRabbitMq),
)
