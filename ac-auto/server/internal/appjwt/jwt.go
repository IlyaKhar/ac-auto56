package appjwt

import (
	"errors"
	"time"

	jwt "github.com/golang-jwt/jwt/v5"
)

var ErrInvalidToken = errors.New("невалидный access token")

// AccessClaims — полезная нагрузка access JWT (роль для RBAC).
type AccessClaims struct {
	UserID int64  `json:"uid"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

// Generator подписывает и парсит access-токены (HS256).
type Generator struct {
	secret []byte
}

func NewGenerator(secret string) *Generator {
	return &Generator{secret: []byte(secret)}
}

func (g *Generator) CreateAccess(userID int64, role string, ttl time.Duration) (string, error) {
	now := time.Now()
	claims := AccessClaims{
		UserID: userID,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(now.Add(ttl)),
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
		},
	}
	t := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return t.SignedString(g.secret)
}

func (g *Generator) ParseAccess(tokenStr string) (*AccessClaims, error) {
	t, err := jwt.ParseWithClaims(tokenStr, &AccessClaims{}, func(t *jwt.Token) (any, error) {
		return g.secret, nil
	})
	if err != nil {
		return nil, ErrInvalidToken
	}
	claims, ok := t.Claims.(*AccessClaims)
	if !ok || !t.Valid {
		return nil, ErrInvalidToken
	}
	return claims, nil
}
