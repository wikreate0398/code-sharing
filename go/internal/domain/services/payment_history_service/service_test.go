package payment_history_service

import (
	"context"
	"fmt"
	"github.com/go-faker/faker/v4"
	"github.com/go-faker/faker/v4/pkg/options"
	"github.com/stretchr/testify/mock"
	"testing"
	"wikreate/fimex/internal/domain/entities/payment/payment_history_entity"
	"wikreate/fimex/internal/domain/structure/dto/payment_dto"
	"wikreate/fimex/internal/domain/structure/dto/user_dto"
	"wikreate/fimex/internal/domain/structure/vo/payment_vo"
	database "wikreate/fimex/internal/infrastructure/db"
	"wikreate/fimex/pkg/workerpool"
	"wikreate/fimex/tests/mocks"
	"wikreate/fimex/tests/suite"
)

func TestRecalcBallances(t *testing.T) {

	st := suite.New(t)
	db, _ := database.NewDb(st.Cfg)

	mockUserRepo := new(mocks.MockUserRepository)
	mockPaymentHistoryRepo := new(mocks.MockPaymentHistoryRepository)

	type testCase struct {
		name    string
		payload payment_dto.RecalcBallanceInputDto
	}

	testCases := make([]testCase, 0)

	for k, _ := range payment_vo.CashboxFields {
		testCases = append(testCases, testCase{
			name: k.String(),
			payload: payment_dto.RecalcBallanceInputDto{
				IdUser:  1,
				Cashbox: k,
			},
		})

		testCases = append(testCases, testCase{
			name: fmt.Sprintf("For all users and cashbox %v", k.String()),
			payload: payment_dto.RecalcBallanceInputDto{
				IdUser:  0,
				Cashbox: k,
			},
		})
	}

	testCases = append(testCases, testCase{
		name: "For all users and cashboxes",
		payload: payment_dto.RecalcBallanceInputDto{
			IdUser:  0,
			Cashbox: "",
		},
	})

	for _, v := range testCases {
		t.Run(v.name, func(t *testing.T) {

			ctx := context.Background()

			var userData []user_dto.UserDto

			_ = faker.FakeData(&userData,
				options.WithRandomMapAndSliceMinSize(1),
				options.WithRandomMapAndSliceMaxSize(1),
			)

			history := make([]payment_history_entity.PaymentHistory, 0)
			for i := 0; i <= 5; i++ {
				var dto payment_dto.PaymentHistoryQueryDto
				_ = faker.FakeData(&dto)
				history = append(history, payment_history_entity.NewPaymentHistory(dto))
			}

			mockUserRepo.On(
				"SelectWhitchHasPaymentHistory", mock.Anything, mock.Anything, mock.Anything,
			).Return(userData, nil)

			mockPaymentHistoryRepo.On(
				"SelectUserHistory", mock.Anything, mock.Anything, mock.Anything,
			).Return(history, nil)

			mockPaymentHistoryRepo.On(
				"BatchUpdate", mock.Anything, mock.Anything, mock.Anything,
			).Return(nil)

			errChan := make(chan error)
			service := NewPaymentHistoryService(Params{
				Logger:             st.Logger,
				Db:                 db,
				UserRepo:           mockUserRepo,
				PaymentHistoryRepo: mockPaymentHistoryRepo,
				Worker:             workerpool.NewFakeWorkerPool(errChan),
			})

			go func() {
				if err := service.RecalcBallances(ctx, v.payload); err != nil {
					errChan <- fmt.Errorf("%w", err)
				}
				close(errChan)
			}()

			for e := range errChan {
				if e != nil {
					t.Error(e)
				}
			}
		})
	}
}
