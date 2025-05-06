package rest

import (
	"github.com/gin-gonic/gin"
	"go.uber.org/fx"
	"wikreate/fimex/internal/domain/interfaces"
	"wikreate/fimex/internal/transport/rest/controllers"
)

type RoutesParams struct {
	fx.In

	Logger interfaces.Logger
	Router *gin.Engine

	MainController  *controllers.MainController
	StockController *controllers.StockController
}

func newRouter() *gin.Engine {
	return gin.New()
}

func registerRoutes(p RoutesParams) {
	v1 := p.Router.Group("/v1")
	{
		v1.POST("/best-product", p.MainController.BestProduct)

		v2 := v1.Group("/stock")
		{
			v2.POST("/upsert-qty", p.StockController.UpsertStockQty)
			v2.POST("/update-price", p.StockController.UpdateStockPrice)
		}
	}
}
