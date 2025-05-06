package best_price_service

import (
	"context"
	"github.com/redis/go-redis/v9"
	"wikreate/fimex/internal/domain/entities/stock/sale_product"
	"wikreate/fimex/internal/domain/structure/dto/stock_dto"
	"wikreate/fimex/internal/helpers"
)

type storePublisher struct {
	redis *redis.Client
}

type body struct {
	Deleted []map[string]any
	Upsert  []map[string]any
}

func newStorePublisher(redis *redis.Client) storePublisher {
	return storePublisher{
		redis: redis,
	}
}

func (s *storePublisher) publish(
	ctx context.Context,
	upsertRecords []stock_dto.SaleProductStoreDto,
	deletedRecords []sale_product.SaleProduct,
) {
	upsert := make([]map[string]any, 0)
	for _, item := range upsertRecords {
		upsert = append(upsert, map[string]any{
			"id_implementation": item.IdImplementation,
			"id_purchase":       item.IdPurchase,
			"id_wholesale":      item.IdWholesale,
			"id_product":        item.IdProduct,
		})
	}

	deleted := make([]map[string]any, 0)
	for _, item := range deletedRecords {
		deleted = append(deleted, map[string]any{
			"id_implementation": item.IdImplementation,
			"id_purchase":       item.IdPurchase,
			"id_wholesale":      item.IdWholesale,
			"id_product":        item.IdProduct,
		})
	}

	var data = body{Deleted: deleted, Upsert: upsert}

	if len(data.Deleted) > 0 || len(data.Upsert) > 0 {
		str, _ := helpers.StructToJson(data)
		s.redis.Publish(ctx, "manage-best-product-channel", string(str))
	}
}
