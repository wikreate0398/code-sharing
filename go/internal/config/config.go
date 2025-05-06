package config

import (
	"fmt"
	"github.com/kelseyhightower/envconfig"
	"github.com/spf13/viper"
	"github.com/subosito/gotenv"
	"os"
	"path/filepath"
)

type Config struct {
	// .env
	Databases Databases
	RabbitMQ  RabbitMQ
	Redis     Redis
	Pusher    Pusher

	//.yaml
	Server `mapstructure:"server"`

	rootPath string
}

type Databases struct {
	MySql MySql
}

type MySql struct {
	Host     string `mapstructure:"DB_HOST"`
	Port     int    `mapstructure:"DB_PORT"`
	User     string `mapstructure:"DB_USER"`
	Password string `mapstructure:"DB_PASSWORD"`
	Database string `mapstructure:"DB_DATABASE"`
}

type RabbitMQ struct {
	Host     string
	Port     int
	User     string
	Password string
}

type Pusher struct {
	AppId   string
	Key     string
	Secret  string
	Cluster string
}

type Redis struct {
	Host     string
	Port     int
	Password string
}

type Server struct {
	Port int `mapstructure:"port"`
}

const env = "stage"

func NewConfig(rootPath string) (*Config, error) {
	cfg := &Config{rootPath: rootPath}

	if err := cfg.parseYaml(env); err != nil {
		return nil, err
	}

	if err := cfg.parseEnv(); err != nil {
		return nil, err
	}

	return cfg, nil
}

func folderExists(path string) bool {
	info, err := os.Stat(path)
	if os.IsNotExist(err) {
		return false
	}
	return info.IsDir()
}

func (cfg *Config) parseYaml(env string) error {
	envViperInstance := viper.New()

	envViperInstance.AddConfigPath(filepath.Join(cfg.rootPath, "configs"))
	envViperInstance.SetConfigName("main")

	if err := envViperInstance.ReadInConfig(); err != nil {
		return err
	}

	envViperInstance.SetConfigName(env)

	if err := envViperInstance.MergeInConfig(); err != nil {
		return err
	}

	if err := envViperInstance.UnmarshalKey("server", &cfg.Server); err != nil {
		return err
	}

	return nil
}

func (cfg *Config) parseEnv() error {
	if err := gotenv.Load(filepath.Join(cfg.rootPath, ".env")); err != nil {
		return fmt.Errorf("Error loading .env file: %w", err)
	}

	if err := loadEnv("db", &cfg.Databases.MySql); err != nil {
		return err
	}

	if err := loadEnv("rmq", &cfg.RabbitMQ); err != nil {
		return err
	}

	if err := loadEnv("redis", &cfg.Redis); err != nil {
		return err
	}

	if err := loadEnv("pusher", &cfg.Pusher); err != nil {
		return err
	}

	return nil
}

func loadEnv(prefix string, spec interface{}) error {
	if err := envconfig.Process(prefix, spec); err != nil {
		return fmt.Errorf("Error loading %s env vars: %w", prefix, err)
	}

	return nil
}
