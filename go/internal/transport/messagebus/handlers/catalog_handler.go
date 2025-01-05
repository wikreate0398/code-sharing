package handlers

import (
	"wikreate/fimex/internal/transport/messagebus/handlers/catalog"
)

type CatalogHandler struct {
	GenerateNames *catalog.GenerateNamesQueue
}

func NewCatalogHandler() *CatalogHandler {
	return &CatalogHandler{
		GenerateNames: catalog.NewGenerateNamesQueue(),
	}
}
