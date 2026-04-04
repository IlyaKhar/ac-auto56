package handler

import (
	"encoding/json"
	"errors"

	"github.com/gofiber/fiber/v2"

	"github.com/IlyaKhar/ac-auto56/server/internal/service"
)

type AdminCMSHandler struct {
	svc *service.AdminCMS
}

func NewAdminCMSHandler(svc *service.AdminCMS) *AdminCMSHandler {
	return &AdminCMSHandler{svc: svc}
}

func (h *AdminCMSHandler) uid(c *fiber.Ctx) (int64, bool) {
	v := c.Locals("user_id")
	id, ok := v.(int64)
	return id, ok
}

func (h *AdminCMSHandler) ip(c *fiber.Ctx) string {
	return c.IP()
}

// --- categories ---

func (h *AdminCMSHandler) ListCategories(c *fiber.Ctx) error {
	list, err := h.svc.ListCategories(c.Context())
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "ошибка БД")
	}
	return c.JSON(list)
}

func (h *AdminCMSHandler) GetCategory(c *fiber.Ctx) error {
	id, err := c.ParamsInt64("id")
	if err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный id")
	}
	row, err := h.svc.GetCategory(c.Context(), id)
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "ошибка БД")
	}
	if row == nil {
		return JSONError(c, fiber.StatusNotFound, "не найдено")
	}
	return c.JSON(row)
}

type createCategoryBody struct {
	Title     string `json:"title"`
	Slug      string `json:"slug"`
	SortOrder int    `json:"sort_order"`
	IsActive  bool   `json:"is_active"`
}

func (h *AdminCMSHandler) CreateCategory(c *fiber.Ctx) error {
	uid, ok := h.uid(c)
	if !ok {
		return JSONError(c, fiber.StatusUnauthorized, "нет пользователя")
	}
	var b createCategoryBody
	if err := c.BodyParser(&b); err != nil || b.Title == "" || b.Slug == "" {
		return JSONError(c, fiber.StatusBadRequest, "title и slug обязательны")
	}
	id, err := h.svc.CreateCategory(c.Context(), uid, b.Title, b.Slug, b.SortOrder, b.IsActive, h.ip(c))
	if errors.Is(err, service.ErrConflict) {
		return JSONError(c, fiber.StatusConflict, "slug уже занят")
	}
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "не удалось создать")
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"id": id})
}

type patchCategoryBody struct {
	Title     *string `json:"title"`
	Slug      *string `json:"slug"`
	SortOrder *int    `json:"sort_order"`
	IsActive  *bool   `json:"is_active"`
}

func (h *AdminCMSHandler) PatchCategory(c *fiber.Ctx) error {
	uid, ok := h.uid(c)
	if !ok {
		return JSONError(c, fiber.StatusUnauthorized, "нет пользователя")
	}
	id, err := c.ParamsInt64("id")
	if err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный id")
	}
	cur, err := h.svc.GetCategory(c.Context(), id)
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "ошибка БД")
	}
	if cur == nil {
		return JSONError(c, fiber.StatusNotFound, "не найдено")
	}
	var b patchCategoryBody
	if err := c.BodyParser(&b); err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный JSON")
	}
	title := cur.Title
	slug := cur.Slug
	sort := cur.SortOrder
	active := cur.IsActive
	if b.Title != nil {
		title = *b.Title
	}
	if b.Slug != nil {
		slug = *b.Slug
	}
	if b.SortOrder != nil {
		sort = *b.SortOrder
	}
	if b.IsActive != nil {
		active = *b.IsActive
	}
	if title == "" || slug == "" {
		return JSONError(c, fiber.StatusBadRequest, "title и slug не могут быть пустыми")
	}
	err = h.svc.UpdateCategory(c.Context(), uid, id, title, slug, sort, active, h.ip(c))
	if errors.Is(err, service.ErrNotFound) {
		return JSONError(c, fiber.StatusNotFound, "не найдено")
	}
	if errors.Is(err, service.ErrConflict) {
		return JSONError(c, fiber.StatusConflict, "slug уже занят")
	}
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "не удалось обновить")
	}
	return c.SendStatus(fiber.StatusNoContent)
}

func (h *AdminCMSHandler) DeleteCategory(c *fiber.Ctx) error {
	uid, ok := h.uid(c)
	if !ok {
		return JSONError(c, fiber.StatusUnauthorized, "нет пользователя")
	}
	id, err := c.ParamsInt64("id")
	if err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный id")
	}
	err = h.svc.DeleteCategory(c.Context(), uid, id, h.ip(c))
	if errors.Is(err, service.ErrNotFound) {
		return JSONError(c, fiber.StatusNotFound, "не найдено")
	}
	if errors.Is(err, service.ErrCategoryHasServices) {
		return JSONError(c, fiber.StatusConflict, "сначала перенеси или удали услуги в категории")
	}
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "не удалось удалить")
	}
	return c.SendStatus(fiber.StatusNoContent)
}

// --- services ---

func (h *AdminCMSHandler) ListServices(c *fiber.Ctx) error {
	list, err := h.svc.ListServices(c.Context())
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "ошибка БД")
	}
	return c.JSON(list)
}

func (h *AdminCMSHandler) GetService(c *fiber.Ctx) error {
	id, err := c.ParamsInt64("id")
	if err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный id")
	}
	row, err := h.svc.GetService(c.Context(), id)
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "ошибка БД")
	}
	if row == nil {
		return JSONError(c, fiber.StatusNotFound, "не найдено")
	}
	return c.JSON(row)
}

type createServiceBody struct {
	Title       string  `json:"title"`
	Description string  `json:"description"`
	Price       *string `json:"price"`
	Duration    *string `json:"duration"`
	CategoryID  int64   `json:"category_id"`
	IsActive    bool    `json:"is_active"`
}

func (h *AdminCMSHandler) CreateService(c *fiber.Ctx) error {
	uid, ok := h.uid(c)
	if !ok {
		return JSONError(c, fiber.StatusUnauthorized, "нет пользователя")
	}
	var b createServiceBody
	if err := c.BodyParser(&b); err != nil || b.Title == "" || b.CategoryID == 0 {
		return JSONError(c, fiber.StatusBadRequest, "title и category_id обязательны")
	}
	id, err := h.svc.CreateService(c.Context(), uid, b.Title, b.Description, b.Price, b.Duration, b.CategoryID, b.IsActive, h.ip(c))
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "не удалось создать услугу")
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"id": id})
}

type patchServiceBody struct {
	Title       *string `json:"title"`
	Description *string `json:"description"`
	Price       *string `json:"price"`
	Duration    *string `json:"duration"`
	CategoryID  *int64  `json:"category_id"`
	IsActive    *bool   `json:"is_active"`
}

func (h *AdminCMSHandler) PatchService(c *fiber.Ctx) error {
	uid, ok := h.uid(c)
	if !ok {
		return JSONError(c, fiber.StatusUnauthorized, "нет пользователя")
	}
	id, err := c.ParamsInt64("id")
	if err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный id")
	}
	cur, err := h.svc.GetService(c.Context(), id)
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "ошибка БД")
	}
	if cur == nil {
		return JSONError(c, fiber.StatusNotFound, "не найдено")
	}
	var b patchServiceBody
	if err := c.BodyParser(&b); err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный JSON")
	}
	title := cur.Title
	desc := cur.Description
	price := cur.Price
	dur := cur.Duration
	cat := cur.CategoryID
	active := cur.IsActive
	if b.Title != nil {
		title = *b.Title
	}
	if b.Description != nil {
		desc = *b.Description
	}
	if b.Price != nil {
		price = b.Price
	}
	if b.Duration != nil {
		dur = b.Duration
	}
	if b.CategoryID != nil {
		cat = *b.CategoryID
	}
	if b.IsActive != nil {
		active = *b.IsActive
	}
	if title == "" || cat == 0 {
		return JSONError(c, fiber.StatusBadRequest, "title и category_id обязательны")
	}
	err = h.svc.UpdateService(c.Context(), uid, id, title, desc, price, dur, cat, active, h.ip(c))
	if errors.Is(err, service.ErrNotFound) {
		return JSONError(c, fiber.StatusNotFound, "не найдено")
	}
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "не удалось обновить")
	}
	return c.SendStatus(fiber.StatusNoContent)
}

func (h *AdminCMSHandler) DeleteService(c *fiber.Ctx) error {
	uid, ok := h.uid(c)
	if !ok {
		return JSONError(c, fiber.StatusUnauthorized, "нет пользователя")
	}
	id, err := c.ParamsInt64("id")
	if err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный id")
	}
	err = h.svc.DeleteService(c.Context(), uid, id, h.ip(c))
	if errors.Is(err, service.ErrNotFound) {
		return JSONError(c, fiber.StatusNotFound, "не найдено")
	}
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "не удалось удалить")
	}
	return c.SendStatus(fiber.StatusNoContent)
}

// --- pages ---

func (h *AdminCMSHandler) ListPages(c *fiber.Ctx) error {
	list, err := h.svc.ListPages(c.Context())
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "ошибка БД")
	}
	return c.JSON(list)
}

func (h *AdminCMSHandler) GetPage(c *fiber.Ctx) error {
	id, err := c.ParamsInt64("id")
	if err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный id")
	}
	p, blocks, err := h.svc.GetPageWithBlocks(c.Context(), id)
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "ошибка БД")
	}
	if p == nil {
		return JSONError(c, fiber.StatusNotFound, "не найдено")
	}
	return c.JSON(fiber.Map{"page": p, "blocks": blocks})
}

type createPageBody struct {
	Slug           string  `json:"slug"`
	Title          string  `json:"title"`
	Status         string  `json:"status"`
	SeoTitle       *string `json:"seo_title"`
	SeoDescription *string `json:"seo_description"`
	OgImageURL     *string `json:"og_image_url"`
}

func (h *AdminCMSHandler) CreatePage(c *fiber.Ctx) error {
	uid, ok := h.uid(c)
	if !ok {
		return JSONError(c, fiber.StatusUnauthorized, "нет пользователя")
	}
	var b createPageBody
	if err := c.BodyParser(&b); err != nil || b.Slug == "" || b.Title == "" || b.Status == "" {
		return JSONError(c, fiber.StatusBadRequest, "slug, title, status обязательны")
	}
	id, err := h.svc.CreatePage(c.Context(), uid, b.Slug, b.Title, b.Status, b.SeoTitle, b.SeoDescription, b.OgImageURL, h.ip(c))
	if errors.Is(err, service.ErrInvalidStatus) {
		return JSONError(c, fiber.StatusBadRequest, "status: draft или published")
	}
	if errors.Is(err, service.ErrConflict) {
		return JSONError(c, fiber.StatusConflict, "slug уже занят")
	}
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "не удалось создать страницу")
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"id": id})
}

type patchPageBody struct {
	Slug           *string `json:"slug"`
	Title          *string `json:"title"`
	Status         *string `json:"status"`
	SeoTitle       *string `json:"seo_title"`
	SeoDescription *string `json:"seo_description"`
	OgImageURL     *string `json:"og_image_url"`
}

func (h *AdminCMSHandler) PatchPage(c *fiber.Ctx) error {
	uid, ok := h.uid(c)
	if !ok {
		return JSONError(c, fiber.StatusUnauthorized, "нет пользователя")
	}
	id, err := c.ParamsInt64("id")
	if err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный id")
	}
	cur, err := h.svc.GetPage(c.Context(), id)
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "ошибка БД")
	}
	if cur == nil {
		return JSONError(c, fiber.StatusNotFound, "не найдено")
	}
	var b patchPageBody
	if err := c.BodyParser(&b); err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный JSON")
	}
	slug := cur.Slug
	title := cur.Title
	status := cur.Status
	seoT := cur.SeoTitle
	seoD := cur.SeoDescription
	og := cur.OgImageURL
	if b.Slug != nil {
		slug = *b.Slug
	}
	if b.Title != nil {
		title = *b.Title
	}
	if b.Status != nil {
		status = *b.Status
	}
	if b.SeoTitle != nil {
		seoT = b.SeoTitle
	}
	if b.SeoDescription != nil {
		seoD = b.SeoDescription
	}
	if b.OgImageURL != nil {
		og = b.OgImageURL
	}
	if slug == "" || title == "" || status == "" {
		return JSONError(c, fiber.StatusBadRequest, "slug, title, status не могут быть пустыми")
	}
	err = h.svc.UpdatePage(c.Context(), uid, id, slug, title, status, seoT, seoD, og, h.ip(c))
	if errors.Is(err, service.ErrInvalidStatus) {
		return JSONError(c, fiber.StatusBadRequest, "status: draft или published")
	}
	if errors.Is(err, service.ErrNotFound) {
		return JSONError(c, fiber.StatusNotFound, "не найдено")
	}
	if errors.Is(err, service.ErrConflict) {
		return JSONError(c, fiber.StatusConflict, "slug уже занят")
	}
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "не удалось обновить")
	}
	return c.SendStatus(fiber.StatusNoContent)
}

func (h *AdminCMSHandler) DeletePage(c *fiber.Ctx) error {
	uid, ok := h.uid(c)
	if !ok {
		return JSONError(c, fiber.StatusUnauthorized, "нет пользователя")
	}
	id, err := c.ParamsInt64("id")
	if err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный id")
	}
	err = h.svc.DeletePage(c.Context(), uid, id, h.ip(c))
	if errors.Is(err, service.ErrNotFound) {
		return JSONError(c, fiber.StatusNotFound, "не найдено")
	}
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "не удалось удалить")
	}
	return c.SendStatus(fiber.StatusNoContent)
}

// --- blocks ---

func (h *AdminCMSHandler) ListBlocks(c *fiber.Ctx) error {
	pageID, err := c.ParamsInt64("pageId")
	if err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный pageId")
	}
	list, err := h.svc.ListBlocks(c.Context(), pageID)
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "ошибка БД")
	}
	return c.JSON(list)
}

type createBlockBody struct {
	BlockType string          `json:"block_type"`
	Data      json.RawMessage `json:"data"`
}

func (h *AdminCMSHandler) CreateBlock(c *fiber.Ctx) error {
	uid, ok := h.uid(c)
	if !ok {
		return JSONError(c, fiber.StatusUnauthorized, "нет пользователя")
	}
	pageID, err := c.ParamsInt64("pageId")
	if err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный pageId")
	}
	var b createBlockBody
	if err := c.BodyParser(&b); err != nil || b.BlockType == "" {
		return JSONError(c, fiber.StatusBadRequest, "block_type обязателен")
	}
	data := []byte(b.Data)
	if len(data) == 0 {
		data = []byte("{}")
	}
	if !json.Valid(data) {
		return JSONError(c, fiber.StatusBadRequest, "data должен быть JSON")
	}
	id, err := h.svc.CreateBlock(c.Context(), uid, pageID, b.BlockType, data, h.ip(c))
	if errors.Is(err, service.ErrNotFound) {
		return JSONError(c, fiber.StatusNotFound, "страница не найдена")
	}
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "не удалось создать блок")
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"id": id})
}

type patchBlockBody struct {
	BlockType *string         `json:"block_type"`
	SortOrder *int            `json:"sort_order"`
	Data      json.RawMessage `json:"data"`
}

func (h *AdminCMSHandler) PatchBlock(c *fiber.Ctx) error {
	uid, ok := h.uid(c)
	if !ok {
		return JSONError(c, fiber.StatusUnauthorized, "нет пользователя")
	}
	pageID, err := c.ParamsInt64("pageId")
	if err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный pageId")
	}
	blockID, err := c.ParamsInt64("blockId")
	if err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный blockId")
	}
	var b patchBlockBody
	if err := c.BodyParser(&b); err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный JSON")
	}
	// текущий блок
	bl, err := h.svc.GetBlockRaw(c.Context(), blockID, pageID)
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "ошибка БД")
	}
	if bl == nil {
		return JSONError(c, fiber.StatusNotFound, "блок не найден")
	}
	bt := bl.BlockType
	sort := bl.SortOrder
	data := bl.Data
	if b.BlockType != nil {
		bt = *b.BlockType
	}
	if b.SortOrder != nil {
		sort = *b.SortOrder
	}
	if len(b.Data) > 0 {
		if !json.Valid(b.Data) {
			return JSONError(c, fiber.StatusBadRequest, "data должен быть JSON")
		}
		data = []byte(b.Data)
	}
	if bt == "" {
		return JSONError(c, fiber.StatusBadRequest, "block_type не может быть пустым")
	}
	err = h.svc.UpdateBlock(c.Context(), uid, pageID, blockID, bt, sort, data, h.ip(c))
	if errors.Is(err, service.ErrNotFound) {
		return JSONError(c, fiber.StatusNotFound, "не найдено")
	}
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "не удалось обновить")
	}
	return c.SendStatus(fiber.StatusNoContent)
}

func (h *AdminCMSHandler) DeleteBlock(c *fiber.Ctx) error {
	uid, ok := h.uid(c)
	if !ok {
		return JSONError(c, fiber.StatusUnauthorized, "нет пользователя")
	}
	pageID, err := c.ParamsInt64("pageId")
	if err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный pageId")
	}
	blockID, err := c.ParamsInt64("blockId")
	if err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный blockId")
	}
	err = h.svc.DeleteBlock(c.Context(), uid, pageID, blockID, h.ip(c))
	if errors.Is(err, service.ErrNotFound) {
		return JSONError(c, fiber.StatusNotFound, "не найдено")
	}
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "не удалось удалить")
	}
	return c.SendStatus(fiber.StatusNoContent)
}

type reorderBlocksBody struct {
	IDs []int64 `json:"ids"`
}

func (h *AdminCMSHandler) ReorderBlocks(c *fiber.Ctx) error {
	uid, ok := h.uid(c)
	if !ok {
		return JSONError(c, fiber.StatusUnauthorized, "нет пользователя")
	}
	pageID, err := c.ParamsInt64("pageId")
	if err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный pageId")
	}
	var b reorderBlocksBody
	if err := c.BodyParser(&b); err != nil || len(b.IDs) == 0 {
		return JSONError(c, fiber.StatusBadRequest, "нужен массив ids")
	}
	err = h.svc.ReorderBlocks(c.Context(), uid, pageID, b.IDs, h.ip(c))
	if errors.Is(err, service.ErrNotFound) {
		return JSONError(c, fiber.StatusNotFound, "страница или блок не на странице")
	}
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "не удалось переупорядочить")
	}
	return c.SendStatus(fiber.StatusNoContent)
}
