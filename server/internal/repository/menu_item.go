package repository

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

// MenuItem — пункт меню (админка).
type MenuItem struct {
	ID        int64   `json:"id"`
	Label     string  `json:"label"`
	Href      *string `json:"href"`
	PageID    *int64  `json:"page_id"`
	ParentID  *int64  `json:"parent_id"`
	SortOrder int     `json:"sort_order"`
	IsVisible bool    `json:"is_visible"`
	PageSlug  *string `json:"page_slug,omitempty"`
}

// MenuItemPublic — ответ для публичного сайта.
type MenuItemPublic struct {
	ID        int64   `json:"id"`
	Label     string  `json:"label"`
	Href      string  `json:"href"`
	ParentID  *int64  `json:"parent_id"`
	SortOrder int     `json:"sort_order"`
}

type MenuRepository struct {
	pool *pgxpool.Pool
}

func NewMenuRepository(pool *pgxpool.Pool) *MenuRepository {
	return &MenuRepository{pool: pool}
}

func menuTextPtr(t pgtype.Text) *string {
	if !t.Valid {
		return nil
	}
	s := t.String
	return &s
}

func menuInt8Ptr(i pgtype.Int8) *int64 {
	if !i.Valid {
		return nil
	}
	v := i.Int64
	return &v
}

func resolveMenuHref(href *string, slug *string) string {
	if href != nil && *href != "" {
		return *href
	}
	if slug != nil && *slug != "" {
		return "/" + *slug
	}
	return "#"
}

func scanMenuItemRow(row pgx.Row) (MenuItem, error) {
	var m MenuItem
	var href, slug pgtype.Text
	var pageID, parentID pgtype.Int8
	err := row.Scan(&m.ID, &m.Label, &href, &pageID, &parentID, &m.SortOrder, &m.IsVisible, &slug)
	if err != nil {
		return m, err
	}
	m.Href = menuTextPtr(href)
	m.PageID = menuInt8Ptr(pageID)
	m.ParentID = menuInt8Ptr(parentID)
	m.PageSlug = menuTextPtr(slug)
	return m, nil
}

// ListMenuPublic — видимые пункты; страница только published.
func (r *MenuRepository) ListMenuPublic(ctx context.Context) ([]MenuItemPublic, error) {
	const q = `
		SELECT m.id, m.label, m.href, m.page_id, m.parent_id, m.sort_order, p.slug
		FROM menu_items m
		LEFT JOIN pages p ON p.id = m.page_id
		WHERE m.is_visible = true
		  AND (m.page_id IS NULL OR p.status = 'published')
		ORDER BY m.sort_order ASC, m.id ASC`
	rows, err := r.pool.Query(ctx, q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []MenuItemPublic
	for rows.Next() {
		var id int64
		var label string
		var href, slug pgtype.Text
		var pageID, parentID pgtype.Int8
		var sort int
		if err := rows.Scan(&id, &label, &href, &pageID, &parentID, &sort, &slug); err != nil {
			return nil, err
		}
		h := menuTextPtr(href)
		slugPtr := menuTextPtr(slug)
		out = append(out, MenuItemPublic{
			ID: id, Label: label, Href: resolveMenuHref(h, slugPtr),
			ParentID: menuInt8Ptr(parentID), SortOrder: sort,
		})
	}
	return out, rows.Err()
}

// ListMenuAll — админка.
func (r *MenuRepository) ListMenuAll(ctx context.Context) ([]MenuItem, error) {
	const q = `
		SELECT m.id, m.label, m.href, m.page_id, m.parent_id, m.sort_order, m.is_visible, p.slug
		FROM menu_items m
		LEFT JOIN pages p ON p.id = m.page_id
		ORDER BY m.sort_order ASC, m.id ASC`
	rows, err := r.pool.Query(ctx, q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []MenuItem
	for rows.Next() {
		m, err := scanMenuItemRow(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, m)
	}
	return out, rows.Err()
}

// GetMenuByID — один пункт меню.
func (r *MenuRepository) GetMenuByID(ctx context.Context, id int64) (*MenuItem, error) {
	const q = `
		SELECT m.id, m.label, m.href, m.page_id, m.parent_id, m.sort_order, m.is_visible, p.slug
		FROM menu_items m
		LEFT JOIN pages p ON p.id = m.page_id
		WHERE m.id = $1`
	m, err := scanMenuItemRow(r.pool.QueryRow(ctx, q, id))
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &m, nil
}

// CreateMenuItem — новый пункт.
// NextMenuSortOrder — следующий sort_order (добавление в конец).
func (r *MenuRepository) NextMenuSortOrder(ctx context.Context) (int, error) {
	const q = `SELECT COALESCE(MAX(sort_order), -1) + 1 FROM menu_items`
	var n int
	err := r.pool.QueryRow(ctx, q).Scan(&n)
	return n, err
}

func (r *MenuRepository) CreateMenuItem(ctx context.Context, label string, href *string, pageID, parentID *int64, sort int, visible bool) (int64, error) {
	const q = `
		INSERT INTO menu_items (label, href, page_id, parent_id, sort_order, is_visible)
		VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`
	var id int64
	err := r.pool.QueryRow(ctx, q, label, href, pageID, parentID, sort, visible).Scan(&id)
	return id, err
}

// UpdateMenuItem — обновление полей.
func (r *MenuRepository) UpdateMenuItem(ctx context.Context, id int64, label string, href *string, pageID, parentID *int64, sort int, visible bool) error {
	const q = `
		UPDATE menu_items SET
			label = $2, href = $3, page_id = $4, parent_id = $5, sort_order = $6, is_visible = $7, updated_at = NOW()
		WHERE id = $1`
	ct, err := r.pool.Exec(ctx, q, id, label, href, pageID, parentID, sort, visible)
	if err != nil {
		return err
	}
	if ct.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

func (r *MenuRepository) DeleteMenuItem(ctx context.Context, id int64) error {
	const q = `DELETE FROM menu_items WHERE id = $1`
	ct, err := r.pool.Exec(ctx, q, id)
	if err != nil {
		return err
	}
	if ct.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

// ReorderMenuItems — порядок по массиву id.
func (r *MenuRepository) ReorderMenuItems(ctx context.Context, ids []int64) error {
	if len(ids) == 0 {
		return nil
	}
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)
	for i, id := range ids {
		const q = `UPDATE menu_items SET sort_order = $1, updated_at = NOW() WHERE id = $2`
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
