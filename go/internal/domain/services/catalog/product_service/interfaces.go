package product_service

import (
	"context"
	"wikreate/fimex/internal/domain/structure/dto/catalog_dto"
)

type ProductRepository interface {
	GetIdsForGenerateNames(ctx context.Context, payload *catalog_dto.GenerateNamesInputDto, limit int, offset int) ([]string, error)
	CountTotalForGenerateNames(ctx context.Context, payload *catalog_dto.GenerateNamesInputDto) (int, error)
	GetForSort(ctx context.Context) ([]catalog_dto.ProductSortQueryDto, error)
	UpdateNames(ctx context.Context, arg interface{}, key string) error
	UpdatePosition(ctx context.Context, arg interface{}, key string) error
}

type ProductCharRepository interface {
	GetByProductIds(ctx context.Context, ids []string) ([]catalog_dto.ProductCharQueryDto, error)
}
