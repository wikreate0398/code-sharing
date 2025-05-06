package product_service

import (
	"context"
	"github.com/go-faker/faker/v4"
	"github.com/stretchr/testify/mock"
	"testing"
	"wikreate/fimex/internal/domain/structure/dto/catalog_dto"
	"wikreate/fimex/pkg/workerpool"
	"wikreate/fimex/tests/mocks"
)

type GenerateNamesDataStruct struct {
	Data    []catalog_dto.ProductCharQueryDto `faker:"slice_len=4"`
	Payload catalog_dto.GenerateNamesInputDto
}

type SortDataStruct struct {
	Data    []catalog_dto.ProductSortQueryDto `faker:"slice_len=4000"`
	Payload catalog_dto.GenerateNamesInputDto
}

func TestProductService_GenerateNames(t *testing.T) {
	ctx := context.Background()

	mockProductRepo := new(mocks.MockProductRepository)

	mockProductRepo.On(
		"CountTotalForGenerateNames", mock.Anything, mock.Anything,
	).Return(100, nil)

	mockProductRepo.On(
		"GetIdsForGenerateNames", mock.Anything, mock.Anything, mock.Anything, mock.Anything,
	).Return([]string{"1", "2", "3", "4"}, nil)

	mockProductRepo.On(
		"UpdateNames", mock.Anything, mock.Anything, mock.Anything,
	).Return(nil)

	mockCharProductRepo := new(mocks.MockProductCharRepository)

	a := GenerateNamesDataStruct{}
	_ = faker.FakeData(&a)

	mockCharProductRepo.On("GetByProductIds", mock.Anything, mock.Anything).Return(a.Data, nil)

	errChan := make(chan error)

	service := NewProductService(Params{
		ProductRepository:     mockProductRepo,
		ProductCharRepository: mockCharProductRepo,
		Worker:                workerpool.NewFakeWorkerPool(errChan),
	})

	go func() {
		err := service.GenerateNames(ctx, a.Payload)
		errChan <- err
		close(errChan)
	}()

	for err := range errChan {
		if err != nil {
			t.Error(err)
		}
	}

	mockCharProductRepo.AssertExpectations(t)
	mockProductRepo.AssertExpectations(t)
}

func TestProductService_Sort(t *testing.T) {
	ctx := context.Background()

	a := SortDataStruct{}
	_ = faker.FakeData(&a)

	mockProductRepo := new(mocks.MockProductRepository)
	mockProductRepo.On(
		"GetForSort", mock.Anything,
	).Return(a.Data, nil)
	mockProductRepo.On(
		"UpdatePosition", mock.Anything, mock.Anything, mock.Anything,
	).Return(nil)

	errChan := make(chan error)
	service := NewProductService(Params{
		ProductRepository:     mockProductRepo,
		ProductCharRepository: new(mocks.MockProductCharRepository),
		Worker:                workerpool.NewFakeWorkerPool(errChan),
	})

	go func() {
		if err := service.Sort(ctx); err != nil {
			errChan <- err
		}
		close(errChan)
	}()

	for err := range errChan {
		if err != nil {
			t.Error(err)
		}
	}

	mockProductRepo.AssertExpectations(t)
}
