package product_service

import (
	"context"
	"fmt"
	"sort"
	"strings"
	"time"
	"wikreate/fimex/internal/domain/entities/catalog/product"
	"wikreate/fimex/internal/domain/structure/dto/catalog_dto"
	"wikreate/fimex/internal/helpers"
)

type generateNamesJob struct {
	productRepository     ProductRepository
	productCharRepository ProductCharRepository
	payload               catalog_dto.GenerateNamesInputDto
	limit                 int
	offset                int
}

func newGenerateNamesJob(
	productRepository ProductRepository,
	productCharRepository ProductCharRepository,
	payload catalog_dto.GenerateNamesInputDto,
	limit int,
	offset int,
) generateNamesJob {
	return generateNamesJob{
		productRepository:     productRepository,
		productCharRepository: productCharRepository,
		payload:               payload,
		limit:                 limit,
		offset:                offset,
	}
}

func (g generateNamesJob) Run(ctx context.Context, errChan chan<- error) {
	ids, err := g.productRepository.GetIdsForGenerateNames(ctx, g.payload, g.limit, g.offset)

	if err != nil {
		errChan <- fmt.Errorf("cannot getting ids for generate names, payload %#v, err %w", g.payload, err)
		return
	}

	grouped := make(map[any][]catalog_dto.ProductCharQueryDto)

	data, err := g.productCharRepository.GetByProductIds(ctx, ids)

	if err != nil {
		errChan <- fmt.Errorf("cannot getting product chars, payload %#v, err %w", g.payload, err)
		return
	}

	for _, char := range data {
		grouped[char.IdProduct] = append(grouped[char.IdProduct], char)
	}

	var products [][]catalog_dto.ProductCharQueryDto

	for _, items := range grouped {
		sort.Slice(items, func(a, b int) bool {
			return items[a].Position < items[b].Position
		})

		products = append(products, items)
	}

	var insert []catalog_dto.ProductNameStoreDto
	for _, productChars := range products {
		var productNameChars []string
		for _, char := range productChars {
			name := product.NewProductChar(char).PrepareNameForProduct()
			if name != "" {
				productNameChars = append(productNameChars, name)
			}
		}

		insert = append(insert, catalog_dto.ProductNameStoreDto{
			Id:        productChars[0].IdProduct,
			Name:      strings.Join(productNameChars, " "),
			UpdatedAt: time.Now().Format(helpers.FullTimeFormat),
		})
	}

	if len(insert) > 0 {
		if err := g.productRepository.UpdateNames(ctx, insert, "id"); err != nil {
			errChan <- fmt.Errorf("cannot update products names, payload %#v, err %w", g.payload, err)
		}
	}
}
