package rest

import (
	"github.com/gin-gonic/gin"
	"wikreate/fimex/internal/domain/interfaces"
	"wikreate/fimex/internal/transport/rest/middleware"
)

func registerMiddleware(router *gin.Engine, logger interfaces.Logger) {
	router.Use(middleware.ErrorHandlerMiddleware(logger))
	router.Use(gin.Recovery())
}
