package redis

import (
	"go.uber.org/fx"
)

var Provider = fx.Provide(NewRedis)
