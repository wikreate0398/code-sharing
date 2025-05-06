package sockets

import (
	"github.com/pusher/pusher-http-go/v5"
	"wikreate/fimex/internal/config"
)

func newPusherClient(config *config.Config) *pusher.Client {
	cfg := config.Pusher

	return &pusher.Client{
		AppID:   cfg.AppId,
		Key:     cfg.Key,
		Secret:  cfg.Secret,
		Cluster: cfg.Cluster,
	}
}
