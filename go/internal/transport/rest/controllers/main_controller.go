package controllers

import (
	"github.com/gin-gonic/gin"
	"wikreate/fimex/internal/domain"
)

type MainController struct {
	BaseController
}

func NewMainController(application *domain.Application) *MainController {
	return &MainController{
		BaseController{application},
	}
}

func (c *MainController) Home(ctx *gin.Context) {
	c.ok200(ctx, Json{"data": "lorem"})
}
