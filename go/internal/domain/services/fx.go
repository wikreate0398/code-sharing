package services

import (
	"go.uber.org/fx"
	"wikreate/fimex/internal/domain/services/catalog/best_price_service"
	"wikreate/fimex/internal/domain/services/catalog/product_service"
	"wikreate/fimex/internal/domain/services/payment_history_service"
	"wikreate/fimex/internal/domain/services/targeting"
	"wikreate/fimex/internal/infrastructure/listeners"
	"wikreate/fimex/internal/transport/rbbtmq/rbmq_consumers"
	"wikreate/fimex/internal/transport/rest/controllers"
)

var Module = fx.Module(
	"domain-service",
	fx.Provide(
		fx.Annotate(
			product_service.NewProductService,
			fx.As(new(rbmq_consumers.ProductService)),
		),

		fx.Annotate(
			payment_history_service.NewPaymentHistoryService,
			fx.As(new(rbmq_consumers.PaymentHistoryService)),
		),

		fx.Annotate(
			best_price_service.NewBestPriceService,
			fx.As(new(rbmq_consumers.BestPriceService)),
			fx.As(new(controllers.BestPriceService)),
			fx.As(new(listeners.BestPriceService)),
		),

		fx.Annotate(
			targeting.NewStockTargetingService,
			fx.As(new(controllers.StockTargetingService)),
		),

		targeting.NewStockSocketManager,
	),
)
