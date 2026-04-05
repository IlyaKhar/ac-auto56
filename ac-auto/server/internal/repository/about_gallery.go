package repository

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5/pgxpool"
)

type AboutGalleryRepository struct {
	pool *pgxpool.Pool
}

func NewAboutGalleryRepository(pool *pgxpool.Pool) *AboutGalleryRepository {
	return &AboutGalleryRepository{pool: pool}
}

// ListImageURLs — ровно 5 строк по порядку slot_index.
func (r *AboutGalleryRepository) ListImageURLs(ctx context.Context) ([]string, error) {
	rows, err := r.pool.Query(ctx, `SELECT image_url FROM about_gallery_slots ORDER BY slot_index`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := make([]string, 0, 5)
	for rows.Next() {
		var u string
		if err := rows.Scan(&u); err != nil {
			return nil, err
		}
		out = append(out, u)
	}
	if len(out) != 5 {
		return nil, errors.New("about_gallery: expected 5 slots")
	}
	return out, rows.Err()
}

// ReplaceAll — обновить все 5 URL (пустая строка допустима).
func (r *AboutGalleryRepository) ReplaceAll(ctx context.Context, urls []string) error {
	if len(urls) != 5 {
		return errors.New("need 5 image urls")
	}
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)
	for i := 0; i < 5; i++ {
		if _, err := tx.Exec(ctx,
			`UPDATE about_gallery_slots SET image_url = $1, updated_at = NOW() WHERE slot_index = $2`,
			urls[i], i,
		); err != nil {
			return err
		}
	}
	return tx.Commit(ctx)
}
