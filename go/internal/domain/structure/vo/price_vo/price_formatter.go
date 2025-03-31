package price_vo

import (
	"fmt"
	"math"
	"strconv"
	"wikreate/fimex/internal/domain/entities/currency"
)

type PriceFormatter struct {
	currency      currency.Currency
	providerPrice float64
	percent       float64
	cargoPrice    float64
}

func NewPriceFormatter(
	currency currency.Currency,
	providerPrice float64,
	percent float64,
	cargoPrice float64,
) PriceFormatter {
	return PriceFormatter{currency, providerPrice, percent, cargoPrice}
}

func (p *PriceFormatter) Generate(round bool) float64 {
	rate := p.currency.Rate()

	cargoExchange := p.cargoPrice * rate
	priceExchange := p.providerPrice * rate

	fullPrice := cargoExchange + priceExchange

	if p.percent > 0 {
		fullPrice += (p.percent / 100) * fullPrice
	}

	if round {
		return p.Format(p.Round(fullPrice))
	}

	return p.Format(fullPrice)
}

func (p *PriceFormatter) Format(num float64) float64 {
	v, err := strconv.ParseFloat(fmt.Sprintf("%.2f", num), 64)

	if err != nil {
		return 0
	}

	return v
}

func (p *PriceFormatter) Round(price float64) float64 {
	iso := p.currency.Iso()
	scale := iso.RoundStep(false)
	return math.Ceil(price/scale) * scale
}
