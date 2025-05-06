package user_repository

import (
	"context"
	"fmt"
	"wikreate/fimex/internal/domain/interfaces"
	"wikreate/fimex/internal/domain/structure/dto/user_dto"
	"wikreate/fimex/internal/domain/structure/vo/payment_vo"
)

type UserRepositoryImpl struct {
	db interfaces.DB
}

func NewUserRepository(db interfaces.DB) UserRepositoryImpl {
	return UserRepositoryImpl{db: db}
}

func (repo UserRepositoryImpl) SelectUserName(ctx context.Context, id int) (string, error) {
	type res struct {
		Name string `db:"name"`
	}

	var user res
	if err := repo.db.GetCtx(ctx, &user, "select name from users where id = ?", id); err != nil {
		return "", fmt.Errorf("cannot select user name err: %w", err)
	}

	return user.Name, nil
}

func (repo UserRepositoryImpl) SelectWhitchHasPaymentHistory(ctx context.Context, id_user int, cashbox payment_vo.Cashbox) ([]user_dto.UserDto, error) {
	var input []user_dto.UserDto

	args := []interface{}{}

	var userCond string
	if id_user > 0 {
		userCond = "id=? and"
		args = append(args, id_user)
	}

	var cashboxCond string
	if len(cashbox) > 0 {
		cashboxCond = "and cashbox=?"
		args = append(args, cashbox.String())
	}

	var query = fmt.Sprintf(`
		select id,deposit,ballance,penalty_ballance
		from users
		where %s exists(select * from payment_history as ph where id_user = users.id and ph.deleted_at is null %s)
		and deleted_at is null
	`, userCond, cashboxCond)

	if err := repo.db.SelectCtx(ctx, &input, query, args...); err != nil {
		return nil, fmt.Errorf("[SelectWhitchHasPaymentHistory] SelectCtx err: %w", err)
	}

	return input, nil
}
