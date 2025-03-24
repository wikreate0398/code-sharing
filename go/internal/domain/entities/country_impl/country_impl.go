package country_impl

import (
	"wikreate/fimex/internal/domain/entities/currency"
	"wikreate/fimex/internal/domain/structure/dto/country_impl_dto"
)

type CountryImplementation struct {
	id       int
	currency currency.Currency
}

func NewCountryImplementation(dto country_impl_dto.CountryImplementationQueryDto) CountryImplementation {
	return CountryImplementation{id: dto.ID}
}

func (p *CountryImplementation) Id() int {
	return p.id
}

func (c *CountryImplementation) SetCurrency(entity currency.Currency) {
	c.currency = entity
}

func (c *CountryImplementation) Currency() currency.Currency {
	return c.currency
}
