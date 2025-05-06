package targeting

import (
	"context"
	"fmt"
	"slices"
	"wikreate/fimex/internal/domain/interfaces"
	"wikreate/fimex/internal/domain/structure/dto/stock_dto"
)

type supplierDataPayload struct {
	Info      string        `json:"info"`
	IdChannel int           `json:"id_channel"`
	Products  []interface{} `json:"products"`
}

type deletePayload struct {
	IdProduct  int `json:"id_product"`
	IdSupplier int `json:"id_provider"`
}

type supplierSocketManager struct {
	repo   ProviderProductRepository
	pusher interfaces.Sockets
}

func newSupplierSocketManager(repo ProviderProductRepository, pusher interfaces.Sockets) supplierSocketManager {
	return supplierSocketManager{repo: repo, pusher: pusher}
}

func (p supplierSocketManager) Manage(
	ctx context.Context,
	dto stock_dto.ProviderProductDto,
) error {

	products, err := p.repo.GetForPusher(ctx, dto.IdPurchase, dto.IdProduct)

	if err != nil {
		return err
	}

	index := slices.IndexFunc(products, func(product stock_dto.PusherProviderProductQueryDto) bool {
		return product.IdSupplier == dto.IdProvider
	})

	if index == -1 {
		p.push(dto.IdProvider, dto.IdPurchase, nil, &deletePayload{
			IdProduct:  dto.IdProduct,
			IdSupplier: dto.IdProvider,
		})
		return nil
	}

	selfProduct := products[index]

	var idSupplierChannel int
	if selfProduct.Price == dto.PrevPrice {
		idSupplierChannel = selfProduct.IdSupplier
	}

	prodInfo := p.prodInfo(products)
	recipients := p.recipients(idSupplierChannel, products)

	payloadData := make([]supplierDataPayload, len(recipients))
	for k, idRecipient := range recipients {

		var supplierProdData []interface{}

		for _, item := range products {
			if item.Price.Valid || item.IdSupplier == idRecipient {
				supplierProdData = append(supplierProdData, map[string]interface{}{
					"id":  item.IdSupplier,
					"im":  item.IdManager,
					"qty": item.Qty,
					"p":   item.Price.Float64,
					"uat": item.PriceUpdatedAt,
				})
			}
		}

		payloadData[k] = supplierDataPayload{
			IdChannel: idRecipient,
			Info:      prodInfo,
			Products:  supplierProdData,
		}
	}

	for _, data := range payloadData {
		p.push(data.IdChannel, dto.IdPurchase, &data, nil)
	}

	return nil
}

func (p supplierSocketManager) push(
	idSupplier int,
	idPurchase int,
	data *supplierDataPayload,
	deletedData *deletePayload,
) {
	channel := fmt.Sprintf("stock_provider_%v", idSupplier)

	payload := map[string]any{
		"id_purchase": idPurchase,
	}

	if deletedData != nil {
		payload["delete_data"] = deletedData
	}

	if data != nil {
		payload["data"] = data
	}

	p.pusher.SendMessage(channel, "change-stock", payload)
}

func (p supplierSocketManager) recipients(idSupplierChannel int, products []stock_dto.PusherProviderProductQueryDto) []int {
	if idSupplierChannel > 0 {
		return []int{idSupplierChannel}
	}

	ids := make([]int, len(products))
	for k, i := range products {
		ids[k] = i.IdSupplier
	}

	return ids
}

func (p supplierSocketManager) prodInfo(products []stock_dto.PusherProviderProductQueryDto) string {
	item := products[0]

	return fmt.Sprintf(
		"%v|%v|%v|%v|%v|%v|%v|%v|%v|%v|%v|%v",
		item.IdProduct,
		item.IdSubcategory,
		"",
		item.ProdName,
		item.ProdCode,
		item.ProdPosition,
		item.SubcatName,
		item.SubcatPosition,
		item.CatPosition,
		item.BrandId,
		item.BrandName,
		item.BrandPosition,
	)
}
