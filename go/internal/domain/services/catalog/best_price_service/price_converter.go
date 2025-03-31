package best_price_service

import (
	"database/sql"
	"sort"
	"time"
	"wikreate/fimex/internal/domain/entities/catalog/product"
	"wikreate/fimex/internal/domain/entities/currency"
	"wikreate/fimex/internal/domain/structure/dto/stock_dto"
	"wikreate/fimex/internal/domain/structure/vo/price_vo"
)

type PriceConverter struct {
	currency currency.Currency
	product  product.Product
	percents map[IdCat]sql.NullFloat64
	cargo    map[IdProd]sql.NullFloat64
}

func NewPriceConverter(
	currency currency.Currency,
	product product.Product,
	percents map[IdCat]sql.NullFloat64,
	cargo map[IdProd]sql.NullFloat64,
) PriceConverter {
	return PriceConverter{currency: currency, product: product, percents: percents, cargo: cargo}
}

func (p *PriceConverter) Convert(data []stock_dto.MappedProviderProductDto) []stock_dto.ConvertedProviderProductDto {
	result := make([]stock_dto.ConvertedProviderProductDto, 0)

	for _, item := range data {
		percent := p.percentMarkup()
		cargoPrice := p.cargo[IdProd(item.IdProduct)]

		if !percent.Valid || !cargoPrice.Valid {
			continue
		}

		priceFormatter := price_vo.NewPriceFormatter(
			p.currency,
			item.ProviderPrice,
			percent.Float64,
			cargoPrice.Float64,
		)

		convertedPrice := priceFormatter.Generate(true)

		result = append(result, stock_dto.ConvertedProviderProductDto{
			Id:             item.Id,
			IdProduct:      item.IdProduct,
			IdProvider:     item.IdProvider,
			IdPurchase:     item.IdPurchase,
			ProviderQty:    item.ProviderQty,
			ProviderPrice:  item.ProviderPrice,
			ConvertedPrice: convertedPrice,
			Percent:        percent.Float64,
			Cargo:          cargoPrice.Float64,
			UpdatedAt:      item.UpdatedAt,
		})
	}

	return p.sort(result)
}

func (p *PriceConverter) percentMarkup() sql.NullFloat64 {
	idCat := IdCat(p.product.IdCategory())
	idSubcat := IdCat(p.product.IdSubcategory())

	if v, ok := p.percents[idSubcat]; ok && v.Valid {
		return v
	}

	if v, ok := p.percents[idCat]; ok && v.Valid {
		return v
	}

	return sql.NullFloat64{}
}

func (p *PriceConverter) sort(result []stock_dto.ConvertedProviderProductDto) []stock_dto.ConvertedProviderProductDto {
	sort.Slice(result, func(i, j int) bool {
		var t1, err1 = time.Parse("2006-01-02 15:04:05", result[i].UpdatedAt)
		var t2, err2 = time.Parse("2006-01-02 15:04:05", result[j].UpdatedAt)

		if err1 != nil || err2 != nil {
			return false
		}

		if result[i].ConvertedPrice == result[j].ConvertedPrice {
			return t1.Before(t2)
		}

		return result[i].ConvertedPrice < result[j].ConvertedPrice
	})

	return result
}
