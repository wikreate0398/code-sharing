package app

import (
	"go.uber.org/fx"
	"time"
	domain_services "wikreate/fimex/internal/domain/services"
	"wikreate/fimex/internal/infrastructure"
	"wikreate/fimex/internal/infrastructure/logger"
	"wikreate/fimex/internal/transport/rbbtmq"
	"wikreate/fimex/internal/transport/rest"
	"wikreate/fimex/internal/transport/sockets"
)

func Create() {
	fx.New(
		infrastructure.Module,
		domain_services.Module,

		fx.Options(
			rest.Module,
			rbbtmq.Module,
			sockets.Module,
		),

		logger.WithLogger,
	).Run()
}
