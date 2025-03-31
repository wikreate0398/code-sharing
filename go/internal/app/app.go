package app

import (
	"go.uber.org/fx"
	"go.uber.org/fx/fxevent"
	"time"
	"wikreate/fimex/internal/domain/interfaces"
	domain_services "wikreate/fimex/internal/domain/services"
	"wikreate/fimex/internal/infrastructure"
	"wikreate/fimex/internal/infrastructure/logger"
	"wikreate/fimex/internal/transport/rbbtmq"
	"wikreate/fimex/internal/transport/rest"
)

func initTime() {
	loc, err := time.LoadLocation("Europe/Chisinau") // Задаем нужный часовой пояс
	if err != nil {
		panic(err)
	}
	time.Local = loc // Устанавливаем глобально
}

func Create() {
	initTime()

	fx.New(
		infrastructure.Module,
		domain_services.Module,

		fx.Options(
			rest.Module,
			rbbtmq.Module,
		),

		fx.WithLogger(func(log interfaces.Logger) fxevent.Logger {
			return logger.NewFxLogger(log)
		}),
	).Run()
}
