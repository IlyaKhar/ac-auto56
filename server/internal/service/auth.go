package service

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"errors"
	"time"

	"golang.org/x/crypto/bcrypt"

	"github.com/IlyaKhar/ac-auto56/server/internal/appjwt"
	"github.com/IlyaKhar/ac-auto56/server/internal/repository"
)

var (
	ErrInvalidCredentials = errors.New("неверные учётные данные")
	ErrInvalidRefresh     = errors.New("невалидный refresh token")
)

type AuthService struct {
	users   *repository.UserRepository
	refresh *repository.RefreshTokenRepository
	jwt     *appjwt.Generator
	access  time.Duration
	refreshTTL time.Duration
}

func NewAuthService(
	users *repository.UserRepository,
	refresh *repository.RefreshTokenRepository,
	jwtGen *appjwt.Generator,
	accessTTL, refreshTTL time.Duration,
) *AuthService {
	return &AuthService{
		users:      users,
		refresh:    refresh,
		jwt:        jwtGen,
		access:     accessTTL,
		refreshTTL: refreshTTL,
	}
}

func (s *AuthService) Login(ctx context.Context, email, password string) (accessToken, refreshPlain string, err error) {
	u, err := s.users.GetByEmail(ctx, email)
	if err != nil {
		return "", "", err
	}
	if u == nil || !u.IsActive {
		return "", "", ErrInvalidCredentials
	}
	if err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(password)); err != nil {
		return "", "", ErrInvalidCredentials
	}

	accessToken, err = s.jwt.CreateAccess(u.ID, u.RoleName, s.access)
	if err != nil {
		return "", "", err
	}

	plain, hash, err := newRefreshPlainAndHash()
	if err != nil {
		return "", "", err
	}
	exp := time.Now().UTC().Add(s.refreshTTL)
	if err := s.refresh.Insert(ctx, u.ID, hash, exp); err != nil {
		return "", "", err
	}
	return accessToken, plain, nil
}

func (s *AuthService) Refresh(ctx context.Context, refreshPlain string) (accessToken, newRefreshPlain string, err error) {
	if refreshPlain == "" {
		return "", "", ErrInvalidRefresh
	}
	hash := hashRefresh(refreshPlain)
	rt, err := s.refresh.FindValidByHash(ctx, hash)
	if err != nil {
		return "", "", err
	}
	if rt == nil {
		return "", "", ErrInvalidRefresh
	}
	if err := s.refresh.RevokeByID(ctx, rt.ID); err != nil {
		return "", "", err
	}

	u, err := s.users.GetByID(ctx, rt.UserID)
	if err != nil {
		return "", "", err
	}
	if u == nil || !u.IsActive {
		return "", "", ErrInvalidRefresh
	}

	accessToken, err = s.jwt.CreateAccess(u.ID, u.RoleName, s.access)
	if err != nil {
		return "", "", err
	}

	plain, h, err := newRefreshPlainAndHash()
	if err != nil {
		return "", "", err
	}
	exp := time.Now().UTC().Add(s.refreshTTL)
	if err := s.refresh.Insert(ctx, u.ID, h, exp); err != nil {
		return "", "", err
	}
	return accessToken, plain, nil
}

func (s *AuthService) Logout(ctx context.Context, refreshPlain string) error {
	if refreshPlain == "" {
		return nil
	}
	return s.refresh.RevokeByHash(ctx, hashRefresh(refreshPlain))
}

func newRefreshPlainAndHash() (plain string, hash string, err error) {
	var b [32]byte
	if _, err := rand.Read(b[:]); err != nil {
		return "", "", err
	}
	plain = base64.RawURLEncoding.EncodeToString(b[:])
	return plain, hashRefresh(plain), nil
}

func hashRefresh(plain string) string {
	sum := sha256.Sum256([]byte(plain))
	return hex.EncodeToString(sum[:])
}

// AccessSeconds — длительность access JWT в секундах (для ответа login/refresh).
func (s *AuthService) AccessSeconds() int64 {
	return int64(s.access / time.Second)
}
