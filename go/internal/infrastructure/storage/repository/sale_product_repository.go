package repository

import (
	"context"
	"fmt"
	"github.com/jmoiron/sqlx"
	"strings"
	"time"
	"wikreate/fimex/internal/domain/entities/stock/sale_product"
	"wikreate/fimex/internal/domain/interfaces"
	"wikreate/fimex/internal/domain/structure/dto/stock_dto"
)

type SaleProductRepositoryImpl struct {
	db interfaces.DB
}

func NewSaleProductRepository(db interfaces.DB) *SaleProductRepositoryImpl {
	return &SaleProductRepositoryImpl{db: db}
}

func (p SaleProductRepositoryImpl) Get(ctx context.Context, params stock_dto.SaleProductRepoParamsDto) ([]sale_product.SaleProduct, error) {

	args := []interface{}{}
	where := make([]string, 0)

	if len(params.IdsProduct) > 0 {
		where = append(where, "id_product in (?)")
		args = append(args, params.IdsProduct)
	}

	if params.IdPurchase > 0 {
		where = append(where, "id_purchase = ?")
		args = append(args, params.IdPurchase)
	}

	var query = fmt.Sprintf(
		`
		select 
		       id,
		       id_purchase, 
		       id_implementation,
		       id_wholesale,
		       id_provider_product,
		       id_provider,
		       id_product, 
		       percent, 
		       cargo, 
		       qty, 
		       total_qty, 
		       provider_price, 
		       price, 
		       is_top
		from sale_products
		where %s
	`, strings.Join(where, " and "))

	query, args, err := sqlx.In(query, args...)

	if err != nil {
		return nil, err
	}

	rows, err := p.db.QueryCtx(ctx, query, args...)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var result []sale_product.SaleProduct
	for rows.Next() {

		var dto stock_dto.SaleProductQueryDto

		if err := rows.Scan(
			&dto.Id,
			&dto.IdPurchase,
			&dto.IdImplementation,
			&dto.IdWholesale,
			&dto.IdProviderProduct,
			&dto.IdProvider,
			&dto.IdProduct,
			&dto.Percent,
			&dto.Cargo,
			&dto.Qty,
			&dto.TotalQty,
			&dto.ProviderPrice,
			&dto.Price,
			&dto.IsTop,
		); err != nil {
			return nil, err
		}

		result = append(result, sale_product.NewSaleProduct(dto))
	}

	return result, nil
}

func (p SaleProductRepositoryImpl) DeleteByIds(ctx context.Context, ids []int) error {
	query, args, err := sqlx.In(`delete FROM sale_products WHERE id IN (?)`, ids)
	if err != nil {
		return err
	}

	_, err = p.db.ExecCtx(ctx, query, args...)

	return err
}

func (p SaleProductRepositoryImpl) BatchCreate(ctx context.Context, records []stock_dto.SaleProductStoreDto) error {
	query := `INSERT INTO sale_products ( 
	    id_purchase, 
	    id_implementation,
	    id_wholesale,
	    id_provider_product,
	    id_provider,
	    id_product, 
	    percent, 
	    cargo, 
	    qty, 
	    total_qty, 
	    provider_price, 
	    price, 
	    is_top,
		created_at,
		updated_at
	) VALUES `

	values := []interface{}{}
	placeholders := []string{}

	// Формируем placeholders для запроса
	for _, record := range records {
		placeholders = append(placeholders, "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
		values = append(
			values,
			record.IdPurchase,
			record.IdImplementation,
			record.IdWholesale,
			record.IdProviderProduct,
			record.IdProvider,
			record.IdProduct,
			record.Percent,
			record.Cargo,
			record.Qty,
			record.TotalQty,
			record.ProviderPrice,
			record.Price,
			record.IsTop,
			record.CreatedAt,
			record.UpdatedAt,
		)
	}

	query += fmt.Sprintf("%s", strings.Join(placeholders, ","))

	_, err := p.db.ExecCtx(ctx, query, values...)

	return err
}

func (p SaleProductRepositoryImpl) BatchUpdate(ctx context.Context, records []stock_dto.SaleProductStoreDto) error {
	type updatePayload struct {
		Id                int       `db:"id"`
		IdPurchase        int       `db:"id_purchase"`
		IdImplementation  int       `db:"id_implementation"`
		IdWholesale       int       `db:"id_wholesale"`
		IdProviderProduct int       `db:"id_provider_product"`
		IdProvider        int       `db:"id_provider"`
		IdProduct         int       `db:"id_product"`
		Percent           float64   `db:"percent"`
		Cargo             float64   `db:"cargo"`
		Qty               int       `db:"qty"`
		TotalQty          int       `db:"total_qty"`
		ProviderPrice     float64   `db:"provider_price"`
		Price             float64   `db:"price"`
		IsTop             bool      `db:"is_top"`
		UpdatedAt         time.Time `db:"updated_at"`
	}

	update := make([]updatePayload, len(records))
	for i, record := range records {
		update[i] = updatePayload{
			Id:                record.Id,
			IdPurchase:        record.IdPurchase,
			IdImplementation:  record.IdImplementation,
			IdWholesale:       record.IdWholesale,
			IdProviderProduct: record.IdProviderProduct,
			IdProvider:        record.IdProvider,
			IdProduct:         record.IdProduct,
			Percent:           record.Percent,
			Cargo:             record.Cargo,
			Qty:               record.Qty,
			TotalQty:          record.TotalQty,
			ProviderPrice:     record.ProviderPrice,
			Price:             record.Price,
			IsTop:             record.IsTop,
			UpdatedAt:         record.UpdatedAt,
		}
	}

	_, err := p.db.BatchUpdateCtx(ctx, "sale_products", "id", update)
	return err
}

func (p SaleProductRepositoryImpl) DeleteProductsWithoutSuppliers(ctx context.Context) error {
	_, err := p.db.ExecCtx(ctx, `
		delete from sale_products 
		where not exists (select * from provider_products as pp where pp.id = sale_products.id_provider_product)
	`)
	return err
}
