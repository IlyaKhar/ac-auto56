package service

import (
	"context"
	"errors"
	"strings"

	"github.com/jackc/pgx/v5"

	"github.com/IlyaKhar/ac-auto56/server/internal/repository"
)

// AdminSalonAddress — заголовок секции и список адресов для админки и публичного API.
type AdminSalonAddress struct {
	repo  *repository.SalonAddressRepository
	audit *repository.AuditRepository
}

func NewAdminSalonAddress(repo *repository.SalonAddressRepository, audit *repository.AuditRepository) *AdminSalonAddress {
	return &AdminSalonAddress{repo: repo, audit: audit}
}

func (s *AdminSalonAddress) log(ctx context.Context, userID int64, action string, entityID *int64, meta map[string]any, ip string) {
	_ = s.audit.Log(ctx, userID, action, "salon_address", entityID, meta, ip)
}

type AdminSalonBundle struct {
	SectionTitle string                  `json:"section_title"`
	Addresses    []repository.SalonAddress `json:"addresses"`
}

func (s *AdminSalonAddress) GetAdminBundle(ctx context.Context) (*AdminSalonBundle, error) {
	title, err := s.repo.GetSectionTitle(ctx)
	if err != nil {
		return nil, err
	}
	list, err := s.repo.ListOrdered(ctx)
	if err != nil {
		return nil, err
	}
	return &AdminSalonBundle{SectionTitle: title, Addresses: list}, nil
}

func (s *AdminSalonAddress) PatchSettings(ctx context.Context, userID int64, title string, ip string) error {
	t := strings.TrimSpace(title)
	if t == "" {
		return ErrValidation
	}
	if err := s.repo.UpdateSectionTitle(ctx, t); err != nil {
		return err
	}
	s.log(ctx, userID, "update_settings", nil, map[string]any{"section_title": t}, ip)
	return nil
}

func (s *AdminSalonAddress) CreateAddress(ctx context.Context, userID int64, sortOrder int, image, city, street, phone, yandex, gis string, ip string) (int64, error) {
	if strings.TrimSpace(street) == "" && strings.TrimSpace(city) == "" {
		return 0, ErrValidation
	}
	so := sortOrder
	if so < 0 {
		var err error
		so, err = s.repo.NextSortOrder(ctx)
		if err != nil {
			return 0, err
		}
	}
	id, err := s.repo.Create(ctx, so, strings.TrimSpace(image), strings.TrimSpace(city), strings.TrimSpace(street),
		strings.TrimSpace(phone), strings.TrimSpace(yandex), strings.TrimSpace(gis))
	if err != nil {
		return 0, err
	}
	s.log(ctx, userID, "create", &id, map[string]any{"street": street}, ip)
	return id, nil
}

func (s *AdminSalonAddress) UpdateAddress(ctx context.Context, userID int64, id int64, sortOrder int, image, city, street, phone, yandex, gis string, ip string) error {
	err := s.repo.Update(ctx, id, sortOrder, strings.TrimSpace(image), strings.TrimSpace(city), strings.TrimSpace(street),
		strings.TrimSpace(phone), strings.TrimSpace(yandex), strings.TrimSpace(gis))
	if errors.Is(err, pgx.ErrNoRows) {
		return ErrNotFound
	}
	if err != nil {
		return err
	}
	s.log(ctx, userID, "update", &id, nil, ip)
	return nil
}

func (s *AdminSalonAddress) DeleteAddress(ctx context.Context, userID int64, id int64, ip string) error {
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

func (s *AdminSalonAddress) Reorder(ctx context.Context, userID int64, ids []int64, ip string) error {
	if len(ids) == 0 {
		return ErrValidation
	}
	if err := s.repo.ReorderByIDs(ctx, ids); err != nil {
		return err
	}
	s.log(ctx, userID, "reorder", nil, map[string]any{"ids": ids}, ip)
	return nil
}
