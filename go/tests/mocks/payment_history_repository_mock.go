package mocks

import (
	"context"
	"github.com/stretchr/testify/mock"
	"wikreate/fimex/internal/domain/entities/payment/payment_history_entity"
	"wikreate/fimex/internal/domain/structure/vo/payment_vo"
)

type MockPaymentHistoryRepository struct {
	mock.Mock
}

func (m *MockPaymentHistoryRepository) SelectUserHistory(
	ctx context.Context, id_user int, cashbox payment_vo.Cashbox,
) ([]payment_history_entity.PaymentHistory, error) {
	args := m.Called(ctx, id_user, cashbox)
	return args.Get(0).([]payment_history_entity.PaymentHistory), args.Error(1)
}

func (m *MockPaymentHistoryRepository) BatchUpdate(ctx context.Context, arg interface{}, identifier string) error {
	args := m.Called(ctx, arg, identifier)
	return args.Error(0)
}
