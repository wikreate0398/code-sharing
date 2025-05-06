package repository

import (
	"fmt"
	"wikreate/fimex/internal/domain/entities/country_impl"
	"wikreate/fimex/internal/domain/entities/currency"
	"wikreate/fimex/internal/domain/interfaces"
	"wikreate/fimex/internal/domain/structure/dto/country_impl_dto"
	"wikreate/fimex/internal/domain/structure/dto/currency_dto"
)

type CountryImplRepositoryImpl struct {
	db interfaces.DB
}

func NewCountryImplRepository(db interfaces.DB) *CountryImplRepositoryImpl {
	return &CountryImplRepositoryImpl{db: db}
}

func (p CountryImplRepositoryImpl) Get() ([]country_impl.CountryImplementation, error) {
	rows, err := p.db.Query(`
		select ci.id, 
		       currency.id as id_currency,
		       currency.iso,
		       currency.rate 
		from country_implementation as ci
		join currency on currency.id = ci.id_currency
		where ci.deleted_at IS NULL
		group by ci.id
	`)

	if err != nil {
		return nil, fmt.Errorf("[CountryImplRepositoryImpl.Get] db.Query err: %w", err)
	}

	defer rows.Close()

	var result []country_impl.CountryImplementation
	for rows.Next() {
		var implDto country_impl_dto.CountryImplementationQueryDto
		var currencyDto currency_dto.CurrencyQueryDto

		if err := rows.Scan(&implDto.ID, &currencyDto.ID, &currencyDto.ISO, &currencyDto.Rate); err != nil {
			return nil, fmt.Errorf("[CountryImplRepositoryImpl.Get] rows.Scan err: %w", err)
		}

		var implEntity = country_impl.NewCountryImplementation(implDto)
		var currencyEntity = currency.NewCurrency(currencyDto)

		implEntity.SetCurrency(currencyEntity)

		result = append(result, implEntity)
	}

	return result, nil
}
