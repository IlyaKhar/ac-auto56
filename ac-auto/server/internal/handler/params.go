package handler

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
)

// parsePathInt64 — int64 из path-параметра; в Fiber v2 есть только ParamsInt, без int64.
func parsePathInt64(c *fiber.Ctx, key string) (int64, error) {
	return strconv.ParseInt(c.Params(key), 10, 64)
}
