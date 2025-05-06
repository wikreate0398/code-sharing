package provider_product

import (
	"wikreate/fimex/internal/domain/structure/dto/stock_dto"
	"wikreate/fimex/internal/domain/structure/dto/user_dto"
)

var (
	CreateProviderProductEventName = "createProviderProduct"
	UpdateProviderProductEventName = "updateProviderProduct"
	DeleteProviderProductEventName = "deleteProviderProduct"
)

// Create
type CreateProviderProductEvent struct {
	Dto    stock_dto.ProviderProductDto
	Causer user_dto.UserDto
}

func (e *CreateProviderProductEvent) EventName() string {
	return CreateProviderProductEventName
}

// Update
type UpdateProviderProductEvent struct {
	Dto    stock_dto.ProviderProductDto
	Causer user_dto.UserDto
}

func (e *UpdateProviderProductEvent) EventName() string {
	return UpdateProviderProductEventName
}

// Delete
type DeleteProviderProductEvent struct {
	Dto    stock_dto.ProviderProductDto
	Causer user_dto.UserDto
}

func (e *DeleteProviderProductEvent) EventName() string {
	return DeleteProviderProductEventName
}
