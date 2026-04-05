package service

import (
	"context"
	"errors"
	"strings"

	"github.com/jackc/pgx/v5"
	"golang.org/x/crypto/bcrypt"

	"github.com/IlyaKhar/ac-auto56/server/internal/domain"
	"github.com/IlyaKhar/ac-auto56/server/internal/repository"
)

var (
	ErrUserNotFound      = errors.New("пользователь не найден")
	ErrInvalidUserRole   = errors.New("роль только moderator или admin")
	ErrWeakPassword      = errors.New("пароль слишком короткий (минимум 8 символов)")
	ErrEmailConflictUser = errors.New("email уже занят")
)

// AdminUsersService — управление пользователями админки (только admin).
type AdminUsersService struct {
	users *repository.UserRepository
	audit *repository.AuditRepository
}

func NewAdminUsersService(users *repository.UserRepository, audit *repository.AuditRepository) *AdminUsersService {
	return &AdminUsersService{users: users, audit: audit}
}

func parseStaffRoleID(roleName string) (int16, error) {
	switch strings.ToLower(strings.TrimSpace(roleName)) {
	case domain.RoleModerator:
		return 1, nil
	case domain.RoleAdmin:
		return 2, nil
	default:
		return 0, ErrInvalidUserRole
	}
}

func (s *AdminUsersService) ListRoles(ctx context.Context) ([]repository.Role, error) {
	return s.users.ListRoles(ctx)
}

func (s *AdminUsersService) ListUsers(ctx context.Context) ([]repository.UserPublic, error) {
	return s.users.ListUsersPublic(ctx)
}

func (s *AdminUsersService) GetUser(ctx context.Context, id int64) (*repository.UserPublic, error) {
	u, err := s.users.GetUserPublic(ctx, id)
	if err != nil {
		return nil, err
	}
	if u == nil {
		return nil, ErrUserNotFound
	}
	return u, nil
}

func (s *AdminUsersService) CreateUser(ctx context.Context, actorID int64, email, password, roleName, ip string) (int64, error) {
	email = strings.TrimSpace(email)
	if len(password) < 8 {
		return 0, ErrWeakPassword
	}
	rid, err := parseStaffRoleID(roleName)
	if err != nil {
		return 0, err
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return 0, err
	}
	id, err := s.users.CreateUser(ctx, email, string(hash), rid)
	if errors.Is(err, repository.ErrEmailExists) {
		return 0, ErrEmailConflictUser
	}
	if err != nil {
		return 0, err
	}
	eid := id
	s.auditLog(ctx, actorID, "create", "user", &eid, map[string]any{"email": email, "role_id": rid}, ip)
	return id, nil
}

type PatchUserInput struct {
	Email    *string
	RoleName *string
	IsActive *bool
}

func (s *AdminUsersService) PatchUser(ctx context.Context, actorID, id int64, p PatchUserInput, ip string) error {
	cur, err := s.users.GetUserPublic(ctx, id)
	if err != nil {
		return err
	}
	if cur == nil {
		return ErrUserNotFound
	}
	email := cur.Email
	roleID := cur.RoleID
	active := cur.IsActive
	if p.Email != nil {
		email = strings.TrimSpace(*p.Email)
	}
	if p.RoleName != nil {
		rid, err := parseStaffRoleID(*p.RoleName)
		if err != nil {
			return err
		}
		roleID = rid
	}
	if p.IsActive != nil {
		active = *p.IsActive
	}
	if email == "" {
		return ErrValidation
	}
	err = s.users.UpdateUserFull(ctx, id, email, roleID, active)
	if errors.Is(err, repository.ErrEmailExists) {
		return ErrEmailConflictUser
	}
	if errors.Is(err, pgx.ErrNoRows) {
		return ErrUserNotFound
	}
	if err != nil {
		return err
	}
	s.auditLog(ctx, actorID, "update", "user", &id, nil, ip)
	return nil
}

func (s *AdminUsersService) ResetPassword(ctx context.Context, actorID, id int64, newPassword, ip string) error {
	if len(newPassword) < 8 {
		return ErrWeakPassword
	}
	u, err := s.users.GetUserPublic(ctx, id)
	if err != nil {
		return err
	}
	if u == nil {
		return ErrUserNotFound
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	err = s.users.SetUserPasswordHash(ctx, id, string(hash))
	if errors.Is(err, pgx.ErrNoRows) {
		return ErrUserNotFound
	}
	if err != nil {
		return err
	}
	s.auditLog(ctx, actorID, "reset_password", "user", &id, nil, ip)
	return nil
}

func (s *AdminUsersService) auditLog(ctx context.Context, userID int64, action, entity string, entityID *int64, meta map[string]any, ip string) {
	_ = s.audit.Log(ctx, userID, action, entity, entityID, meta, ip)
}
