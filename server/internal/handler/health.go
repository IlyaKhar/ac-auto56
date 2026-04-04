package handler

import "github.com/gofiber/fiber/v2"

// Health отдаёт 200, если процесс жив (для Docker healthcheck).
func Health(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"status": "ok",
	})
}
