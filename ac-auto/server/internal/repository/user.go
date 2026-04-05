package repository

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// User — пользователь админки с ролью (JOIN roles).
type User struct {
	ID           int64
	Email        string
	PasswordHash string
	RoleID       int16
	RoleName     string
	IsActive     bool
}

type UserRepository struct {
	pool *pgxpool.Pool
}

func NewUserRepository(pool *pgxpool.Pool) *UserRepository {
	return &UserRepository{pool: pool}
}

func (r *UserRepository) GetByEmail(ctx context.Context, email string) (*User, error) {
	const q = `
		SELECT u.id, u.email, u.password_hash, u.role_id, r.name, u.is_active
		FROM users u
		INNER JOIN roles r ON r.id = u.role_id
		WHERE u.email = $1
		LIMIT 1`
	var u User
	err := r.pool.QueryRow(ctx, q, email).Scan(
		&u.ID, &u.Email, &u.PasswordHash, &u.RoleID, &u.RoleName, &u.IsActive,
	)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &u, nil
}

// IsActiveStaff — пользователь активен и роль moderator или admin (для назначения менеджером).
func (r *UserRepository) IsActiveStaff(ctx context.Context, id int64) (bool, error) {
	const q = `
		SELECT EXISTS(
			SELECT 1 FROM users u
			INNER JOIN roles r ON r.id = u.role_id
			WHERE u.id = $1 AND u.is_active AND r.name IN ('moderator', 'admin')
		)`
	var ok bool
	err := r.pool.QueryRow(ctx, q, id).Scan(&ok)
	return ok, err
}

func (r *UserRepository) GetByID(ctx context.Context, id int64) (*User, error) {
	const q = `
		SELECT u.id, u.email, u.password_hash, u.role_id, r.name, u.is_active
		FROM users u
		INNER JOIN roles r ON r.id = u.role_id
		WHERE u.id = $1
		LIMIT 1`
	var u User
	err := r.pool.QueryRow(ctx, q, id).Scan(
		&u.ID, &u.Email, &u.PasswordHash, &u.RoleID, &u.RoleName, &u.IsActive,
	)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &u, nil
}
