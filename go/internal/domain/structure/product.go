package structure

type ProductChar struct {
	IdProduct int    `json:"id_product"`
	Name      string `json:"name"`
	UseInName bool   `json:"use_product_name"`
	UseEmoji  string `json:"add_emodji"`
	Position  string `json:"position"`
}

type ProductIds struct {
	Id int `json:"id"`
}
