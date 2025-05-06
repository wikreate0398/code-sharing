package rbmq_consumers

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"wikreate/fimex/internal/domain/services/targeting"
	"wikreate/fimex/internal/domain/structure/dto/stock_dto"
)

type SupplierStockPusherConsumer struct {
	service *targeting.StockSocketManager
}

func NewSupplierStockPusherConsumer(service *targeting.StockSocketManager) *SupplierStockPusherConsumer {
	return &SupplierStockPusherConsumer{service: service}
}

func (s *SupplierStockPusherConsumer) Consume(ctx context.Context, result []byte) error {
	dto, err := s.stockConsumerResultToDto(result)
	if err != nil {
		return fmt.Errorf("cannot unmarshal stock dto: err %w", err)
	}

	return s.service.Manage(ctx, dto)
}

func (s *SupplierStockPusherConsumer) stockConsumerResultToDto(result []byte) (stock_dto.ProviderProductDto, error) {
	var input = stock_dto.StockPusherConsumeInputDto{}
	if err := json.Unmarshal(result, &input); err != nil {
		return stock_dto.ProviderProductDto{}, err
	}

	var price sql.NullFloat64
	if input.Price != nil {
		price = sql.NullFloat64{Float64: *input.Price, Valid: true}
	}

	var prevPrice sql.NullFloat64
	if input.PrevPrice != nil {
		prevPrice = sql.NullFloat64{Float64: *input.PrevPrice, Valid: true}
	}

	var updatedAt sql.NullString
	if input.PriceUpdatedAt != nil {
		updatedAt = sql.NullString{String: *input.PriceUpdatedAt, Valid: true}
	}

	var dto = stock_dto.ProviderProductDto{
		Id:             input.Id,
		IdPurchase:     input.IdPurchase,
		IdProvider:     input.IdSupplier,
		IdProduct:      input.IdProduct,
		Qty:            input.Qty,
		PrevQty:        input.PrevQty,
		Price:          price,
		PrevPrice:      prevPrice,
		PriceUpdatedAt: updatedAt,
	}

	return dto, nil
}
