package domain

// Имена ролей в БД (таблица roles).
const (
	RoleModerator = "moderator"
	RoleAdmin     = "admin"
)

// Guest — не JWT, публичные эндпоинты без токена.
