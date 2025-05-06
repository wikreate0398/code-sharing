package catalog_dto

import "database/sql"

type ProductQueryDto struct {
	Id                         int    `db:"id"`
	Name                       string `db:"name"`
	Code                       string `db:"code"`
	Position                   int    `db:"page_up"`
	BotGroupChars              string `db:"bot_group_chars"`
	IdBrand                    int    `db:"id_brand"`
	IdCategory                 int    `db:"id_category"`
	IdSubcategory              int    `db:"id_subcategory"`
	PreorderNotificationsCount int    `db:"count_notifications"`
}

type ProductNameStoreDto struct {
	Id        int    `db:"id"`
	Name      string `db:"name"`
	UpdatedAt string `db:"updated_at"`
}

type ProductSortQueryDto struct {
	ID             int            `db:"id"`
	IdSubcategory  int            `db:"id_subcategory"`
	IdCategory     int            `db:"id_category"`
	IdBrand        int            `db:"id_brand"`
	IdGroup        int            `db:"id_group"`
	BrandPosition  int            `db:"brand_position"`
	CatPosition    int            `db:"cat_position"`
	SubCatPosition int            `db:"subcat_position"`
	Position       sql.NullString `db:"position"`
}

type ProductSortStoreDto struct {
	ID        int    `db:"id"`
	Position  int    `db:"page_up"`
	UpdatedAt string `db:"updated_at"`
}
