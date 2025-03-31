package controllers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"go.uber.org/fx"
	"wikreate/fimex/internal/domain/interfaces"
	"wikreate/fimex/internal/transport/rest/response"
)

type Params struct {
	fx.In

	//BestPriceServ *best_price_service.BestPriceService
	Response *response.Response
	Logger   interfaces.Logger
}

type MainController struct {
	*Params
}

func NewMainController(p Params) *MainController {
	return &MainController{
		Params: &p,
	}
}

func (c *MainController) Home(ctx *gin.Context) {

	//start := time.Now()
	//var idPurchase = 5
	//var IdsProd = []int{24453}
	//
	//err := c.BestPriceServ.GeneratePricesForSelectedStockProducts(context.Background(), idPurchase, IdsProd, false)
	//
	//fmt.Println(time.Since(start))
	//err := c.BestPriceServ.GeneratePricesForAllStockProducts(context.Background())

	c.Response.Ok200(ctx, Json{"error": fmt.Sprintf("%v", nil)})
}
