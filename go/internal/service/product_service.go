package service

type ProductService struct {
	Deps
}

func NewProductService(deps *Deps) *ProductService {
	return &ProductService{Deps: *deps}
}
