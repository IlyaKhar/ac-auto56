package service

import (
	"context"

	"github.com/IlyaKhar/ac-auto56/server/internal/repository"
)

// PublicCatalog — публичное чтение категорий, услуг, страниц, меню, футера, каталога авто и адресов салона.
type PublicCatalog struct {
	categories *repository.ServiceCategoryRepository
	services   *repository.CatalogServiceRepository
	pages      *repository.PageRepository
	blocks     *repository.BlockRepository
	menu       *repository.MenuRepository
	footer     *repository.FooterRepository
	vehicles   *repository.VehicleRepository
	salonAddr   *repository.SalonAddressRepository
	aboutGallery *repository.AboutGalleryRepository
	homeMedia    *repository.HomeMediaRepository
}

func NewPublicCatalog(
	categories *repository.ServiceCategoryRepository,
	services *repository.CatalogServiceRepository,
	pages *repository.PageRepository,
	blocks *repository.BlockRepository,
	menu *repository.MenuRepository,
	footer *repository.FooterRepository,
	vehicles *repository.VehicleRepository,
	salonAddr *repository.SalonAddressRepository,
	aboutGallery *repository.AboutGalleryRepository,
	homeMedia *repository.HomeMediaRepository,
) *PublicCatalog {
	return &PublicCatalog{
		categories:   categories,
		services:     services,
		pages:        pages,
		blocks:       blocks,
		menu:         menu,
		footer:       footer,
		vehicles:     vehicles,
		salonAddr:    salonAddr,
		aboutGallery: aboutGallery,
		homeMedia:    homeMedia,
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

func (s *PublicCatalog) ListVehiclesPublished(ctx context.Context) ([]repository.Vehicle, error) {
	return s.vehicles.ListPublished(ctx)
}

func (s *PublicCatalog) GetVehiclePublished(ctx context.Context, id int64) (*repository.Vehicle, error) {
	return s.vehicles.GetPublishedByID(ctx, id)
}

// SalonLocationsView — блок адресов на главной.
type SalonLocationsView struct {
	Title     string                    `json:"title"`
	Locations []repository.SalonAddress `json:"locations"`
}

func (s *PublicCatalog) GetSalonLocations(ctx context.Context) (*SalonLocationsView, error) {
	title, err := s.salonAddr.GetSectionTitle(ctx)
	if err != nil {
		return nil, err
	}
	list, err := s.salonAddr.ListOrdered(ctx)
	if err != nil {
		return nil, err
	}
	return &SalonLocationsView{Title: title, Locations: list}, nil
}

// AboutGalleryView — слайдер на странице «О компании».
type AboutGalleryView struct {
	ImageURLs []string `json:"image_urls"`
}

func (s *PublicCatalog) GetAboutGallery(ctx context.Context) (*AboutGalleryView, error) {
	list, err := s.aboutGallery.ListImageURLs(ctx)
	if err != nil {
		return nil, err
	}
	return &AboutGalleryView{ImageURLs: list}, nil
}

func (s *PublicCatalog) GetHomeMedia(ctx context.Context) (*HomeMediaView, error) {
	our, err := s.homeMedia.ListSection(ctx, repository.HomeSectionOurServices)
	if err != nil {
		return nil, err
	}
	inspection, err := s.homeMedia.ListSection(ctx, repository.HomeSectionCarInspection)
	if err != nil {
		return nil, err
	}
	owners, err := s.homeMedia.ListSection(ctx, repository.HomeSectionHappyOwners)
	if err != nil {
		return nil, err
	}
	insurance, err := s.homeMedia.ListSection(ctx, repository.HomeSectionInsuranceServices)
	if err != nil {
		return nil, err
	}
	return &HomeMediaView{
		OurServices:   our,
		CarInspection: inspection,
		HappyOwners:   owners,
		InsuranceServices: insurance,
	}, nil
}
