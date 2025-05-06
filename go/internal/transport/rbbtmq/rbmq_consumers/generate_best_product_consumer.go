package rbmq_consumers

import (
	"context"
	"encoding/json"
	"wikreate/fimex/internal/domain/structure/dto/stock_dto"
)

type GenerateBestProductConsumer struct {
	service BestPriceService
}

func NewGenerateBestProductConsumer(service BestPriceService) *GenerateBestProductConsumer {
	return &GenerateBestProductConsumer{service}
}

func (r *GenerateBestProductConsumer) Consume(ctx context.Context, result []byte) error {
	if r.isEmpty(result) {
		return r.service.GeneratePricesForAllStockProducts(ctx)
	}

	var input = new(stock_dto.GenerateBestProductInputDto)
	if err := json.Unmarshal(result, &input); err != nil {
		return err
	}

	return r.service.GeneratePricesForSelectedStockProducts(
		ctx, input.IdPurchase, input.IdsProducts, false,
	)
}

func (r *GenerateBestProductConsumer) isEmpty(result []byte) bool {
	return len(result) == 0 || string(result) == "[]" || result == nil
}
