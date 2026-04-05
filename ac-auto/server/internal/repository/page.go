package repository

import (
	"context"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Page struct {
	ID             int64      `json:"id"`
	Slug           string     `json:"slug"`
	Title          string     `json:"title"`
	Status         string     `json:"status"`
	SeoTitle       *string    `json:"seo_title"`
	SeoDescription *string    `json:"seo_description"`
	OgImageURL     *string    `json:"og_image_url"`
	PublishedAt    *time.Time `json:"published_at"`
	CreatedAt      time.Time  `json:"created_at"`
	UpdatedAt      time.Time  `json:"updated_at"`
}

type PageRepository struct {
	pool *pgxpool.Pool
}

func NewPageRepository(pool *pgxpool.Pool) *PageRepository {
	return &PageRepository{pool: pool}
}

func textPtr(t pgtype.Text) *string {
	if !t.Valid {
		return nil
	}
	s := t.String
	return &s
}

func tsPtr(t pgtype.Timestamptz) *time.Time {
	if !t.Valid {
		return nil
	}
	tt := t.Time
	return &tt
}

func (r *PageRepository) GetPublishedBySlug(ctx context.Context, slug string) (*Page, error) {
	const q = `
		SELECT id, slug, title, status, seo_title, seo_description, og_image_url, published_at, created_at, updated_at
		FROM pages WHERE slug = $1 AND status = 'published' LIMIT 1`
	var p Page
	var seoT, seoD, og pgtype.Text
	var pub pgtype.Timestamptz
	err := r.pool.QueryRow(ctx, q, slug).Scan(
		&p.ID, &p.Slug, &p.Title, &p.Status, &seoT, &seoD, &og, &pub, &p.CreatedAt, &p.UpdatedAt,
	)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	p.SeoTitle = textPtr(seoT)
	p.SeoDescription = textPtr(seoD)
	p.OgImageURL = textPtr(og)
	p.PublishedAt = tsPtr(pub)
	return &p, nil
}

func (r *PageRepository) ListAll(ctx context.Context) ([]Page, error) {
	const q = `
		SELECT id, slug, title, status, seo_title, seo_description, og_image_url, published_at, created_at, updated_at
		FROM pages ORDER BY updated_at DESC, id DESC`
	rows, err := r.pool.Query(ctx, q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanPages(rows)
}

func (r *PageRepository) GetByID(ctx context.Context, id int64) (*Page, error) {
	const q = `
		SELECT id, slug, title, status, seo_title, seo_description, og_image_url, published_at, created_at, updated_at
		FROM pages WHERE id = $1`
	var p Page
	var seoT, seoD, og pgtype.Text
	var pub pgtype.Timestamptz
	err := r.pool.QueryRow(ctx, q, id).Scan(
		&p.ID, &p.Slug, &p.Title, &p.Status, &seoT, &seoD, &og, &pub, &p.CreatedAt, &p.UpdatedAt,
	)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	p.SeoTitle = textPtr(seoT)
	p.SeoDescription = textPtr(seoD)
	p.OgImageURL = textPtr(og)
	p.PublishedAt = tsPtr(pub)
	return &p, nil
}

func scanPages(rows pgx.Rows) ([]Page, error) {
	var out []Page
	for rows.Next() {
		var p Page
		var seoT, seoD, og pgtype.Text
		var pub pgtype.Timestamptz
		if err := rows.Scan(
			&p.ID, &p.Slug, &p.Title, &p.Status, &seoT, &seoD, &og, &pub, &p.CreatedAt, &p.UpdatedAt,
		); err != nil {
			return nil, err
		}
		p.SeoTitle = textPtr(seoT)
		p.SeoDescription = textPtr(seoD)
		p.OgImageURL = textPtr(og)
		p.PublishedAt = tsPtr(pub)
		out = append(out, p)
	}
	return out, rows.Err()
}

func (r *PageRepository) Create(ctx context.Context, slug, title, status string, seoTitle, seoDesc, og *string, publishedAt *time.Time) (int64, error) {
	const q = `
		INSERT INTO pages (slug, title, status, seo_title, seo_description, og_image_url, published_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`
	var id int64
	err := r.pool.QueryRow(ctx, q, slug, title, status, seoTitle, seoDesc, og, publishedAt).Scan(&id)
	return id, err
}

func (r *PageRepository) Update(ctx context.Context, id int64, slug, title, status string, seoTitle, seoDesc, og *string, publishedAt *time.Time) error {
	const q = `
		UPDATE pages SET
			slug = $2, title = $3, status = $4,
			seo_title = $5, seo_description = $6, og_image_url = $7,
			published_at = $8, updated_at = NOW()
		WHERE id = $1`
	ct, err := r.pool.Exec(ctx, q, id, slug, title, status, seoTitle, seoDesc, og, publishedAt)
	if err != nil {
		return err
	}
	if ct.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

func (r *PageRepository) Delete(ctx context.Context, id int64) error {
	const q = `DELETE FROM pages WHERE id = $1`
	ct, err := r.pool.Exec(ctx, q, id)
	if err != nil {
		return err
	}
	if ct.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}
