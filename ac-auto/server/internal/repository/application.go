package repository

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
)

type ApplicationRepository struct {
	pool *pgxpool.Pool
}

func NewApplicationRepository(pool *pgxpool.Pool) *ApplicationRepository {
	return &ApplicationRepository{pool: pool}
}

// Create публичная заявка + запись в истории (событие created).
func (r *ApplicationRepository) Create(
	ctx context.Context,
	appType string,
	name, phone string,
	email, carBrand, vin *string,
	serviceID *int64,
	message *string,
) (int64, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return 0, err
	}
	defer tx.Rollback(ctx)

	const insertApp = `
		INSERT INTO applications (
			type, name, phone, email, car_brand, vin, service_id, message, status
		) VALUES (
			$1::application_type, $2, $3, $4, $5, $6, $7, $8, 'new'
		) RETURNING id`

	var id int64
	if err := tx.QueryRow(ctx, insertApp,
		appType, name, phone, email, carBrand, vin, serviceID, message,
	).Scan(&id); err != nil {
		return 0, err
	}

	payload, _ := json.Marshal(map[string]string{"source": "public"})
	const hist = `
		INSERT INTO application_history (application_id, user_id, event, payload)
		VALUES ($1, $2, 'created', $3)`
	if _, err := tx.Exec(ctx, hist, id, nil, payload); err != nil {
		return 0, err
	}

	if err := tx.Commit(ctx); err != nil {
		return 0, err
	}
	return id, nil
}

// ServiceExists — опциональная проверка service_id для service_request.
func (r *ApplicationRepository) ServiceExists(ctx context.Context, id int64) (bool, error) {
	const q = `SELECT EXISTS(SELECT 1 FROM services WHERE id = $1 AND is_active = true)`
	var ok bool
	if err := r.pool.QueryRow(ctx, q, id).Scan(&ok); err != nil {
		return false, fmt.Errorf("service exists: %w", err)
	}
	return ok, nil
}
