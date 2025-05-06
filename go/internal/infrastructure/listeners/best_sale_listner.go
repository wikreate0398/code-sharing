package listeners

import (
	"context"
	"go.uber.org/fx"
	"wikreate/fimex/internal/domain/entities/stock/provider_product"
	"wikreate/fimex/internal/domain/interfaces"
)

type BestSaleParams struct {
	fx.In

	BestPriceServ BestPriceService
}

type BestSaleListener struct {
	*BestSaleParams
}

func NewBestSaleListener(params BestSaleParams) *BestSaleListener {
	return &BestSaleListener{&params}
}

func (pl *BestSaleListener) Subscribe() []string {
	return []string{
		provider_product.UpdateProviderProductEventName,
		provider_product.DeleteProviderProductEventName,
	}
}

func (pl *BestSaleListener) Notify(ctx context.Context, event interfaces.Event) error {
	switch e := event.(type) {
	case *provider_product.UpdateProviderProductEvent:

		return pl.generate(e.Dto.IdPurchase, e.Dto.IdProduct)

	case *provider_product.DeleteProviderProductEvent:
		return pl.generate(e.Dto.IdPurchase, e.Dto.IdProduct)
	}

	return nil
}

func (pl *BestSaleListener) generate(IdPurchase int, IdProduct int) error {
	return pl.BestPriceServ.GeneratePricesForSelectedStockProducts(
		context.Background(),
		IdPurchase,
		[]int{IdProduct},
		false,
	)
}
