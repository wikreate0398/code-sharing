package product

import "wikreate/fimex/internal/domain/structure/dto/catalog_dto"

type Product struct {
	id            int
	idCategory    int
	idSubcategory int
}

func NewProduct(dto catalog_dto.ProductQueryDto) Product {
	return Product{
		id:            dto.Id,
		idCategory:    dto.IdCategory,
		idSubcategory: dto.IdSubcategory,
	}
}

func (p *Product) IdCategory() int {
	return p.idCategory
}

func (p *Product) IdSubcategory() int {
	return p.idSubcategory
}
