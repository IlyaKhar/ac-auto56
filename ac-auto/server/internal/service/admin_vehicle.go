package service

import (
	"context"
	"errors"
	"strings"

	"github.com/jackc/pgx/v5"

	"github.com/IlyaKhar/ac-auto56/server/internal/repository"
)

// AdminVehicle — CRUD каталога авто + audit.
type AdminVehicle struct {
	repo  *repository.VehicleRepository
	audit *repository.AuditRepository
}

func NewAdminVehicle(repo *repository.VehicleRepository, audit *repository.AuditRepository) *AdminVehicle {
	return &AdminVehicle{repo: repo, audit: audit}
}

func (s *AdminVehicle) log(ctx context.Context, userID int64, action string, entityID *int64, meta map[string]any, ip string) {
	_ = s.audit.Log(ctx, userID, action, "vehicle", entityID, meta, ip)
}

func (s *AdminVehicle) List(ctx context.Context) ([]repository.Vehicle, error) {
	return s.repo.ListAll(ctx)
}

func (s *AdminVehicle) Get(ctx context.Context, id int64) (*repository.Vehicle, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *AdminVehicle) Create(ctx context.Context, userID int64, title, brandLabel string, priceRub int64, description string, features, images []string, sortOrder int, published, isNew bool, ip string) (int64, error) {
	id, err := s.repo.Create(ctx, strings.TrimSpace(title), strings.TrimSpace(brandLabel), priceRub, strings.TrimSpace(description), features, images, sortOrder, published, isNew)
	if err != nil {
		return 0, err
	}
	s.log(ctx, userID, "create", &id, map[string]any{"title": title}, ip)
	return id, nil
}

func (s *AdminVehicle) Update(ctx context.Context, userID int64, id int64, title, brandLabel string, priceRub int64, description string, features, images []string, sortOrder int, published, isNew bool, ip string) error {
	err := s.repo.Update(ctx, id, strings.TrimSpace(title), strings.TrimSpace(brandLabel), priceRub, strings.TrimSpace(description), features, images, sortOrder, published, isNew)
	if errors.Is(err, pgx.ErrNoRows) {
		return ErrNotFound
	}
	if err != nil {
		return err
	}
	s.log(ctx, userID, "update", &id, map[string]any{"title": title}, ip)
	return nil
}

func (s *AdminVehicle) Delete(ctx context.Context, userID int64, id int64, ip string) error {
	err := s.repo.Delete(ctx, id)
	if errors.Is(err, pgx.ErrNoRows) {
		return ErrNotFound
	}
	if err != nil {
		return err
	}
	s.log(ctx, userID, "delete", &id, nil, ip)
	return nil
}
