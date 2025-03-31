package best_price_service

import (
	"context"
	"github.com/redis/go-redis/v9"
	"wikreate/fimex/internal/domain/entities/stock/provider_product"
	"wikreate/fimex/internal/domain/structure/dto/stock_dto"
	"wikreate/fimex/internal/helpers"
)

type preorderNotificationPublisher struct {
	redis       *redis.Client
	idsProducts map[int]struct{}

	items []preorderNotificationDto
}

func newPreOrderNotification(
	redis *redis.Client,
	providerProducts *[]provider_product.ProviderProduct,
) preorderNotificationPublisher {
	idsProducts := map[int]struct{}{}

	for _, item := range *providerProducts {
		product := item.Product()
		if product.HasPreorderNotifications() {
			idsProducts[item.IdProduct()] = struct{}{}
		}
	}

	return preorderNotificationPublisher{
		redis:       redis,
		idsProducts: idsProducts,
		items:       make([]preorderNotificationDto, 0),
	}
}

func (s *preorderNotificationPublisher) appendRecords(records []stock_dto.SaleProductStoreDto) {
	for _, record := range records {
		if _, exist := s.idsProducts[record.IdProduct]; exist == true && record.IsNew {
			s.items = append(s.items, preorderNotificationDto{
				IDProduct:        record.IdProduct,
				IDWholesale:      record.IdWholesale,
				IDPurchase:       record.IdPurchase,
				IDImplementation: record.IdImplementation,
				Price:            record.Price,
			})
		}
	}
}

func (s *preorderNotificationPublisher) publish(ctx context.Context) {
	if len(s.items) > 0 {
		str, _ := helpers.StructToJson(s.items)
		s.redis.Publish(ctx, "stock-notification-channel", string(str))
	}
}
