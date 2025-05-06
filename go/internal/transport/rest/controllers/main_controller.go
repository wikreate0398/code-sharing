package controllers

import (
	"github.com/gin-gonic/gin"
	"go.uber.org/fx"
	"wikreate/fimex/internal/transport/rest/response"
)

type MainParams struct {
	fx.In

	BestPriceServ BestPriceService
	Response      *response.Response
}

type MainController struct {
	*MainParams
}

func NewMainController(p MainParams) *MainController {
	return &MainController{
		MainParams: &p,
	}
}

func (c *MainController) BestProduct(ctx *gin.Context) {
	type req struct {
		IdProduct  []int `json:"id_product"`
		IdPurchase int   `json:"id_purchase"`
	}

	var params req
	if err := ctx.ShouldBindJSON(&params); err != nil {
		c.Response.HandleErr(ctx, err)
		return
	}

	err := c.BestPriceServ.GeneratePricesForSelectedStockProducts(
		ctx.Request.Context(), params.IdPurchase, params.IdProduct, false,
	)

	if err != nil {
		c.Response.HandleErr(ctx, err)
		return
	}

	c.Response.Ok200(ctx, gin.H{})
}
