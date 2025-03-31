package product

import "wikreate/fimex/internal/domain/structure/dto/catalog_dto"

type Product struct {
	id                         int
	idCategory                 int
	idSubcategory              int
	preorderNotificationsCount int
}

func NewProduct(dto catalog_dto.ProductQueryDto) Product {
	return Product{
		id:                         dto.Id,
		idCategory:                 dto.IdCategory,
		idSubcategory:              dto.IdSubcategory,
		preorderNotificationsCount: dto.PreorderNotificationsCount,
	}
}

func (p *Product) IdCategory() int {
	return p.idCategory
}

func (p *Product) IdSubcategory() int {
	return p.idSubcategory
}

func (p *Product) HasPreorderNotifications() bool {
	return p.preorderNotificationsCount > 0
}
