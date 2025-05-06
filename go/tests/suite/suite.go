package suite

import (
	"path/filepath"
	"runtime"
	"testing"
	"wikreate/fimex/internal/config"
	"wikreate/fimex/internal/domain/interfaces"
	"wikreate/fimex/internal/infrastructure/logger"
)

type Suite struct {
	*testing.T
	Cfg    *config.Config
	Logger interfaces.Logger
}

func New(t *testing.T) *Suite {
	_, b, _, _ := runtime.Caller(0)

	cfg, _ := config.NewConfig(filepath.Join(filepath.Dir(b), "../.."))
	log, _ := logger.NewLogger()

	return &Suite{
		T:      t,
		Cfg:    cfg,
		Logger: log,
	}
}
