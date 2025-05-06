package listeners

import (
	"context"
	"fmt"
	"github.com/redis/go-redis/v9"
	"go.uber.org/fx"
	"wikreate/fimex/internal/domain/entities/stock/provider_product"
	"wikreate/fimex/internal/domain/interfaces"
	"wikreate/fimex/internal/domain/services/targeting"
	"wikreate/fimex/internal/domain/structure/dto/stock_dto"
	"wikreate/fimex/internal/domain/structure/dto/user_dto"
	"wikreate/fimex/internal/helpers"
)

type PusherParams struct {
	fx.In

	Pusher            interfaces.Sockets
	Logger            interfaces.Logger
	StockSocketManger *targeting.StockSocketManager
	RedisClient       *redis.Client
}

type PusherListener struct {
	*PusherParams
}

func NewPusherListener(params PusherParams) *PusherListener {
	return &PusherListener{&params}
}

func (pl *PusherListener) Subscribe() []string {
	return []string{
		provider_product.CreateProviderProductEventName,
		provider_product.UpdateProviderProductEventName,
		provider_product.DeleteProviderProductEventName,
	}
}

func (pl *PusherListener) Notify(ctx context.Context, event interfaces.Event) error {
	switch e := event.(type) {
	case *provider_product.CreateProviderProductEvent:
		return pl.supplierProductManage(ctx, e.Dto, e.Causer)
		//fmt.Println("PusherListener CreateProviderProductEventName", e.Dto.Id)

	case *provider_product.UpdateProviderProductEvent:
		return pl.supplierProductManage(ctx, e.Dto, e.Causer)
		//fmt.Println("PusherListener UpdateProviderProductEventName", e.Dto.Id)

	case *provider_product.DeleteProviderProductEvent:
		return pl.supplierProductManage(ctx, e.Dto, e.Causer)
		//fmt.Println("PusherListener DeleteProviderProductEventName", e.Dto.Id)
	}

	return nil
}

func (pl *PusherListener) supplierProductManage(ctx context.Context, dto stock_dto.ProviderProductDto, userDto user_dto.UserDto) error {
	// notify about product changes

	var resp = struct {
		Params stock_dto.ProviderProductDto `json:"params"`
		Causer map[string]interface{}       `json:"causer"`
	}{
		Params: dto,
		Causer: map[string]interface{}{
			"id": userDto.ID,
		},
	}

	str, _ := helpers.StructToJson(resp)
	pl.RedisClient.Publish(ctx, "change-stock-product-channel", string(str))

	// realtime in supplier/admin profile
	err := pl.StockSocketManger.Manage(
		context.Background(),
		dto,
	)
	if err != nil {
		return fmt.Errorf("cannot manage stock socket in pusher listner: %w", err)
	}

	return nil
}
