package response

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

type Json map[string]interface{}

type Response struct{}

func NewResponse() *Response {
	return &Response{}
}

func (r *Response) Ok200(context *gin.Context, result map[string]any) {
	context.JSON(http.StatusOK, result)
}

// nolint:unused
func (r *Response) Error400(context *gin.Context, result map[string]any) {
	context.JSON(http.StatusBadRequest, result)
}
