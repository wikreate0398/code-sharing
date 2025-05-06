package targeting

import (
	"context"
	"wikreate/fimex/internal/domain/interfaces"
	"wikreate/fimex/internal/domain/structure/dto/catalog_dto"
	"wikreate/fimex/internal/domain/structure/dto/stock_dto"
)

type adminDataPayload struct {
	Info      string        `json:"info"`
	IdChannel int           `json:"id_channel"`
	Products  []interface{} `json:"products"`
}

type adminSocketManager struct {
	userRepo  UserRepository
	prodRepo  ProductRepository
	cargoRepo CargoRepository
	pusher    interfaces.Sockets
}

func newAdminSocketManager(
	userRepo UserRepository,
	prodRepo ProductRepository,
	cargoRepo CargoRepository,
	pusher interfaces.Sockets,
) adminSocketManager {
	return adminSocketManager{userRepo: userRepo, prodRepo: prodRepo, cargoRepo: cargoRepo, pusher: pusher}
}

func (p adminSocketManager) Manage(
	ctx context.Context,
	dto stock_dto.ProviderProductDto,
) error {

	userName, err := p.userRepo.SelectUserName(ctx, dto.IdProvider)
	if err != nil {
		return err
	}

	product, err := p.prodRepo.Find(ctx, dto.IdProduct)
	if err != nil {
		return err
	}

	cargoData, err := p.cargoRepo.Get(catalog_dto.CargoRepoParamsDto{
		IdProduct: dto.IdProduct,
	})

	if err != nil {
		return err
	}

	cargo := map[int]map[int]interface{}{}
	for _, item := range cargoData {
		if cargo[item.IdPurchase] == nil {
			cargo[item.IdPurchase] = map[int]interface{}{}
		}
		cargo[item.IdPurchase][item.IdImplementation] = item.Cargo.Float64
	}

	payload := map[string]any{
		"provider_data": map[string]any{
			"id":               dto.Id,
			"qty":              dto.Qty,
			"price":            dto.Price.Float64,
			"price_updated_at": dto.PriceUpdatedAt.String,
			"id_provider":      dto.IdProvider,
			"id_purchase":      dto.IdPurchase,
			"cargo":            cargo,
		},
		"provider": map[string]any{
			"name": userName,
		},
		"product_data": map[string]any{
			"id":             product.Id(),
			"page_up":        product.Position(),
			"id_subcategory": product.IdSubcategory(),
			"id_category":    product.IdCategory(),
			"id_brand":       product.IdBrand(),
			"name":           product.Name(),
			"code":           product.Code(),
			"group_chars":    product.BotGroupChars().Ids,
		},
	}

	p.pusher.SendMessage("admin-warehouse", "update-warehouse", payload)

	return nil
}
