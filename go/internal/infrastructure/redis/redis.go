package redis

import (
	"context"
	"fmt"
	"github.com/redis/go-redis/v9"
	"wikreate/fimex/internal/config"
)

func NewRedis(cfg *config.Config) *redis.Client {
	ctx := context.Background()

	client := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%v:%v", cfg.Redis.Host, cfg.Redis.Port),
		Password: cfg.Redis.Password,
		DB:       0,
		Protocol: 3,
	})

	err := client.Set(ctx, "foo", "bar", 0).Err()
	if err != nil {
		panic(err)
	}

	_, err = client.Get(ctx, "foo").Result()
	if err != nil {
		panic(err)
	}

	fmt.Println("redis connected")

	return client
}
