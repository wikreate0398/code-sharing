package product_repository

import (
	"context"
	"fmt"
	"github.com/jmoiron/sqlx"
	"wikreate/fimex/internal/domain/entities/catalog/product"
	"wikreate/fimex/internal/domain/interfaces"
	"wikreate/fimex/internal/domain/structure/dto/catalog_dto"
	"wikreate/fimex/internal/helpers"
)

type ProductRepositoryImpl struct {
	db interfaces.DB
}

func NewProductRepository(db interfaces.DB) *ProductRepositoryImpl {
	return &ProductRepositoryImpl{db: db}
}

func (p ProductRepositoryImpl) Find(ctx context.Context, id int) (product.Product, error) {

	var dto catalog_dto.ProductQueryDto
	query := `select 
					prod.id, 
					prod.name, 
					code,
					prod.page_up, 
					bot_group_chars,
					id_category, 
					id_subcategory,
					cat.id_brand
			  from products as prod
			  join categories as cat on prod.id_category = cat.id
			  where prod.id = ?`

	if err := p.db.GetCtx(ctx, &dto, query, id); err != nil {
		return product.Product{}, fmt.Errorf("productRepositoryImpl find() db.SelectCtx err: %w", err)
	}

	return product.NewProduct(dto), nil
}

func (p ProductRepositoryImpl) GetIdsForGenerateNames(ctx context.Context, payload catalog_dto.GenerateNamesInputDto, limit int, offset int) ([]string, error) {

	var cond, args = condGenerateNamesPayload(payload)
	args = append(args, limit, offset)

	var ids []string

	var query = fmt.Sprintf("select id from products %s order by id asc LIMIT ? OFFSET ?", helpers.PrependStr(cond, "where"))

	query, args, err := sqlx.In(query, args...)

	if err != nil {
		return nil, fmt.Errorf("[GetIdsForGenerateNames] sqlx.In err: %w", err)
	}

	if err := p.db.SelectCtx(ctx, &ids, query, args...); err != nil {
		return nil, fmt.Errorf("[GetIdsForGenerateNames] db.SelectCtx err: %w", err)
	}

	return ids, nil
}

func (p ProductRepositoryImpl) CountTotalForGenerateNames(ctx context.Context, payload catalog_dto.GenerateNamesInputDto) (int, error) {
	var cond, args = condGenerateNamesPayload(payload)

	var total int
	var query = fmt.Sprintf("select count(*) from products %s", helpers.PrependStr(cond, "where"))

	query, args, err := sqlx.In(query, args...)

	if err != nil {
		return 0, fmt.Errorf("[CountTotalForGenerateNames] sqlx.In err: %w", err)
	}

	if err := p.db.GetCtx(ctx, &total, query, args...); err != nil {
		return 0, fmt.Errorf("[CountTotalForGenerateNames] db.GetCtx err: %w", err)
	}

	return total, nil
}

func (p ProductRepositoryImpl) GetForSort(ctx context.Context) ([]catalog_dto.ProductSortQueryDto, error) {
	query := `
		SELECT 
			products.id, 
			products.id_subcategory, 
			products.id_category, 
			categories.id_brand,   
			categories.id_group,  
			brands.page_up as brand_position,
			categories.page_up as cat_position,
			subcategory.page_up as subcat_position,
			(
				SELECT GROUP_CONCAT(
					chars.page_up
					ORDER BY cgc.position SEPARATOR ','
				)
				FROM chars
				JOIN product_chars AS pc ON pc.id_value = chars.id AND pc.id_product = products.id   
				JOIN catalog_groups_chars AS cgc ON cgc.id_char = pc.id_char AND cgc.id_group = pc.id_group
				WHERE cgc.in_bot = 1 
				AND pc.id_product = products.id 
				AND exclude = 0
			) AS position
		FROM products
		JOIN categories AS categories ON categories.id = products.id_category
		JOIN categories AS subcategory ON subcategory.id = products.id_subcategory
		JOIN brands ON brands.id = categories.id_brand
		WHERE products.deleted_at IS NULL  
		order by brand_position, cat_position, subcat_position`

	var dto []catalog_dto.ProductSortQueryDto

	if err := p.db.SelectCtx(ctx, &dto, query); err != nil {
		return nil, fmt.Errorf("[GetForSort] db.SelectCtx err: %w", err)
	}

	return dto, nil
}

func (p ProductRepositoryImpl) UpdateNames(ctx context.Context, arg interface{}, identifier string) error {
	_, err := p.db.BatchUpdateCtx(ctx, "products", identifier, arg)

	if err != nil {
		return fmt.Errorf("[UpdateNames] db.BatchUpdateCtx err: %w", err)
	}

	return nil
}

func (p ProductRepositoryImpl) UpdatePosition(ctx context.Context, arg interface{}, identifier string) error {
	_, err := p.db.BatchUpdateCtx(ctx, "products", identifier, arg)

	if err != nil {
		return fmt.Errorf("[UpdatePosition] db.BatchUpdateCtx err: %w", err)
	}

	return nil
}
