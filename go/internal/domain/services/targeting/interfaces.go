package targeting

import (
	"context"
	"database/sql"
	"wikreate/fimex/internal/domain/entities/catalog/product"
	"wikreate/fimex/internal/domain/entities/stock/provider_product"
	"wikreate/fimex/internal/domain/structure/dto/catalog_dto"
	"wikreate/fimex/internal/domain/structure/dto/stock_dto"
)

type ProviderProductRepository interface {
	GetForTarget(
		ctx context.Context, idProduct int, idPurchase int,
	) ([]provider_product.ProviderProduct, error)

	GetForPusher(
		ctx context.Context, idPurchase int, idProduct int,
	) ([]stock_dto.PusherProviderProductQueryDto, error)

	Delete(ctx context.Context, id int) error

	UpdateQty(ctx context.Context, id int, qty int) error

	UpdatePrice(ctx context.Context, id int, price sql.NullFloat64, updatedAt string) error

	Create(ctx context.Context, dto stock_dto.ProviderProductDto) (stock_dto.ProviderProductDto, error)
}

type UserRepository interface {
	SelectUserName(ctx context.Context, id int) (string, error)
}

type ProductRepository interface {
	Find(ctx context.Context, id int) (product.Product, error)
}

type CargoRepository interface {
	Get(params catalog_dto.CargoRepoParamsDto) ([]catalog_dto.CargoQueryDto, error)
}
