package targeting

import (
	"context"
	"go.uber.org/fx"
	"wikreate/fimex/internal/domain/entities/stock/provider_product"
	"wikreate/fimex/internal/domain/interfaces"
	"wikreate/fimex/internal/domain/structure/dto/stock_dto"
)

type socketManager interface {
	Manage(
		ctx context.Context,
		dto stock_dto.ProviderProductDto,
	) error
}

type StockSocketManagerParams struct {
	fx.In

	ProviderProductRepo ProviderProductRepository
	ProductRepository   ProductRepository
	UserRepository      UserRepository
	CargoRepository     CargoRepository
	Pusher              interfaces.Sockets
}

type StockSocketManager struct {
	*StockSocketManagerParams
}

func NewStockSocketManager(params StockSocketManagerParams) *StockSocketManager {
	return &StockSocketManager{&params}
}

func (p *StockSocketManager) Manage(
	ctx context.Context,
	dto stock_dto.ProviderProductDto,
) error {

	entity := provider_product.NewProviderProduct(dto)

	if entity.WasAffectedPriceableProduct() {
		if err := p.execute(ctx, dto, newAdminSocketManager(p.UserRepository, p.ProductRepository, p.CargoRepository, p.Pusher)); err != nil {
			return err
		}
	}

	return p.execute(ctx, dto, newSupplierSocketManager(p.ProviderProductRepo, p.Pusher))
}

func (p *StockSocketManager) execute(ctx context.Context, dto stock_dto.ProviderProductDto, m socketManager) error {
	return m.Manage(ctx, dto)
}
