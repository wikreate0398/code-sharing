package product

import (
	"wikreate/fimex/internal/domain/structure/dto/catalog_dto"
	"wikreate/fimex/internal/domain/structure/vo/product_vo"
)

type Product struct {
	id                         int
	name                       string
	code                       string
	position                   int
	botGroupChars              product_vo.BotGroupChars
	idBrand                    int
	idCategory                 int
	idSubcategory              int
	preorderNotificationsCount int
}

func NewProduct(dto catalog_dto.ProductQueryDto) Product {
	return Product{
		id:                         dto.Id,
		name:                       dto.Name,
		code:                       dto.Code,
		position:                   dto.Position,
		botGroupChars:              product_vo.BotGroupCharsToStruct(dto.BotGroupChars),
		idBrand:                    dto.IdBrand,
		idCategory:                 dto.IdCategory,
		idSubcategory:              dto.IdSubcategory,
		preorderNotificationsCount: dto.PreorderNotificationsCount,
	}
}

func (p *Product) Id() int {
	return p.id
}

func (p *Product) Name() string {
	return p.name
}

func (p *Product) Code() string {
	return p.code
}

func (p *Product) Position() int {
	return p.position
}

func (p *Product) BotGroupChars() product_vo.BotGroupChars {
	return p.botGroupChars
}

func (p *Product) IdBrand() int {
	return p.idBrand
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
