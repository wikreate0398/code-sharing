package repository

import (
	"fmt"
	"github.com/jmoiron/sqlx"
	"strings"
	"wikreate/fimex/internal/domain/interfaces"
	"wikreate/fimex/internal/domain/structure/dto/catalog_dto"
)

type CategoryPercentRepositoryImpl struct {
	db interfaces.DB
}

func NewCategoryPercentRepository(db interfaces.DB) *CategoryPercentRepositoryImpl {
	return &CategoryPercentRepositoryImpl{db: db}
}

func (p CategoryPercentRepositoryImpl) Get(params catalog_dto.CategoryPercentRepoParamsDto) ([]catalog_dto.CategoryPercentQueryDto, error) {
	var result []catalog_dto.CategoryPercentQueryDto

	args := []interface{}{}
	where := make([]string, 0)

	if params.IdPurchase > 0 {
		where = append(where, "id_purchase = ?")
		args = append(args, params.IdPurchase)
	}

	if params.IdCategory > 0 {
		where = append(where, "id_category = ?")
		args = append(args, params.IdCategory)
	}

	if len(params.IdsCategory) > 0 {
		where = append(where, "id_category in (?)")
		args = append(args, params.IdsCategory)
	}

	if params.IdImplementation > 0 {
		where = append(where, "id_implementation = ?")
		args = append(args, params.IdImplementation)
	}

	if params.IdWholesale > 0 {
		where = append(where, "id_wholesale = ?")
		args = append(args, params.IdWholesale)
	}

	if len(params.Type) > 0 {
		where = append(where, "type = ?")
		args = append(args, params.Type)
	}

	var query = fmt.Sprintf(`
		select type, id_category, id_implementation, id_purchase, id_wholesale, percent from categories_percents
		where %s
	`, strings.Join(where, " and "))

	query, args, err := sqlx.In(query, args...)

	if err != nil {
		return nil, err
	}

	if err := p.db.Select(&result, query, args...); err != nil {
		return nil, err
	}

	return result, nil
}
