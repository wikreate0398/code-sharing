package middleware

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"wikreate/fimex/internal/domain/interfaces"
	"wikreate/fimex/internal/helpers"
)

func ErrorHandlerMiddleware(logger interfaces.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		if len(c.Errors) > 0 {
			for _, err := range c.Errors {
				logger.WithFields(helpers.KeyStrValue{
					"path":   c.Request.URL.Path,
					"method": c.Request.Method,
				}).Error(fmt.Errorf("Logger Middleware %w", err.Err))
			}
		}
	}
}
