package rbbtmq

import (
	"go.uber.org/fx"
	"wikreate/fimex/internal/transport/rbbtmq/rbmq_consumers"
)

var Module = fx.Module("rbbtmq",
	fx.Provide(
		fx.Private,

		rbmq_consumers.NewGenerateProductsNamesConsumer,
		rbmq_consumers.NewRecalcHistoryBallanceConsumer,
		rbmq_consumers.NewSortProductsConsumer,
		rbmq_consumers.NewGenerateBestProductConsumer,
		rbmq_consumers.NewSupplierStockPusherConsumer,
	),

	fx.Invoke(handleRabbitMq),
)
