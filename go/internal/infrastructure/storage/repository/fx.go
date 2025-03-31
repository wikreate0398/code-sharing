package repository

import (
	"go.uber.org/fx"
	"wikreate/fimex/internal/domain/services/catalog/best_price_service"
	"wikreate/fimex/internal/domain/services/catalog/product_service"
	"wikreate/fimex/internal/domain/services/payment_history_service"
	"wikreate/fimex/internal/infrastructure/storage/repository/product_repository"
	"wikreate/fimex/internal/infrastructure/storage/repository/user_repository"
)

var _ product_service.ProductCharRepository = (*ProductCharRepositoryImpl)(nil)
var _ product_service.ProductRepository = (*product_repository.ProductRepositoryImpl)(nil)
var _ payment_history_service.UserRepository = (*user_repository.UserRepositoryImpl)(nil)
var _ best_price_service.ProviderProductRepository = (*ProviderProductRepositoryImpl)(nil)

var Module = fx.Module("repository",
	fx.Provide(
		fx.Annotate(
			NewPaymentHistoryRepository,
			fx.As(new(payment_history_service.PaymentHistoryRepository)),
		),

		fx.Annotate(
			user_repository.NewUserRepository,
			fx.As(new(payment_history_service.UserRepository)),
		),

		fx.Annotate(
			NewProductCharRepository,
			fx.As(new(product_service.ProductCharRepository)),
		),

		fx.Annotate(
			product_repository.NewProductRepository,
			fx.As(new(product_service.ProductRepository)),
		),

		fx.Annotate(
			NewProviderProductRepository,
			fx.As(new(best_price_service.ProviderProductRepository)),
		),

		fx.Annotate(
			NewCategoryPercentRepository,
			fx.As(new(best_price_service.CategoryPercentRepository)),
		),

		fx.Annotate(
			NewCargoRepository,
			fx.As(new(best_price_service.CargoRepository)),
		),

		fx.Annotate(
			NewCountryImplRepository,
			fx.As(new(best_price_service.CountryImplementationRepository)),
		),

		fx.Annotate(
			NewWholesaleRepository,
			fx.As(new(best_price_service.WholesaleRepository)),
		),

		fx.Annotate(
			NewSaleProductRepository,
			fx.As(new(best_price_service.SaleProductRepository)),
		),
	),
)
