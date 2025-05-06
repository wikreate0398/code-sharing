//go:build integration
// +build integration

package integration

import (
	"testing"
)

func TestGeneratePricesForSelectedStockProducts(t *testing.T) {
	//ctx := context.Background()
	//app := fx.New(
	//	infrastructure.Module,
	//
	//	fx.Invoke(func(params best_price_service.Params) {
	//		obj := best_price_service.NewBestPriceService(params)
	//
	//		err := obj.GeneratePricesForSelectedStockProducts(
	//			ctx,
	//			5,
	//			[]int{22139},
	//			false,
	//		)
	//
	//		if err != nil {
	//			t.Fatalf("error generating prices for selected stock products: %v", err)
	//		}
	//	}),
	//
	//	logger.WithLogger,
	//)
	//if err := app.Start(ctx); err != nil {
	//	t.Fatalf("failed to start the app: %v", err)
	//}
	//
	//defer app.Stop(ctx)
}
