package currency

import (
	"wikreate/fimex/internal/domain/structure/dto/currency_dto"
	"wikreate/fimex/internal/domain/structure/vo/iso_vo"
)

type Currency struct {
	id       int
	name     string
	symbol   string
	iso      iso_vo.ISO
	rate     float64
	main     bool
	position int
}

func NewCurrency(dto currency_dto.CurrencyQueryDto) Currency {
	return Currency{
		id:       dto.ID,
		name:     dto.Name,
		symbol:   dto.Symbol,
		iso:      iso_vo.ISO(dto.ISO),
		rate:     dto.Rate,
		main:     dto.Main,
		position: dto.Position,
	}
}

func (c *Currency) Rate() float64 {
	return c.rate
}

func (c *Currency) Iso() iso_vo.ISO {
	return c.iso
}
