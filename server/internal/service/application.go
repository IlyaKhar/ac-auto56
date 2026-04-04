package service

import (
	"context"
	"errors"
	"strings"

	"github.com/IlyaKhar/ac-auto56/server/internal/config"
	"github.com/IlyaKhar/ac-auto56/server/internal/repository"
	"github.com/IlyaKhar/ac-auto56/server/internal/turnstile"
)

var (
	ErrValidation       = errors.New("ошибка валидации")
	ErrTurnstileFailed  = errors.New("капча не прошла проверку")
	ErrServiceNotFound  = errors.New("услуга не найдена или неактивна")
)

const (
	AppTypeCallback       = "callback"
	AppTypeQuestion       = "question"
	AppTypeServiceRequest = "service_request"
)

type CreateApplicationInput struct {
	Type           string
	Name           string
	Phone          string
	Email          string
	CarBrand       string
	VIN            string
	ServiceID      *int64
	Message        string
	TurnstileToken string
}

type ApplicationService struct {
	cfg  *config.Config
	repo *repository.ApplicationRepository
}

func NewApplicationService(cfg *config.Config, repo *repository.ApplicationRepository) *ApplicationService {
	return &ApplicationService{cfg: cfg, repo: repo}
}

func (s *ApplicationService) Create(ctx context.Context, in CreateApplicationInput, clientIP string) (int64, error) {
	in.Type = strings.TrimSpace(in.Type)
	in.Name = strings.TrimSpace(in.Name)
	in.Phone = strings.TrimSpace(in.Phone)
	in.Message = strings.TrimSpace(in.Message)
	in.Email = strings.TrimSpace(in.Email)
	in.CarBrand = strings.TrimSpace(in.CarBrand)
	in.VIN = strings.TrimSpace(in.VIN)

	if in.Name == "" || in.Phone == "" {
		return 0, ErrValidation
	}
	switch in.Type {
	case AppTypeCallback:
		// message необязательно
	case AppTypeQuestion, AppTypeServiceRequest:
		if in.Message == "" {
			return 0, ErrValidation
		}
	default:
		return 0, ErrValidation
	}

	if !s.cfg.TurnstileSkip {
		if s.cfg.TurnstileSecretKey == "" {
			return 0, ErrTurnstileFailed
		}
		if err := turnstile.Verify(ctx, s.cfg.TurnstileSecretKey, in.TurnstileToken, clientIP); err != nil {
			return 0, ErrTurnstileFailed
		}
	}

	var email, carBrand, vin *string
	if in.Email != "" {
		email = &in.Email
	}
	if in.CarBrand != "" {
		carBrand = &in.CarBrand
	}
	if in.VIN != "" {
		vin = &in.VIN
	}
	var message *string
	if in.Message != "" {
		message = &in.Message
	}

	serviceID := in.ServiceID
	if in.Type == AppTypeServiceRequest && serviceID != nil {
		ok, err := s.repo.ServiceExists(ctx, *serviceID)
		if err != nil {
			return 0, err
		}
		if !ok {
			return 0, ErrServiceNotFound
		}
	}

	id, err := s.repo.Create(ctx, in.Type, in.Name, in.Phone, email, carBrand, vin, serviceID, message)
	if err != nil {
		return 0, err
	}
	return id, nil
}
