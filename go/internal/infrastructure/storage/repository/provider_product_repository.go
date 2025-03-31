package repository

import (
	"context"
	"fmt"
	"github.com/jmoiron/sqlx"
	"strconv"
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

func (p *ProviderProductRepositoryImpl) GetForBestSale(ctx context.Context, id_purchase int, ids []int) ([]provider_product.ProviderProduct, error) {
	var query = fmt.Sprintf(`select 
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
			FOR UPDATE`)

	query, args, err := sqlx.In(query, ids, strconv.Itoa(id_purchase))

	if err != nil {
		return nil, err
	}

	rows, err := p.db.QueryCtx(ctx, query, args...)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var result []provider_product.ProviderProduct

	for rows.Next() {
		var ppDto stock_dto.ProviderProductQueryDto
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
			return nil, err
		}

		prodDto.Id = ppDto.IdProduct

		var providerProdEntity = provider_product.NewProviderProduct(ppDto)
		providerProdEntity.SetProduct(product.NewProduct(prodDto))

		result = append(result, providerProdEntity)
	}

	return result, nil
}

func (p *ProviderProductRepositoryImpl) GetActiveProducts(ctx context.Context) ([]provider_product.ProviderProduct, error) {
	var query = `select pp.id_product, pp.id_purchase 
                 from provider_products as pp
			     where qty > 0 and price is not null group by pp.id_product`

	rows, err := p.db.QueryCtx(ctx, query)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var result []provider_product.ProviderProduct

	for rows.Next() {
		var ppDto stock_dto.ProviderProductQueryDto

		if err := rows.Scan(&ppDto.IdProduct, &ppDto.IdPurchase); err != nil {
			return nil, err
		}

		result = append(result, provider_product.NewProviderProduct(ppDto))
	}

	return result, nil
}
