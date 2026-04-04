package service

import (
	"context"
	"errors"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"

	"github.com/IlyaKhar/ac-auto56/server/internal/repository"
)

var (
	ErrNotFound            = errors.New("не найдено")
	ErrConflict            = errors.New("конфликт уникальности")
	ErrCategoryHasServices = errors.New("в категории есть услуги")
	ErrInvalidStatus       = errors.New("некорректный status страницы")
)

// AdminCMS — CRUD контента (только роль admin) + audit_logs.
type AdminCMS struct {
	categories *repository.ServiceCategoryRepository
	services   *repository.CatalogServiceRepository
	pages      *repository.PageRepository
	blocks     *repository.BlockRepository
	audit      *repository.AuditRepository
}

func NewAdminCMS(
	categories *repository.ServiceCategoryRepository,
	services *repository.CatalogServiceRepository,
	pages *repository.PageRepository,
	blocks *repository.BlockRepository,
	audit *repository.AuditRepository,
) *AdminCMS {
	return &AdminCMS{
		categories: categories,
		services:   services,
		pages:      pages,
		blocks:     blocks,
		audit:      audit,
	}
}

func isUniqueViolation(err error) bool {
	var pe *pgconn.PgError
	return errors.As(err, &pe) && pe.Code == "23505"
}

func (s *AdminCMS) log(ctx context.Context, userID int64, action, entity string, entityID *int64, meta map[string]any, ip string) {
	_ = s.audit.Log(ctx, userID, action, entity, entityID, meta, ip)
}

// --- categories ---

func (s *AdminCMS) ListCategories(ctx context.Context) ([]repository.ServiceCategory, error) {
	return s.categories.ListAll(ctx)
}

func (s *AdminCMS) GetCategory(ctx context.Context, id int64) (*repository.ServiceCategory, error) {
	return s.categories.GetByID(ctx, id)
}

func (s *AdminCMS) CreateCategory(ctx context.Context, userID int64, title, slug string, sort int, active bool, ip string) (int64, error) {
	id, err := s.categories.Create(ctx, strings.TrimSpace(title), strings.TrimSpace(slug), sort, active)
	if err != nil {
		if isUniqueViolation(err) {
			return 0, ErrConflict
		}
		return 0, err
	}
	s.log(ctx, userID, "create", "service_category", &id, map[string]any{"slug": slug}, ip)
	return id, nil
}

func (s *AdminCMS) UpdateCategory(ctx context.Context, userID int64, id int64, title, slug string, sort int, active bool, ip string) error {
	err := s.categories.Update(ctx, id, strings.TrimSpace(title), strings.TrimSpace(slug), sort, active)
	if errors.Is(err, pgx.ErrNoRows) {
		return ErrNotFound
	}
	if err != nil {
		if isUniqueViolation(err) {
			return ErrConflict
		}
		return err
	}
	s.log(ctx, userID, "update", "service_category", &id, nil, ip)
	return nil
}

func (s *AdminCMS) DeleteCategory(ctx context.Context, userID int64, id int64, ip string) error {
	n, err := s.categories.CountServices(ctx, id)
	if err != nil {
		return err
	}
	if n > 0 {
		return ErrCategoryHasServices
	}
	err = s.categories.Delete(ctx, id)
	if errors.Is(err, pgx.ErrNoRows) {
		return ErrNotFound
	}
	if err != nil {
		return err
	}
	s.log(ctx, userID, "delete", "service_category", &id, nil, ip)
	return nil
}

// --- services (catalog) ---

func (s *AdminCMS) ListServices(ctx context.Context) ([]repository.CatalogService, error) {
	return s.services.ListAll(ctx)
}

func (s *AdminCMS) GetService(ctx context.Context, id int64) (*repository.CatalogService, error) {
	return s.services.GetByID(ctx, id)
}

func (s *AdminCMS) CreateService(ctx context.Context, userID int64, title, desc string, price, duration *string, categoryID int64, active bool, ip string) (int64, error) {
	id, err := s.services.Create(ctx, strings.TrimSpace(title), strings.TrimSpace(desc), price, duration, categoryID, active)
	if err != nil {
		return 0, err
	}
	s.log(ctx, userID, "create", "service", &id, map[string]any{"category_id": categoryID}, ip)
	return id, nil
}

func (s *AdminCMS) UpdateService(ctx context.Context, userID int64, id int64, title, desc string, price, duration *string, categoryID int64, active bool, ip string) error {
	err := s.services.Update(ctx, id, strings.TrimSpace(title), strings.TrimSpace(desc), price, duration, categoryID, active)
	if errors.Is(err, pgx.ErrNoRows) {
		return ErrNotFound
	}
	if err != nil {
		return err
	}
	s.log(ctx, userID, "update", "service", &id, nil, ip)
	return nil
}

func (s *AdminCMS) DeleteService(ctx context.Context, userID int64, id int64, ip string) error {
	err := s.services.Delete(ctx, id)
	if errors.Is(err, pgx.ErrNoRows) {
		return ErrNotFound
	}
	if err != nil {
		return err
	}
	s.log(ctx, userID, "delete", "service", &id, nil, ip)
	return nil
}

func normalizePageStatus(st string) (string, error) {
	switch strings.TrimSpace(st) {
	case "draft", "published":
		return st, nil
	default:
		return "", ErrInvalidStatus
	}
}

func publishedAtForSave(oldStatus, newStatus string, oldPub *time.Time) *time.Time {
	if newStatus != "published" {
		return oldPub
	}
	if oldStatus != "published" {
		now := time.Now().UTC()
		return &now
	}
	return oldPub
}

// --- pages ---

func (s *AdminCMS) ListPages(ctx context.Context) ([]repository.Page, error) {
	return s.pages.ListAll(ctx)
}

func (s *AdminCMS) GetPage(ctx context.Context, id int64) (*repository.Page, error) {
	return s.pages.GetByID(ctx, id)
}

// GetPageWithBlocks — админка: страница + блоки одним ответом.
func (s *AdminCMS) GetPageWithBlocks(ctx context.Context, id int64) (*repository.Page, []repository.BlockJSON, error) {
	p, err := s.pages.GetByID(ctx, id)
	if err != nil || p == nil {
		return p, nil, err
	}
	blocks, err := s.ListBlocks(ctx, id)
	return p, blocks, err
}

func (s *AdminCMS) CreatePage(ctx context.Context, userID int64, slug, title, status string, seoTitle, seoDesc, og *string, ip string) (int64, error) {
	st, err := normalizePageStatus(status)
	if err != nil {
		return 0, err
	}
	var pub *time.Time
	if st == "published" {
		now := time.Now().UTC()
		pub = &now
	}
	id, err := s.pages.Create(ctx, strings.TrimSpace(slug), strings.TrimSpace(title), st, seoTitle, seoDesc, og, pub)
	if err != nil {
		if isUniqueViolation(err) {
			return 0, ErrConflict
		}
		return 0, err
	}
	s.log(ctx, userID, "create", "page", &id, map[string]any{"slug": slug}, ip)
	return id, nil
}

func (s *AdminCMS) UpdatePage(ctx context.Context, userID int64, id int64, slug, title, status string, seoTitle, seoDesc, og *string, ip string) error {
	old, err := s.pages.GetByID(ctx, id)
	if err != nil {
		return err
	}
	if old == nil {
		return ErrNotFound
	}
	st, err := normalizePageStatus(status)
	if err != nil {
		return err
	}
	pub := publishedAtForSave(old.Status, st, old.PublishedAt)
	err = s.pages.Update(ctx, id, strings.TrimSpace(slug), strings.TrimSpace(title), st, seoTitle, seoDesc, og, pub)
	if err != nil {
		if isUniqueViolation(err) {
			return ErrConflict
		}
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrNotFound
		}
		return err
	}
	s.log(ctx, userID, "update", "page", &id, nil, ip)
	return nil
}

func (s *AdminCMS) DeletePage(ctx context.Context, userID int64, id int64, ip string) error {
	err := s.pages.Delete(ctx, id)
	if errors.Is(err, pgx.ErrNoRows) {
		return ErrNotFound
	}
	if err != nil {
		return err
	}
	s.log(ctx, userID, "delete", "page", &id, nil, ip)
	return nil
}

// --- blocks ---

func (s *AdminCMS) ListBlocks(ctx context.Context, pageID int64) ([]repository.BlockJSON, error) {
	raw, err := s.blocks.ListByPage(ctx, pageID)
	if err != nil {
		return nil, err
	}
	out := make([]repository.BlockJSON, 0, len(raw))
	for _, b := range raw {
		out = append(out, repository.BlockToJSON(b))
	}
	return out, nil
}

func (s *AdminCMS) CreateBlock(ctx context.Context, userID int64, pageID int64, blockType string, data []byte, ip string) (int64, error) {
	p, err := s.pages.GetByID(ctx, pageID)
	if err != nil {
		return 0, err
	}
	if p == nil {
		return 0, ErrNotFound
	}
	sort, err := s.blocks.NextSortOrder(ctx, pageID)
	if err != nil {
		return 0, err
	}
	id, err := s.blocks.Create(ctx, pageID, strings.TrimSpace(blockType), sort, data)
	if err != nil {
		return 0, err
	}
	s.log(ctx, userID, "create", "block", &id, map[string]any{"page_id": pageID}, ip)
	return id, nil
}

// GetBlockRaw — блок, принадлежащий странице (для PATCH merge в handler).
func (s *AdminCMS) GetBlockRaw(ctx context.Context, blockID, pageID int64) (*repository.Block, error) {
	b, err := s.blocks.GetByID(ctx, blockID)
	if err != nil {
		return nil, err
	}
	if b == nil || b.PageID != pageID {
		return nil, nil
	}
	return b, nil
}

func (s *AdminCMS) UpdateBlock(ctx context.Context, userID int64, pageID, blockID int64, blockType string, sort int, data []byte, ip string) error {
	b, err := s.blocks.GetByID(ctx, blockID)
	if err != nil {
		return err
	}
	if b == nil || b.PageID != pageID {
		return ErrNotFound
	}
	err = s.blocks.Update(ctx, blockID, strings.TrimSpace(blockType), sort, data)
	if errors.Is(err, pgx.ErrNoRows) {
		return ErrNotFound
	}
	if err != nil {
		return err
	}
	s.log(ctx, userID, "update", "block", &blockID, map[string]any{"page_id": pageID}, ip)
	return nil
}

func (s *AdminCMS) DeleteBlock(ctx context.Context, userID int64, pageID, blockID int64, ip string) error {
	b, err := s.blocks.GetByID(ctx, blockID)
	if err != nil {
		return err
	}
	if b == nil || b.PageID != pageID {
		return ErrNotFound
	}
	err = s.blocks.Delete(ctx, blockID)
	if errors.Is(err, pgx.ErrNoRows) {
		return ErrNotFound
	}
	if err != nil {
		return err
	}
	s.log(ctx, userID, "delete", "block", &blockID, map[string]any{"page_id": pageID}, ip)
	return nil
}

func (s *AdminCMS) ReorderBlocks(ctx context.Context, userID int64, pageID int64, ids []int64, ip string) error {
	p, err := s.pages.GetByID(ctx, pageID)
	if err != nil {
		return err
	}
	if p == nil {
		return ErrNotFound
	}
	if err := s.blocks.Reorder(ctx, pageID, ids); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrNotFound
		}
		return err
	}
	s.log(ctx, userID, "reorder", "blocks", &pageID, map[string]any{"order": ids}, ip)
	return nil
}
