package best_price_service

import (
	"context"
	"github.com/redis/go-redis/v9"
	"wikreate/fimex/internal/domain/entities/stock/sale_product"
	"wikreate/fimex/internal/domain/structure/dto/stock_dto"
	"wikreate/fimex/internal/helpers"
)

type topPricePublisher struct {
	redis *redis.Client

	idPurchase int
	items      []stock_dto.TopPriceDto
}

func newTopPricePublisher(redis *redis.Client, idPurchase int) topPricePublisher {
	return topPricePublisher{
		redis:      redis,
		idPurchase: idPurchase,
		items:      make([]stock_dto.TopPriceDto, 0),
	}
}

func (s *topPricePublisher) appendDeletedRecord(item sale_product.SaleProduct) {
	if item.IsTop() {
		s.items = append(s.items, item.FillTopPriceDto())
	}
}

func (s *topPricePublisher) appendRecords(records []stock_dto.SaleProductStoreDto) {
	for _, item := range records {
		if item.WasAffectedTopPrice {
			s.items = append(s.items, stock_dto.TopPriceDto{
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
}

func (s *topPricePublisher) publish(ctx context.Context) {
	if len(s.items) > 0 {
		str, _ := helpers.StructToJson(s.items)
		s.redis.Publish(ctx, "top-price-channel", string(str))
	}
}
