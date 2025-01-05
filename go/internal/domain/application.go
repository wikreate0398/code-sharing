package domain

import (
	"github.com/jmoiron/sqlx"
	"wikreate/fimex/internal/config"
	"wikreate/fimex/internal/repository"
	"wikreate/fimex/internal/service"
)

type AppDeps struct {
	Repository *repository.Repository
	Db         *sqlx.DB
	Service    *service.Service
	Config     *config.Config
}

type Application struct {
	AppDeps
}
