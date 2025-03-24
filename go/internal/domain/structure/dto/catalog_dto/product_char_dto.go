package catalog_dto

type GenerateNamesInputDto struct {
	IdGroup  int   `json:"id_group"`
	IdsChars []int `json:"ids_chars"`
	IdsVal   []int `json:"ids_val"`
}

type ProductCharQueryDto struct {
	IdProduct int    `db:"id_product"`
	Name      string `db:"name"`
	UseInName bool   `db:"use_product_name"`
	UseEmoji  bool   `db:"add_emodji"`
	Position  string `db:"position"`
}
