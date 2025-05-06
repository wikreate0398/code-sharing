package rbbtmq

import (
	"context"
	"go.uber.org/fx"
	"wikreate/fimex/internal/config"
	"wikreate/fimex/internal/domain/interfaces"
	"wikreate/fimex/internal/transport/rbbtmq/rbmq_consumers"
	"wikreate/fimex/pkg/rabbitmq"
)

type RabitMqParams struct {
	fx.In

	Lc     fx.Lifecycle
	Logger interfaces.Logger
	Config *config.Config

	GenerateProductsNamesConsumer *rbmq_consumers.GenerateNamesConsumer
	SortProductsConsumer          *rbmq_consumers.SortProductsConsumer
	RecalcBallanceHistoryConsumer *rbmq_consumers.RecalcHistoryBallanceConsumer
	GenerateBestProductConsumer   *rbmq_consumers.GenerateBestProductConsumer
	SupplierStockPusherConsumer   *rbmq_consumers.SupplierStockPusherConsumer
}

func handleRabbitMq(p RabitMqParams) {
	conf := p.Config.RabbitMQ
	rbMq := rabbitmq.InitRabbitMQ(rabbitmq.Credentials{
		Host:     conf.Host,
		Port:     conf.Port,
		User:     conf.User,
		Password: conf.Password,
	}, p.Logger)

	p.Lc.Append(fx.Hook{
		OnStart: func(_ context.Context) error {

			ctx := context.Background()

			rbMq.RegisterConsumer(rabbitmq.RegisterDto{
				Exchange:   "catalog",
				QueueName:  "products_queue",
				RoutingKey: "generate.names",
				Consumer:   p.GenerateProductsNamesConsumer,
			})

			rbMq.RegisterConsumer(rabbitmq.RegisterDto{
				Exchange:   "catalog",
				QueueName:  "products_queue",
				RoutingKey: "sort.product",
				Consumer:   p.SortProductsConsumer,
			})

			rbMq.RegisterConsumer(rabbitmq.RegisterDto{
				Exchange:   "payment",
				QueueName:  "ballance_queue",
				RoutingKey: "recalculate.history",
				Consumer:   p.RecalcBallanceHistoryConsumer,
			})

			rbMq.RegisterConsumer(rabbitmq.RegisterDto{
				Exchange:   "catalog",
				QueueName:  "products_queue",
				RoutingKey: "generate.best.product",
				Consumer:   p.GenerateBestProductConsumer,
			})

			rbMq.RegisterConsumer(rabbitmq.RegisterDto{
				Exchange:   "pusher",
				QueueName:  "pusher_queue",
				RoutingKey: "supplier.stock",
				Consumer:   p.SupplierStockPusherConsumer,
			})

			rbMq.Listen(ctx)

			return nil
		},

		OnStop: func(_ context.Context) error {
			rbMq.Close()
			return nil
		},
	})
}
