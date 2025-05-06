package mocks

import (
	"context"
	"github.com/stretchr/testify/mock"
	"wikreate/fimex/internal/domain/structure/dto/catalog_dto"
)

type MockProductCharRepository struct {
	mock.Mock
}

func (m *MockProductCharRepository) GetByProductIds(ctx context.Context, ids []string) ([]catalog_dto.ProductCharQueryDto, error) {
	args := m.Called(ctx, ids)
	return args.Get(0).([]catalog_dto.ProductCharQueryDto), args.Error(1)
}
