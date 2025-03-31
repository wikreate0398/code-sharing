package payment_history_service

import (
	"context"
	"wikreate/fimex/internal/domain/entities/payment/payment_history_entity"
	"wikreate/fimex/internal/domain/structure/dto/user_dto"
	"wikreate/fimex/internal/domain/structure/vo/payment_vo"
)

type UserRepository interface {
	SelectWhitchHasPaymentHistory(ctx context.Context, id_user int, cashbox payment_vo.Cashbox) ([]user_dto.UserQueryDto, error)
}

type PaymentHistoryRepository interface {
	SelectUserHistory(ctx context.Context, id_user int, cashbox payment_vo.Cashbox) ([]payment_history_entity.PaymentHistory, error)
	BatchUpdate(ctx context.Context, arg interface{}, identifier string) error
}
