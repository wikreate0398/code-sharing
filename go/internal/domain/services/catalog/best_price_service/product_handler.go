package best_price_service

import (
	"context"
	"wikreate/fimex/internal/domain/entities/country_impl"
	"wikreate/fimex/internal/domain/entities/stock/provider_product"
	"wikreate/fimex/internal/domain/entities/stock/sale_product"
	"wikreate/fimex/internal/domain/entities/wholesale"
	"wikreate/fimex/internal/domain/structure/dto/stock_dto"
)

type saleProductsHandler struct {
	saleProductRepo SaleProductRepository

	global               bool
	percents             PercentsMapKey
	cargo                CargosMapKey
	implementations      []country_impl.CountryImplementation
	wholesales           []wholesale.Wholesale
	saleProducts         map[saleProductMapKeyDto][]sale_product.SaleProduct
	records              []stock_dto.SaleProductStoreDto
	topPrice             topPricePublisher
	preorderNotification preorderNotificationPublisher
}

func (s *saleProductsHandler) handle(ctx context.Context, providerProducts []provider_product.ProviderProduct) error {
	if len(providerProducts) <= 0 {
		if err := s.deleteNotRelevantProducts(ctx); err != nil {
			return err
		}
	} else {
		for _, items := range groupProviderProducts(providerProducts) {
			if err := s.manageProduct(items); err != nil {
				return err
			}
		}

		if err := s.batchCreate(ctx); err != nil {
			return err
		}

		if err := s.batchUpdate(ctx); err != nil {
			return err
		}

		if err := s.deleteNotRelevantProducts(ctx); err != nil {
			return err
		}

		s.topPrice.appendRecords(s.records)
		s.preorderNotification.appendRecords(s.records)
	}

	s.topPrice.publish(ctx)
	s.preorderNotification.publish(ctx)

	return nil
}

func (s *saleProductsHandler) manageProduct(
	providerProducts []provider_product.ProviderProduct,
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

			preparedData := newUpsertPreparation(implementation, whs, totalQty, bestPrice, s.saleProducts)

			s.records = append(s.records, preparedData.prepare())
		}
	}

	return nil
}

func (s *saleProductsHandler) batchCreate(ctx context.Context) error {
	createRecords := make([]stock_dto.SaleProductStoreDto, 0)

	for _, record := range s.records {
		if record.IsNew {
			createRecords = append(createRecords, record)
		}
	}

	if len(createRecords) > 0 {
		return s.saleProductRepo.BatchCreate(ctx, createRecords)
	}

	return nil
}

func (s *saleProductsHandler) batchUpdate(ctx context.Context) error {
	updateRecords := make([]stock_dto.SaleProductStoreDto, 0)

	for _, record := range s.records {
		if record.NeedUpdate {
			updateRecords = append(updateRecords, record)
		}
	}

	if len(updateRecords) > 0 {
		return s.saleProductRepo.BatchUpdate(ctx, updateRecords)
	}

	return nil
}

func (s *saleProductsHandler) deleteNotRelevantProducts(ctx context.Context) error {
	unToucheableIds := make(map[int]struct{})
	for _, record := range s.records {
		if record.Id > 0 {
			unToucheableIds[record.Id] = struct{}{}
		}
	}

	deletedIds := make([]int, 0)

	for _, items := range s.saleProducts {
		for _, item := range items {
			if _, ok := unToucheableIds[item.Id()]; !ok {
				deletedIds = append(deletedIds, item.Id())
				s.topPrice.appendDeletedRecord(item)
			}
		}
	}

	if len(deletedIds) > 0 {
		return s.saleProductRepo.DeleteByIds(ctx, deletedIds)
	}

	return nil
}
