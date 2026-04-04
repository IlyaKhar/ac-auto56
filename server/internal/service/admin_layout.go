package service

import (
	"context"
	"errors"
	"strings"

	"github.com/jackc/pgx/v5"

	"github.com/IlyaKhar/ac-auto56/server/internal/repository"
)

// AdminLayoutService — меню и футер в админке + audit.
type AdminLayoutService struct {
	menu   *repository.MenuRepository
	footer *repository.FooterRepository
	pages  *repository.PageRepository
	audit  *repository.AuditRepository
}

func NewAdminLayoutService(
	menu *repository.MenuRepository,
	footer *repository.FooterRepository,
	pages *repository.PageRepository,
	audit *repository.AuditRepository,
) *AdminLayoutService {
	return &AdminLayoutService{menu: menu, footer: footer, pages: pages, audit: audit}
}

func (s *AdminLayoutService) log(ctx context.Context, userID int64, action, entity string, entityID *int64, meta map[string]any, ip string) {
	_ = s.audit.Log(ctx, userID, action, entity, entityID, meta, ip)
}

func (s *AdminLayoutService) ensurePage(ctx context.Context, pageID *int64) error {
	if pageID == nil {
		return nil
	}
	p, err := s.pages.GetByID(ctx, *pageID)
	if err != nil {
		return err
	}
	if p == nil {
		return ErrNotFound
	}
	return nil
}

// --- menu ---

func (s *AdminLayoutService) ListMenu(ctx context.Context) ([]repository.MenuItem, error) {
	return s.menu.ListMenuAll(ctx)
}

func (s *AdminLayoutService) GetMenu(ctx context.Context, id int64) (*repository.MenuItem, error) {
	return s.menu.GetMenuByID(ctx, id)
}

func (s *AdminLayoutService) CreateMenu(ctx context.Context, userID int64, label string, href *string, pageID, parentID *int64, sort int, visible bool, ip string) (int64, error) {
	if err := s.ensurePage(ctx, pageID); err != nil {
		return 0, err
	}
	if sort == 0 {
		n, err := s.menu.NextMenuSortOrder(ctx)
		if err != nil {
			return 0, err
		}
		sort = n
	}
	newID, err := s.menu.CreateMenuItem(ctx, strings.TrimSpace(label), href, pageID, parentID, sort, visible)
	if err != nil {
		return 0, err
	}
	s.log(ctx, userID, "create", "menu_item", &newID, nil, ip)
	return newID, nil
}

func (s *AdminLayoutService) UpdateMenu(ctx context.Context, userID, id int64, label string, href *string, pageID, parentID *int64, sort int, visible bool, ip string) error {
	if err := s.ensurePage(ctx, pageID); err != nil {
		return err
	}
	if err := s.menu.UpdateMenuItem(ctx, id, strings.TrimSpace(label), href, pageID, parentID, sort, visible); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrNotFound
		}
		return err
	}
	s.log(ctx, userID, "update", "menu_item", &id, nil, ip)
	return nil
}

func (s *AdminLayoutService) DeleteMenu(ctx context.Context, userID, id int64, ip string) error {
	if err := s.menu.DeleteMenuItem(ctx, id); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrNotFound
		}
		return err
	}
	s.log(ctx, userID, "delete", "menu_item", &id, nil, ip)
	return nil
}

func (s *AdminLayoutService) ReorderMenu(ctx context.Context, userID int64, ids []int64, ip string) error {
	if err := s.menu.ReorderMenuItems(ctx, ids); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrNotFound
		}
		return err
	}
	s.log(ctx, userID, "reorder", "menu_items", nil, map[string]any{"ids": ids}, ip)
	return nil
}

// --- footer ---

func (s *AdminLayoutService) ListFooter(ctx context.Context) ([]repository.FooterSection, error) {
	return s.footer.ListFooterAll(ctx)
}

func (s *AdminLayoutService) GetFooter(ctx context.Context, id int64) (*repository.FooterSection, error) {
	return s.footer.GetFooterByID(ctx, id)
}

func (s *AdminLayoutService) CreateFooter(ctx context.Context, userID int64, title *string, content string, sort int, ip string) (int64, error) {
	content = strings.TrimSpace(content)
	if sort == 0 {
		n, err := s.footer.NextFooterSortOrder(ctx)
		if err != nil {
			return 0, err
		}
		sort = n
	}
	id, err := s.footer.CreateFooter(ctx, title, content, sort)
	if err != nil {
		return 0, err
	}
	s.log(ctx, userID, "create", "footer_section", &id, nil, ip)
	return id, nil
}

func (s *AdminLayoutService) UpdateFooter(ctx context.Context, userID, id int64, title *string, content string, sort int, ip string) error {
	content = strings.TrimSpace(content)
	if err := s.footer.UpdateFooter(ctx, id, title, content, sort); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrNotFound
		}
		return err
	}
	s.log(ctx, userID, "update", "footer_section", &id, nil, ip)
	return nil
}

func (s *AdminLayoutService) DeleteFooter(ctx context.Context, userID, id int64, ip string) error {
	if err := s.footer.DeleteFooter(ctx, id); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrNotFound
		}
		return err
	}
	s.log(ctx, userID, "delete", "footer_section", &id, nil, ip)
	return nil
}

func (s *AdminLayoutService) ReorderFooter(ctx context.Context, userID int64, ids []int64, ip string) error {
	if err := s.footer.ReorderFooter(ctx, ids); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrNotFound
		}
		return err
	}
	s.log(ctx, userID, "reorder", "footer_sections", nil, map[string]any{"ids": ids}, ip)
	return nil
}
