package handler

import (
	"errors"

	"github.com/gofiber/fiber/v2"

	"github.com/IlyaKhar/ac-auto56/server/internal/service"
)

type AdminLayoutHandler struct {
	svc *service.AdminLayoutService
}

func NewAdminLayoutHandler(svc *service.AdminLayoutService) *AdminLayoutHandler {
	return &AdminLayoutHandler{svc: svc}
}

func (h *AdminLayoutHandler) uid(c *fiber.Ctx) (int64, bool) {
	v := c.Locals("user_id")
	id, ok := v.(int64)
	return id, ok
}

func (h *AdminLayoutHandler) ip(c *fiber.Ctx) string {
	return c.IP()
}

// --- menu ---

func (h *AdminLayoutHandler) ListMenu(c *fiber.Ctx) error {
	list, err := h.svc.ListMenu(c.Context())
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "ошибка БД")
	}
	return c.JSON(list)
}

func (h *AdminLayoutHandler) GetMenu(c *fiber.Ctx) error {
	id, err := parsePathInt64(c,"id")
	if err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный id")
	}
	m, err := h.svc.GetMenu(c.Context(), id)
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "ошибка БД")
	}
	if m == nil {
		return JSONError(c, fiber.StatusNotFound, "не найдено")
	}
	return c.JSON(m)
}

type createMenuBody struct {
	Label     string  `json:"label"`
	Href      *string `json:"href"`
	PageID    *int64  `json:"page_id"`
	ParentID  *int64  `json:"parent_id"`
	SortOrder int     `json:"sort_order"`
	IsVisible bool    `json:"is_visible"`
}

func (h *AdminLayoutHandler) CreateMenu(c *fiber.Ctx) error {
	uid, ok := h.uid(c)
	if !ok {
		return JSONError(c, fiber.StatusUnauthorized, "нет пользователя")
	}
	var b createMenuBody
	if err := c.BodyParser(&b); err != nil || b.Label == "" {
		return JSONError(c, fiber.StatusBadRequest, "label обязателен")
	}
	id, err := h.svc.CreateMenu(c.Context(), uid, b.Label, b.Href, b.PageID, b.ParentID, b.SortOrder, b.IsVisible, h.ip(c))
	if errors.Is(err, service.ErrNotFound) {
		return JSONError(c, fiber.StatusBadRequest, "страница не найдена")
	}
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "не удалось создать")
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"id": id})
}

type patchMenuBody struct {
	Label     *string `json:"label"`
	Href      *string `json:"href"`
	PageID    *int64  `json:"page_id"`
	ParentID  *int64  `json:"parent_id"`
	SortOrder *int    `json:"sort_order"`
	IsVisible *bool   `json:"is_visible"`
}

func (h *AdminLayoutHandler) PatchMenu(c *fiber.Ctx) error {
	uid, ok := h.uid(c)
	if !ok {
		return JSONError(c, fiber.StatusUnauthorized, "нет пользователя")
	}
	id, err := parsePathInt64(c,"id")
	if err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный id")
	}
	cur, err := h.svc.GetMenu(c.Context(), id)
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "ошибка БД")
	}
	if cur == nil {
		return JSONError(c, fiber.StatusNotFound, "не найдено")
	}
	var b patchMenuBody
	if err := c.BodyParser(&b); err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный JSON")
	}
	label := cur.Label
	href := cur.Href
	pageID := cur.PageID
	parentID := cur.ParentID
	sort := cur.SortOrder
	vis := cur.IsVisible
	if b.Label != nil {
		label = *b.Label
	}
	if b.Href != nil {
		href = b.Href
	}
	if b.PageID != nil {
		pageID = b.PageID
	}
	if b.ParentID != nil {
		parentID = b.ParentID
	}
	if b.SortOrder != nil {
		sort = *b.SortOrder
	}
	if b.IsVisible != nil {
		vis = *b.IsVisible
	}
	if label == "" {
		return JSONError(c, fiber.StatusBadRequest, "label не может быть пустым")
	}
	err = h.svc.UpdateMenu(c.Context(), uid, id, label, href, pageID, parentID, sort, vis, h.ip(c))
	if errors.Is(err, service.ErrNotFound) {
		return JSONError(c, fiber.StatusNotFound, "не найдено или страница не существует")
	}
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "не удалось обновить")
	}
	return c.SendStatus(fiber.StatusNoContent)
}

func (h *AdminLayoutHandler) DeleteMenu(c *fiber.Ctx) error {
	uid, ok := h.uid(c)
	if !ok {
		return JSONError(c, fiber.StatusUnauthorized, "нет пользователя")
	}
	id, err := parsePathInt64(c,"id")
	if err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный id")
	}
	err = h.svc.DeleteMenu(c.Context(), uid, id, h.ip(c))
	if errors.Is(err, service.ErrNotFound) {
		return JSONError(c, fiber.StatusNotFound, "не найдено")
	}
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "не удалось удалить")
	}
	return c.SendStatus(fiber.StatusNoContent)
}

type reorderMenuBody struct {
	IDs []int64 `json:"ids"`
}

func (h *AdminLayoutHandler) ReorderMenu(c *fiber.Ctx) error {
	uid, ok := h.uid(c)
	if !ok {
		return JSONError(c, fiber.StatusUnauthorized, "нет пользователя")
	}
	var b reorderMenuBody
	if err := c.BodyParser(&b); err != nil || len(b.IDs) == 0 {
		return JSONError(c, fiber.StatusBadRequest, "нужен массив ids")
	}
	err := h.svc.ReorderMenu(c.Context(), uid, b.IDs, h.ip(c))
	if errors.Is(err, service.ErrNotFound) {
		return JSONError(c, fiber.StatusBadRequest, "некорректный id в списке")
	}
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "не удалось переупорядочить")
	}
	return c.SendStatus(fiber.StatusNoContent)
}

// --- footer ---

func (h *AdminLayoutHandler) ListFooter(c *fiber.Ctx) error {
	list, err := h.svc.ListFooter(c.Context())
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "ошибка БД")
	}
	return c.JSON(list)
}

func (h *AdminLayoutHandler) GetFooter(c *fiber.Ctx) error {
	id, err := parsePathInt64(c,"id")
	if err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный id")
	}
	f, err := h.svc.GetFooter(c.Context(), id)
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "ошибка БД")
	}
	if f == nil {
		return JSONError(c, fiber.StatusNotFound, "не найдено")
	}
	return c.JSON(f)
}

type createFooterBody struct {
	Title     *string `json:"title"`
	Content   string  `json:"content"`
	SortOrder int     `json:"sort_order"`
}

func (h *AdminLayoutHandler) CreateFooter(c *fiber.Ctx) error {
	uid, ok := h.uid(c)
	if !ok {
		return JSONError(c, fiber.StatusUnauthorized, "нет пользователя")
	}
	var b createFooterBody
	if err := c.BodyParser(&b); err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный JSON")
	}
	id, err := h.svc.CreateFooter(c.Context(), uid, b.Title, b.Content, b.SortOrder, h.ip(c))
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "не удалось создать")
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"id": id})
}

type patchFooterBody struct {
	Title     *string `json:"title"`
	Content   *string `json:"content"`
	SortOrder *int    `json:"sort_order"`
}

func (h *AdminLayoutHandler) PatchFooter(c *fiber.Ctx) error {
	uid, ok := h.uid(c)
	if !ok {
		return JSONError(c, fiber.StatusUnauthorized, "нет пользователя")
	}
	id, err := parsePathInt64(c,"id")
	if err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный id")
	}
	cur, err := h.svc.GetFooter(c.Context(), id)
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "ошибка БД")
	}
	if cur == nil {
		return JSONError(c, fiber.StatusNotFound, "не найдено")
	}
	var b patchFooterBody
	if err := c.BodyParser(&b); err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный JSON")
	}
	title := cur.Title
	content := cur.Content
	sort := cur.SortOrder
	if b.Title != nil {
		title = b.Title
	}
	if b.Content != nil {
		content = *b.Content
	}
	if b.SortOrder != nil {
		sort = *b.SortOrder
	}
	err = h.svc.UpdateFooter(c.Context(), uid, id, title, content, sort, h.ip(c))
	if errors.Is(err, service.ErrNotFound) {
		return JSONError(c, fiber.StatusNotFound, "не найдено")
	}
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "не удалось обновить")
	}
	return c.SendStatus(fiber.StatusNoContent)
}

func (h *AdminLayoutHandler) DeleteFooter(c *fiber.Ctx) error {
	uid, ok := h.uid(c)
	if !ok {
		return JSONError(c, fiber.StatusUnauthorized, "нет пользователя")
	}
	id, err := parsePathInt64(c,"id")
	if err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный id")
	}
	err = h.svc.DeleteFooter(c.Context(), uid, id, h.ip(c))
	if errors.Is(err, service.ErrNotFound) {
		return JSONError(c, fiber.StatusNotFound, "не найдено")
	}
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "не удалось удалить")
	}
	return c.SendStatus(fiber.StatusNoContent)
}

type reorderFooterBody struct {
	IDs []int64 `json:"ids"`
}

func (h *AdminLayoutHandler) ReorderFooter(c *fiber.Ctx) error {
	uid, ok := h.uid(c)
	if !ok {
		return JSONError(c, fiber.StatusUnauthorized, "нет пользователя")
	}
	var b reorderFooterBody
	if err := c.BodyParser(&b); err != nil || len(b.IDs) == 0 {
		return JSONError(c, fiber.StatusBadRequest, "нужен массив ids")
	}
	err := h.svc.ReorderFooter(c.Context(), uid, b.IDs, h.ip(c))
	if errors.Is(err, service.ErrNotFound) {
		return JSONError(c, fiber.StatusBadRequest, "некорректный id")
	}
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "не удалось переупорядочить")
	}
	return c.SendStatus(fiber.StatusNoContent)
}
