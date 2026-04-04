package db

import (
	"errors"
	"fmt"
	"path/filepath"
	"strings"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

// MigrationsFileURL — корректный file:// для golang-migrate (Windows / Unix).
func MigrationsFileURL(dir string) (string, error) {
	abs, err := filepath.Abs(dir)
	if err != nil {
		return "", err
	}
	s := filepath.ToSlash(abs)
	if len(s) >= 2 && s[1] == ':' {
		return "file:///" + s, nil
	}
	return "file://" + s, nil
}

// RunMigrations применяет SQL-миграции golang-migrate (up до конца).
func RunMigrations(databaseURL, migrationsDir string) error {
	sourceURL, err := MigrationsFileURL(migrationsDir)
	if err != nil {
		return fmt.Errorf("migrations path: %w", err)
	}
	if !strings.HasPrefix(sourceURL, "file://") {
		return fmt.Errorf("некорректный sourceURL: %s", sourceURL)
	}
	m, err := migrate.New(sourceURL, databaseURL)
	if err != nil {
		return fmt.Errorf("migrate.New: %w", err)
	}
	defer m.Close()

	if err := m.Up(); err != nil && !errors.Is(err, migrate.ErrNoChange) {
		return fmt.Errorf("m.Up: %w", err)
	}

	return nil
}
