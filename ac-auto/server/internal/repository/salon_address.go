package repository

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// SalonAddress — точка на карте для блока адресов на сайте.
type SalonAddress struct {
	ID             int64     `json:"id"`
	SortOrder      int       `json:"sort_order"`
	Image          string    `json:"image"`
	City           string    `json:"city"`
	Street         string    `json:"street"`
	Phone          string    `json:"phone"`
	YandexMapsURL  string    `json:"yandex_maps_url"`
	GisURL         string    `json:"gis_url"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

type SalonAddressRepository struct {
	pool *pgxpool.Pool
}

func NewSalonAddressRepository(pool *pgxpool.Pool) *SalonAddressRepository {
	return &SalonAddressRepository{pool: pool}
}

func (r *SalonAddressRepository) GetSectionTitle(ctx context.Context) (string, error) {
	var title string
	err := r.pool.QueryRow(ctx, `SELECT section_title FROM salon_address_settings WHERE id = 1`).Scan(&title)
	if err != nil {
		return "", err
	}
	return title, nil
}

func (r *SalonAddressRepository) UpdateSectionTitle(ctx context.Context, title string) error {
	_, err := r.pool.Exec(ctx,
		`UPDATE salon_address_settings SET section_title = $1, updated_at = NOW() WHERE id = 1`,
		title,
	)
	return err
}

func (r *SalonAddressRepository) ListOrdered(ctx context.Context) ([]SalonAddress, error) {
	rows, err := r.pool.Query(ctx, `
		SELECT id, sort_order, image_url, city, street, phone, yandex_maps_url, gis_url, created_at, updated_at
		FROM salon_addresses
		ORDER BY sort_order ASC, id ASC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []SalonAddress
	for rows.Next() {
		var a SalonAddress
		if err := rows.Scan(&a.ID, &a.SortOrder, &a.Image, &a.City, &a.Street, &a.Phone, &a.YandexMapsURL, &a.GisURL, &a.CreatedAt, &a.UpdatedAt); err != nil {
			return nil, err
		}
		out = append(out, a)
	}
	return out, rows.Err()
}

func (r *SalonAddressRepository) GetByID(ctx context.Context, id int64) (*SalonAddress, error) {
	var a SalonAddress
	err := r.pool.QueryRow(ctx, `
		SELECT id, sort_order, image_url, city, street, phone, yandex_maps_url, gis_url, created_at, updated_at
		FROM salon_addresses WHERE id = $1
	`, id).Scan(&a.ID, &a.SortOrder, &a.Image, &a.City, &a.Street, &a.Phone, &a.YandexMapsURL, &a.GisURL, &a.CreatedAt, &a.UpdatedAt)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &a, nil
}

func (r *SalonAddressRepository) NextSortOrder(ctx context.Context) (int, error) {
	var n int
	err := r.pool.QueryRow(ctx, `SELECT COALESCE(MAX(sort_order), -1) + 1 FROM salon_addresses`).Scan(&n)
	return n, err
}

func (r *SalonAddressRepository) Create(ctx context.Context, sortOrder int, image, city, street, phone, yandex, gis string) (int64, error) {
	var id int64
	err := r.pool.QueryRow(ctx, `
		INSERT INTO salon_addresses (sort_order, image_url, city, street, phone, yandex_maps_url, gis_url)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id
	`, sortOrder, image, city, street, phone, yandex, gis).Scan(&id)
	return id, err
}

func (r *SalonAddressRepository) Update(ctx context.Context, id int64, sortOrder int, image, city, street, phone, yandex, gis string) error {
	tag, err := r.pool.Exec(ctx, `
		UPDATE salon_addresses
		SET sort_order = $2, image_url = $3, city = $4, street = $5, phone = $6, yandex_maps_url = $7, gis_url = $8, updated_at = NOW()
		WHERE id = $1
	`, id, sortOrder, image, city, street, phone, yandex, gis)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

func (r *SalonAddressRepository) Delete(ctx context.Context, id int64) error {
	tag, err := r.pool.Exec(ctx, `DELETE FROM salon_addresses WHERE id = $1`, id)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

// ReorderByIDs — выставляет sort_order по порядку id в срезе (0,1,2,…).
func (r *SalonAddressRepository) ReorderByIDs(ctx context.Context, ids []int64) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer func() { _ = tx.Rollback(ctx) }()
	for i, id := range ids {
		if _, err := tx.Exec(ctx, `UPDATE salon_addresses SET sort_order = $2, updated_at = NOW() WHERE id = $1`, id, i); err != nil {
			return err
		}
	}
	return tx.Commit(ctx)
}
