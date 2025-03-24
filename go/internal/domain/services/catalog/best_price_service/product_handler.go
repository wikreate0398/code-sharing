package best_price_service

import (
	"context"
	"wikreate/fimex/internal/domain/entities/country_impl"
	"wikreate/fimex/internal/domain/entities/stock/provider_product"
	"wikreate/fimex/internal/domain/entities/stock/sale_product"
	"wikreate/fimex/internal/domain/entities/wholesale"
	"wikreate/fimex/internal/domain/structure/dto/stock_dto"
)

type saleProductHandler struct {
	percents        PercentsMapKey
	cargo           CargosMapKey
	implementations []country_impl.CountryImplementation
	wholesales      []wholesale.Wholesale
	saleProducts    map[SaleProductMapKeyDto][]sale_product.SaleProduct

	saleProductRepo SaleProductRepository
}

func (s *saleProductHandler) handle(ctx context.Context, providerProducts []provider_product.ProviderProduct) error {
	// delete not relevant s
	if len(providerProducts) <= 0 {
		if err := s.deleteNotRelevantSaleProducts(ctx, nil); err != nil {
			return err
		}
	} else {
		/*
		 manager products
		*/
		records := make([]stock_dto.SaleProductStoreDto, 0)
		//groupSaleProducts(saleProducts)
		for _, items := range groupProviderProducts(providerProducts) {
			if err := s.manageProduct(items, &records); err != nil {
				return err
			}
		}

		if err := s.create(ctx, records); err != nil {
			return err
		}

		if err := s.update(ctx, records); err != nil {
			return err
		}

		if err := s.deleteNotRelevantSaleProducts(ctx, records); err != nil {
			return err
		}
	}

	return nil
}

func (s *saleProductHandler) manageProduct(
	providerProducts []provider_product.ProviderProduct,
	records *[]stock_dto.SaleProductStoreDto,
) error {
	mappedProviderProducts := mapProviderProducts(providerProducts)
	totalQty := sumTotal(mappedProviderProducts)

	for _, implementation := range s.implementations {
		for _, whs := range s.wholesales {
			priceConverter := NewPriceConverter(
				implementation.Currency(),
				providerProducts[0].Product(),
				s.percents[IdImpl(implementation.Id())][IdWhs(whs.Id())],
				s.cargo[IdImpl(implementation.Id())],
			)

			result := priceConverter.Convert(mappedProviderProducts)

			if len(result) <= 0 {
				continue
			}

			bestPrice := result[0]

			preparedData := NewUpsertPreparation(implementation, whs, totalQty, bestPrice, s.saleProducts)

			*records = append(*records, preparedData.GetPayload())
		}
	}

	return nil
}

func (s *saleProductHandler) create(
	ctx context.Context,
	records []stock_dto.SaleProductStoreDto,
) error {
	createRecords := make([]stock_dto.SaleProductStoreDto, 0)

	for _, record := range records {
		if record.Id == 0 && !record.NeedUpdate {
			createRecords = append(createRecords, record)
		}
	}

	if len(createRecords) > 0 {
		return s.saleProductRepo.BatchCreate(ctx, createRecords)
	}

	return nil
}

func (s *saleProductHandler) update(
	ctx context.Context,
	records []stock_dto.SaleProductStoreDto,
) error {
	updateRecords := make([]stock_dto.SaleProductStoreDto, 0)

	for _, record := range records {
		if record.NeedUpdate {
			updateRecords = append(updateRecords, record)
		}
	}

	if len(updateRecords) > 0 {
		return s.saleProductRepo.BatchUpdate(ctx, updateRecords)
	}

	return nil
}

func (s *saleProductHandler) deleteNotRelevantSaleProducts(
	ctx context.Context,
	records []stock_dto.SaleProductStoreDto,
) error {
	unToucheableIds := make(map[int]struct{})
	for _, record := range records {
		if record.Id > 0 {
			unToucheableIds[record.Id] = struct{}{}
		}
	}

	deletedIds := make([]int, 0)
	for _, items := range s.saleProducts {
		for _, item := range items {
			if _, ok := unToucheableIds[item.Id()]; !ok {
				deletedIds = append(deletedIds, item.Id())
			}
		}
	}

	if len(deletedIds) > 0 {
		return s.saleProductRepo.DeleteByIds(ctx, deletedIds)
	}

	return nil
}
