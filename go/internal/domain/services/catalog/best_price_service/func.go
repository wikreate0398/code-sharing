package best_price_service

import (
	"database/sql"
	"wikreate/fimex/internal/domain/entities/stock/provider_product"
	"wikreate/fimex/internal/domain/entities/stock/sale_product"
	"wikreate/fimex/internal/domain/structure/dto/catalog_dto"
	"wikreate/fimex/internal/domain/structure/dto/stock_dto"
)

func mapPercents(percents []catalog_dto.CategoryPercentQueryDto) PercentsMapKey {
	res := make(PercentsMapKey)

	for _, cat := range percents {
		idImpl := IdImpl(cat.IdImplementation)
		idWhs := IdWhs(cat.IdWholesale)
		idCat := IdCat(cat.IdCategory)

		if res[idImpl] == nil {
			res[idImpl] = make(map[IdWhs]map[IdCat]sql.NullFloat64)
		}

		if res[idImpl][idWhs] == nil {
			res[idImpl][idWhs] = make(map[IdCat]sql.NullFloat64)
		}

		res[idImpl][idWhs][idCat] = cat.Percent
	}

	return res
}

func extractCatIds(providerProducts []provider_product.ProviderProduct) []int {
	var idsCatMap = make(map[int]int, 0)

	for _, item := range providerProducts {
		var prod = item.Product()

		var idCat = prod.IdCategory()
		var idSubcat = prod.IdSubcategory()

		if _, ok := idsCatMap[idCat]; !ok && idCat > 0 {
			idsCatMap[idCat] = idCat
		}

		if _, ok := idsCatMap[idSubcat]; !ok && idSubcat > 0 {
			idsCatMap[idSubcat] = idSubcat
		}
	}

	var idsCat = make([]int, 0)
	for _, id := range idsCatMap {
		idsCat = append(idsCat, id)
	}

	return idsCat
}

func groupSaleProducts(saleProducts []sale_product.SaleProduct) map[saleProductMapKeyDto][]sale_product.SaleProduct {
	var groupedSaleProducts = make(map[saleProductMapKeyDto][]sale_product.SaleProduct)

	for _, item := range saleProducts {
		k := saleProductMapKeyDto{
			IdProduct:        item.IdProduct(),
			IdImplementation: item.IdImplementation(),
			IdWholesale:      item.IdWholesale(),
		}

		groupedSaleProducts[k] = append(groupedSaleProducts[k], item)
	}

	return groupedSaleProducts
}

func groupProviderProducts(providerProducts []provider_product.ProviderProduct) map[int][]provider_product.ProviderProduct {
	var groupedProviderProducts = make(map[int][]provider_product.ProviderProduct)

	for _, item := range providerProducts {
		k := item.IdProduct()
		groupedProviderProducts[k] = append(groupedProviderProducts[k], item)
	}

	return groupedProviderProducts
}

func mapProviderProducts(providerProducts []provider_product.ProviderProduct) []stock_dto.MappedProviderProductDto {
	var data = make([]stock_dto.MappedProviderProductDto, 0)

	for _, item := range providerProducts {
		data = append(data, item.ToMappedDto())
	}

	return data
}

func mapCargo(cargo []catalog_dto.CargoQueryDto) CargosMapKey {
	res := make(CargosMapKey)

	for _, item := range cargo {
		if res[IdImpl(item.IdImplementation)] == nil {
			res[IdImpl(item.IdImplementation)] = make(map[IdProd]sql.NullFloat64)
		}

		res[IdImpl(item.IdImplementation)][IdProd(item.IdProduct)] = item.Cargo
	}

	return res
}

func sumTotal(products []stock_dto.MappedProviderProductDto) int {
	var total int
	for _, p := range products {
		total += p.ProviderQty
	}
	return total
}
