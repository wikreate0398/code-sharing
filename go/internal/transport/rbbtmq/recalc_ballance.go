package rbbtmq

import (
	"context"
	"encoding/json"
	"wikreate/fimex/internal/domain/structure/dto/payment_dto"
)

type RecalcHistoryBallanceConsumer struct {
	service PaymentHistoryService
}

func NewRecalcHistoryBallanceConsumer(service PaymentHistoryService) *RecalcHistoryBallanceConsumer {
	return &RecalcHistoryBallanceConsumer{service}
}

func (r *RecalcHistoryBallanceConsumer) Handle(ctx context.Context, result []byte) error {
	var input = new(payment_dto.RecalcBallanceInputDto)
	if err := json.Unmarshal(result, &input); err != nil {
		return err
	}

	r.service.RecalcBallances(ctx, input)

	return nil
}
