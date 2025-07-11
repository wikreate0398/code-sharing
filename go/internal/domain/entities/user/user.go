package user

import (
	"wikreate/fimex/internal/domain/entities/payment/payment_history_entity"
	"wikreate/fimex/internal/domain/structure/dto/user_dto"
	"wikreate/fimex/internal/domain/structure/vo/payment_vo"
)

type User struct {
	id               int
	userType         string
	deposit          float64
	ballance         float64
	penaltyBallance  float64
	purchaseBallance float64

	paymentsHistory []payment_history_entity.PaymentHistory
}

func NewUser(dto user_dto.UserDto) *User {
	return &User{
		id:               dto.ID,
		deposit:          dto.Deposit,
		ballance:         dto.Ballance,
		penaltyBallance:  dto.PenaltyBallance,
		purchaseBallance: dto.PurchaseBallance,
	}
}

func (u *User) ToDto() user_dto.UserDto {
	return user_dto.UserDto{
		ID:               u.id,
		Type:             u.userType,
		Deposit:          u.deposit,
		Ballance:         u.ballance,
		PenaltyBallance:  u.penaltyBallance,
		PurchaseBallance: u.purchaseBallance,
	}
}

func (u *User) SetPaymentHistory(paymentsHistory []payment_history_entity.PaymentHistory) {
	u.paymentsHistory = paymentsHistory
}

func (u *User) ID() int {
	return u.id
}

func (u *User) Type() string {
	return u.userType
}

func (u *User) PaymentsHistory() []payment_history_entity.PaymentHistory {
	return u.paymentsHistory
}

func (u *User) BallanceValueByCashbox(val payment_vo.Cashbox) float64 {
	switch val {
	case payment_vo.Deposit:
		return u.deposit
	case payment_vo.Balance:
		return u.ballance
	case payment_vo.Penalty:
		return u.penaltyBallance
	case payment_vo.PurchaseLimit:
		return u.purchaseBallance
	default:
		return 0
	}
}

func (u *User) CountInitialBallance(cashbox payment_vo.Cashbox) float64 {
	var currentBallance = u.BallanceValueByCashbox(cashbox)
	for _, item := range u.PaymentsHistory() {
		var sum = item.Sum()
		if item.Increase().IsUp() {
			currentBallance -= sum
		} else {
			currentBallance += sum
		}
	}

	return currentBallance
}
