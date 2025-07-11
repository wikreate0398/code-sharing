package repository

import (
	"context"
	"fmt"
	"strings"
	"wikreate/fimex/internal/domain/interfaces"
	"wikreate/fimex/internal/domain/structure/dto/catalog_dto"
)

type ProductCharRepositoryImpl struct {
	db interfaces.DB
}

func NewProductCharRepository(db interfaces.DB) *ProductCharRepositoryImpl {
	return &ProductCharRepositoryImpl{db: db}
}

func (p ProductCharRepositoryImpl) GetByProductIds(ctx context.Context, ids []string) ([]catalog_dto.ProductCharQueryDto, error) {
	var productChars []catalog_dto.ProductCharQueryDto
	query := fmt.Sprintf(`
			select id_product,name,use_product_name,add_emodji,cgc.position 
			from product_chars as pc
			join chars on chars.id = pc.id_value 
			join catalog_groups_chars as cgc on cgc.id_char = pc.id_char and cgc.id_group = pc.id_group
			where id_product in (%s) 
			and use_product_name = 1 
			and chars.deleted_at is null
		`, strings.Join(ids, ","))

	if err := p.db.SelectCtx(ctx, &productChars, query); err != nil {
		return nil, fmt.Errorf("[GetByProductIds] db.SelectCtx err: %w", err)
	}

	return productChars, nil
}
