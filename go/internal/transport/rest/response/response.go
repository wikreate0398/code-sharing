package response

import (
	"github.com/gin-gonic/gin"
	"github.com/pkg/errors"
	"net/http"
	"wikreate/fimex/internal/domain/custom_errors"
)

type Json map[string]interface{}

type Response struct{}

func NewResponse() *Response {
	return &Response{}
}

func (r *Response) Ok200(context *gin.Context, obj any) {
	context.JSON(http.StatusOK, obj)
}

// nolint:unused
func (r *Response) Error400(context *gin.Context, message string, params map[string]any) {
	var obj = gin.H{"message": message}
	for k, v := range params {
		obj[k] = v
	}

	context.JSON(http.StatusBadRequest, obj)
}

// nolint:unused
func (r *Response) Error500(context *gin.Context, message string, params map[string]any) {
	var obj = gin.H{"message": message}
	for k, v := range params {
		obj[k] = v
	}

	context.JSON(http.StatusInternalServerError, obj)
}

func (r *Response) HandleErr(ctx *gin.Context, err error) {
	var customErr *custom_errors.ClientError
	if errors.As(err, &customErr) {
		r.Error400(ctx, customErr.Error(), gin.H{
			"code": customErr.StatusCode(),
		})
	} else {
		_ = ctx.Error(err)
		r.Error500(ctx, err.Error(), gin.H{})
	}
}
