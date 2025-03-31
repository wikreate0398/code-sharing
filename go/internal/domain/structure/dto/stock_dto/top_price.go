package stock_dto

type TopPriceDto struct {
	IDProviderProduct int     `json:"id_provider_product"`
	IDProduct         int     `json:"id_product"`
	IDImplementation  int     `json:"id_implementation"`
	IDPurchase        int     `json:"id_purchase"`
	IDWholesale       int     `json:"id_wholesale"`
	Price             float64 `json:"price"`
	PrevPrice         float64 `json:"prev_price"`
	Qty               int     `json:"qty"`
	TotalQty          int     `json:"total_qty"`
}
