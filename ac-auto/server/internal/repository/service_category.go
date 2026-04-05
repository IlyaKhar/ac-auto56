package repository

import (
	"context"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type ServiceCategory struct {
	ID        int64     `json:"id"`
	Title     string    `json:"title"`
	Slug      string    `json:"slug"`
	SortOrder int       `json:"sort_order"`
	IsActive  bool      `json:"is_active"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type ServiceCategoryRepository struct {
	pool *pgxpool.Pool
}

func NewServiceCategoryRepository(pool *pgxpool.Pool) *ServiceCategoryRepository {
	return &ServiceCategoryRepository{pool: pool}
}

func (r *ServiceCategoryRepository) ListPublic(ctx context.Context) ([]ServiceCategory, error) {
	const q = `
		SELECT id, title, slug, sort_order, is_active, created_at, updated_at
		FROM service_categories
		WHERE is_active = true
		ORDER BY sort_order ASC, id ASC`
	rows, err := r.pool.Query(ctx, q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanCategories(rows)
}

func (r *ServiceCategoryRepository) ListAll(ctx context.Context) ([]ServiceCategory, error) {
	const q = `
		SELECT id, title, slug, sort_order, is_active, created_at, updated_at
		FROM service_categories
		ORDER BY sort_order ASC, id ASC`
	rows, err := r.pool.Query(ctx, q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanCategories(rows)
}

func scanCategories(rows pgx.Rows) ([]ServiceCategory, error) {
	var out []ServiceCategory
	for rows.Next() {
		var c ServiceCategory
		if err := rows.Scan(&c.ID, &c.Title, &c.Slug, &c.SortOrder, &c.IsActive, &c.CreatedAt, &c.UpdatedAt); err != nil {
			return nil, err
		}
		out = append(out, c)
	}
	return out, rows.Err()
}

func (r *ServiceCategoryRepository) GetByID(ctx context.Context, id int64) (*ServiceCategory, error) {
	const q = `
		SELECT id, title, slug, sort_order, is_active, created_at, updated_at
		FROM service_categories WHERE id = $1`
	var c ServiceCategory
	err := r.pool.QueryRow(ctx, q, id).Scan(&c.ID, &c.Title, &c.Slug, &c.SortOrder, &c.IsActive, &c.CreatedAt, &c.UpdatedAt)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &c, nil
}

func (r *ServiceCategoryRepository) Create(ctx context.Context, title, slug string, sortOrder int, isActive bool) (int64, error) {
	const q = `
		INSERT INTO service_categories (title, slug, sort_order, is_active)
		VALUES ($1, $2, $3, $4) RETURNING id`
	var id int64
	err := r.pool.QueryRow(ctx, q, title, slug, sortOrder, isActive).Scan(&id)
	return id, err
}

func (r *ServiceCategoryRepository) Update(ctx context.Context, id int64, title, slug string, sortOrder int, isActive bool) error {
	const q = `
		UPDATE service_categories
		SET title = $2, slug = $3, sort_order = $4, is_active = $5, updated_at = NOW()
		WHERE id = $1`
	ct, err := r.pool.Exec(ctx, q, id, title, slug, sortOrder, isActive)
	if err != nil {
		return err
	}
	if ct.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

func (r *ServiceCategoryRepository) CountServices(ctx context.Context, categoryID int64) (int64, error) {
	const q = `SELECT COUNT(*) FROM services WHERE category_id = $1`
	var n int64
	err := r.pool.QueryRow(ctx, q, categoryID).Scan(&n)
	return n, err
}

func (r *ServiceCategoryRepository) Delete(ctx context.Context, id int64) error {
	const q = `DELETE FROM service_categories WHERE id = $1`
	ct, err := r.pool.Exec(ctx, q, id)
	if err != nil {
		return err
	}
	if ct.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}
