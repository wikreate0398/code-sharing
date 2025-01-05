package repository

type ProductStorage struct {
	Deps
}

type ProductForRefreshNames struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

func NewProductStorage(deps *Deps) ProductStorage {
	return ProductStorage{Deps: *deps}
}

func (p ProductStorage) GetProductsForRefreshNames() ProductForRefreshNames {
	var product ProductForRefreshNames
	p.db.Get(&product, "SELECT id, name FROM products WHERE id = 1000")
	return product
}
