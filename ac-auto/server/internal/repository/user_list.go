package repository

import (
	"context"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
)

// UserPublic — пользователь без секретов (API).
type UserPublic struct {
	ID        int64     `json:"id"`
	Email     string    `json:"email"`
	RoleID    int16     `json:"role_id"`
	RoleName  string    `json:"role_name"`
	IsActive  bool      `json:"is_active"`
	CreatedAt time.Time `json:"created_at"`
}

// StaffUserRef — краткая карточка для назначения менеджера (staff API).
type StaffUserRef struct {
	ID       int64  `json:"id"`
	Email    string `json:"email"`
	RoleName string `json:"role_name"`
}

// Role — строка из таблицы roles.
type Role struct {
	ID   int16  `json:"id"`
	Name string `json:"name"`
}

// ListUsersPublic — все пользователи админки.
func (r *UserRepository) ListUsersPublic(ctx context.Context) ([]UserPublic, error) {
	const q = `
		SELECT u.id, u.email, u.role_id, r.name, u.is_active, u.created_at
		FROM users u
		INNER JOIN roles r ON r.id = u.role_id
		ORDER BY u.id ASC`
	rows, err := r.pool.Query(ctx, q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []UserPublic
	for rows.Next() {
		var u UserPublic
		if err := rows.Scan(&u.ID, &u.Email, &u.RoleID, &u.RoleName, &u.IsActive, &u.CreatedAt); err != nil {
			return nil, err
		}
		out = append(out, u)
	}
	return out, rows.Err()
}

// ListActiveStaffRefs — активные moderator/admin для селекта «менеджер».
func (r *UserRepository) ListActiveStaffRefs(ctx context.Context) ([]StaffUserRef, error) {
	const q = `
		SELECT u.id, u.email, r.name
		FROM users u
		INNER JOIN roles r ON r.id = u.role_id
		WHERE u.is_active = true AND r.name IN ('moderator', 'admin')
		ORDER BY u.email ASC`
	rows, err := r.pool.Query(ctx, q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []StaffUserRef
	for rows.Next() {
		var s StaffUserRef
		if err := rows.Scan(&s.ID, &s.Email, &s.RoleName); err != nil {
			return nil, err
		}
		out = append(out, s)
	}
	return out, rows.Err()
}

// GetUserPublic — по id без password_hash.
func (r *UserRepository) GetUserPublic(ctx context.Context, id int64) (*UserPublic, error) {
	const q = `
		SELECT u.id, u.email, u.role_id, r.name, u.is_active, u.created_at
		FROM users u
		INNER JOIN roles r ON r.id = u.role_id
		WHERE u.id = $1`
	var u UserPublic
	err := r.pool.QueryRow(ctx, q, id).Scan(&u.ID, &u.Email, &u.RoleID, &u.RoleName, &u.IsActive, &u.CreatedAt)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &u, nil
}

// ErrEmailExists — нарушение UNIQUE(email).
var ErrEmailExists = errors.New("email уже занят")

// CreateUser — новый пользователь (role_id 1 или 2).
func (r *UserRepository) CreateUser(ctx context.Context, email, passwordHash string, roleID int16) (int64, error) {
	const q = `
		INSERT INTO users (email, password_hash, role_id)
		VALUES ($1, $2, $3) RETURNING id`
	var id int64
	err := r.pool.QueryRow(ctx, q, email, passwordHash, roleID).Scan(&id)
	if err != nil {
		var pe *pgconn.PgError
		if errors.As(err, &pe) && pe.Code == "23505" {
			return 0, ErrEmailExists
		}
		return 0, err
	}
	return id, nil
}

// UpdateUserFull — email, role_id, is_active (админка).
func (r *UserRepository) UpdateUserFull(ctx context.Context, id int64, email string, roleID int16, isActive bool) error {
	const q = `
		UPDATE users SET email = $2, role_id = $3, is_active = $4, updated_at = NOW()
		WHERE id = $1`
	ct, err := r.pool.Exec(ctx, q, id, email, roleID, isActive)
	if err != nil {
		var pe *pgconn.PgError
		if errors.As(err, &pe) && pe.Code == "23505" {
			return ErrEmailExists
		}
		return err
	}
	if ct.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

// SetUserPasswordHash — сброс пароля админом.
func (r *UserRepository) SetUserPasswordHash(ctx context.Context, id int64, hash string) error {
	const q = `UPDATE users SET password_hash = $2, updated_at = NOW() WHERE id = $1`
	ct, err := r.pool.Exec(ctx, q, id, hash)
	if err != nil {
		return err
	}
	if ct.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

// ListRoles — moderator + admin для выпадашек.
func (r *UserRepository) ListRoles(ctx context.Context) ([]Role, error) {
	const q = `SELECT id, name FROM roles ORDER BY id ASC`
	rows, err := r.pool.Query(ctx, q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []Role
	for rows.Next() {
		var ro Role
		if err := rows.Scan(&ro.ID, &ro.Name); err != nil {
			return nil, err
		}
		out = append(out, ro)
	}
	return out, rows.Err()
}
