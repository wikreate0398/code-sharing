package sockets

import (
	"fmt"
	"github.com/pusher/pusher-http-go/v5"
	"wikreate/fimex/internal/config"
	"wikreate/fimex/internal/domain/interfaces"
	"wikreate/fimex/internal/helpers"
)

type PusherAdapter struct {
	client *pusher.Client
	logger interfaces.Logger
}

func NewPusherAdapter(cfg *config.Config, logger interfaces.Logger) *PusherAdapter {
	return &PusherAdapter{client: newPusherClient(cfg), logger: logger}
}

func (s *PusherAdapter) SendMessage(channel string, eventName string, data interface{}) {

	err := s.client.Trigger(channel, eventName, data)

	if err != nil {
		s.logger.WithFields(helpers.KeyStrValue{
			"channel":   channel,
			"eventName": eventName,
			"data":      data,
		}).Error(fmt.Errorf("Failed to send socket message: %w", err))
	}
}
