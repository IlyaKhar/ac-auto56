package router

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	swagger "github.com/swaggo/fiber-swagger"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/IlyaKhar/ac-auto56/server/internal/appjwt"
	"github.com/IlyaKhar/ac-auto56/server/internal/config"
	"github.com/IlyaKhar/ac-auto56/server/internal/domain"
	"github.com/IlyaKhar/ac-auto56/server/internal/handler"
	"github.com/IlyaKhar/ac-auto56/server/internal/middleware"
	"github.com/IlyaKhar/ac-auto56/server/internal/repository"
	"github.com/IlyaKhar/ac-auto56/server/internal/service"
	"github.com/IlyaKhar/ac-auto56/server/internal/telegram"
)

// New — Fiber + маршруты v1 (auth, заявки, health).
func New(cfg *config.Config, pool *pgxpool.Pool) *fiber.App {
	userRepo := repository.NewUserRepository(pool)
	refreshRepo := repository.NewRefreshTokenRepository(pool)
	appRepo := repository.NewApplicationRepository(pool)
	catRepo := repository.NewServiceCategoryRepository(pool)
	svcRepo := repository.NewCatalogServiceRepository(pool)
	pageRepo := repository.NewPageRepository(pool)
	blockRepo := repository.NewBlockRepository(pool)
	auditRepo := repository.NewAuditRepository(pool)
	menuRepo := repository.NewMenuRepository(pool)
	footerRepo := repository.NewFooterRepository(pool)
	vehicleRepo := repository.NewVehicleRepository(pool)
	salonAddrRepo := repository.NewSalonAddressRepository(pool)
	aboutGalleryRepo := repository.NewAboutGalleryRepository(pool)

	jwtGen := appjwt.NewGenerator(cfg.JWTSecret)
	accessTTL := time.Duration(cfg.JWTAccessMinutes) * time.Minute
	refreshTTL := time.Duration(cfg.JWTRefreshDays) * 24 * time.Hour

	authSvc := service.NewAuthService(userRepo, refreshRepo, jwtGen, accessTTL, refreshTTL)
	tgClient := telegram.New(cfg.TelegramBotToken, cfg.TelegramChatID)
	appSvc := service.NewApplicationService(cfg, appRepo, tgClient)
	appStaffSvc := service.NewApplicationStaffService(appRepo, userRepo)
	publicCatalog := service.NewPublicCatalog(catRepo, svcRepo, pageRepo, blockRepo, menuRepo, footerRepo, vehicleRepo, salonAddrRepo, aboutGalleryRepo)
	adminCMS := service.NewAdminCMS(catRepo, svcRepo, pageRepo, blockRepo, auditRepo)
	adminVehicleSvc := service.NewAdminVehicle(vehicleRepo, auditRepo)
	adminSalonSvc := service.NewAdminSalonAddress(salonAddrRepo, auditRepo)
	adminAboutGallerySvc := service.NewAdminAboutGallery(aboutGalleryRepo, auditRepo)
	adminUsersSvc := service.NewAdminUsersService(userRepo, auditRepo)
	adminLayoutSvc := service.NewAdminLayoutService(menuRepo, footerRepo, pageRepo, auditRepo)

	authH := handler.NewAuthHandler(authSvc)
	appH := handler.NewApplicationHandler(appSvc)
	appStaffH := handler.NewApplicationStaffHandler(appStaffSvc)
	catH := handler.NewCatalogHandler(publicCatalog)
	adminH := handler.NewAdminCMSHandler(adminCMS)
	adminVehicleH := handler.NewAdminVehicleHandler(adminVehicleSvc)
	adminSalonH := handler.NewAdminSalonAddressHandler(adminSalonSvc)
	adminAboutGalleryH := handler.NewAdminAboutGalleryHandler(adminAboutGallerySvc)
	usersH := handler.NewAdminUsersHandler(adminUsersSvc)
	layoutH := handler.NewAdminLayoutHandler(adminLayoutSvc)

	app := fiber.New(fiber.Config{
		DisableStartupMessage: false,
	})

	app.Use(recover.New())
	app.Use(logger.New())
	// Глобальный лимит по IP
	app.Use(limiter.New(limiter.Config{
		Max:        300,
		Expiration: time.Minute,
		KeyGenerator: func(c *fiber.Ctx) string {
			return c.IP()
		},
	}))

	if cfg.CORSAllowOrigin != "" {
		app.Use(cors.New(cors.Config{
			AllowOrigins:     cfg.CORSAllowOrigin,
			AllowMethods:     "GET,POST,PUT,PATCH,DELETE,OPTIONS",
			AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
			AllowCredentials: true,
		}))
	}

	app.Get("/health", handler.Health)
	// Swagger UI: /swagger/index.html
	app.Get("/swagger/*", swagger.WrapHandler)

	v1 := app.Group("/api/v1")
	v1.Get("/health", handler.Health)

	// Публичный каталог (без JWT)
	v1.Get("/service-categories", catH.ListCategories)
	v1.Get("/services", catH.ListServices)
	v1.Get("/services/:id", catH.GetService)
	v1.Get("/pages/:slug", catH.GetPublishedPage)
	v1.Get("/menu-items", catH.ListMenuPublic)
	v1.Get("/footer-sections", catH.ListFooterPublic)
	v1.Get("/vehicles", catH.ListVehicles)
	v1.Get("/vehicles/:id", catH.GetVehicle)
	v1.Get("/salon-locations", catH.GetSalonLocations)
	v1.Get("/about-gallery", catH.GetAboutGallery)

	// Публичная авторизация — отдельный лимит на /auth
	authLimiter := limiter.New(limiter.Config{
		Max:        40,
		Expiration: time.Minute,
		KeyGenerator: func(c *fiber.Ctx) string {
			return c.IP()
		},
	})
	authPublic := v1.Group("/auth", authLimiter)
	authPublic.Post("/login", authH.Login)
	authPublic.Post("/refresh", authH.Refresh)
	authPublic.Post("/logout", authH.Logout)

	authPrivate := v1.Group("/auth", middleware.RequireAuth(jwtGen))
	authPrivate.Get("/me", authH.Me)

	// Публичные заявки — свой лимит
	appLimiter := limiter.New(limiter.Config{
		Max:        40,
		Expiration: 5 * time.Minute,
		KeyGenerator: func(c *fiber.Ctx) string {
			return c.IP()
		},
	})
	apps := v1.Group("/applications", appLimiter)
	apps.Post("/", appH.Create)

	// Заявки для moderator / admin
	staff := v1.Group("/staff",
		middleware.RequireAuth(jwtGen),
		middleware.RequireRoles(domain.RoleModerator, domain.RoleAdmin),
	)
	staff.Get("/ping", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"staff": true})
	})
	staff.Get("/applications", appStaffH.List)
	staff.Get("/applications/:id", appStaffH.Get)
	staff.Patch("/applications/:id", appStaffH.Patch)
	staff.Post("/applications/:id/comments", appStaffH.AddComment)
	staff.Get("/users", appStaffH.ListStaffUsers)
	v1.Get("/admin/ping",
		middleware.RequireAuth(jwtGen),
		middleware.RequireRoles(domain.RoleAdmin),
		func(c *fiber.Ctx) error {
			return c.JSON(fiber.Map{"admin": true})
		},
	)

	// Админский CRUD контента (только admin)
	admin := v1.Group("/admin",
		middleware.RequireAuth(jwtGen),
		middleware.RequireRoles(domain.RoleAdmin),
	)
	admin.Get("/service-categories", adminH.ListCategories)
	admin.Post("/service-categories", adminH.CreateCategory)
	admin.Get("/service-categories/:id", adminH.GetCategory)
	admin.Patch("/service-categories/:id", adminH.PatchCategory)
	admin.Delete("/service-categories/:id", adminH.DeleteCategory)

	admin.Get("/services", adminH.ListServices)
	admin.Post("/services", adminH.CreateService)
	admin.Get("/services/:id", adminH.GetService)
	admin.Patch("/services/:id", adminH.PatchService)
	admin.Delete("/services/:id", adminH.DeleteService)

	admin.Get("/vehicles", adminVehicleH.List)
	admin.Post("/vehicles", adminVehicleH.Create)
	admin.Get("/vehicles/:id", adminVehicleH.Get)
	admin.Patch("/vehicles/:id", adminVehicleH.Patch)
	admin.Delete("/vehicles/:id", adminVehicleH.Delete)

	admin.Get("/salon-locations", adminSalonH.GetBundle)
	admin.Patch("/salon-locations/settings", adminSalonH.PatchSettings)
	admin.Post("/salon-locations/addresses/reorder", adminSalonH.Reorder)
	admin.Post("/salon-locations/addresses", adminSalonH.CreateAddress)
	admin.Patch("/salon-locations/addresses/:id", adminSalonH.PatchAddress)
	admin.Delete("/salon-locations/addresses/:id", adminSalonH.DeleteAddress)

	admin.Get("/about-gallery", adminAboutGalleryH.Get)
	admin.Put("/about-gallery", adminAboutGalleryH.Put)

	admin.Get("/pages", adminH.ListPages)
	admin.Post("/pages", adminH.CreatePage)
	admin.Get("/pages/:id", adminH.GetPage)
	admin.Patch("/pages/:id", adminH.PatchPage)
	admin.Delete("/pages/:id", adminH.DeletePage)

	admin.Post("/pages/:pageId/blocks/reorder", adminH.ReorderBlocks)
	admin.Get("/pages/:pageId/blocks", adminH.ListBlocks)
	admin.Post("/pages/:pageId/blocks", adminH.CreateBlock)
	admin.Patch("/pages/:pageId/blocks/:blockId", adminH.PatchBlock)
	admin.Delete("/pages/:pageId/blocks/:blockId", adminH.DeleteBlock)

	admin.Get("/roles", usersH.ListRoles)
	admin.Get("/users", usersH.ListUsers)
	admin.Post("/users", usersH.CreateUser)
	admin.Get("/users/:id", usersH.GetUser)
	admin.Patch("/users/:id", usersH.PatchUser)
	admin.Post("/users/:id/reset-password", usersH.ResetPassword)

	admin.Post("/menu-items/reorder", layoutH.ReorderMenu)
	admin.Get("/menu-items", layoutH.ListMenu)
	admin.Post("/menu-items", layoutH.CreateMenu)
	admin.Get("/menu-items/:id", layoutH.GetMenu)
	admin.Patch("/menu-items/:id", layoutH.PatchMenu)
	admin.Delete("/menu-items/:id", layoutH.DeleteMenu)

	admin.Post("/footer-sections/reorder", layoutH.ReorderFooter)
	admin.Get("/footer-sections", layoutH.ListFooter)
	admin.Post("/footer-sections", layoutH.CreateFooter)
	admin.Get("/footer-sections/:id", layoutH.GetFooter)
	admin.Patch("/footer-sections/:id", layoutH.PatchFooter)
	admin.Delete("/footer-sections/:id", layoutH.DeleteFooter)

	return app
}
