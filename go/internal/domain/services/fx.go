package services

import (
	"go.uber.org/fx"
	"wikreate/fimex/internal/domain/services/catalog/best_price_service"
	"wikreate/fimex/internal/domain/services/catalog/product_service"
	"wikreate/fimex/internal/domain/services/payment_history_service"
	"wikreate/fimex/internal/transport/rbbtmq/consumers"
)

var Module = fx.Module(
	"domain-service",
	fx.Provide(
		fx.Annotate(
			product_service.NewProductService,
			fx.As(new(consumers.ProductService)),
		),

		fx.Annotate(
			payment_history_service.NewPaymentHistoryService,
			fx.As(new(consumers.PaymentHistoryService)),
		),

		fx.Annotate(best_price_service.NewBestPriceService),
	),
)
