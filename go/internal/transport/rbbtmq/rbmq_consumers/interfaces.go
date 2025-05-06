package rbmq_consumers

import (
	"context"
	"wikreate/fimex/internal/domain/structure/dto/catalog_dto"
	"wikreate/fimex/internal/domain/structure/dto/payment_dto"
)

type PaymentHistoryService interface {
	RecalcBallances(ctx context.Context, payload payment_dto.RecalcBallanceInputDto) error
}

type ProductService interface {
	GenerateNames(ctx context.Context, payload catalog_dto.GenerateNamesInputDto) error
	Sort(ctx context.Context) error
}

type BestPriceService interface {
	GeneratePricesForSelectedStockProducts(
		ctx context.Context,
		idPurchase int,
		idsProducts []int,
		global bool,
	) error

	GeneratePricesForAllStockProducts(ctx context.Context) error
}
