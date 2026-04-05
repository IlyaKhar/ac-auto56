package repository

import (
	"context"
	"encoding/json"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// Vehicle — запись каталога авто (JSONB: features, images — массивы строк).
type Vehicle struct {
	ID          int64     `json:"id"`
	Title       string    `json:"title"`
	BrandLabel  string    `json:"brand_label"`
	PriceRub    int64     `json:"price_rub"`
	Description string    `json:"description"`
	Features    []string  `json:"features"`
	Images      []string  `json:"images"`
	SortOrder   int       `json:"sort_order"`
	IsPublished bool      `json:"is_published"`
	IsNew       bool      `json:"is_new"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type VehicleRepository struct {
	pool *pgxpool.Pool
}

func NewVehicleRepository(pool *pgxpool.Pool) *VehicleRepository {
	return &VehicleRepository{pool: pool}
}

func scanStringSliceJSON(b []byte) ([]string, error) {
	if len(b) == 0 {
		return []string{}, nil
	}
	var s []string
	if err := json.Unmarshal(b, &s); err != nil {
		return nil, err
	}
	return s, nil
}

func marshalStringSlice(s []string) ([]byte, error) {
	if s == nil {
		return []byte("[]"), nil
	}
	return json.Marshal(s)
}

func scanVehicle(row pgx.Row) (*Vehicle, error) {
	var v Vehicle
	var feat, imgs []byte
	err := row.Scan(
		&v.ID, &v.Title, &v.BrandLabel, &v.PriceRub, &v.Description,
		&feat, &imgs, &v.SortOrder, &v.IsPublished, &v.IsNew, &v.CreatedAt, &v.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	f, err := scanStringSliceJSON(feat)
	if err != nil {
		return nil, err
	}
	im, err := scanStringSliceJSON(imgs)
	if err != nil {
		return nil, err
	}
	v.Features = f
	v.Images = im
	return &v, nil
}

// ListPublished — только опубликованные, по sort_order.
func (r *VehicleRepository) ListPublished(ctx context.Context) ([]Vehicle, error) {
	const q = `
		SELECT id, title, brand_label, price_rub, description, features, images, sort_order, is_published, is_new, created_at, updated_at
		FROM vehicles WHERE is_published = true
		ORDER BY sort_order ASC, id ASC`
	rows, err := r.pool.Query(ctx, q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []Vehicle
	for rows.Next() {
		v, err := scanVehicle(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, *v)
	}
	return out, rows.Err()
}

// GetPublishedByID — одна опубликованная запись или nil.
func (r *VehicleRepository) GetPublishedByID(ctx context.Context, id int64) (*Vehicle, error) {
	const q = `
		SELECT id, title, brand_label, price_rub, description, features, images, sort_order, is_published, is_new, created_at, updated_at
		FROM vehicles WHERE id = $1 AND is_published = true`
	v, err := scanVehicle(r.pool.QueryRow(ctx, q, id))
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return v, nil
}

func (r *VehicleRepository) ListAll(ctx context.Context) ([]Vehicle, error) {
	const q = `
		SELECT id, title, brand_label, price_rub, description, features, images, sort_order, is_published, is_new, created_at, updated_at
		FROM vehicles ORDER BY sort_order ASC, id ASC`
	rows, err := r.pool.Query(ctx, q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []Vehicle
	for rows.Next() {
		v, err := scanVehicle(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, *v)
	}
	return out, rows.Err()
}

func (r *VehicleRepository) GetByID(ctx context.Context, id int64) (*Vehicle, error) {
	const q = `
		SELECT id, title, brand_label, price_rub, description, features, images, sort_order, is_published, is_new, created_at, updated_at
		FROM vehicles WHERE id = $1`
	v, err := scanVehicle(r.pool.QueryRow(ctx, q, id))
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return v, nil
}

func (r *VehicleRepository) Create(ctx context.Context, title, brandLabel string, priceRub int64, description string, features, images []string, sortOrder int, published, isNew bool) (int64, error) {
	fb, err := marshalStringSlice(features)
	if err != nil {
		return 0, err
	}
	ib, err := marshalStringSlice(images)
	if err != nil {
		return 0, err
	}
	const q = `
		INSERT INTO vehicles (title, brand_label, price_rub, description, features, images, sort_order, is_published, is_new)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`
	var id int64
	err = r.pool.QueryRow(ctx, q, title, brandLabel, priceRub, description, fb, ib, sortOrder, published, isNew).Scan(&id)
	if err != nil {
		return 0, err
	}
	return id, nil
}

func (r *VehicleRepository) Update(ctx context.Context, id int64, title, brandLabel string, priceRub int64, description string, features, images []string, sortOrder int, published, isNew bool) error {
	fb, err := marshalStringSlice(features)
	if err != nil {
		return err
	}
	ib, err := marshalStringSlice(images)
	if err != nil {
		return err
	}
	const q = `
		UPDATE vehicles SET title = $2, brand_label = $3, price_rub = $4, description = $5, features = $6, images = $7, sort_order = $8, is_published = $9, is_new = $10, updated_at = NOW()
		WHERE id = $1`
	tag, err := r.pool.Exec(ctx, q, id, title, brandLabel, priceRub, description, fb, ib, sortOrder, published, isNew)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

func (r *VehicleRepository) Delete(ctx context.Context, id int64) error {
	const q = `DELETE FROM vehicles WHERE id = $1`
	tag, err := r.pool.Exec(ctx, q, id)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}
