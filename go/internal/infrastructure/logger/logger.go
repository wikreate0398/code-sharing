package logger

import (
	"path/filepath"
	"wikreate/fimex/internal/helpers"
	"wikreate/fimex/internal/infrastructure/adapter/logger_adapter"
	"wikreate/fimex/pkg/logrus"
)

func NewLogger() (*logger_adapter.LoggerAdapter, error) {
	logger, err := logrus.NewLogrus(filepath.Join(helpers.GetRootPath(), "logs"))

	if err != nil {
		return nil, err
	}

	return logger_adapter.NewLoggerAdapter(logger), nil
}
