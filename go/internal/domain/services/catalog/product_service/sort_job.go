package product_service

import (
	"context"
	"fmt"
	"sort"
	"strconv"
	"strings"
	"time"
	"wikreate/fimex/internal/domain/structure/dto/catalog_dto"
	"wikreate/fimex/internal/helpers"
)

type sortProductsJob struct {
	productRepository ProductRepository
	subcatProducts    []catalog_dto.ProductSortQueryDto
	iteration         int
}

func newSortProductsJob(
	productRepository ProductRepository,
	subcatProducts []catalog_dto.ProductSortQueryDto,
	iteration int,
) *sortProductsJob {
	return &sortProductsJob{
		productRepository: productRepository,
		subcatProducts:    subcatProducts,
		iteration:         iteration,
	}
}

func (s sortProductsJob) Run(ctx context.Context, errChan chan<- error) {
	var insert []catalog_dto.ProductSortStoreDto

	sort.Slice(s.subcatProducts, func(a, b int) bool {
		var aPup = strings.Split(s.subcatProducts[a].Position.String, ",")
		var bPup = strings.Split(s.subcatProducts[b].Position.String, ",")

		for k := 0; k < len(aPup) && k < len(bPup); k++ {
			aVal, _ := strconv.Atoi(aPup[k])
			bVal, _ := strconv.Atoi(bPup[k])

			if aVal != bVal {
				return aVal < bVal
			}
		}
		return false
	})

	for _, prod := range s.subcatProducts {
		insert = append(insert, catalog_dto.ProductSortStoreDto{
			ID:        prod.ID,
			Position:  s.iteration,
			UpdatedAt: time.Now().Format(helpers.FullTimeFormat),
		})
		s.iteration++
	}

	if err := s.productRepository.UpdatePosition(ctx, insert, "id"); err != nil {
		errChan <- fmt.Errorf(
			"cannot update products positions. id_cat %d, id_subcat %d, err %w",
			s.subcatProducts[0].IdCategory,
			s.subcatProducts[0].IdSubcategory,
			err,
		)
	}
}
