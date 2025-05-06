package best_price_service

import (
	"context"
	"github.com/redis/go-redis/v9"
	"wikreate/fimex/internal/domain/entities/stock/sale_product"
	"wikreate/fimex/internal/domain/structure/dto/stock_dto"
	"wikreate/fimex/internal/helpers"
)

type topPricePublisher struct {
	redis      *redis.Client
	idPurchase int
}

func newTopPricePublisher(redis *redis.Client, idPurchase int) topPricePublisher {
	return topPricePublisher{
		redis:      redis,
		idPurchase: idPurchase,
	}
}

func (s *topPricePublisher) publish(
	ctx context.Context,
	upsertRecords []stock_dto.SaleProductStoreDto,
	deletedRecords []sale_product.SaleProduct,
) {
	items := make([]stock_dto.TopPriceDto, 0)

	for _, item := range upsertRecords {
		if item.WasAffectedTopPrice {
			items = append(items, stock_dto.TopPriceDto{
				IDProviderProduct: item.IdProviderProduct,
				IDProduct:         item.IdProduct,
				IDImplementation:  item.IdImplementation,
				IDPurchase:        item.IdPurchase,
				IDWholesale:       item.IdWholesale,
				Qty:               item.Qty,
				TotalQty:          item.TotalQty,
				PrevPrice:         item.PrevPrice,
				Price:             item.Price,
			})
		}
	}

	for _, item := range deletedRecords {
		if item.IsTop() {
			items = append(items, item.FillTopPriceDto())
		}
	}

	if len(items) > 0 {
		str, _ := helpers.StructToJson(items)
		s.redis.Publish(ctx, "top-price-channel", string(str))
	}
}
