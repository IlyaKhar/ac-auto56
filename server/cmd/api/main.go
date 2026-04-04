// AC Auto — HTTP API. OpenAPI: server/docs/swagger.json, UI: GET /swagger/index.html
package main

import (
	"context"
	"log"

	_ "github.com/IlyaKhar/ac-auto56/server/docs" // side-effect: регистрация OpenAPI для Swagger UI

	"github.com/IlyaKhar/ac-auto56/server/internal/config"
	"github.com/IlyaKhar/ac-auto56/server/internal/db"
	"github.com/IlyaKhar/ac-auto56/server/internal/router"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("config: %v", err)
	}

	if err := db.RunMigrations(cfg.DatabaseURL, cfg.MigrationsPath); err != nil {
		log.Fatalf("migrations: %v", err)
	}

	ctx := context.Background()
	pool, err := db.NewPool(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("db pool: %v", err)
	}
	defer pool.Close()

	app := router.New(cfg, pool)
	addr := ":" + cfg.HTTPPort
	log.Printf("API слушает %s", addr)
	if err := app.Listen(addr); err != nil {
		log.Fatal(err)
	}
}
