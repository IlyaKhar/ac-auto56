package handler

import "github.com/gofiber/fiber/v2"

// JSONError — единый формат ошибки API.
func JSONError(c *fiber.Ctx, status int, msg string) error {
	return c.Status(status).JSON(fiber.Map{"error": msg})
}
