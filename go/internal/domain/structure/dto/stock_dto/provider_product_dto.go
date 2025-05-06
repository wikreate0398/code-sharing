package stock_dto

import (
	"database/sql"
)

type ProviderProductDto struct {
	Id             int             `json:"id"`
	IdProduct      int             `json:"id_product"`
	IdPurchase     int             `json:"id_purchase"`
	IdProvider     int             `json:"id_provider"`
	IdManager      int             `json:"id_manager"`
	Qty            int             `json:"qty"`
	PrevQty        int             `json:"prev_qty"`
	Price          sql.NullFloat64 `json:"price"`
	PrevPrice      sql.NullFloat64 `json:"prev_price"`
	PriceUpdatedAt sql.NullString  `json:"price_updated_at"`
	CreatedAt      string          `json:"created_at"`
	UpdatedAt      string          `json:"updated_at"`
	ProviderName   string          `json:"provider_name"`
}

type MappedProviderProductDto struct {
	Id            int
	IdProduct     int
	IdProvider    int
	IdPurchase    int
	ProviderQty   int
	ProviderPrice float64
	UpdatedAt     string
}

type ConvertedProviderProductDto struct {
	Id             int
	IdProduct      int
	IdProvider     int
	IdPurchase     int
	Provider       string
	ProviderQty    int
	ProviderPrice  float64
	ConvertedPrice float64
	Percent        float64
	Cargo          float64
	UpdatedAt      string
}

type TargetingInputDto struct {
	IdSupplier int     `json:"id_supplier"`
	IdProduct  int     `json:"id_product"`
	IdManager  int     `json:"id_manager"`
	IdPurchase int     `json:"id_purchase"`
	Qty        int     `json:"qty"`
	Price      float64 `json:"price"`
	Causer     struct {
		Id   int    `json:"id"`
		Type string `json:"type"`
	} `json:"causer"`
}

type StockPusherConsumeInputDto struct {
	Id             int      `json:"id"`
	IdSupplier     int      `json:"id_supplier"`
	IdProduct      int      `json:"id_product"`
	IdPurchase     int      `json:"id_purchase"`
	Qty            int      `json:"qty"`
	PrevQty        int      `json:"prev_qty"`
	Price          *float64 `json:"price"`
	PrevPrice      *float64 `json:"prev_price"`
	PriceUpdatedAt *string  `json:"price_updated_at"`
}

type AddedProviderProductPusherDto struct {
	IdSupplier int
	IdProduct  int
	IdManager  int
	IdPurchase int
	Qty        int
}

type PusherProviderProductQueryDto struct {
	Id             int             `db:"id"`
	IdProduct      int             `db:"id_product"`
	IdSupplier     int             `db:"id_provider"`
	IdManager      int             `db:"id_manager"`
	IdPurchase     int             `db:"id_purchase"`
	Qty            int             `db:"qty"`
	Price          sql.NullFloat64 `db:"price"`
	PriceUpdatedAt sql.NullString  `db:"price_updated_at"`

	// Продукт
	IdCategory    int    `db:"id_category"`
	IdSubcategory int    `db:"id_subcategory"`
	ProdName      string `db:"prod_name"`
	ProdCode      string `db:"prod_code"`
	ProdPosition  int    `db:"position"`

	// Категория
	CatName     string `db:"cat_name"`
	CatPosition int    `db:"cat_position"`

	// Подкатегория
	SubcatName     string `db:"subcat_name"`
	SubcatPosition int    `db:"subcat_position"`

	// Бренд
	BrandId       int    `db:"brand_id"`
	BrandName     string `db:"brand_name"`
	BrandPosition int    `db:"brand_position"`
}
