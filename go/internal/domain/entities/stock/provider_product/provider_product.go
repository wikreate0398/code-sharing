package provider_product

import (
	"wikreate/fimex/internal/domain/entities/catalog/product"
	"wikreate/fimex/internal/domain/structure/dto/stock_dto"
)

type ProviderProduct struct {
	id             int
	idProduct      int
	idPurchase     int
	idProvider     int
	qty            int
	price          float64
	priceUpdatedAt string
	idCategory     int
	idSubcategory  int
	providerName   string

	product product.Product
}

func NewProviderProduct(dto stock_dto.ProviderProductQueryDto) ProviderProduct {
	return ProviderProduct{
		id:             dto.Id,
		idProduct:      dto.IdProduct,
		idPurchase:     dto.IdPurchase,
		idProvider:     dto.IdProvider,
		qty:            dto.Qty,
		price:          dto.Price,
		priceUpdatedAt: dto.PriceUpdatedAt,
		providerName:   dto.ProviderName,
	}
}

func (p *ProviderProduct) ToMappedDto() stock_dto.MappedProviderProductDto {
	return stock_dto.MappedProviderProductDto{
		Id:            p.id,
		IdProduct:     p.idProduct,
		IdProvider:    p.idProvider,
		IdPurchase:    p.idPurchase,
		ProviderQty:   p.qty,
		ProviderPrice: p.price,
		UpdatedAt:     p.priceUpdatedAt,
	}
}

func (p *ProviderProduct) IdProduct() int {
	return p.idProduct
}

func (p *ProviderProduct) IdPurchase() int {
	return p.idPurchase
}

func (p *ProviderProduct) SetProduct(prod product.Product) {
	p.product = prod
}

func (p *ProviderProduct) Product() product.Product {
	return p.product
}
