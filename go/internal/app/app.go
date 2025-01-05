package app

import (
	"wikreate/fimex/internal/config"
	"wikreate/fimex/internal/domain"
	"wikreate/fimex/internal/repository"
	"wikreate/fimex/internal/service"
	"wikreate/fimex/internal/transport/messagebus"
	"wikreate/fimex/internal/transport/rest"
	"wikreate/fimex/pkg/database/mysql"
	"wikreate/fimex/pkg/lifecycle"
)

func NewApplication(deps domain.AppDeps) *domain.Application {
	return &domain.Application{AppDeps: deps}
}

func Make(cfg *config.Config) {
	db := mysql.NewClient(cfg.Databases.MySql)
	repo := repository.NewRepository(db)
	serv := service.NewService(repo, db)

	app := NewApplication(domain.AppDeps{
		Repository: repository.NewRepository(db),
		Db:         db,
		Service:    serv,
		Config:     cfg,
	})

	lf := lifecycle.Register(
		rest.Init(app),
		messagebus.Init(app),
	)

	lf.Run()
}
