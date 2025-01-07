package product_service

import (
	"fmt"
	"wikreate/fimex/internal/domain/interfaces/repo_interfaces"
	"wikreate/fimex/internal/domain/structure"
)

type Deps struct {
	productRepository repo_interfaces.ProductRepository
}

type ProductService struct {
	deps *Deps
}

func NewProductService(productRepo repo_interfaces.ProductRepository) *ProductService {
	return &ProductService{
		deps: &Deps{
			productRepo,
		},
	}
}

func (s ProductService) GenerateNames(payload *structure.GenerateNamesPayloadInput) {
	ids := s.deps.productRepository.GetAllIds(payload)

	fmt.Println("Generating names", ids)
}
