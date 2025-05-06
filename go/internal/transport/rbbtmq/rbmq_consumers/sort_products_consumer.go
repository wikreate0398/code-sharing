package rbmq_consumers

import (
	"context"
)

type SortProductsConsumer struct {
	service ProductService
}

func NewSortProductsConsumer(service ProductService) *SortProductsConsumer {
	return &SortProductsConsumer{service}
}

func (r *SortProductsConsumer) Consume(ctx context.Context, result []byte) error {
	return r.service.Sort(ctx)
}
