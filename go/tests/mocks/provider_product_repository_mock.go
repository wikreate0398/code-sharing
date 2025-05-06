package mocks

import (
	"context"
	"database/sql"
	"github.com/stretchr/testify/mock"
	"wikreate/fimex/internal/domain/entities/stock/provider_product"
	"wikreate/fimex/internal/domain/structure/dto/stock_dto"
)

type MockProviderProductRepository struct {
	mock.Mock
}

func (m *MockProviderProductRepository) GetForTarget(
	ctx context.Context, idProduct int, idPurchase int,
) ([]provider_product.ProviderProduct, error) {
	args := m.Called(ctx, idProduct, idPurchase)
	return args.Get(0).([]provider_product.ProviderProduct), args.Error(1)
}

func (m *MockProviderProductRepository) GetForPusher(
	ctx context.Context, idPurchase int, idProduct int,
) ([]stock_dto.PusherProviderProductQueryDto, error) {
	args := m.Called(ctx, idPurchase, idProduct)
	return args.Get(0).([]stock_dto.PusherProviderProductQueryDto), args.Error(1)
}

func (m *MockProviderProductRepository) Delete(ctx context.Context, id int) error {
	args := m.Called(ctx, id)
	return args.Get(0).(error)
}

func (m *MockProviderProductRepository) UpdateQty(ctx context.Context, id int, qty int) error {
	args := m.Called(ctx, id, qty)
	return args.Get(0).(error)
}

func (m *MockProviderProductRepository) UpdatePrice(ctx context.Context, id int, price sql.NullFloat64, updatedAt string) error {
	args := m.Called(ctx, id, price, updatedAt)
	return args.Get(0).(error)
}

func (m *MockProviderProductRepository) Create(ctx context.Context, dto stock_dto.ProviderProductDto) (stock_dto.ProviderProductDto, error) {
	args := m.Called(ctx, dto)
	return args.Get(0).(stock_dto.ProviderProductDto), args.Error(1)
}
