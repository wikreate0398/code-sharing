package redis

import (
	"context"
	"fmt"
	"github.com/redis/go-redis/v9"
	"wikreate/fimex/internal/config"
	"wikreate/fimex/internal/domain/interfaces"
)

func NewRedis(cfg *config.Config, log interfaces.Logger) *redis.Client {
	ctx := context.Background()

	client := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%v:%v", cfg.Redis.Host, cfg.Redis.Port),
		Password: cfg.Redis.Password,
		DB:       0,
		Protocol: 3,
	})

	err := client.Set(ctx, "foo", "bar", 0).Err()
	log.FatalOnErr(err, "Failed to store value in redis")

	_, err = client.Get(ctx, "foo").Result()
	log.FatalOnErr(err, "Failed to get value from redis")

	return client
}
