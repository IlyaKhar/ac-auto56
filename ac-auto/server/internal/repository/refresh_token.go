package repository

import (
	"context"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type RefreshToken struct {
	ID     int64
	UserID int64
}

type RefreshTokenRepository struct {
	pool *pgxpool.Pool
}

func NewRefreshTokenRepository(pool *pgxpool.Pool) *RefreshTokenRepository {
	return &RefreshTokenRepository{pool: pool}
}

func (r *RefreshTokenRepository) Insert(ctx context.Context, userID int64, tokenHash string, expiresAt time.Time) error {
	const q = `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`
	_, err := r.pool.Exec(ctx, q, userID, tokenHash, expiresAt)
	return err
}

func (r *RefreshTokenRepository) FindValidByHash(ctx context.Context, tokenHash string) (*RefreshToken, error) {
	const q = `
		SELECT id, user_id FROM refresh_tokens
		WHERE token_hash = $1 AND revoked_at IS NULL AND expires_at > NOW()
		LIMIT 1`
	var t RefreshToken
	err := r.pool.QueryRow(ctx, q, tokenHash).Scan(&t.ID, &t.UserID)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &t, nil
}

func (r *RefreshTokenRepository) RevokeByID(ctx context.Context, id int64) error {
	const q = `UPDATE refresh_tokens SET revoked_at = NOW() WHERE id = $1 AND revoked_at IS NULL`
	_, err := r.pool.Exec(ctx, q, id)
	return err
}

func (r *RefreshTokenRepository) RevokeByHash(ctx context.Context, tokenHash string) error {
	const q = `UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = $1 AND revoked_at IS NULL`
	_, err := r.pool.Exec(ctx, q, tokenHash)
	return err
}
