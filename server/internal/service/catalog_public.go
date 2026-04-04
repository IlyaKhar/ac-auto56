package service

import (
	"context"

	"github.com/IlyaKhar/ac-auto56/server/internal/repository"
)

// PublicCatalog — публичное чтение категорий, услуг, страниц, меню и футера.
type PublicCatalog struct {
	categories *repository.ServiceCategoryRepository
	services   *repository.CatalogServiceRepository
	pages      *repository.PageRepository
	blocks     *repository.BlockRepository
	menu       *repository.MenuRepository
	footer     *repository.FooterRepository
}

func NewPublicCatalog(
	categories *repository.ServiceCategoryRepository,
	services *repository.CatalogServiceRepository,
	pages *repository.PageRepository,
	blocks *repository.BlockRepository,
	menu *repository.MenuRepository,
	footer *repository.FooterRepository,
) *PublicCatalog {
	return &PublicCatalog{
		categories: categories,
		services:   services,
		pages:      pages,
		blocks:     blocks,
		menu:       menu,
		footer:     footer,
	}
}

func (s *PublicCatalog) ListCategories(ctx context.Context) ([]repository.ServiceCategory, error) {
	return s.categories.ListPublic(ctx)
}

func (s *PublicCatalog) ListServices(ctx context.Context, categoryID *int64, limit, offset int) ([]repository.CatalogService, error) {
	return s.services.ListPublic(ctx, categoryID, limit, offset)
}

func (s *PublicCatalog) GetService(ctx context.Context, id int64) (*repository.CatalogService, error) {
	return s.services.GetPublicByID(ctx, id)
}

// PublishedPageView — страница + блоки для публичного сайта.
type PublishedPageView struct {
	Page   repository.Page            `json:"page"`
	Blocks []repository.BlockJSON     `json:"blocks"`
}

func (s *PublicCatalog) GetPublishedPage(ctx context.Context, slug string) (*PublishedPageView, error) {
	p, err := s.pages.GetPublishedBySlug(ctx, slug)
	if err != nil {
		return nil, err
	}
	if p == nil {
		return nil, nil
	}
	raw, err := s.blocks.ListByPage(ctx, p.ID)
	if err != nil {
		return nil, err
	}
	bj := make([]repository.BlockJSON, 0, len(raw))
	for _, b := range raw {
		bj = append(bj, repository.BlockToJSON(b))
	}
	return &PublishedPageView{Page: *p, Blocks: bj}, nil
}

func (s *PublicCatalog) ListMenuPublic(ctx context.Context) ([]repository.MenuItemPublic, error) {
	return s.menu.ListMenuPublic(ctx)
}

func (s *PublicCatalog) ListFooterPublic(ctx context.Context) ([]repository.FooterSection, error) {
	return s.footer.ListFooterPublic(ctx)
}
