package payment_history_service

import (
	"context"
	"fmt"
	"wikreate/fimex/internal/domain/entities/user"
	"wikreate/fimex/internal/domain/interfaces"
	"wikreate/fimex/internal/domain/structure/dto/payment_dto"
	"wikreate/fimex/internal/domain/structure/dto/user_dto"
	"wikreate/fimex/internal/domain/structure/vo/payment_vo"
)

type recalcBallancesJob struct {
	repo        PaymentHistoryRepository
	db          interfaces.DB
	userDto     user_dto.UserDto
	cashboxType payment_vo.Cashbox
}

func newRecalcJob(
	repo PaymentHistoryRepository,
	db interfaces.DB,
	userDto user_dto.UserDto,
	cashboxType payment_vo.Cashbox,
) *recalcBallancesJob {
	return &recalcBallancesJob{
		repo:        repo,
		db:          db,
		userDto:     userDto,
		cashboxType: cashboxType,
	}
}

func (r *recalcBallancesJob) Run(ctx context.Context, errChan chan<- error) {
	err := r.db.Transaction(ctx, func(ctx context.Context) error {
		defer func() {
			if err := recover(); err != nil {
				errChan <- fmt.Errorf(
					"id_user %d, cashbox %s, err %w", r.userDto.ID, r.cashboxType.String(),
					err.(error),
				)
			}
		}()

		var userEntity = user.NewUser(r.userDto)

		history, err := r.repo.SelectUserHistory(ctx, userEntity.ID(), r.cashboxType)

		if err != nil {
			return err
		}

		if len(history) <= 0 {
			return nil
		}

		userEntity.SetPaymentHistory(history)

		var initialBallance = userEntity.CountInitialBallance(r.cashboxType)

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
			if err := r.repo.BatchUpdate(ctx, inserts, "id"); err != nil {
				return fmt.Errorf("failed to batch update payment history ballance %w", err)
			}
		}

		return nil
	})

	if err != nil {
		errChan <- fmt.Errorf(
			"id_user %d, cashbox %s, err %w", r.userDto.ID, r.cashboxType.String(),
			err,
		)
	}
}
