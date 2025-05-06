package mocks

import (
	"context"
	"github.com/stretchr/testify/mock"
	"wikreate/fimex/internal/domain/structure/dto/user_dto"
	"wikreate/fimex/internal/domain/structure/vo/payment_vo"
)

type MockUserRepository struct {
	mock.Mock
}

func (m *MockUserRepository) SelectWhitchHasPaymentHistory(ctx context.Context, id_user int, cashbox payment_vo.Cashbox) ([]user_dto.UserDto, error) {
	args := m.Called(ctx, id_user, cashbox)
	return args.Get(0).([]user_dto.UserDto), args.Error(1)
}
