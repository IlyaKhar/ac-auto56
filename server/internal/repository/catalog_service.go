package repository

import (
	"context"
	"errors"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

// CatalogService — услуга (таблица services), не путать с Go-service слоем.
type CatalogService struct {
	ID              int64     `json:"id"`
	Title           string    `json:"title"`
	Description     string    `json:"description"`
	Price           *string   `json:"price"`
	Duration        *string   `json:"duration"`
	CategoryID      int64     `json:"category_id"`
	CategoryTitle   string    `json:"category_title,omitempty"`
	CategorySlug    string    `json:"category_slug,omitempty"`
	IsActive        bool      `json:"is_active"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

type CatalogServiceRepository struct {
	pool *pgxpool.Pool
}

func NewCatalogServiceRepository(pool *pgxpool.Pool) *CatalogServiceRepository {
	return &CatalogServiceRepository{pool: pool}
}

func (r *CatalogServiceRepository) ListPublic(ctx context.Context, categoryID *int64, limit, offset int) ([]CatalogService, error) {
	if limit <= 0 || limit > 500 {
		limit = 100
	}
	if offset < 0 {
		offset = 0
	}
	var rows pgx.Rows
	var err error
	if categoryID != nil {
		const q = `
			SELECT s.id, s.title, s.description,
				CASE WHEN s.price IS NULL THEN NULL ELSE trim_scale(s.price)::text END,
				s.duration, s.category_id, c.title, c.slug, s.is_active, s.created_at, s.updated_at
			FROM services s
			INNER JOIN service_categories c ON c.id = s.category_id
			WHERE s.is_active = true AND c.is_active = true AND s.category_id = $1
			ORDER BY c.sort_order ASC, s.id ASC
			LIMIT $2 OFFSET $3`
		rows, err = r.pool.Query(ctx, q, *categoryID, limit, offset)
	} else {
		const q = `
			SELECT s.id, s.title, s.description,
				CASE WHEN s.price IS NULL THEN NULL ELSE trim_scale(s.price)::text END,
				s.duration, s.category_id, c.title, c.slug, s.is_active, s.created_at, s.updated_at
			FROM services s
			INNER JOIN service_categories c ON c.id = s.category_id
			WHERE s.is_active = true AND c.is_active = true
			ORDER BY c.sort_order ASC, s.id ASC
			LIMIT $1 OFFSET $2`
		rows, err = r.pool.Query(ctx, q, limit, offset)
	}
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanCatalogServices(rows)
}

func (r *CatalogServiceRepository) GetPublicByID(ctx context.Context, id int64) (*CatalogService, error) {
	const q = `
		SELECT s.id, s.title, s.description,
			CASE WHEN s.price IS NULL THEN NULL ELSE trim_scale(s.price)::text END,
			s.duration, s.category_id, c.title, c.slug, s.is_active, s.created_at, s.updated_at
		FROM services s
		INNER JOIN service_categories c ON c.id = s.category_id
		WHERE s.id = $1 AND s.is_active = true AND c.is_active = true`
	var s CatalogService
	var price, dur pgtype.Text
	err := r.pool.QueryRow(ctx, q, id).Scan(
		&s.ID, &s.Title, &s.Description, &price, &dur, &s.CategoryID,
		&s.CategoryTitle, &s.CategorySlug, &s.IsActive, &s.CreatedAt, &s.UpdatedAt,
	)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	s.Price = catalogTextPtr(price)
	s.Duration = catalogTextPtr(dur)
	return &s, nil
}

func (r *CatalogServiceRepository) ListAll(ctx context.Context) ([]CatalogService, error) {
	const q = `
		SELECT s.id, s.title, s.description,
			CASE WHEN s.price IS NULL THEN NULL ELSE trim_scale(s.price)::text END,
			s.duration, s.category_id, c.title, c.slug, s.is_active, s.created_at, s.updated_at
		FROM services s
		INNER JOIN service_categories c ON c.id = s.category_id
		ORDER BY c.sort_order ASC, s.id ASC`
	rows, err := r.pool.Query(ctx, q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanCatalogServices(rows)
}

func (r *CatalogServiceRepository) GetByID(ctx context.Context, id int64) (*CatalogService, error) {
	const q = `
		SELECT s.id, s.title, s.description,
			CASE WHEN s.price IS NULL THEN NULL ELSE trim_scale(s.price)::text END,
			s.duration, s.category_id, c.title, c.slug, s.is_active, s.created_at, s.updated_at
		FROM services s
		INNER JOIN service_categories c ON c.id = s.category_id
		WHERE s.id = $1`
	var s CatalogService
	var price, dur pgtype.Text
	err := r.pool.QueryRow(ctx, q, id).Scan(
		&s.ID, &s.Title, &s.Description, &price, &dur, &s.CategoryID,
		&s.CategoryTitle, &s.CategorySlug, &s.IsActive, &s.CreatedAt, &s.UpdatedAt,
	)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	s.Price = catalogTextPtr(price)
	s.Duration = catalogTextPtr(dur)
	return &s, nil
}

func catalogTextPtr(t pgtype.Text) *string {
	if !t.Valid {
		return nil
	}
	s := t.String
	return &s
}

func scanCatalogServices(rows pgx.Rows) ([]CatalogService, error) {
	var out []CatalogService
	for rows.Next() {
		var s CatalogService
		var price, dur pgtype.Text
		if err := rows.Scan(
			&s.ID, &s.Title, &s.Description, &price, &dur, &s.CategoryID,
			&s.CategoryTitle, &s.CategorySlug, &s.IsActive, &s.CreatedAt, &s.UpdatedAt,
		); err != nil {
			return nil, err
		}
		s.Price = catalogTextPtr(price)
		s.Duration = catalogTextPtr(dur)
		out = append(out, s)
	}
	return out, rows.Err()
}

func normOptionalStr(p *string) *string {
	if p == nil {
		return nil
	}
	if strings.TrimSpace(*p) == "" {
		return nil
	}
	return p
}

func (r *CatalogServiceRepository) Create(ctx context.Context, title, description string, price *string, duration *string, categoryID int64, isActive bool) (int64, error) {
	price = normOptionalStr(price)
	duration = normOptionalStr(duration)
	const q = `
		INSERT INTO services (title, description, price, duration, category_id, is_active)
		VALUES ($1, $2, CAST($3 AS NUMERIC), $4, $5, $6) RETURNING id`
	var id int64
	err := r.pool.QueryRow(ctx, q, title, description, price, duration, categoryID, isActive).Scan(&id)
	return id, err
}

func (r *CatalogServiceRepository) Update(ctx context.Context, id int64, title, description string, price *string, duration *string, categoryID int64, isActive bool) error {
	price = normOptionalStr(price)
	duration = normOptionalStr(duration)
	const q = `
		UPDATE services SET
			title = $2, description = $3, price = CAST($4 AS NUMERIC), duration = $5,
			category_id = $6, is_active = $7, updated_at = NOW()
		WHERE id = $1`
	ct, err := r.pool.Exec(ctx, q, id, title, description, price, duration, categoryID, isActive)
	if err != nil {
		return err
	}
	if ct.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

func (r *CatalogServiceRepository) Delete(ctx context.Context, id int64) error {
	const q = `DELETE FROM services WHERE id = $1`
	ct, err := r.pool.Exec(ctx, q, id)
	if err != nil {
		return err
	}
	if ct.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}
