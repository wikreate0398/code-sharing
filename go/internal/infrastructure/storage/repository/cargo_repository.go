package repository

import (
	"fmt"
	"github.com/jmoiron/sqlx"
	"strings"
	"wikreate/fimex/internal/domain/interfaces"
	"wikreate/fimex/internal/domain/structure/dto/catalog_dto"
)

type CargoRepositoryImpl struct {
	db interfaces.DB
}

func NewCargoRepository(db interfaces.DB) *CargoRepositoryImpl {
	return &CargoRepositoryImpl{db: db}
}

func (p CargoRepositoryImpl) Get(params catalog_dto.CargoRepoParamsDto) ([]catalog_dto.CargoQueryDto, error) {
	var result []catalog_dto.CargoQueryDto

	args := []interface{}{}
	where := make([]string, 0)

	if params.IdPurchase > 0 {
		where = append(where, "id_purchase = ?")
		args = append(args, params.IdPurchase)
	}

	if params.IdProduct > 0 {
		where = append(where, "id_product = ?")
		args = append(args, params.IdProduct)
	}

	if len(params.IdsProducts) > 0 {
		where = append(where, "id_product in (?)")
		args = append(args, params.IdsProducts)
	}

	if params.IdImplementation > 0 {
		where = append(where, "id_implementation = ?")
		args = append(args, params.IdImplementation)
	}

	var query = fmt.Sprintf(`
		select id_product, id_implementation, id_purchase, tariff, CAST(cargo AS DECIMAL(8, 2)) as cargo from cargo
		where %s
	`, strings.Join(where, " and "))

	query, args, err := sqlx.In(query, args...)

	if err != nil {
		return nil, fmt.Errorf("[cargoRepositoryImpl.Get] sqlx.In err: %w", err)
	}

	if err := p.db.Select(&result, query, args...); err != nil {
		return nil, fmt.Errorf("[cargoRepositoryImpl.Get] db.Select err: %w", err)
	}

	return result, nil
}
