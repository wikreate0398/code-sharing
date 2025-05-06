package config

import (
	"go.uber.org/fx"
	"wikreate/fimex/internal/helpers"
)

var Provider = fx.Provide(func() (*Config, error) {
	return NewConfig(helpers.GetRootPath())
})
