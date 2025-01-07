package repository

import (
	"fmt"
	"wikreate/fimex/internal/domain/structure"
)

type ProductRepositoryImpl struct {
	deps *Deps
}

func NewProductRepository(deps *Deps) *ProductRepositoryImpl {
	return &ProductRepositoryImpl{deps}
}

func (p ProductRepositoryImpl) GetAllIds(payload *structure.GenerateNamesPayloadInput) []structure.ProductIds {
	var product []structure.ProductIds

	var query string

	if payload.IdGroup > 0 {
		query += fmt.Sprintf("where EXISTS(SELECT * FROM categories where id = id_subcategory and id_group = %v)", payload.IdGroup)
	}

	p.deps.DbManager.Select(&product, fmt.Sprintf("SELECT id FROM products %v", query))
	
	return product
}
