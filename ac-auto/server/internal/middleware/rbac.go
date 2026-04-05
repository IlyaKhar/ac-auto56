package middleware

import (
	"github.com/gofiber/fiber/v2"
)

// RequireRoles — доступ только для перечисленных ролей (после RequireAuth).
func RequireRoles(allowed ...string) fiber.Handler {
	allow := make(map[string]struct{}, len(allowed))
	for _, a := range allowed {
		allow[a] = struct{}{}
	}
	return func(c *fiber.Ctx) error {
		role, _ := c.Locals("role").(string)
		if _, ok := allow[role]; !ok {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "недостаточно прав"})
		}
		return c.Next()
	}
}
