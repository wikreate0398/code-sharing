package user_dto

type UserDto struct {
	ID               int     `db:"id"`
	Type             string  `db:"type"`
	Deposit          float64 `db:"deposit"`
	Ballance         float64 `db:"ballance"`
	PenaltyBallance  float64 `db:"penalty_ballance"`
	PurchaseBallance float64 `db:"purchase_ballance"`
}
