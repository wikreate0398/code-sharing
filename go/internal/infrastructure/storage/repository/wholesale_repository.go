package repository

import (
	"fmt"
	"wikreate/fimex/internal/domain/entities/wholesale"
	"wikreate/fimex/internal/domain/interfaces"
)

type WholesaleRepositoryImpl struct {
	db interfaces.DB
}

func NewWholesaleRepository(db interfaces.DB) *WholesaleRepositoryImpl {
	return &WholesaleRepositoryImpl{db: db}
}

func (p WholesaleRepositoryImpl) Get() ([]wholesale.Wholesale, error) {

	rows, err := p.db.Query(`select id, name from wholesale_types where type = 'default' and deleted_at is null`)

	if err != nil {
		return nil, fmt.Errorf("[WholesaleRepositoryImpl.Get] db.Query: %w", err)
	}

	defer rows.Close()

	var result []wholesale.Wholesale
	for rows.Next() {
		var id int
		var name string

		if err := rows.Scan(&id, &name); err != nil {
			return nil, fmt.Errorf("[WholesaleRepositoryImpl.Get] db.Scan: %w", err)
		}

		result = append(result, wholesale.NewWholesale(id, name))
	}

	return result, nil
}
