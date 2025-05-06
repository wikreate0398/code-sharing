package provider_product

import (
	"database/sql"
	"wikreate/fimex/internal/domain/entities/catalog/product"
	"wikreate/fimex/internal/domain/interfaces"
	"wikreate/fimex/internal/domain/structure/dto/stock_dto"
	"wikreate/fimex/internal/domain/structure/dto/user_dto"
	"wikreate/fimex/internal/infrastructure/events/observer"
)

type ProviderProduct struct {
	events interfaces.EventObservable

	id             int
	idProduct      int
	idPurchase     int
	idProvider     int
	idManager      int
	qty            int
	prevQty        int
	price          sql.NullFloat64
	prevPrice      sql.NullFloat64
	priceUpdatedAt sql.NullString
	providerName   string

	product product.Product
}

func NewProviderProduct(dto stock_dto.ProviderProductDto) ProviderProduct {
	return ProviderProduct{
		id:             dto.Id,
		idProduct:      dto.IdProduct,
		idPurchase:     dto.IdPurchase,
		idProvider:     dto.IdProvider,
		idManager:      dto.IdManager,
		qty:            dto.Qty,
		prevQty:        dto.PrevQty,
		price:          dto.Price,
		prevPrice:      dto.PrevPrice,
		priceUpdatedAt: dto.PriceUpdatedAt,
		providerName:   dto.ProviderName,
		events:         observer.NewEventObservable(),
	}
}

func Create(dto stock_dto.ProviderProductDto, causer user_dto.UserDto) ProviderProduct {
	e := NewProviderProduct(dto)
	e.events.Register(&CreateProviderProductEvent{Dto: e.ToDto(), Causer: causer})
	return e
}

func (p *ProviderProduct) ToDto() stock_dto.ProviderProductDto {
	return stock_dto.ProviderProductDto{
		Id:             p.id,
		IdProduct:      p.idProduct,
		IdPurchase:     p.idPurchase,
		IdProvider:     p.idProvider,
		IdManager:      p.idManager,
		Qty:            p.qty,
		PrevQty:        p.prevQty,
		Price:          p.price,
		PrevPrice:      p.prevPrice,
		PriceUpdatedAt: p.priceUpdatedAt,
	}
}

func (p *ProviderProduct) Id() int {
	return p.id
}

func (p *ProviderProduct) IdProduct() int {
	return p.idProduct
}

func (p *ProviderProduct) IdSupplier() int {
	return p.idProvider
}

func (p *ProviderProduct) IdManager() int {
	return p.idManager
}

func (p *ProviderProduct) IdPurchase() int {
	return p.idPurchase
}

func (p *ProviderProduct) Price() sql.NullFloat64 {
	return p.price
}

func (p *ProviderProduct) Qty() int {
	return p.qty
}

func (p *ProviderProduct) SetProduct(prod product.Product) {
	p.product = prod
}

func (p *ProviderProduct) Product() product.Product {
	return p.product
}

func (s *ProviderProduct) IsOwnerManager(idManager int, causerType string) bool {
	if idManager > 0 && idManager != s.idManager && s.qty > 0 {
		if causerType != "admin_provider" {
			return false
		}
	}

	return true
}

func (p *ProviderProduct) ToMappedDto() stock_dto.MappedProviderProductDto {
	return stock_dto.MappedProviderProductDto{
		Id:            p.id,
		IdProduct:     p.idProduct,
		IdProvider:    p.idProvider,
		IdPurchase:    p.idPurchase,
		ProviderQty:   p.qty,
		ProviderPrice: p.price.Float64,
		UpdatedAt:     p.priceUpdatedAt.String,
	}
}

func (p *ProviderProduct) markDelete(causer user_dto.UserDto) {
	var (
		prevPrice = p.price
		prevQty   = p.qty
	)

	p.qty = 0
	p.prevQty = prevQty
	p.price = sql.NullFloat64{}
	p.priceUpdatedAt = sql.NullString{}
	p.prevPrice = prevPrice

	p.events.Register(&DeleteProviderProductEvent{
		Dto:    p.ToDto(),
		Causer: causer,
	})
}

func (p *ProviderProduct) UpdateQty(qty int, causer user_dto.UserDto) {
	if qty <= 0 {
		p.markDelete(causer)
		return
	}

	var (
		prevPrice = p.price
		prevQty   = p.qty
	)

	p.qty = qty
	p.prevPrice = prevPrice
	p.prevQty = prevQty

	p.events.Register(&UpdateProviderProductEvent{
		Dto:    p.ToDto(),
		Causer: causer,
	})
}

func (p *ProviderProduct) UpdatePrice(price sql.NullFloat64, updatedAt string, causer user_dto.UserDto) {
	var (
		prevPrice = p.price
		prevQty   = p.qty
	)

	p.price = price
	p.prevPrice = prevPrice
	p.priceUpdatedAt = sql.NullString{String: updatedAt, Valid: len(updatedAt) > 0}
	p.prevQty = prevQty

	p.events.Register(&UpdateProviderProductEvent{
		Dto:    p.ToDto(),
		Causer: causer,
	})
}

func (p *ProviderProduct) PrepareNewPrice(price float64, products []ProviderProduct) sql.NullFloat64 {
	if price == 0 {
		return sql.NullFloat64{}
	}

	for _, prod := range products {
		if prod.IdSupplier() != p.IdSupplier() && prod.Price().Float64 == price {
			return p.PrepareNewPrice(price+1, products)
		}
	}

	return sql.NullFloat64{Float64: price, Valid: price > 0}
}

func (p *ProviderProduct) GetEvents() []interfaces.Event {
	return p.events.GetEvents()
}

func (p *ProviderProduct) ClearEvents() {
	p.events.ClearEvents()
}

func (p *ProviderProduct) WasAffectedPriceableProduct() bool {
	return p.qty != p.prevQty && p.price.Float64 > 0 || p.price.Float64 != p.prevPrice.Float64
}
