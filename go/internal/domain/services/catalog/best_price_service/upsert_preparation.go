package best_price_service

import (
	"time"
	"wikreate/fimex/internal/domain/entities/country_impl"
	"wikreate/fimex/internal/domain/entities/stock/sale_product"
	"wikreate/fimex/internal/domain/entities/wholesale"
	"wikreate/fimex/internal/domain/structure/dto/stock_dto"
)

type upsertPreparation struct {
	implementation country_impl.CountryImplementation
	whs            wholesale.Wholesale
	totalQty       int
	bestProduct    stock_dto.ConvertedProviderProductDto
	saleProducts   map[saleProductMapKeyDto][]sale_product.SaleProduct
}

func newUpsertPreparation(
	implementation country_impl.CountryImplementation,
	whs wholesale.Wholesale,
	totalQty int,
	bestProduct stock_dto.ConvertedProviderProductDto,
	saleProducts map[saleProductMapKeyDto][]sale_product.SaleProduct,
) upsertPreparation {
	return upsertPreparation{
		implementation,
		whs,
		totalQty,
		bestProduct,
		saleProducts,
	}
}

func (c *upsertPreparation) prepare() stock_dto.SaleProductStoreDto {
	saleProduct := c.getSaleProductRecord()

	var (
		id                          = 0
		isTop                       = false
		prevPrice           float64 = 0
		wasAffectedTopPrice         = false
		createdAt                   = time.Now()
		updatedAt                   = createdAt
		needUpdate                  = false
	)

	if saleProduct != nil {
		id = saleProduct.Id()
		wasAffectedTopPrice = saleProduct.WasAffectedTopPrice(c.bestProduct.ConvertedPrice)
		isTop = saleProduct.CanLeaveInTop(c.bestProduct.ConvertedPrice)
		prevPrice = saleProduct.Price()
		createdAt = time.Now()
		updatedAt = createdAt
		needUpdate = !saleProduct.IsEqual(c.bestProduct, c.totalQty)
	}

	return stock_dto.SaleProductStoreDto{
		Id:                id,
		IdProduct:         c.bestProduct.IdProduct,
		IdPurchase:        c.bestProduct.IdPurchase,
		IdImplementation:  c.implementation.Id(),
		IdWholesale:       c.whs.Id(),
		IdProviderProduct: c.bestProduct.Id,
		IdProvider:        c.bestProduct.IdProvider,
		Percent:           c.bestProduct.Percent,
		Cargo:             c.bestProduct.Cargo,
		Qty:               c.bestProduct.ProviderQty,
		TotalQty:          c.totalQty,
		ProviderPrice:     c.bestProduct.ProviderPrice,
		Price:             c.bestProduct.ConvertedPrice,
		IsTop:             isTop,
		CreatedAt:         createdAt,
		UpdatedAt:         updatedAt,

		IsNew:               id == 0 && !needUpdate,
		NeedUpdate:          needUpdate,
		PrevPrice:           prevPrice,
		WasAffectedTopPrice: wasAffectedTopPrice,
	}
}

func (c *upsertPreparation) getSaleProductRecord() *sale_product.SaleProduct {
	k := saleProductMapKeyDto{
		IdProduct:        c.bestProduct.IdProduct,
		IdImplementation: c.implementation.Id(),
		IdWholesale:      c.whs.Id(),
	}

	if selected, ok := c.saleProducts[k]; ok {
		return &selected[0]
	}

	return nil
}
