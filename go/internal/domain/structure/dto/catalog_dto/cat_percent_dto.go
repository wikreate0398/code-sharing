package catalog_dto

import "database/sql"

type CategoryPercentQueryDto struct {
	IdCategory       int             `db:"id_category"`
	IdImplementation int             `db:"id_implementation"`
	IdPurchase       int             `db:"id_purchase"`
	IdWholesale      int             `db:"id_wholesale"`
	Percent          sql.NullFloat64 `db:"percent"`
	Type             string          `db:"type"`
}

type CategoryPercentRepoParamsDto struct {
	IdCategory       int
	IdImplementation int
	IdWholesale      int
	IdsCategory      []int
	IdPurchase       int
	Type             string
}
