package service

import (
	"github.com/jmoiron/sqlx"
	"wikreate/fimex/internal/repository"
)

type Deps struct {
	repo *repository.Repository
	db   *sqlx.DB
}

type Service struct {
	productService *ProductService
}

func NewService(repository *repository.Repository, db *sqlx.DB) *Service {
	deps := &Deps{repo: repository, db: db}
	return &Service{productService: NewProductService(deps)}
}
