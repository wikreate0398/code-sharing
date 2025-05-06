package rbmq_consumers

import (
	"context"
	"encoding/json"
	"wikreate/fimex/internal/domain/structure/dto/catalog_dto"
)

type GenerateNamesConsumer struct {
	service ProductService
}

func NewGenerateProductsNamesConsumer(service ProductService) *GenerateNamesConsumer {
	return &GenerateNamesConsumer{service}
}

func (r *GenerateNamesConsumer) Consume(ctx context.Context, result []byte) error {
	var input = catalog_dto.GenerateNamesInputDto{}
	if err := json.Unmarshal(result, &input); err != nil {
		return err
	}

	return r.service.GenerateNames(ctx, input)
}
