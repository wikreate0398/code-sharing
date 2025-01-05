package repository

import "github.com/jmoiron/sqlx"

type Deps struct {
	db *sqlx.DB
}

type Repository struct {
	productRepository ProductStorage
}

func NewRepository(db *sqlx.DB) *Repository {
	deps := &Deps{db}
	return &Repository{
		productRepository: NewProductStorage(deps),
	}
}
