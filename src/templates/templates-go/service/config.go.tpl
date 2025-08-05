package config

import (
	"fmt"
	"os"
	"github.com/joho/godotenv"
)

type DBConfig struct {
	Host, User, Password, Name string
	Port                       string
}

type AppConfig struct {
	Port string
	DB   DBConfig
}

func Load() AppConfig {
	_ = godotenv.Load()
	port := os.Getenv("APP_PORT")
	if port == "" {
		port = "8080"
	}
	db := DBConfig{
		Host:     getenv("DB_HOST", "localhost"),
		User:     getenv("DB_USER", "postgres"),
		Password: getenv("DB_PASSWORD", "postgres"),
		Name:     getenv("DB_NAME", "products"),
		Port:     getenv("DB_PORT", "5432"),
	}
	return AppConfig{Port: port, DB: db}
}

func (d DBConfig) DSN() string {
	return fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=UTC",
		d.Host, d.User, d.Password, d.Name, d.Port,
	)
}

func getenv(k, def string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return def
}
