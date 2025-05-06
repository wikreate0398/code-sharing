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
	}
}

func (s *preorderNotificationPublisher) publish(
	ctx context.Context,
	upsertRecords []stock_dto.SaleProductStoreDto,
) {
	items := make([]preorderNotificationDto, 0)

	for _, record := range upsertRecords {
		if _, exist := s.idsProducts[record.IdProduct]; exist && record.IsNew {
			items = append(items, preorderNotificationDto{
				IDProduct:        record.IdProduct,
				IDWholesale:      record.IdWholesale,
				IDPurchase:       record.IdPurchase,
				IDImplementation: record.IdImplementation,
				Price:            record.Price,
			})
		}
	}

	if len(items) > 0 {
		str, _ := helpers.StructToJson(items)
		s.redis.Publish(ctx, "stock-notification-channel", string(str))
	}
}
