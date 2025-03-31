package best_price_service

import (
	"context"
	"github.com/redis/go-redis/v9"
	"go.uber.org/fx"
	"slices"
	"wikreate/fimex/internal/domain/entities/stock/provider_product"
	"wikreate/fimex/internal/domain/interfaces"
	"wikreate/fimex/internal/domain/structure/dto/catalog_dto"
	"wikreate/fimex/internal/domain/structure/dto/stock_dto"
	"wikreate/fimex/internal/helpers"
	"wikreate/fimex/pkg/workerpool"
)

type Params struct {
	fx.In

	Logger interfaces.Logger
	Db     interfaces.DB
	Redis  *redis.Client

	ProviderProductRepo ProviderProductRepository
	CategoryPercentRepo CategoryPercentRepository
	CargoRepo           CargoRepository
	CountryImplRepo     CountryImplementationRepository
	WholesaleRepo       WholesaleRepository
	SaleProductRepo     SaleProductRepository
}

type BestPriceService struct {
	*Params
}

func NewBestPriceService(params Params) *BestPriceService {
	return &BestPriceService{&params}
}

func (s *BestPriceService) GeneratePricesForSelectedStockProducts(
	ctx context.Context,
	idPurchase int,
	idsProducts []int,
	global bool,
) error {
	return s.Db.Transaction(ctx, func(ctx context.Context) error {
		providerProducts, err := s.ProviderProductRepo.GetForBestSale(ctx, idPurchase, idsProducts)
		if err != nil {
			return err
		}

		var percents []catalog_dto.CategoryPercentQueryDto
		if len(providerProducts) > 0 {
			percents, err = s.CategoryPercentRepo.Get(catalog_dto.CategoryPercentRepoParamsDto{
				IdPurchase:  idPurchase,
				IdsCategory: extractCatIds(providerProducts),
				Type:        "sales",
			})

			if err != nil {
				return err
			}
		}

		cargoDtoParams := catalog_dto.CargoRepoParamsDto{IdPurchase: idPurchase, IdsProducts: idsProducts}
		cargo, err := s.CargoRepo.Get(cargoDtoParams)
		if err != nil {
			return err
		}

		impl, err := s.CountryImplRepo.Get()
		if err != nil {
			return err
		}

		whs, err := s.WholesaleRepo.Get()
		if err != nil {
			return err
		}

		saleProdDtoParams := stock_dto.SaleProductRepoParamsDto{IdPurchase: idPurchase, IdsProduct: idsProducts}
		saleProducts, err := s.SaleProductRepo.Get(ctx, saleProdDtoParams)
		if err != nil {
			return err
		}

		handler := saleProductsHandler{
			global:          global,
			percents:        mapPercents(percents),
			cargo:           mapCargo(cargo),
			implementations: impl,
			wholesales:      whs,
			saleProducts:    groupSaleProducts(saleProducts),
			saleProductRepo: s.SaleProductRepo,

			records:              make([]stock_dto.SaleProductStoreDto, 0),
			topPrice:             newTopPricePublisher(s.Redis, idPurchase),
			preorderNotification: newPreOrderNotification(s.Redis, &providerProducts),
		}

		return handler.handle(ctx, providerProducts)
	})
}

func (s *BestPriceService) GeneratePricesForAllStockProducts(ctx context.Context) error {
	if err := s.SaleProductRepo.DeleteUnvailableProducts(ctx); err != nil {
		s.Logger.OnError(err, "failed to delete unvailable products")
		return err
	}

	providerProducts, err := s.ProviderProductRepo.GetActiveProducts(ctx)
	if err != nil {
		s.Logger.OnError(err, "failed to get active products")
		return err
	}

	mapped := make(map[int][]provider_product.ProviderProduct)
	for _, item := range providerProducts {
		mapped[item.IdPurchase()] = append(mapped[item.IdPurchase()], item)
	}

	pool := workerpool.NewWorkerPool(30)

	pool.Start()

	defer func() {
		pool.Wait()
		pool.Stop()
	}()

	for idPurchase, items := range mapped {
		for chunkItems := range slices.Chunk(items, 100) {
			ids := make([]int, len(chunkItems))
			for i, item := range chunkItems {
				ids[i] = item.IdProduct()
			}

			pool.AddJob(func(ids []int) func() {
				return func() {
					err := s.GeneratePricesForSelectedStockProducts(ctx, idPurchase, ids, true)

					s.Logger.WithFields(helpers.KeyStrValue{
						"idPurchase": idPurchase,
						"ids":        ids,
					}).OnError(err, "failed to generate prices for all products")
				}
			}(ids))
		}
	}

	return err
}
