package repo_interfaces

import (
	"wikreate/fimex/internal/domain/structure"
)

type ProductRepository interface {
	GetAllIds(payload *structure.GenerateNamesPayloadInput) []structure.ProductIds
}
