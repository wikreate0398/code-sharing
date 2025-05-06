package best_price_service

import (
	"context"
	"fmt"
)

type generatePricesJob struct {
	service    *BestPriceService
	idPurchase int
	ids        []int
}

func newGeneratePricesJob(service *BestPriceService, idPurchase int, ids []int) generatePricesJob {
	return generatePricesJob{
		service:    service,
		idPurchase: idPurchase,
		ids:        ids,
	}
}

func (g generatePricesJob) Run(ctx context.Context, chanErr chan<- error) {
	err := g.service.GeneratePricesForSelectedStockProducts(ctx, g.idPurchase, g.ids, true)

	if err != nil {
		chanErr <- fmt.Errorf(
			"failed to generate prices for all products. purchase %d, err %w",
			g.idPurchase, err,
		)
	}
}
