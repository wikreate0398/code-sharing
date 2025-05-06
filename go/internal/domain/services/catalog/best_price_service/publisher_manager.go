package best_price_service

import (
	"context"
	"wikreate/fimex/internal/domain/entities/stock/sale_product"
	"wikreate/fimex/internal/domain/structure/dto/stock_dto"
)

type publisherManager struct {
	topPrice             topPricePublisher
	preorderNotification preorderNotificationPublisher
	store                storePublisher
	isGlobal             bool
}

func newPublisherManager(
	topPrice topPricePublisher,
	preorderNotification preorderNotificationPublisher,
	storePublisher storePublisher,
	isGlobal bool,
) publisherManager {
	return publisherManager{
		topPrice:             topPrice,
		preorderNotification: preorderNotification,
		store:                storePublisher,
		isGlobal:             isGlobal,
	}
}

func (s *publisherManager) publish(
	ctx context.Context,
	upsertRecords []stock_dto.SaleProductStoreDto,
	deletedRecords []sale_product.SaleProduct,
) {
	s.topPrice.publish(ctx, upsertRecords, deletedRecords)
	s.preorderNotification.publish(ctx, upsertRecords)

	if !s.isGlobal {
		s.store.publish(ctx, upsertRecords, deletedRecords)
	}
}
