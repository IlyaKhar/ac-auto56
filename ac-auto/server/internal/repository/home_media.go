package repository

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5/pgxpool"
)

const (
	HomeSectionOurServices  = "our_services"
	HomeSectionCarInspection = "car_inspection"
	HomeSectionHappyOwners  = "happy_owners"
	HomeSectionInsuranceServices = "insurance_services"
)

var homeSectionSlots = map[string]int{
	HomeSectionOurServices:  8,
	HomeSectionCarInspection: 6,
	HomeSectionHappyOwners:  9,
	HomeSectionInsuranceServices: 4,
}

type HomeMediaRepository struct {
	pool *pgxpool.Pool
}

func NewHomeMediaRepository(pool *pgxpool.Pool) *HomeMediaRepository {
	return &HomeMediaRepository{pool: pool}
}

func (r *HomeMediaRepository) ListSection(ctx context.Context, section string) ([]string, error) {
	expected, ok := homeSectionSlots[section]
	if !ok {
		return nil, errors.New("unknown section")
	}
	rows, err := r.pool.Query(ctx, `SELECT image_url FROM home_media_slots WHERE section = $1 ORDER BY slot_index`, section)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := make([]string, 0, expected)
	for rows.Next() {
		var u string
		if err := rows.Scan(&u); err != nil {
			return nil, err
		}
		out = append(out, u)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	if len(out) != expected {
		return nil, errors.New("home_media: invalid slots count")
	}
	return out, nil
}

func (r *HomeMediaRepository) ReplaceSection(ctx context.Context, section string, urls []string) error {
	expected, ok := homeSectionSlots[section]
	if !ok {
		return errors.New("unknown section")
	}
	if len(urls) != expected {
		return errors.New("invalid slots count")
	}
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	for i := 0; i < expected; i++ {
		if _, err := tx.Exec(ctx,
			`UPDATE home_media_slots SET image_url = $1, updated_at = NOW() WHERE section = $2 AND slot_index = $3`,
			urls[i], section, i,
		); err != nil {
			return err
		}
	}
	return tx.Commit(ctx)
}
