package handler

import (
	"errors"

	"github.com/gofiber/fiber/v2"

	"github.com/IlyaKhar/ac-auto56/server/internal/service"
)

type AuthHandler struct {
	svc *service.AuthService
}

func NewAuthHandler(svc *service.AuthService) *AuthHandler {
	return &AuthHandler{svc: svc}
}

type loginBody struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (h *AuthHandler) Login(c *fiber.Ctx) error {
	var b loginBody
	if err := c.BodyParser(&b); err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректное тело запроса")
	}
	if b.Email == "" || b.Password == "" {
		return JSONError(c, fiber.StatusBadRequest, "email и пароль обязательны")
	}
	access, refresh, err := h.svc.Login(c.Context(), b.Email, b.Password)
	if errors.Is(err, service.ErrInvalidCredentials) {
		return JSONError(c, fiber.StatusUnauthorized, "неверный email или пароль")
	}
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "внутренняя ошибка")
	}
	return c.JSON(fiber.Map{
		"access_token":  access,
		"refresh_token": refresh,
		"token_type":    "Bearer",
		"expires_in":    int(h.svc.AccessSeconds()),
	})
}

type refreshBody struct {
	RefreshToken string `json:"refresh_token"`
}

func (h *AuthHandler) Refresh(c *fiber.Ctx) error {
	var b refreshBody
	if err := c.BodyParser(&b); err != nil {
		return JSONError(c, fiber.StatusBadRequest, "некорректное тело запроса")
	}
	access, refresh, err := h.svc.Refresh(c.Context(), b.RefreshToken)
	if errors.Is(err, service.ErrInvalidRefresh) {
		return JSONError(c, fiber.StatusUnauthorized, "невалидный refresh token")
	}
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "внутренняя ошибка")
	}
	return c.JSON(fiber.Map{
		"access_token":  access,
		"refresh_token": refresh,
		"token_type":    "Bearer",
		"expires_in":    int(h.svc.AccessSeconds()),
	})
}

// Me — smoke-check JWT (user_id + role из токена).
func (h *AuthHandler) Me(c *fiber.Ctx) error {
	uid, ok := c.Locals("user_id").(int64)
	if !ok {
		return JSONError(c, fiber.StatusUnauthorized, "нет контекста пользователя")
	}
	role, _ := c.Locals("role").(string)
	return c.JSON(fiber.Map{
		"user_id": uid,
		"role":    role,
	})
}

func (h *AuthHandler) Logout(c *fiber.Ctx) error {
	var b refreshBody
	_ = c.BodyParser(&b)
	if b.RefreshToken != "" {
		_ = h.svc.Logout(c.Context(), b.RefreshToken)
	}
	return c.SendStatus(fiber.StatusNoContent)
}
