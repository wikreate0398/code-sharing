package repository

import (
	"context"
	"database/sql"
	"fmt"
	"github.com/jmoiron/sqlx"
	"strconv"
	"strings"
	"wikreate/fimex/internal/domain/entities/catalog/product"
	"wikreate/fimex/internal/domain/entities/stock/provider_product"
	"wikreate/fimex/internal/domain/interfaces"
	"wikreate/fimex/internal/domain/structure/dto/catalog_dto"
	"wikreate/fimex/internal/domain/structure/dto/stock_dto"
)

type ProviderProductRepositoryImpl struct {
	db interfaces.DB
}

func NewProviderProductRepository(db interfaces.DB) *ProviderProductRepositoryImpl {
	return &ProviderProductRepositoryImpl{db: db}
}

func (p *ProviderProductRepositoryImpl) GetForBestSale(
	ctx context.Context, id_purchase int, ids []int,
) ([]provider_product.ProviderProduct, error) {
	query := `select 
    				    pp.id, 
    				    pp.id_product, 
       					pp.id_provider, 
					    pp.id_purchase, 
       					pp.qty, 
       					pp.price, 
       					pp.price_updated_at,
       					
       					prod.id_category,
       					prod.id_subcategory,
       					
       					(select count(*) from preorder_notification 
       					                 where ids_chars = JSON_UNQUOTE(JSON_EXTRACT(prod.app_group_chars, '$.ids')) 
       					                 and id_purchase = pp.id_purchase
       				    ) as count_notifications
			from provider_products as pp
		    join products as prod on prod.id = pp.id_product 
			where id_product in (?) 
			and id_purchase = ?
			and qty > 0
		    and price is not null
		    and prod.deleted_at IS NULL 
			and exists (select * from users where id = pp.id_provider and deleted_at IS NULL)
			group by pp.id
			FOR UPDATE`

	query, args, err := sqlx.In(query, ids, strconv.Itoa(id_purchase))

	if err != nil {
		return nil, fmt.Errorf("[GetForBestSale] sqlx.In. purchase %d, ids %#v, err: %w",
			id_purchase, ids, err,
		)
	}

	rows, err := p.db.QueryCtx(ctx, query, args...)

	if err != nil {
		return nil, fmt.Errorf(
			"[GetForBestSale] QueryCtx. purchase %d, ids %#v, err: %w",
			id_purchase, ids, err,
		)
	}

	defer rows.Close()

	var result []provider_product.ProviderProduct

	for rows.Next() {
		var ppDto stock_dto.ProviderProductDto
		var prodDto catalog_dto.ProductQueryDto

		err := rows.Scan(
			&ppDto.Id,
			&ppDto.IdProduct,
			&ppDto.IdProvider,
			&ppDto.IdPurchase,
			&ppDto.Qty,
			&ppDto.Price,
			&ppDto.PriceUpdatedAt,

			&prodDto.IdCategory,
			&prodDto.IdSubcategory,
			&prodDto.PreorderNotificationsCount,
		)

		if err != nil {
			return nil, fmt.Errorf(
				"[GetForBestSale] Scan. purchase %d, ids %#v, err: %w",
				id_purchase, ids, err,
			)
		}

		prodDto.Id = ppDto.IdProduct

		var providerProdEntity = provider_product.NewProviderProduct(ppDto)
		providerProdEntity.SetProduct(product.NewProduct(prodDto))

		result = append(result, providerProdEntity)
	}

	return result, nil
}

func (p *ProviderProductRepositoryImpl) GetForPusher(
	ctx context.Context, idPurchase int, idProduct int,
) ([]stock_dto.PusherProviderProductQueryDto, error) {
	query := `select 
    				    pp.id, 
    				    pp.id_product, 
       					pp.id_provider, 
       					pp.id_manager, 
					    pp.id_purchase, 
       					pp.qty, 
       					pp.price, 
       					pp.price_updated_at,
       					
       					prod.id_category,
       					prod.id_subcategory,
       					prod.name as prod_name,
       					prod.code as prod_code,
       					prod.page_up as position,
       					
       					cat.name_ru as cat_name,
       					cat.page_up as cat_position,
       					
       					subcat.name_ru as subcat_name,
       					subcat.page_up as subcat_position,
       					
       					brand.id as brand_id,
       					brand.name as brand_name,
       					brand.page_up as brand_position
       					
			from provider_products as pp
		    join products as prod on prod.id = pp.id_product 
		    join categories as cat on cat.id = prod.id_category 
		    join categories as subcat on subcat.id = prod.id_subcategory 
		    join brands as brand on brand.id = cat.id_brand
			where id_product = ?
			and id_purchase = ?
			and qty > 0
		    and prod.deleted_at IS NULL 
			and exists (select * from users where id = pp.id_provider and deleted_at IS NULL)
			group by pp.id`

	var result []stock_dto.PusherProviderProductQueryDto
	err := p.db.SelectCtx(ctx, &result, query, idProduct, idPurchase)

	if err != nil {
		return nil, fmt.Errorf(
			"[GetForPusher] QueryCtx. purchase %d, prod %d, err: %w",
			idPurchase, idProduct, err,
		)
	}

	return result, nil
}

func (p *ProviderProductRepositoryImpl) GetActiveProducts(
	ctx context.Context,
) ([]provider_product.ProviderProduct, error) {
	var query = `select pp.id_product, pp.id_purchase 
                 from provider_products as pp
			     where qty > 0 and price is not null group by pp.id_product, pp.id_purchase`

	rows, err := p.db.QueryCtx(ctx, query)

	if err != nil {
		return nil, fmt.Errorf("[GetActiveProducts] QueryCtx err: %w", err)
	}

	defer rows.Close()

	var result []provider_product.ProviderProduct

	for rows.Next() {
		var ppDto stock_dto.ProviderProductDto

		if err := rows.Scan(&ppDto.IdProduct, &ppDto.IdPurchase); err != nil {
			return nil, fmt.Errorf("[GetActiveProducts] Scan err: %w", err)
		}

		result = append(result, provider_product.NewProviderProduct(ppDto))
	}

	return result, nil
}

func (p *ProviderProductRepositoryImpl) GetForTarget(
	ctx context.Context, idProduct int, idPurchase int,
) ([]provider_product.ProviderProduct, error) {

	var query = `select pp.id, 
       				    pp.id_provider, 
       				    pp.id_manager,
					    pp.id_product,  
					    pp.id_purchase, 
					    pp.qty,
					    pp.price,
					    pp.price_updated_at
                 from provider_products as pp
			     where id_product = ? and id_purchase = ?
			     FOR UPDATE`

	rows, err := p.db.QueryCtx(ctx, query, idProduct, idPurchase)

	if err != nil {
		return nil, fmt.Errorf(
			"[GetForTarget] QueryCtx. prod: %d, purchase: %d, err: %w",
			idProduct, idPurchase, err,
		)
	}

	defer rows.Close()

	var result []provider_product.ProviderProduct

	for rows.Next() {
		var ppDto stock_dto.ProviderProductDto

		if err := rows.Scan(
			&ppDto.Id,
			&ppDto.IdProvider,
			&ppDto.IdManager,
			&ppDto.IdProduct,
			&ppDto.IdPurchase,
			&ppDto.Qty,
			&ppDto.Price,
			&ppDto.PriceUpdatedAt,
		); err != nil {
			return nil, fmt.Errorf(
				"[GetForTarget] Scan. prod: %d, purchase: %d, err: %w",
				idProduct, idPurchase, err,
			)
		}

		result = append(result, provider_product.NewProviderProduct(ppDto))
	}

	return result, nil
}

func (p *ProviderProductRepositoryImpl) Create(ctx context.Context, dto stock_dto.ProviderProductDto) (stock_dto.ProviderProductDto, error) {
	result, err := p.db.ExecCtx(ctx, `
		INSERT INTO provider_products (
			id_product,
			id_purchase,
			id_provider,
			id_manager,
			qty, 
			created_at,
			updated_at
		) VALUES (?, ?, ?, ?, ?, ?, ?)
	`,
		dto.IdProduct,
		dto.IdPurchase,
		dto.IdProvider,
		dto.IdManager,
		dto.Qty,
		dto.CreatedAt,
		dto.UpdatedAt,
	)

	if err != nil {
		errMsg := fmt.Errorf("[ProviderProductRepositoryImpl.Create] ExecCtx. %#v, err: %w", dto, err)
		return stock_dto.ProviderProductDto{}, errMsg
	}

	lastID, err := result.LastInsertId()

	if err != nil {
		errMsg := fmt.Errorf("[ProviderProductRepositoryImpl.Create] LastInsertId. %#v, err: %w", dto, err)
		return stock_dto.ProviderProductDto{}, errMsg
	}

	dto.Id = int(lastID)

	return dto, nil
}

func (p *ProviderProductRepositoryImpl) UpdateQty(ctx context.Context, id int, qty int) error {

	fields := []string{"qty = ?"}
	if qty == 0 {
		fields = append(fields, "price = null")
		fields = append(fields, "price_updated_at = null")
	}

	_, err := p.db.ExecCtx(
		ctx,
		fmt.Sprintf("update provider_products set %s where id = ?", strings.Join(fields, ", ")),
		qty, id,
	)

	if err != nil {
		return fmt.Errorf(
			"[ProviderProductRepositoryImpl.UpdateQty] ExecCtx. id %d, qty %d, err: %w",
			id, qty, err,
		)
	}

	return nil
}

func (p *ProviderProductRepositoryImpl) UpdatePrice(ctx context.Context, id int, price sql.NullFloat64, updatedAt string) error {
	_, err := p.db.ExecCtx(
		ctx,
		"update provider_products set price = ?, price_updated_at = ? where id = ?",
		price, updatedAt, id,
	)

	if err != nil {
		return fmt.Errorf(
			"[ProviderProductRepositoryImpl.UpdatePrice] ExecCtx. id %d, price %v, date %v, err: %w",
			id, price, updatedAt, err,
		)
	}

	return nil
}

func (p *ProviderProductRepositoryImpl) Delete(ctx context.Context, id int) error {
	_, err := p.db.ExecCtx(ctx, "delete from provider_products where id = ?", id)
	if err != nil {
		return fmt.Errorf("[ProviderProductRepositoryImpl.Delete] ExecCtx. id %d, err: %w", id, err)
	}
	return nil
}
