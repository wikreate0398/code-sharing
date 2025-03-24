package controllers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"go.uber.org/fx"
	"golang.org/x/net/context"
	"wikreate/fimex/internal/domain/interfaces"
	"wikreate/fimex/internal/domain/services/catalog/best_price_service"
	"wikreate/fimex/internal/transport/rest/response"
)

type Params struct {
	fx.In

	BestPriceServ *best_price_service.BestPriceService
	Response      *response.Response
	Logger        interfaces.Logger
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

	//var idPurchase = 5
	//var IdsProd = []int{23030}
	//
	//err := c.BestPriceServ.GeneratePricesForSelectedProducts(context.Background(), idPurchase, IdsProd)

	err := c.BestPriceServ.GeneratePricesForAllProducts(context.Background())

	c.Response.Ok200(ctx, Json{"error": fmt.Sprintf("%v", err)})
}
