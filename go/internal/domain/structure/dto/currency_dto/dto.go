package currency_dto

type CurrencyQueryDto struct {
	ID       int     `db:"id"`
	Name     string  `db:"name"`
	Symbol   string  `db:"symbol"`
	ISO      string  `db:"iso"`
	Rate     float64 `db:"rate"`
	Main     bool    `db:"main"`
	Position int     `db:"position"`
}
