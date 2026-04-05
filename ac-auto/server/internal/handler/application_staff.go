package handler

import (
	"errors"
	"strconv"

	"github.com/gofiber/fiber/v2"

	"github.com/IlyaKhar/ac-auto56/server/internal/repository"
	"github.com/IlyaKhar/ac-auto56/server/internal/service"
)

type ApplicationStaffHandler struct {
	svc *service.ApplicationStaffService
}

func NewApplicationStaffHandler(svc *service.ApplicationStaffService) *ApplicationStaffHandler {
	return &ApplicationStaffHandler{svc: svc}
}

func (h *ApplicationStaffHandler) ListStaffUsers(c *fiber.Ctx) error {
	list, err := h.svc.ListStaffRefs(c.Context())
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "ошибка БД")
	}
	return c.JSON(list)
}

func (h *ApplicationStaffHandler) List(c *fiber.Ctx) error {
	f := repository.StaffApplicationFilter{}
	if v := c.Query("status"); v != "" {
		f.Status = &v
	}
	if v := c.Query("type"); v != "" {
		f.Type = &v
	}
	if v := c.Query("assigned_manager_id"); v != "" {
		n, err := strconv.ParseInt(v, 10, 64)
		if err != nil {
			return JSONError(c, fiber.StatusBadRequest, "некорректный assigned_manager_id")
		}
		f.AssignedManagerID = &n
	}
	if v := c.Query("limit"); v != "" {
		n, err := strconv.Atoi(v)
		if err != nil || n < 1 {
			return JSONError(c, fiber.StatusBadRequest, "некорректный limit")
		}
		f.Limit = n
	}
	if v := c.Query("offset"); v != "" {
		n, err := strconv.Atoi(v)
		if err != nil || n < 0 {
			return JSONError(c, fiber.StatusBadRequest, "некорректный offset")
		}
		f.Offset = n
	}
	list, err := h.svc.ListApplications(c.Context(), f)
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "ошибка БД")
	}
	return c.JSON(list)
}

func (h *ApplicationStaffHandler) Get(c *fiber.Ctx) error {
	id, err := parsePathInt64(c,"id")
	if err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный id")
	}
	d, err := h.svc.GetDetail(c.Context(), id)
	if errors.Is(err, service.ErrApplicationNotFound) {
		return JSONError(c, fiber.StatusNotFound, "заявка не найдена")
	}
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "ошибка БД")
	}
	return c.JSON(d)
}

type patchApplicationBody struct {
	Status            *string `json:"status"`
	AssignedManagerID *int64  `json:"assigned_manager_id"`
	ClearAssigned     *bool   `json:"clear_assigned"`
}

func (h *ApplicationStaffHandler) Patch(c *fiber.Ctx) error {
	uid, ok := c.Locals("user_id").(int64)
	if !ok {
		return JSONError(c, fiber.StatusUnauthorized, "нет пользователя")
	}
	id, err := parsePathInt64(c,"id")
	if err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный id")
	}
	var b patchApplicationBody
	if err := c.BodyParser(&b); err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный JSON")
	}
	p := service.PatchStaffApplication{
		Status:            b.Status,
		AssignedManagerID: b.AssignedManagerID,
		ClearAssigned:     b.ClearAssigned != nil && *b.ClearAssigned,
	}
	err = h.svc.PatchApplication(c.Context(), uid, id, p)
	if errors.Is(err, service.ErrApplicationNotFound) {
		return JSONError(c, fiber.StatusNotFound, "заявка не найдена")
	}
	if errors.Is(err, service.ErrInvalidAppStatus) {
		return JSONError(c, fiber.StatusBadRequest, "статус: new, in_progress, completed, rejected")
	}
	if errors.Is(err, service.ErrAssigneeNotStaff) {
		return JSONError(c, fiber.StatusBadRequest, "нельзя назначить этого пользователя")
	}
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "не удалось обновить")
	}
	return c.SendStatus(fiber.StatusNoContent)
}

type addCommentBody struct {
	Body string `json:"body"`
}

func (h *ApplicationStaffHandler) AddComment(c *fiber.Ctx) error {
	uid, ok := c.Locals("user_id").(int64)
	if !ok {
		return JSONError(c, fiber.StatusUnauthorized, "нет пользователя")
	}
	id, err := parsePathInt64(c,"id")
	if err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный id")
	}
	var b addCommentBody
	if err := c.BodyParser(&b); err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный JSON")
	}
	cid, err := h.svc.AddComment(c.Context(), uid, id, b.Body)
	if errors.Is(err, service.ErrApplicationNotFound) {
		return JSONError(c, fiber.StatusNotFound, "заявка не найдена")
	}
	if errors.Is(err, service.ErrEmptyComment) {
		return JSONError(c, fiber.StatusBadRequest, "текст комментария обязателен")
	}
	if errors.Is(err, service.ErrAssigneeNotStaff) {
		return JSONError(c, fiber.StatusForbidden, "нет прав")
	}
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "не удалось сохранить комментарий")
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"id": cid})
}
