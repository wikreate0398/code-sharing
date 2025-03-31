package best_price_service

type saleProductMapKeyDto struct {
	IdProduct        int
	IdImplementation int
	IdWholesale      int
}

type preorderNotificationDto struct {
	IDProduct        int     `json:"id_product"`
	IDImplementation int     `json:"id_implementation"`
	IDPurchase       int     `json:"id_purchase"`
	IDWholesale      int     `json:"id_wholesale"`
	Price            float64 `json:"price"`
}
