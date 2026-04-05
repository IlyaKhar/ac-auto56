package service

import (
	"context"

	"github.com/IlyaKhar/ac-auto56/server/internal/repository"
)

type AdminAboutGallery struct {
	repo  *repository.AboutGalleryRepository
	audit *repository.AuditRepository
}

func NewAdminAboutGallery(repo *repository.AboutGalleryRepository, audit *repository.AuditRepository) *AdminAboutGallery {
	return &AdminAboutGallery{repo: repo, audit: audit}
}

func (s *AdminAboutGallery) List(ctx context.Context) ([]string, error) {
	return s.repo.ListImageURLs(ctx)
}

func (s *AdminAboutGallery) Put(ctx context.Context, userID int64, urls []string, ip string) error {
	if err := s.repo.ReplaceAll(ctx, urls); err != nil {
		return err
	}
	_ = s.audit.Log(ctx, userID, "update", "about_gallery", nil, map[string]any{"count": len(urls)}, ip)
	return nil
}
