package services

import (
	"wikreate/fimex/internal/repository"
	"wikreate/fimex/internal/services/product_service"
)

type Service struct {
	ProductService *product_service.ProductService
}

func NewService(repository *repository.Repository) *Service {
	return &Service{ProductService: product_service.NewProductService(repository.ProductRepo)}
}
