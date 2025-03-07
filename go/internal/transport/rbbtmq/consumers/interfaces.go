package consumers

import (
	"context"
	"wikreate/fimex/internal/domain/structure/dto/catalog_dto"
	"wikreate/fimex/internal/domain/structure/dto/payment_dto"
)

type PaymentHistoryService interface {
	RecalcBallances(ctx context.Context, payload *payment_dto.RecalcBallanceInputDto)
}

type ProductService interface {
	GenerateNames(ctx context.Context, payload *catalog_dto.GenerateNamesInputDto)
	Sort(ctx context.Context)
}
