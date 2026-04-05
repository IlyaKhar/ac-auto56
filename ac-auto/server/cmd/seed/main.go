package main

import (
	"context"
	"log"
	"os"
	"strings"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

// id ролей из миграции: первый INSERT — moderator, второй — admin.
const (
	roleModerator = 1
	roleAdmin     = 2
)

func main() {
	_ = godotenv.Load()

	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		log.Fatal("DATABASE_URL обязателен")
	}

	adminEmail := strings.TrimSpace(os.Getenv("ADMIN_EMAIL"))
	adminPass := os.Getenv("ADMIN_PASSWORD")
	modEmail := strings.TrimSpace(os.Getenv("MODERATOR_EMAIL"))
	modPass := os.Getenv("MODERATOR_PASSWORD")

	hasAdmin := adminEmail != "" && adminPass != ""
	hasMod := modEmail != "" && modPass != ""
	if !hasAdmin && !hasMod {
		log.Fatal("Укажи пару ADMIN_EMAIL+ADMIN_PASSWORD и/или MODERATOR_EMAIL+MODERATOR_PASSWORD")
	}

	ctx := context.Background()
	pool, err := pgxpool.New(ctx, databaseURL)
	if err != nil {
		log.Fatalf("db: %v", err)
	}
	defer pool.Close()

	if hasAdmin {
		if err := ensureUser(ctx, pool, adminEmail, adminPass, roleAdmin, "admin"); err != nil {
			log.Fatal(err)
		}
	}
	if hasMod {
		if err := ensureUser(ctx, pool, modEmail, modPass, roleModerator, "moderator"); err != nil {
			log.Fatal(err)
		}
	}
}

func ensureUser(ctx context.Context, pool *pgxpool.Pool, email, password string, roleID int, roleLabel string) error {
	var exists bool
	err := pool.QueryRow(ctx, `SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)`, email).Scan(&exists)
	if err != nil {
		return err
	}
	if exists {
		log.Printf("[%s] %s уже есть — пропуск.", roleLabel, email)
		return nil
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	_, err = pool.Exec(ctx, `
		INSERT INTO users (email, password_hash, role_id)
		VALUES ($1, $2, $3)
	`, email, string(hash), roleID)
	if err != nil {
		return err
	}

	log.Printf("[%s] создан пользователь: %s", roleLabel, email)
	return nil
}
