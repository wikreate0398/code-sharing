package listeners

import (
	"context"
)

type BestPriceService interface {
	GeneratePricesForSelectedStockProducts(
		ctx context.Context,
		idPurchase int,
		idsProducts []int,
		global bool,
	) error
}
