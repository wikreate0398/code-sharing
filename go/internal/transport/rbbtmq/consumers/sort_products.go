package consumers

import "context"

type SortProductsConsumer struct {
	service ProductService
}

func NewSortProductsConsumer(service ProductService) *SortProductsConsumer {
	return &SortProductsConsumer{service}
}

func (r *SortProductsConsumer) Handle(ctx context.Context, result []byte) error {
	r.service.Sort(ctx)
	return nil
}
