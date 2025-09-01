package config

import (
	"fmt"

	"github.com/caarlos0/env/v6"
)

// Config
type Config struct {
	Postgres   Postgres    `envPrefix:"POSTGRES_"`
	Redis      RedisConfig `envPrefix:"REDIS_"`
	NeptuneRpc string      `env:"NEPTUNE_RPC"`
}

type Postgres struct {
	User     string `env:"USER"`
	Password string `env:"PASSWORD"`
	DBName   string `env:"DBNAME"`
	Port     string `env:"PORT"`
	Url      string `env:"URL"`
}

type RedisConfig struct {
	URI      string `env:"URI" envDefault:"localhost:6379"`
	User     string `env:"USER"`
	Password string `env:"PASSWORD"`
	DB       int    `env:"DB" envDefault:"0"`
}

// C Global Config
var C Config

func init() {
	if err := env.Parse(&C); err != nil {
		fmt.Printf("%+v\n", err)
	}

	fmt.Printf("%+v\n", C)
}
