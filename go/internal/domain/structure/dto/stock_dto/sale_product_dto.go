package stock_dto

import "time"

type SaleProductQueryDto struct {
	Id                int
	IdPurchase        int
	IdImplementation  int
	IdWholesale       int
	IdProviderProduct int
	IdProvider        int
	IdProduct         int
	Percent           float64
	Cargo             float64
	Qty               int
	TotalQty          int
	ProviderPrice     float64
	Price             float64
	IsTop             bool
}

type SaleProductStoreDto struct {
	Id                int
	IdPurchase        int
	IdImplementation  int
	IdWholesale       int
	IdProviderProduct int
	IdProvider        int
	IdProduct         int
	Percent           float64
	Cargo             float64
	Qty               int
	TotalQty          int
	ProviderPrice     float64
	Price             float64
	IsTop             bool
	CreatedAt         time.Time
	UpdatedAt         time.Time

	IsNew               bool
	NeedUpdate          bool
	PrevPrice           float64
	WasAffectedTopPrice bool
}

type SaleProductRepoParamsDto struct {
	IdPurchase int
	IdProduct  int
	IdsProduct []int
}

type GenerateBestProductInputDto struct {
	IdPurchase  int   `json:"id_purchase"`
	IdsProducts []int `json:"ids_product"`
}
