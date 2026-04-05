package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
)

// Config — настройки API из env (12-factor).
type Config struct {
	HTTPPort        string
	DatabaseURL     string
	MigrationsPath  string
	CORSAllowOrigin string
	// JWTSecret — ключ подписи access JWT (HS256), минимум надёжности в проде.
	JWTSecret        string
	JWTAccessMinutes int
	JWTRefreshDays   int
	// TurnstileSecretKey — секрет сервера Cloudflare Turnstile.
	TurnstileSecretKey string
	// TurnstileSkip — если true, проверка капчи не вызывается (только локальная разработка).
	TurnstileSkip bool
	// TelegramBotToken — токен от @BotFather; пусто = не слать уведомления.
	TelegramBotToken string
	// TelegramChatID — id чата/группы/канала (например -1001234567890).
	TelegramChatID string
}

// Load читает .env (если есть) и переменные окружения.
func Load() (*Config, error) {
	_ = godotenv.Load()

	migrationsPath := os.Getenv("MIGRATIONS_PATH")
	if migrationsPath == "" {
		migrationsPath = "./database/migrations"
	}

	skipTurnstile, _ := strconv.ParseBool(os.Getenv("TURNSTILE_SKIP"))

	jwtSecret := strings.TrimSpace(os.Getenv("JWT_SECRET"))
	accessMin := 15
	if v := os.Getenv("JWT_ACCESS_MINUTES"); v != "" {
		if n, err := strconv.Atoi(v); err == nil && n > 0 {
			accessMin = n
		}
	}
	refreshDays := 7
	if v := os.Getenv("JWT_REFRESH_DAYS"); v != "" {
		if n, err := strconv.Atoi(v); err == nil && n > 0 {
			refreshDays = n
		}
	}

	c := &Config{
		HTTPPort:           firstNonEmpty(os.Getenv("HTTP_PORT"), "8080"),
		DatabaseURL:        os.Getenv("DATABASE_URL"),
		MigrationsPath:     migrationsPath,
		CORSAllowOrigin:    strings.TrimSpace(os.Getenv("CORS_ALLOW_ORIGIN")),
		JWTSecret:          jwtSecret,
		JWTAccessMinutes:   accessMin,
		JWTRefreshDays:     refreshDays,
		TurnstileSecretKey: strings.TrimSpace(os.Getenv("TURNSTILE_SECRET_KEY")),
		TurnstileSkip:      skipTurnstile,
		TelegramBotToken:   strings.TrimSpace(os.Getenv("TELEGRAM_BOT_TOKEN")),
		TelegramChatID:     strings.TrimSpace(os.Getenv("TELEGRAM_CHAT_ID")),
	}

	if c.DatabaseURL == "" {
		return nil, fmt.Errorf("DATABASE_URL обязателен")
	}
	if c.JWTSecret == "" {
		return nil, fmt.Errorf("JWT_SECRET обязателен")
	}
	if len(c.JWTSecret) < 16 {
		return nil, fmt.Errorf("JWT_SECRET слишком короткий (минимум 16 символов)")
	}

	return c, nil
}

func firstNonEmpty(a, b string) string {
	if strings.TrimSpace(a) != "" {
		return a
	}
	return b
}
