package catalog_dto

import "database/sql"

type CargoRepoParamsDto struct {
	IdsProducts      []int
	IdProduct        int
	IdPurchase       int
	IdImplementation int
}

type CargoQueryDto struct {
	IdProduct        int             `db:"id_product"`
	IdImplementation int             `db:"id_implementation"`
	IdPurchase       int             `db:"id_purchase"`
	Tariff           sql.NullFloat64 `db:"tariff"`
	Cargo            sql.NullFloat64 `db:"cargo"`
}
