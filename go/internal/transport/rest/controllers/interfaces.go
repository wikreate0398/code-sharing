package controllers

import (
	"context"
	"wikreate/fimex/internal/domain/structure/dto/stock_dto"
)

type BestPriceService interface {
	GeneratePricesForSelectedStockProducts(
		ctx context.Context,
		idPurchase int,
		idsProducts []int,
		global bool,
	) error
}

type StockTargetingService interface {
	UpsertQty(ctx context.Context, payload stock_dto.TargetingInputDto) error
	UpdatePrice(ctx context.Context, input stock_dto.TargetingInputDto) (float64, error)
}
