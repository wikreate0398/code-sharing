package targeting

import (
	"context"
	"fmt"
	"github.com/pkg/errors"
	"go.uber.org/fx"
	"slices"
	"time"
	"wikreate/fimex/internal/domain/custom_errors"
	"wikreate/fimex/internal/domain/entities/stock/provider_product"
	"wikreate/fimex/internal/domain/interfaces"
	"wikreate/fimex/internal/domain/structure/dto/stock_dto"
	"wikreate/fimex/internal/domain/structure/dto/user_dto"
	"wikreate/fimex/internal/helpers"
)

type Params struct {
	fx.In

	ProviderProductRepo ProviderProductRepository
	DB                  interfaces.DB
	Publisher           interfaces.EventPublisher
	Logger              interfaces.Logger
}

type StockTargetingService struct {
	*Params
}

func NewStockTargetingService(params Params) *StockTargetingService {
	return &StockTargetingService{
		Params: &params,
	}
}

func (s *StockTargetingService) UpsertQty(ctx context.Context, input stock_dto.TargetingInputDto) error {
	ctx, err := s.DB.BeginTx(ctx)
	if err != nil {
		return fmt.Errorf("failed start transaction on stock upsert qty: inputs: %#v, err: %w", input, err)
	}

	defer s.DB.RollbackTx(ctx)

	products, err := s.ProviderProductRepo.GetForTarget(ctx, input.IdProduct, input.IdPurchase)
	if err != nil {
		return err
	}

	index := s.findSelfIndex(products, input.IdSupplier)

	if index == -1 && input.Qty == 0 {
		return nil
	}

	causer := user_dto.UserDto{
		ID:   input.Causer.Id,
		Type: input.Causer.Type,
	}

	var providerProduct provider_product.ProviderProduct

	if index == -1 {
		if input.Qty <= 0 {
			return &custom_errors.ClientError{
				Message: errors.New("The qty must be more than 0"),
				Code:    provider_product.QtyErrCode,
			}
		}

		now := time.Now().Format(helpers.FullTimeFormat)

		dto, err := s.ProviderProductRepo.Create(ctx, stock_dto.ProviderProductDto{
			IdPurchase: input.IdPurchase,
			IdProduct:  input.IdProduct,
			IdProvider: input.IdSupplier,
			IdManager:  input.IdManager,
			Qty:        input.Qty,
			CreatedAt:  now,
			UpdatedAt:  now,
		})

		providerProduct = provider_product.Create(dto, causer)

		if err != nil {
			return err
		}
	} else {
		providerProduct = products[index]

		if !providerProduct.IsOwnerManager(input.IdManager, causer.Type) {
			return &custom_errors.ClientError{
				Message: errors.New("Product was added by another manager"),
				Code:    provider_product.SupplierProductOwnerConflictErrCode,
			}
		}

		if input.Qty > 0 {
			err = s.ProviderProductRepo.UpdateQty(ctx, providerProduct.Id(), input.Qty)
		} else {
			err = s.ProviderProductRepo.Delete(ctx, providerProduct.Id())
		}

		if err != nil {
			return err
		}

		providerProduct.UpdateQty(input.Qty, causer)
	}

	if err = s.DB.CommitTx(ctx); err != nil {
		return fmt.Errorf("failed commit transaction on stock upsert qty: inputs: %#v, err: %w", input, err)
	}

	events := providerProduct.GetEvents()
	providerProduct.ClearEvents()

	s.Publisher.DispatchAllAsync(events)

	return nil
}

func (s *StockTargetingService) UpdatePrice(ctx context.Context, input stock_dto.TargetingInputDto) (float64, error) {
	ctx, err := s.DB.BeginTx(ctx)
	if err != nil {
		return 0, fmt.Errorf("failed start transaction on stock update price: inputs: %#v, err: %w", input, err)
	}

	defer s.DB.RollbackTx(ctx)

	products, err := s.ProviderProductRepo.GetForTarget(ctx, input.IdProduct, input.IdPurchase)
	if err != nil {
		return 0, err
	}

	index := s.findSelfIndex(products, input.IdSupplier)

	if index == -1 {
		return 0, nil
	}

	causer := user_dto.UserDto{
		ID:   input.Causer.Id,
		Type: input.Causer.Type,
	}
	product := products[index]

	if !product.IsOwnerManager(input.IdManager, causer.Type) {
		return 0, &custom_errors.ClientError{
			Message: errors.New("Product was added by another manager"),
			Code:    provider_product.SupplierProductOwnerConflictErrCode,
		}
	}

	if product.Price().Float64 == input.Price {
		return 0, nil
	}

	price := product.PrepareNewPrice(input.Price, products)
	updatedAt := time.Now().Format(helpers.FullTimeFormat)

	if err := s.ProviderProductRepo.UpdatePrice(ctx, product.Id(), price, updatedAt); err != nil {
		return 0, err
	}

	product.UpdatePrice(price, updatedAt, causer)

	if err = s.DB.CommitTx(ctx); err != nil {
		return 0, fmt.Errorf("failed commit transaction on stock update price: inputs: %#v, err: %w", input, err)
	}

	events := product.GetEvents()
	product.ClearEvents()
	s.Publisher.DispatchAllAsync(events)

	return price.Float64, nil
}

func (s *StockTargetingService) findSelfIndex(products []provider_product.ProviderProduct, IdSupplier int) int {
	return slices.IndexFunc(products, func(product provider_product.ProviderProduct) bool {
		return product.IdSupplier() == IdSupplier
	})
}
