package sale_product

import (
	"wikreate/fimex/internal/domain/entities/stock/provider_product"
	"wikreate/fimex/internal/domain/structure/dto/stock_dto"
)

type SaleProduct struct {
	id                int
	idPurchase        int
	idImplementation  int
	idWholesale       int
	idProviderProduct int
	idProvider        int
	idProduct         int
	percent           float64
	cargo             float64
	qty               int
	totalQty          int
	providerPrice     float64
	price             float64
	isTop             bool

	providerProduct provider_product.ProviderProduct
}

func NewSaleProduct(dto stock_dto.SaleProductQueryDto) SaleProduct {
	return SaleProduct{
		id:                dto.Id,
		idPurchase:        dto.IdPurchase,
		idImplementation:  dto.IdImplementation,
		idWholesale:       dto.IdWholesale,
		idProviderProduct: dto.IdProviderProduct,
		idProvider:        dto.IdProvider,
		idProduct:         dto.IdProduct,
		percent:           dto.Percent,
		cargo:             dto.Cargo,
		qty:               dto.Qty,
		totalQty:          dto.TotalQty,
		providerPrice:     dto.ProviderPrice,
		price:             dto.Price,
		isTop:             dto.IsTop,
	}
}

func (p *SaleProduct) Id() int {
	return p.id
}

func (p *SaleProduct) IdProduct() int {
	return p.idProduct
}

func (p *SaleProduct) IdImplementation() int {
	return p.idImplementation
}

func (p *SaleProduct) IdPurchase() int {
	return p.idImplementation
}

func (p *SaleProduct) IdWholesale() int {
	return p.idWholesale
}

func (p *SaleProduct) Price() float64 {
	return p.price
}

func (p *SaleProduct) SetProviderProduct(pp provider_product.ProviderProduct) {
	p.providerProduct = pp
}

func (p *SaleProduct) ProviderProduct() provider_product.ProviderProduct {
	return p.providerProduct
}

func (p *SaleProduct) IsTop() bool {
	return p.isTop
}

func (p *SaleProduct) FillTopPriceDto() stock_dto.TopPriceDto {
	return stock_dto.TopPriceDto{
		IDProviderProduct: p.id,
		IDProduct:         p.idProduct,
		IDImplementation:  p.idImplementation,
		IDPurchase:        p.idPurchase,
		IDWholesale:       p.idWholesale,
		Qty:               0,
	}
}

func (p *SaleProduct) IsEqual(dto stock_dto.ConvertedProviderProductDto, totalQty int) bool {

	flag := dto.Id == p.idProviderProduct &&
		dto.IdProvider == p.idProvider &&
		dto.IdProduct == p.idProduct &&
		dto.Cargo == p.cargo &&
		dto.Percent == p.percent &&
		dto.ProviderQty == p.qty &&
		dto.ConvertedPrice == p.price &&
		dto.ProviderPrice == p.providerPrice &&
		p.totalQty == totalQty

	//if !flag {
	//	fmt.Println("##START##")
	//	fmt.Printf(
	//		"%v == %v, %v == %v, %v == %v, %v == %v, %v == %v, %v == %v, %v == %v, %v == %v, %v == %v",
	//		dto.Id, p.idProviderProduct, dto.IdProvider, p.idProvider, dto.IdProduct, p.idProduct,
	//		dto.Cargo, p.cargo, dto.Percent, p.percent, dto.ProviderQty, p.qty, dto.ConvertedPrice, p.price,
	//		dto.ProviderPrice, p.providerPrice, p.totalQty, totalQty,
	//	)
	//	fmt.Println("##STOP##")
	//}

	return flag
}

func (p *SaleProduct) CanLeaveInTop(price float64) bool {
	return p.isTop && price <= p.price
}

func (p *SaleProduct) WasAffectedTopPrice(price float64) bool {
	return p.isTop && price != p.price
}
