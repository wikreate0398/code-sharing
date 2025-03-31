package stock_dto

type ProviderProductQueryDto struct {
	Id             int
	IdProduct      int
	IdPurchase     int
	IdProvider     int
	Qty            int
	Price          float64
	PriceUpdatedAt string
	ProviderName   string
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
