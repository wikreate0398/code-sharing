package repository

import (
	"context"
	"fmt"
	"wikreate/fimex/internal/domain/entities/payment/payment_history_entity"
	"wikreate/fimex/internal/domain/interfaces"
	"wikreate/fimex/internal/domain/structure/dto/payment_dto"
	"wikreate/fimex/internal/domain/structure/vo/payment_vo"
)

type PaymentHistoryRepositoryImpl struct {
	db interfaces.DB
}

func NewPaymentHistoryRepository(db interfaces.DB) *PaymentHistoryRepositoryImpl {
	return &PaymentHistoryRepositoryImpl{db: db}
}

func (repo PaymentHistoryRepositoryImpl) SelectUserHistory(
	ctx context.Context, id_user int, cashbox payment_vo.Cashbox,
) ([]payment_history_entity.PaymentHistory, error) {
	rows, err := repo.db.QueryCtx(ctx, `
	   select id,id_user,increase,sum,ballance,date
		from payment_history
		WHERE id_user=? and cashbox=? and deleted_at is null
		order by date asc, id asc 
		FOR UPDATE
	`, id_user, cashbox.String())

	if err != nil {
		return nil, fmt.Errorf("[SelectUserHistory] db.QueryCtx err: %w", err)
	}

	defer rows.Close()

	var history []payment_history_entity.PaymentHistory
	for rows.Next() {
		var id int
		var idUser int
		var increase string
		var sum float64
		var ballance float64
		var date string

		err := rows.Scan(&id, &idUser, &increase, &sum, &ballance, &date)

		if err != nil {
			return nil, fmt.Errorf("[SelectUserHistory] rows.Scan err: %w", err)
		}

		dto := payment_dto.PaymentHistoryQueryDto{
			ID:       id,
			IdUser:   idUser,
			Increase: increase,
			Sum:      sum,
			Ballance: ballance,
			Date:     date,
		}

		history = append(history, payment_history_entity.NewPaymentHistory(dto))
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("[SelectUserHistory] rows.Err: %w", err)
	}

	return history, nil
}

func (p PaymentHistoryRepositoryImpl) BatchUpdate(ctx context.Context, arg interface{}, identifier string) error {
	_, err := p.db.BatchUpdateCtx(ctx, "payment_history", identifier, arg)

	if err != nil {
		return fmt.Errorf("[PaymentHistoryRepositoryImpl.BatchUpdate] db.BatchUpdateCtx err: %w", err)
	}

	return nil
}
