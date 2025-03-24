package best_price_service

import (
	"context"
	"wikreate/fimex/internal/domain/entities/country_impl"
	"wikreate/fimex/internal/domain/entities/stock/provider_product"
	"wikreate/fimex/internal/domain/entities/stock/sale_product"
	"wikreate/fimex/internal/domain/entities/wholesale"
	"wikreate/fimex/internal/domain/structure/dto/catalog_dto"
	"wikreate/fimex/internal/domain/structure/dto/stock_dto"
)

type ProviderProductRepository interface {
	GetForBestSale(ctx context.Context, id_purchase int, ids []int) ([]provider_product.ProviderProduct, error)
	GetActiveProducts(ctx context.Context) ([]provider_product.ProviderProduct, error)
}

type CategoryPercentRepository interface {
	Get(params catalog_dto.CategoryPercentRepoParamsDto) ([]catalog_dto.CategoryPercentQueryDto, error)
}

type CargoRepository interface {
	Get(params catalog_dto.CargoRepoParamsDto) ([]catalog_dto.CargoQueryDto, error)
}

type CountryImplementationRepository interface {
	Get() ([]country_impl.CountryImplementation, error)
}

type WholesaleRepository interface {
	Get() ([]wholesale.Wholesale, error)
}

type SaleProductRepository interface {
	Get(ctx context.Context, params stock_dto.SaleProductRepoParamsDto) ([]sale_product.SaleProduct, error)
	DeleteByIds(ctx context.Context, ids []int) error
	BatchCreate(ctx context.Context, records []stock_dto.SaleProductStoreDto) error
	BatchUpdate(ctx context.Context, records []stock_dto.SaleProductStoreDto) error
	DeleteProductsWithoutSuppliers(ctx context.Context) error
}
