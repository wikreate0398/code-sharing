package handlers

type Handlers struct {
	CatalogHandler *CatalogHandler
}

func NewHandlers() *Handlers {
	return &Handlers{
		CatalogHandler: NewCatalogHandler(),
	}
}
