package repository

import (
	"wikreate/fimex/pkg/database"
)

type Deps struct {
	DbManager database.DbManager
}

type Repository struct {
	ProductRepo *ProductRepositoryImpl
}

func NewRepository(dbManager database.DbManager) *Repository {
	deps := &Deps{dbManager}

	return &Repository{
		ProductRepo: NewProductRepository(deps),
	}
}
