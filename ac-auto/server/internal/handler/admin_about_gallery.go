package handler

import (
	"github.com/gofiber/fiber/v2"

	"github.com/IlyaKhar/ac-auto56/server/internal/service"
)

type AdminAboutGalleryHandler struct {
	svc *service.AdminAboutGallery
}

func NewAdminAboutGalleryHandler(svc *service.AdminAboutGallery) *AdminAboutGalleryHandler {
	return &AdminAboutGalleryHandler{svc: svc}
}

func (h *AdminAboutGalleryHandler) uid(c *fiber.Ctx) (int64, bool) {
	v := c.Locals("user_id")
	id, ok := v.(int64)
	return id, ok
}

func (h *AdminAboutGalleryHandler) Get(c *fiber.Ctx) error {
	list, err := h.svc.List(c.Context())
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "ошибка БД")
	}
	return c.JSON(fiber.Map{"image_urls": list})
}

type aboutGalleryPutBody struct {
	ImageURLs []string `json:"image_urls"`
}

func (h *AdminAboutGalleryHandler) Put(c *fiber.Ctx) error {
	uid, ok := h.uid(c)
	if !ok {
		return JSONError(c, fiber.StatusUnauthorized, "нет пользователя")
	}
	var body aboutGalleryPutBody
	if err := c.BodyParser(&body); err != nil || len(body.ImageURLs) != 5 {
		return JSONError(c, fiber.StatusBadRequest, "нужен массив image_urls из 5 строк")
	}
	if err := h.svc.Put(c.Context(), uid, body.ImageURLs, c.IP()); err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "ошибка БД")
	}
	return c.SendStatus(fiber.StatusNoContent)
}
