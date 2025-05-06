package sockets

import (
	"go.uber.org/fx"
	"wikreate/fimex/internal/domain/interfaces"
)

var Module = fx.Module("sockets",
	fx.Provide(
		fx.Annotate(
			NewPusherAdapter,
			fx.As(new(interfaces.Sockets)),
		),
	),
)
