package docs

import (
	_ "embed"

	"github.com/swaggo/swag"
)

//go:embed swagger.json
var swaggerJSON string

// SwaggerInfo регистрирует OpenAPI 2.0 для fiber-swagger (UI: /swagger/index.html).
var SwaggerInfo = &swag.Spec{
	Version:          "1.0",
	Host:             "localhost:8080",
	BasePath:         "/",
	Schemes:          []string{"http"},
	Title:            "AC Auto API",
	Description:      "Публичные эндпоинты без JWT. Staff (moderator|admin) и админка — заголовок Authorization: Bearer {access_token}.",
	InfoInstanceName: "swagger",
	SwaggerTemplate:  swaggerJSON,
	LeftDelim:        "{{",
	RightDelim:       "}}",
}

func init() {
	swag.Register(SwaggerInfo.InstanceName(), SwaggerInfo)
}
