package payment_history_service

import (
	"context"
	"go.uber.org/fx"
	"runtime"
	"wikreate/fimex/internal/domain/entities/user"
	"wikreate/fimex/internal/domain/interfaces"
	"wikreate/fimex/internal/domain/structure/dto/payment_dto"
	"wikreate/fimex/internal/domain/structure/dto/user_dto"
	"wikreate/fimex/internal/domain/structure/vo/payment_vo"
	"wikreate/fimex/internal/helpers"
	"wikreate/fimex/pkg/workerpool"
)

type Params struct {
	fx.In

	UserRepo           UserRepository
	PaymentHistoryRepo PaymentHistoryRepository
	Logger             interfaces.Logger
	Db                 interfaces.DB
}

type PaymentHistoryService struct {
	*Params
}

func NewPaymentHistoryService(params Params) *PaymentHistoryService {
	return &PaymentHistoryService{&params}
}

func (s PaymentHistoryService) RecalcBallances(ctx context.Context, payload *payment_dto.RecalcBallanceInputDto) {
	//var start = time.Now()

	var cashboxes []payment_vo.Cashbox
	for _, val := range payment_vo.GetCashboxes() {
		var eqWithVal = payload.Cashbox.String() != "" && payload.Cashbox == val
		var exceptIfEmpty = payload.Cashbox.String() == "" && val != payment_vo.PurchaseLimit

		if eqWithVal || exceptIfEmpty {
			cashboxes = append(cashboxes, val)
		}
	}

	pool := workerpool.NewWorkerPool(runtime.NumCPU())

	pool.Start()

	for _, val := range cashboxes {
		var users, err = s.UserRepo.SelectWhitchHasPaymentHistory(ctx, payload.IdUser, val)

		if err != nil {
			s.Logger.WithFields(helpers.KeyStrValue{
				"id_user": payload.IdUser,
				"cashbox": val.String(),
			}).Errorf("Error selecting cashboxes: %v", err)
			continue
		}

		for _, userDto := range users {
			pool.AddJob(func(userDto user_dto.UserQueryDto, cashboxType payment_vo.Cashbox) func() {
				return func() {
					defer func() {
						if err := recover(); err != nil {
							s.Logger.WithFields(helpers.KeyStrValue{
								"id_user": userDto.ID,
								"cashbox": cashboxType.String(),
							}).Errorf("Failed to recalc history: %v", err)
						}
					}()

					err := s.Db.Transaction(ctx, func(ctx context.Context) error {
						var userEntity = user.NewUser(userDto)

						history, err := s.PaymentHistoryRepo.SelectUserHistory(ctx, userEntity.ID(), cashboxType)

						if err != nil {
							panic(err)
						}

						if len(history) <= 0 {
							return nil
						}

						userEntity.SetPaymentHistory(history)

						var initialBallance = userEntity.CountInitialBallance(cashboxType)

						inserts := make([]payment_dto.PaymentHistoryBallanceStoreDto, 0, len(history))

						for _, item := range userEntity.PaymentsHistory() {
							if item.Increase().IsUp() {
								initialBallance += item.Sum()
							} else {
								initialBallance -= item.Sum()
							}

							inserts = append(inserts, payment_dto.PaymentHistoryBallanceStoreDto{
								ID:       item.ID(),
								Ballance: initialBallance,
							})
						}

						if len(inserts) > 0 {
							if err := s.PaymentHistoryRepo.BatchUpdate(ctx, inserts, "id"); err != nil {
								s.Logger.Errorf("Failed to batch update payment_history ballance %s", err.Error())
							}
						}

						return nil
					})

					s.Logger.PanicOnErr(err)
				}
			}(userDto, val))
		}
	}

	pool.Stop()
	pool.Wait()

	//fmt.Println("payment history", time.Since(start))
}
