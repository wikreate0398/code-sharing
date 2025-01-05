package controllers

import "wikreate/fimex/internal/domain"

type Controllers struct {
	MainController *MainController
}

func NewControllers(application *domain.Application) *Controllers {
	return &Controllers{
		MainController: NewMainController(application),
	}
}
