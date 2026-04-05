package handler

import (
	"errors"

	"github.com/gofiber/fiber/v2"

	"github.com/IlyaKhar/ac-auto56/server/internal/service"
)

type AdminSalonAddressHandler struct {
	svc *service.AdminSalonAddress
}

func NewAdminSalonAddressHandler(svc *service.AdminSalonAddress) *AdminSalonAddressHandler {
	return &AdminSalonAddressHandler{svc: svc}
}

func (h *AdminSalonAddressHandler) uid(c *fiber.Ctx) (int64, bool) {
	v := c.Locals("user_id")
	id, ok := v.(int64)
	return id, ok
}

func (h *AdminSalonAddressHandler) GetBundle(c *fiber.Ctx) error {
	b, err := h.svc.GetAdminBundle(c.Context())
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "ошибка БД")
	}
	return c.JSON(b)
}

type salonSettingsBody struct {
	SectionTitle string `json:"section_title"`
}

func (h *AdminSalonAddressHandler) PatchSettings(c *fiber.Ctx) error {
	uid, ok := h.uid(c)
	if !ok {
		return JSONError(c, fiber.StatusUnauthorized, "нет пользователя")
	}
	var body salonSettingsBody
	if err := c.BodyParser(&body); err != nil || body.SectionTitle == "" {
		return JSONError(c, fiber.StatusBadRequest, "section_title обязателен")
	}
	if err := h.svc.PatchSettings(c.Context(), uid, body.SectionTitle, c.IP()); err != nil {
		if errors.Is(err, service.ErrValidation) {
			return JSONError(c, fiber.StatusBadRequest, "некорректные данные")
		}
		return JSONError(c, fiber.StatusInternalServerError, "ошибка БД")
	}
	return c.SendStatus(fiber.StatusNoContent)
}

type salonAddressBody struct {
	SortOrder     int    `json:"sort_order"`
	Image         string `json:"image"`
	City          string `json:"city"`
	Street        string `json:"street"`
	Phone         string `json:"phone"`
	YandexMapsURL string `json:"yandex_maps_url"`
	GisURL        string `json:"gis_url"`
}

func (h *AdminSalonAddressHandler) CreateAddress(c *fiber.Ctx) error {
	uid, ok := h.uid(c)
	if !ok {
		return JSONError(c, fiber.StatusUnauthorized, "нет пользователя")
	}
	var b salonAddressBody
	if err := c.BodyParser(&b); err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректное тело")
	}
	id, err := h.svc.CreateAddress(c.Context(), uid, b.SortOrder, b.Image, b.City, b.Street, b.Phone, b.YandexMapsURL, b.GisURL, c.IP())
	if err != nil {
		if errors.Is(err, service.ErrValidation) {
			return JSONError(c, fiber.StatusBadRequest, "укажите город или улицу")
		}
		return JSONError(c, fiber.StatusInternalServerError, "не удалось создать")
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"id": id})
}

func (h *AdminSalonAddressHandler) PatchAddress(c *fiber.Ctx) error {
	uid, ok := h.uid(c)
	if !ok {
		return JSONError(c, fiber.StatusUnauthorized, "нет пользователя")
	}
	id, err := parsePathInt64(c, "id")
	if err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный id")
	}
	var b salonAddressBody
	if err := c.BodyParser(&b); err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректное тело")
	}
	if err := h.svc.UpdateAddress(c.Context(), uid, id, b.SortOrder, b.Image, b.City, b.Street, b.Phone, b.YandexMapsURL, b.GisURL, c.IP()); err != nil {
		if errors.Is(err, service.ErrNotFound) {
			return JSONError(c, fiber.StatusNotFound, "не найдено")
		}
		return JSONError(c, fiber.StatusInternalServerError, "ошибка БД")
	}
	return c.SendStatus(fiber.StatusNoContent)
}

func (h *AdminSalonAddressHandler) DeleteAddress(c *fiber.Ctx) error {
	uid, ok := h.uid(c)
	if !ok {
		return JSONError(c, fiber.StatusUnauthorized, "нет пользователя")
	}
	id, err := parsePathInt64(c, "id")
	if err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный id")
	}
	if err := h.svc.DeleteAddress(c.Context(), uid, id, c.IP()); err != nil {
		if errors.Is(err, service.ErrNotFound) {
			return JSONError(c, fiber.StatusNotFound, "не найдено")
		}
		return JSONError(c, fiber.StatusInternalServerError, "ошибка БД")
	}
	return c.SendStatus(fiber.StatusNoContent)
}

type reorderSalonBody struct {
	IDs []int64 `json:"ids"`
}

func (h *AdminSalonAddressHandler) Reorder(c *fiber.Ctx) error {
	uid, ok := h.uid(c)
	if !ok {
		return JSONError(c, fiber.StatusUnauthorized, "нет пользователя")
	}
	var body reorderSalonBody
	if err := c.BodyParser(&body); err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректное тело")
	}
	if err := h.svc.Reorder(c.Context(), uid, body.IDs, c.IP()); err != nil {
		if errors.Is(err, service.ErrValidation) {
			return JSONError(c, fiber.StatusBadRequest, "пустой порядок")
		}
		return JSONError(c, fiber.StatusInternalServerError, "ошибка БД")
	}
	return c.SendStatus(fiber.StatusNoContent)
}
