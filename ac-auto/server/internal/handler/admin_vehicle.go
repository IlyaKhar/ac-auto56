package handler

import (
	"errors"

	"github.com/gofiber/fiber/v2"

	"github.com/IlyaKhar/ac-auto56/server/internal/service"
)

type AdminVehicleHandler struct {
	svc *service.AdminVehicle
}

func NewAdminVehicleHandler(svc *service.AdminVehicle) *AdminVehicleHandler {
	return &AdminVehicleHandler{svc: svc}
}

func (h *AdminVehicleHandler) uid(c *fiber.Ctx) (int64, bool) {
	v := c.Locals("user_id")
	id, ok := v.(int64)
	return id, ok
}

func (h *AdminVehicleHandler) List(c *fiber.Ctx) error {
	list, err := h.svc.List(c.Context())
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "ошибка БД")
	}
	return c.JSON(list)
}

func (h *AdminVehicleHandler) Get(c *fiber.Ctx) error {
	id, err := parsePathInt64(c, "id")
	if err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный id")
	}
	row, err := h.svc.Get(c.Context(), id)
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "ошибка БД")
	}
	if row == nil {
		return JSONError(c, fiber.StatusNotFound, "не найдено")
	}
	return c.JSON(row)
}

type vehicleBody struct {
	Title       string   `json:"title"`
	BrandLabel  string   `json:"brand_label"`
	PriceRub    int64    `json:"price_rub"`
	Description string   `json:"description"`
	Features    []string `json:"features"`
	Images      []string `json:"images"`
	SortOrder   int      `json:"sort_order"`
	IsPublished bool  `json:"is_published"`
	IsNew       *bool `json:"is_new,omitempty"`
}

func (h *AdminVehicleHandler) Create(c *fiber.Ctx) error {
	uid, ok := h.uid(c)
	if !ok {
		return JSONError(c, fiber.StatusUnauthorized, "нет пользователя")
	}
	var b vehicleBody
	if err := c.BodyParser(&b); err != nil || b.Title == "" {
		return JSONError(c, fiber.StatusBadRequest, "title обязателен")
	}
	if b.PriceRub < 0 {
		return JSONError(c, fiber.StatusBadRequest, "price_rub не может быть отрицательным")
	}
	isNew := false
	if b.IsNew != nil {
		isNew = *b.IsNew
	}
	id, err := h.svc.Create(c.Context(), uid, b.Title, b.BrandLabel, b.PriceRub, b.Description, b.Features, b.Images, b.SortOrder, b.IsPublished, isNew, c.IP())
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "не удалось создать")
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"id": id})
}

func (h *AdminVehicleHandler) Patch(c *fiber.Ctx) error {
	uid, ok := h.uid(c)
	if !ok {
		return JSONError(c, fiber.StatusUnauthorized, "нет пользователя")
	}
	id, err := parsePathInt64(c, "id")
	if err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный id")
	}
	cur, err := h.svc.Get(c.Context(), id)
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "ошибка БД")
	}
	if cur == nil {
		return JSONError(c, fiber.StatusNotFound, "не найдено")
	}
	var b vehicleBody
	if err := c.BodyParser(&b); err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный JSON")
	}
	if b.Title == "" {
		return JSONError(c, fiber.StatusBadRequest, "title обязателен")
	}
	if b.PriceRub < 0 {
		return JSONError(c, fiber.StatusBadRequest, "price_rub не может быть отрицательным")
	}
	feat := b.Features
	if feat == nil {
		feat = cur.Features
	}
	imgs := b.Images
	if imgs == nil {
		imgs = cur.Images
	}
	isNew := cur.IsNew
	if b.IsNew != nil {
		isNew = *b.IsNew
	}

	err = h.svc.Update(c.Context(), uid, id, b.Title, b.BrandLabel, b.PriceRub, b.Description, feat, imgs, b.SortOrder, b.IsPublished, isNew, c.IP())
	if errors.Is(err, service.ErrNotFound) {
		return JSONError(c, fiber.StatusNotFound, "не найдено")
	}
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "не удалось обновить")
	}
	return c.SendStatus(fiber.StatusNoContent)
}

func (h *AdminVehicleHandler) Delete(c *fiber.Ctx) error {
	uid, ok := h.uid(c)
	if !ok {
		return JSONError(c, fiber.StatusUnauthorized, "нет пользователя")
	}
	id, err := parsePathInt64(c, "id")
	if err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный id")
	}
	err = h.svc.Delete(c.Context(), uid, id, c.IP())
	if errors.Is(err, service.ErrNotFound) {
		return JSONError(c, fiber.StatusNotFound, "не найдено")
	}
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "не удалось удалить")
	}
	return c.SendStatus(fiber.StatusNoContent)
}
