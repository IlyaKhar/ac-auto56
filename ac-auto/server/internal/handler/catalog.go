package handler

import (
	"strconv"

	"github.com/gofiber/fiber/v2"

	"github.com/IlyaKhar/ac-auto56/server/internal/service"
)

type CatalogHandler struct {
	svc *service.PublicCatalog
}

func NewCatalogHandler(svc *service.PublicCatalog) *CatalogHandler {
	return &CatalogHandler{svc: svc}
}

func (h *CatalogHandler) ListCategories(c *fiber.Ctx) error {
	list, err := h.svc.ListCategories(c.Context())
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "не удалось загрузить категории")
	}
	return c.JSON(list)
}

func (h *CatalogHandler) ListServices(c *fiber.Ctx) error {
	var catID *int64
	if q := c.Query("category_id"); q != "" {
		n, err := strconv.ParseInt(q, 10, 64)
		if err != nil {
			return JSONError(c, fiber.StatusBadRequest, "некорректный category_id")
		}
		catID = &n
	}
	limit, _ := strconv.Atoi(c.Query("limit"))
	offset, _ := strconv.Atoi(c.Query("offset"))
	list, err := h.svc.ListServices(c.Context(), catID, limit, offset)
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "не удалось загрузить услуги")
	}
	return c.JSON(list)
}

func (h *CatalogHandler) GetService(c *fiber.Ctx) error {
	id, err := parsePathInt64(c,"id")
	if err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный id")
	}
	s, err := h.svc.GetService(c.Context(), id)
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "ошибка БД")
	}
	if s == nil {
		return JSONError(c, fiber.StatusNotFound, "услуга не найдена")
	}
	return c.JSON(s)
}

func (h *CatalogHandler) GetPublishedPage(c *fiber.Ctx) error {
	slug := c.Params("slug")
	if slug == "" {
		return JSONError(c, fiber.StatusBadRequest, "нужен slug")
	}
	v, err := h.svc.GetPublishedPage(c.Context(), slug)
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "ошибка БД")
	}
	if v == nil {
		return JSONError(c, fiber.StatusNotFound, "страница не найдена")
	}
	return c.JSON(v)
}

func (h *CatalogHandler) ListMenuPublic(c *fiber.Ctx) error {
	list, err := h.svc.ListMenuPublic(c.Context())
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "не удалось загрузить меню")
	}
	return c.JSON(list)
}

func (h *CatalogHandler) ListFooterPublic(c *fiber.Ctx) error {
	list, err := h.svc.ListFooterPublic(c.Context())
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "не удалось загрузить футер")
	}
	return c.JSON(list)
}

func (h *CatalogHandler) ListVehicles(c *fiber.Ctx) error {
	list, err := h.svc.ListVehiclesPublished(c.Context())
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "не удалось загрузить каталог авто")
	}
	return c.JSON(list)
}

func (h *CatalogHandler) GetSalonLocations(c *fiber.Ctx) error {
	v, err := h.svc.GetSalonLocations(c.Context())
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "не удалось загрузить адреса")
	}
	return c.JSON(v)
}

func (h *CatalogHandler) GetAboutGallery(c *fiber.Ctx) error {
	v, err := h.svc.GetAboutGallery(c.Context())
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "не удалось загрузить галерею")
	}
	return c.JSON(v)
}

func (h *CatalogHandler) GetHomeMedia(c *fiber.Ctx) error {
	v, err := h.svc.GetHomeMedia(c.Context())
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "не удалось загрузить фото блоков")
	}
	return c.JSON(v)
}

func (h *CatalogHandler) GetVehicle(c *fiber.Ctx) error {
	id, err := parsePathInt64(c, "id")
	if err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный id")
	}
	v, err := h.svc.GetVehiclePublished(c.Context(), id)
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "ошибка БД")
	}
	if v == nil {
		return JSONError(c, fiber.StatusNotFound, "автомобиль не найден")
	}
	return c.JSON(v)
}
