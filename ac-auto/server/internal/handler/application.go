package handler

import (
	"errors"

	"github.com/gofiber/fiber/v2"

	"github.com/IlyaKhar/ac-auto56/server/internal/service"
)

type ApplicationHandler struct {
	svc *service.ApplicationService
}

func NewApplicationHandler(svc *service.ApplicationService) *ApplicationHandler {
	return &ApplicationHandler{svc: svc}
}

type createApplicationBody struct {
	Type           string  `json:"type"`
	Name           string  `json:"name"`
	Phone          string  `json:"phone"`
	Email          string  `json:"email"`
	CarBrand       string  `json:"car_brand"`
	VIN            string  `json:"vin"`
	ServiceID      *int64  `json:"service_id"`
	Message        string  `json:"message"`
	TurnstileToken string  `json:"turnstile_token"`
}

func (h *ApplicationHandler) Create(c *fiber.Ctx) error {
	var b createApplicationBody
	if err := c.BodyParser(&b); err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректное тело запроса")
	}
	in := service.CreateApplicationInput{
		Type:           b.Type,
		Name:           b.Name,
		Phone:          b.Phone,
		Email:          b.Email,
		CarBrand:       b.CarBrand,
		VIN:            b.VIN,
		ServiceID:      b.ServiceID,
		Message:        b.Message,
		TurnstileToken: b.TurnstileToken,
	}
	id, err := h.svc.Create(c.Context(), in, c.IP())
	if errors.Is(err, service.ErrValidation) {
		return JSONError(c, fiber.StatusUnprocessableEntity, "проверьте обязательные поля и тип заявки")
	}
	if errors.Is(err, service.ErrTurnstileFailed) {
		return JSONError(c, fiber.StatusUnprocessableEntity, "капча не прошла проверку")
	}
	if errors.Is(err, service.ErrServiceNotFound) {
		return JSONError(c, fiber.StatusBadRequest, "услуга не найдена")
	}
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "не удалось сохранить заявку")
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"id": id})
}
