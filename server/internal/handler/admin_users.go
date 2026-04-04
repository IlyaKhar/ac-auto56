package handler

import (
	"errors"

	"github.com/gofiber/fiber/v2"

	"github.com/IlyaKhar/ac-auto56/server/internal/service"
)

type AdminUsersHandler struct {
	svc *service.AdminUsersService
}

func NewAdminUsersHandler(svc *service.AdminUsersService) *AdminUsersHandler {
	return &AdminUsersHandler{svc: svc}
}

func (h *AdminUsersHandler) uid(c *fiber.Ctx) (int64, bool) {
	v := c.Locals("user_id")
	id, ok := v.(int64)
	return id, ok
}

func (h *AdminUsersHandler) ip(c *fiber.Ctx) string {
	return c.IP()
}

func (h *AdminUsersHandler) ListRoles(c *fiber.Ctx) error {
	list, err := h.svc.ListRoles(c.Context())
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "ошибка БД")
	}
	return c.JSON(list)
}

func (h *AdminUsersHandler) ListUsers(c *fiber.Ctx) error {
	list, err := h.svc.ListUsers(c.Context())
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "ошибка БД")
	}
	return c.JSON(list)
}

func (h *AdminUsersHandler) GetUser(c *fiber.Ctx) error {
	id, err := c.ParamsInt64("id")
	if err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный id")
	}
	u, err := h.svc.GetUser(c.Context(), id)
	if errors.Is(err, service.ErrUserNotFound) {
		return JSONError(c, fiber.StatusNotFound, "не найдено")
	}
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "ошибка БД")
	}
	return c.JSON(u)
}

type createUserBody struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

func (h *AdminUsersHandler) CreateUser(c *fiber.Ctx) error {
	uid, ok := h.uid(c)
	if !ok {
		return JSONError(c, fiber.StatusUnauthorized, "нет пользователя")
	}
	var b createUserBody
	if err := c.BodyParser(&b); err != nil || b.Email == "" || b.Password == "" || b.Role == "" {
		return JSONError(c, fiber.StatusBadRequest, "email, password и role обязательны")
	}
	id, err := h.svc.CreateUser(c.Context(), uid, b.Email, b.Password, b.Role, h.ip(c))
	if errors.Is(err, service.ErrWeakPassword) {
		return JSONError(c, fiber.StatusBadRequest, "пароль минимум 8 символов")
	}
	if errors.Is(err, service.ErrInvalidUserRole) {
		return JSONError(c, fiber.StatusBadRequest, "role: moderator или admin")
	}
	if errors.Is(err, service.ErrEmailConflictUser) {
		return JSONError(c, fiber.StatusConflict, "email уже занят")
	}
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "не удалось создать")
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"id": id})
}

type patchUserBody struct {
	Email    *string `json:"email"`
	Role     *string `json:"role"`
	IsActive *bool   `json:"is_active"`
}

func (h *AdminUsersHandler) PatchUser(c *fiber.Ctx) error {
	uid, ok := h.uid(c)
	if !ok {
		return JSONError(c, fiber.StatusUnauthorized, "нет пользователя")
	}
	id, err := c.ParamsInt64("id")
	if err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный id")
	}
	var b patchUserBody
	if err := c.BodyParser(&b); err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный JSON")
	}
	err = h.svc.PatchUser(c.Context(), uid, id, service.PatchUserInput{
		Email: b.Email, RoleName: b.Role, IsActive: b.IsActive,
	}, h.ip(c))
	if errors.Is(err, service.ErrUserNotFound) {
		return JSONError(c, fiber.StatusNotFound, "не найдено")
	}
	if errors.Is(err, service.ErrInvalidUserRole) {
		return JSONError(c, fiber.StatusBadRequest, "role: moderator или admin")
	}
	if errors.Is(err, service.ErrEmailConflictUser) {
		return JSONError(c, fiber.StatusConflict, "email уже занят")
	}
	if errors.Is(err, service.ErrValidation) {
		return JSONError(c, fiber.StatusBadRequest, "email не может быть пустым")
	}
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "не удалось обновить")
	}
	return c.SendStatus(fiber.StatusNoContent)
}

type resetPasswordBody struct {
	Password string `json:"password"`
}

func (h *AdminUsersHandler) ResetPassword(c *fiber.Ctx) error {
	uid, ok := h.uid(c)
	if !ok {
		return JSONError(c, fiber.StatusUnauthorized, "нет пользователя")
	}
	id, err := c.ParamsInt64("id")
	if err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректный id")
	}
	var b resetPasswordBody
	if err := c.BodyParser(&b); err != nil || b.Password == "" {
		return JSONError(c, fiber.StatusBadRequest, "password обязателен")
	}
	err = h.svc.ResetPassword(c.Context(), uid, id, b.Password, h.ip(c))
	if errors.Is(err, service.ErrUserNotFound) {
		return JSONError(c, fiber.StatusNotFound, "не найдено")
	}
	if errors.Is(err, service.ErrWeakPassword) {
		return JSONError(c, fiber.StatusBadRequest, "пароль минимум 8 символов")
	}
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "не удалось сменить пароль")
	}
	return c.SendStatus(fiber.StatusNoContent)
}
