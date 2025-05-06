package targeting

import (
	"context"
	"github.com/go-faker/faker/v4"
	"testing"
	"wikreate/fimex/internal/domain/structure/dto/stock_dto"
	"wikreate/fimex/tests/mocks"
)

func fillTargetingInputDto() stock_dto.TargetingInputDto {
	var dto stock_dto.TargetingInputDto
	_ = faker.FakeData(&dto)
	return dto
}

func TestStockTargetingService_UpsertQty(t *testing.T) {
	// создаем
	// редактируем
	// обнуляем

	ctx := context.Background()
	db := new(mocks.MockDb)

	s := NewStockTargetingService(Params{
		DB:                  db,
		ProviderProductRepo: new(mocks.MockProviderProductRepository),
	})

	type testCase struct {
		name  string
		input stock_dto.TargetingInputDto
	}

	testCases := []testCase{
		{
			name: "Create New Product",
			input: func() stock_dto.TargetingInputDto {
				dto := fillTargetingInputDto()
				dto.Price = 0
				return dto
			}(),
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			if err := s.UpsertQty(ctx, tc.input); err != nil {
				t.Error(err)
			}
		})
	}
}
