package infrastructure

import (
	"go.uber.org/fx"
	"wikreate/fimex/internal/config"
	"wikreate/fimex/internal/infrastructure/db"
	"wikreate/fimex/internal/infrastructure/logger"
	"wikreate/fimex/internal/infrastructure/storage/repository"
)

var Module = fx.Module("infrastructure",
	config.Provider,
	logger.Provider,
	db.Provider,
	repository.Module,
)
