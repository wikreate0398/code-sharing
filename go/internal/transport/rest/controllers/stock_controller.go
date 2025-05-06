package controllers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"go.uber.org/fx"
	"wikreate/fimex/internal/domain/interfaces"
	"wikreate/fimex/internal/domain/structure/dto/stock_dto"
	"wikreate/fimex/internal/transport/rest/response"
)

type StockParams struct {
	fx.In

	Response *response.Response
	Logger   interfaces.Logger
	Service  StockTargetingService
}

type StockController struct {
	*StockParams
}

func NewStockController(p StockParams) *StockController {
	return &StockController{&p}
}

func (c *StockController) UpsertStockQty(ctx *gin.Context) {
	var dto stock_dto.TargetingInputDto
	if err := ctx.ShouldBindJSON(&dto); err != nil {
		c.Response.HandleErr(ctx, fmt.Errorf("cannot parse params for upsert stock qty: %w", err))
		return
	}

	err := c.Service.UpsertQty(ctx.Request.Context(), dto)

	if err != nil {
		c.Response.HandleErr(ctx, err)
		return
	}

	c.Response.Ok200(ctx, gin.H{})
}

func (c *StockController) UpdateStockPrice(ctx *gin.Context) {
	var dto stock_dto.TargetingInputDto
	if err := ctx.ShouldBindJSON(&dto); err != nil {
		c.Response.HandleErr(ctx, fmt.Errorf("cannot parse params for update stock price: %w", err))
		return
	}

	newPrice, err := c.Service.UpdatePrice(
		ctx.Request.Context(),
		dto,
	)

	if err != nil {
		c.Response.HandleErr(ctx, err)
		return
	}

	c.Response.Ok200(ctx, gin.H{
		"price": newPrice,
	})
}
