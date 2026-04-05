package repository

import (
	"context"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

// FooterSection — блок футера.
type FooterSection struct {
	ID        int64     `json:"id"`
	Title     *string   `json:"title"`
	Content   string    `json:"content"`
	SortOrder int       `json:"sort_order"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type FooterRepository struct {
	pool *pgxpool.Pool
}

func NewFooterRepository(pool *pgxpool.Pool) *FooterRepository {
	return &FooterRepository{pool: pool}
}

func scanFooter(row pgx.Row) (FooterSection, error) {
	var f FooterSection
	var title pgtype.Text
	var ca, ua pgtype.Timestamptz
	err := row.Scan(&f.ID, &title, &f.Content, &f.SortOrder, &ca, &ua)
	if err != nil {
		return f, err
	}
	f.Title = menuTextPtr(title)
	if ca.Valid {
		f.CreatedAt = ca.Time
	}
	if ua.Valid {
		f.UpdatedAt = ua.Time
	}
	return f, nil
}

// ListFooterPublic — все секции по порядку.
func (r *FooterRepository) ListFooterPublic(ctx context.Context) ([]FooterSection, error) {
	const q = `
		SELECT id, title, content, sort_order, created_at, updated_at
		FROM footer_sections
		ORDER BY sort_order ASC, id ASC`
	rows, err := r.pool.Query(ctx, q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []FooterSection
	for rows.Next() {
		f, err := scanFooter(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, f)
	}
	return out, rows.Err()
}

// ListFooterAll — то же для админки.
func (r *FooterRepository) ListFooterAll(ctx context.Context) ([]FooterSection, error) {
	return r.ListFooterPublic(ctx)
}

func (r *FooterRepository) GetFooterByID(ctx context.Context, id int64) (*FooterSection, error) {
	const q = `
		SELECT id, title, content, sort_order, created_at, updated_at
		FROM footer_sections WHERE id = $1`
	f, err := scanFooter(r.pool.QueryRow(ctx, q, id))
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &f, nil
}

// NextFooterSortOrder — следующий sort_order.
func (r *FooterRepository) NextFooterSortOrder(ctx context.Context) (int, error) {
	const q = `SELECT COALESCE(MAX(sort_order), -1) + 1 FROM footer_sections`
	var n int
	err := r.pool.QueryRow(ctx, q).Scan(&n)
	return n, err
}

func (r *FooterRepository) CreateFooter(ctx context.Context, title *string, content string, sort int) (int64, error) {
	const q = `
		INSERT INTO footer_sections (title, content, sort_order)
		VALUES ($1, $2, $3) RETURNING id`
	var id int64
	err := r.pool.QueryRow(ctx, q, title, content, sort).Scan(&id)
	return id, err
}

func (r *FooterRepository) UpdateFooter(ctx context.Context, id int64, title *string, content string, sort int) error {
	const q = `
		UPDATE footer_sections SET title = $2, content = $3, sort_order = $4, updated_at = NOW()
		WHERE id = $1`
	ct, err := r.pool.Exec(ctx, q, id, title, content, sort)
	if err != nil {
		return err
	}
	if ct.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

func (r *FooterRepository) DeleteFooter(ctx context.Context, id int64) error {
	const q = `DELETE FROM footer_sections WHERE id = $1`
	ct, err := r.pool.Exec(ctx, q, id)
	if err != nil {
		return err
	}
	if ct.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

func (r *FooterRepository) ReorderFooter(ctx context.Context, ids []int64) error {
	if len(ids) == 0 {
		return nil
	}
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)
	for i, id := range ids {
		const q = `UPDATE footer_sections SET sort_order = $1, updated_at = NOW() WHERE id = $2`
		ct, err := tx.Exec(ctx, q, i, id)
		if err != nil {
			return err
		}
		if ct.RowsAffected() == 0 {
			return pgx.ErrNoRows
		}
	}
	return tx.Commit(ctx)
}
