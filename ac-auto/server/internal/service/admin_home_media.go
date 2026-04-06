package service

import (
	"context"
	"strings"

	"github.com/IlyaKhar/ac-auto56/server/internal/repository"
)

type HomeMediaView struct {
	OurServices   []string `json:"our_services"`
	CarInspection []string `json:"car_inspection"`
	HappyOwners   []string `json:"happy_owners"`
	InsuranceServices []string `json:"insurance_services"`
}

type AdminHomeMedia struct {
	repo  *repository.HomeMediaRepository
	audit *repository.AuditRepository
}

func NewAdminHomeMedia(repo *repository.HomeMediaRepository, audit *repository.AuditRepository) *AdminHomeMedia {
	return &AdminHomeMedia{repo: repo, audit: audit}
}

func (s *AdminHomeMedia) List(ctx context.Context) (*HomeMediaView, error) {
	our, err := s.repo.ListSection(ctx, repository.HomeSectionOurServices)
	if err != nil {
		return nil, err
	}
	inspection, err := s.repo.ListSection(ctx, repository.HomeSectionCarInspection)
	if err != nil {
		return nil, err
	}
	owners, err := s.repo.ListSection(ctx, repository.HomeSectionHappyOwners)
	if err != nil {
		return nil, err
	}
	insurance, err := s.repo.ListSection(ctx, repository.HomeSectionInsuranceServices)
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

func (s *AdminHomeMedia) Put(ctx context.Context, userID int64, in *HomeMediaView, ip string) error {
	our := trimAll(in.OurServices)
	inspection := trimAll(in.CarInspection)
	owners := trimAll(in.HappyOwners)
	insurance := trimAll(in.InsuranceServices)

	if err := s.repo.ReplaceSection(ctx, repository.HomeSectionOurServices, our); err != nil {
		return err
	}
	if err := s.repo.ReplaceSection(ctx, repository.HomeSectionCarInspection, inspection); err != nil {
		return err
	}
	if err := s.repo.ReplaceSection(ctx, repository.HomeSectionHappyOwners, owners); err != nil {
		return err
	}
	if err := s.repo.ReplaceSection(ctx, repository.HomeSectionInsuranceServices, insurance); err != nil {
		return err
	}
	_ = s.audit.Log(ctx, userID, "update", "home_media", nil, map[string]any{
		"our_services":   len(our),
		"car_inspection": len(inspection),
		"happy_owners":   len(owners),
		"insurance_services": len(insurance),
	}, ip)
	return nil
}

func trimAll(in []string) []string {
	out := make([]string, len(in))
	for i := range in {
		out[i] = strings.TrimSpace(in[i])
	}
	return out
}
