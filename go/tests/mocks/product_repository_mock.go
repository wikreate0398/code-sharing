package mocks

import (
	"context"
	"github.com/stretchr/testify/mock"
	"wikreate/fimex/internal/domain/structure/dto/catalog_dto"
)

type MockProductRepository struct {
	mock.Mock
}

func (m *MockProductRepository) GetIdsForGenerateNames(ctx context.Context, payload catalog_dto.GenerateNamesInputDto, limit int, offset int) ([]string, error) {
	args := m.Called(ctx, payload, limit, offset)
	return args.Get(0).([]string), args.Error(1)
}

// CountTotalForGenerateNames мока для метода CountTotalForGenerateNames
func (m *MockProductRepository) CountTotalForGenerateNames(ctx context.Context, payload catalog_dto.GenerateNamesInputDto) (int, error) {
	args := m.Called(ctx, payload)
	return args.Int(0), args.Error(1)
}

// GetForSort мока для метода GetForSort
func (m *MockProductRepository) GetForSort(ctx context.Context) ([]catalog_dto.ProductSortQueryDto, error) {
	args := m.Called(ctx)
	return args.Get(0).([]catalog_dto.ProductSortQueryDto), args.Error(1)
}

// UpdateNames мока для метода UpdateNames
func (m *MockProductRepository) UpdateNames(ctx context.Context, arg interface{}, key string) error {
	args := m.Called(ctx, arg, key)
	return args.Error(0)
}

// UpdatePosition мока для метода UpdatePosition
func (m *MockProductRepository) UpdatePosition(ctx context.Context, arg interface{}, key string) error {
	args := m.Called(ctx, arg, key)
	return args.Error(0)
}
