package payment_history_service

import (
	"context"
	"fmt"
	"go.uber.org/fx"
	"wikreate/fimex/internal/domain/interfaces"
	"wikreate/fimex/internal/domain/structure/dto/payment_dto"
	"wikreate/fimex/internal/domain/structure/vo/payment_vo"
)

type Params struct {
	fx.In

	UserRepo           UserRepository
	PaymentHistoryRepo PaymentHistoryRepository
	Logger             interfaces.Logger
	Db                 interfaces.DB
	Worker             interfaces.WorkerPool
}

type PaymentHistoryService struct {
	*Params
}

func NewPaymentHistoryService(params Params) *PaymentHistoryService {
	return &PaymentHistoryService{&params}
}

func (s PaymentHistoryService) RecalcBallances(ctx context.Context, payload payment_dto.RecalcBallanceInputDto) error {
	//var start = time.Now()

	var cashboxes []payment_vo.Cashbox
	for _, val := range payment_vo.GetCashboxes() {
		var eqWithVal = payload.Cashbox.String() != "" && payload.Cashbox == val
		var exceptIfEmpty = payload.Cashbox.String() == "" && val != payment_vo.PurchaseLimit

		if eqWithVal || exceptIfEmpty {
			cashboxes = append(cashboxes, val)
		}
	}

	for _, val := range cashboxes {
		var users, err = s.UserRepo.SelectWhitchHasPaymentHistory(ctx, payload.IdUser, val)

		if err != nil {
			return fmt.Errorf(
				"error selecting users. id_user %d, cashbox %s, %w",
				payload.IdUser, val.String(), err,
			)
		}

		for _, userDto := range users {
			s.Worker.AddJob(newRecalcJob(s.PaymentHistoryRepo, s.Db, userDto, val))
		}
	}

	return nil
}
