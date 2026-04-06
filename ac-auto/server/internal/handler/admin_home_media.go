package handler

import (
	"github.com/gofiber/fiber/v2"

	"github.com/IlyaKhar/ac-auto56/server/internal/service"
)

type AdminHomeMediaHandler struct {
	svc *service.AdminHomeMedia
}

func NewAdminHomeMediaHandler(svc *service.AdminHomeMedia) *AdminHomeMediaHandler {
	return &AdminHomeMediaHandler{svc: svc}
}

func (h *AdminHomeMediaHandler) uid(c *fiber.Ctx) (int64, bool) {
	v := c.Locals("user_id")
	id, ok := v.(int64)
	return id, ok
}

func (h *AdminHomeMediaHandler) Get(c *fiber.Ctx) error {
	v, err := h.svc.List(c.Context())
	if err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "ошибка БД")
	}
	return c.JSON(v)
}

type homeMediaPutBody struct {
	OurServices   []string `json:"our_services"`
	CarInspection []string `json:"car_inspection"`
	HappyOwners   []string `json:"happy_owners"`
	InsuranceServices []string `json:"insurance_services"`
}

func (h *AdminHomeMediaHandler) Put(c *fiber.Ctx) error {
	uid, ok := h.uid(c)
	if !ok {
		return JSONError(c, fiber.StatusUnauthorized, "нет пользователя")
	}
	var body homeMediaPutBody
	if err := c.BodyParser(&body); err != nil {
		return JSONError(c, fiber.StatusBadRequest, "невалидный JSON")
	}
	if len(body.OurServices) != 8 || len(body.CarInspection) != 6 || len(body.HappyOwners) != 9 || len(body.InsuranceServices) != 4 {
		return JSONError(c, fiber.StatusBadRequest, "ожидаются our_services(8), car_inspection(6), happy_owners(9), insurance_services(4)")
	}
	if err := h.svc.Put(c.Context(), uid, &service.HomeMediaView{
		OurServices:   body.OurServices,
		CarInspection: body.CarInspection,
		HappyOwners:   body.HappyOwners,
		InsuranceServices: body.InsuranceServices,
	}, c.IP()); err != nil {
		return JSONError(c, fiber.StatusInternalServerError, "ошибка БД")
	}
	return c.SendStatus(fiber.StatusNoContent)
}
