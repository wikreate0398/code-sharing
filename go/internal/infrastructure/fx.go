package infrastructure

import (
	"go.uber.org/fx"
	"wikreate/fimex/internal/config"
	"wikreate/fimex/internal/constant"
	"wikreate/fimex/internal/infrastructure/db"
	"wikreate/fimex/internal/infrastructure/events"
	"wikreate/fimex/internal/infrastructure/listeners"
	"wikreate/fimex/internal/infrastructure/logger"
	"wikreate/fimex/internal/infrastructure/queue"
	"wikreate/fimex/internal/infrastructure/redis"
	"wikreate/fimex/internal/infrastructure/storage/repository"
)

var Module = fx.Module("infrastructure",
	config.Provider,
	redis.Provider,
	logger.Provider,
	db.Provider,
	repository.Module,
	queue.Module(constant.WorkersNum),
	events.Module,
	listeners.Module,
)
