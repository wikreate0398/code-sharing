package product_service

import (
	"context"
	"fmt"
	"go.uber.org/fx"
	"math"
	"wikreate/fimex/internal/domain/interfaces"
	"wikreate/fimex/internal/domain/structure/dto/catalog_dto"
)

type Params struct {
	fx.In

	ProductRepository     ProductRepository
	ProductCharRepository ProductCharRepository
	Worker                interfaces.WorkerPool
}

type ProductService struct {
	*Params
}

func NewProductService(params Params) *ProductService {
	return &ProductService{&params}
}

func (s ProductService) GenerateNames(ctx context.Context, payload catalog_dto.GenerateNamesInputDto) error {
	//start := time.Now()

	total, err := s.ProductRepository.CountTotalForGenerateNames(ctx, payload)

	if err != nil {
		return fmt.Errorf("cannot count total products for generate names: %w", err)
	}

	var (
		limit      = 700
		iterations = int(math.Ceil(float64(total) / float64(limit)))
	)

	for i := 0; i < iterations; i++ {
		s.Worker.AddJob(
			newGenerateNamesJob(
				s.ProductRepository,
				s.ProductCharRepository,
				payload,
				limit,
				i*limit,
			),
		)
	}

	return nil
}

func (s ProductService) Sort(ctx context.Context) error {
	//start := time.Now()

	grouped := make(map[any][]catalog_dto.ProductSortQueryDto)
	var orderedKeys []string

	var data, err = s.ProductRepository.GetForSort(ctx)

	if err != nil {
		return fmt.Errorf("cannot get products for sort: %w", err)
	}

	for _, prod := range data {
		var key = fmt.Sprintf("%v.%v.%v", prod.IdBrand, prod.IdCategory, prod.IdSubcategory)

		if _, exists := grouped[key]; !exists {
			orderedKeys = append(orderedKeys, key)
		}

		grouped[key] = append(grouped[key], prod)
	}

	var num = 1
	var i = 1
	for _, key := range orderedKeys {
		var products = grouped[key]

		s.Worker.AddJob(
			newSortProductsJob(
				s.ProductRepository,
				products,
				num,
			),
		)

		i++
		num += len(products)
	}

	return nil
}
