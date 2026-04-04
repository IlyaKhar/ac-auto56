package repository

import (
	"context"
	"encoding/json"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
)

// StaffApplication — заявка для модераторов/админов (с названием услуги).
type StaffApplication struct {
	ID                int64     `json:"id"`
	Type              string    `json:"type"`
	Name              string    `json:"name"`
	Phone             string    `json:"phone"`
	Email             *string   `json:"email"`
	CarBrand          *string   `json:"car_brand"`
	VIN               *string   `json:"vin"`
	ServiceID         *int64    `json:"service_id"`
	ServiceTitle      *string   `json:"service_title"`
	Message           *string   `json:"message"`
	Status            string    `json:"status"`
	AssignedManagerID *int64    `json:"assigned_manager_id"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
}

// StaffApplicationFilter — фильтры списка.
type StaffApplicationFilter struct {
	Status            *string
	Type              *string
	AssignedManagerID *int64
	Limit             int
	Offset            int
}

func staffTextPtr(t pgtype.Text) *string {
	if !t.Valid {
		return nil
	}
	s := t.String
	return &s
}

func staffInt8Ptr(i pgtype.Int8) *int64 {
	if !i.Valid {
		return nil
	}
	v := i.Int64
	return &v
}

func scanStaffApp(row pgx.Row) (StaffApplication, error) {
	var a StaffApplication
	var email, car, vin, msg, svcTitle pgtype.Text
	var svcID, mgrID pgtype.Int8
	var ca, ua pgtype.Timestamptz
	err := row.Scan(
		&a.ID, &a.Type, &a.Name, &a.Phone, &email, &car, &vin, &svcID, &svcTitle,
		&msg, &a.Status, &mgrID, &ca, &ua,
	)
	if err != nil {
		return a, err
	}
	a.Email = staffTextPtr(email)
	a.CarBrand = staffTextPtr(car)
	a.VIN = staffTextPtr(vin)
	a.ServiceID = staffInt8Ptr(svcID)
	a.ServiceTitle = staffTextPtr(svcTitle)
	a.Message = staffTextPtr(msg)
	a.AssignedManagerID = staffInt8Ptr(mgrID)
	if ca.Valid {
		a.CreatedAt = ca.Time
	}
	if ua.Valid {
		a.UpdatedAt = ua.Time
	}
	return a, nil
}

// ListStaffApplications — список с фильтрами и пагинацией.
func (r *ApplicationRepository) ListStaffApplications(ctx context.Context, f StaffApplicationFilter) ([]StaffApplication, error) {
	if f.Limit <= 0 || f.Limit > 200 {
		f.Limit = 50
	}
	if f.Offset < 0 {
		f.Offset = 0
	}
	const q = `
		SELECT a.id, a.type::text, a.name, a.phone, a.email, a.car_brand, a.vin, a.service_id,
			s.title,
			a.message, a.status::text, a.assigned_manager_id, a.created_at, a.updated_at
		FROM applications a
		LEFT JOIN services s ON s.id = a.service_id
		WHERE ($1::text IS NULL OR $1 = '' OR a.status::text = $1)
		  AND ($2::text IS NULL OR $2 = '' OR a.type::text = $2)
		  AND ($3::bigint IS NULL OR a.assigned_manager_id = $3)
		ORDER BY a.created_at DESC
		LIMIT $4 OFFSET $5`
	rows, err := r.pool.Query(ctx, q, f.Status, f.Type, f.AssignedManagerID, f.Limit, f.Offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []StaffApplication
	for rows.Next() {
		a, err := scanStaffApp(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, a)
	}
	return out, rows.Err()
}

// GetStaffApplication — одна заявка по id.
func (r *ApplicationRepository) GetStaffApplication(ctx context.Context, id int64) (*StaffApplication, error) {
	const q = `
		SELECT a.id, a.type::text, a.name, a.phone, a.email, a.car_brand, a.vin, a.service_id,
			s.title,
			a.message, a.status::text, a.assigned_manager_id, a.created_at, a.updated_at
		FROM applications a
		LEFT JOIN services s ON s.id = a.service_id
		WHERE a.id = $1`
	a, err := scanStaffApp(r.pool.QueryRow(ctx, q, id))
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &a, nil
}

// UpdateApplicationStaff — статус и назначенный менеджер.
func (r *ApplicationRepository) UpdateApplicationStaff(ctx context.Context, id int64, status string, assignedManagerID *int64) error {
	const q = `
		UPDATE applications
		SET status = $2::application_status,
		    assigned_manager_id = $3,
		    updated_at = NOW()
		WHERE id = $1`
	ct, err := r.pool.Exec(ctx, q, id, status, assignedManagerID)
	if err != nil {
		return err
	}
	if ct.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

// AddApplicationHistory — событие в истории заявки.
func (r *ApplicationRepository) AddApplicationHistory(ctx context.Context, applicationID int64, userID *int64, event string, payload any) error {
	b, mErr := json.Marshal(payload)
	if mErr != nil {
		b = []byte("{}")
	}
	const q = `
		INSERT INTO application_history (application_id, user_id, event, payload)
		VALUES ($1, $2, $3, $4)`
	_, err := r.pool.Exec(ctx, q, applicationID, userID, event, b)
	return err
}

// StaffComment — комментарий с email автора.
type StaffComment struct {
	ID        int64     `json:"id"`
	UserID    int64     `json:"user_id"`
	UserEmail string    `json:"user_email"`
	Body      string    `json:"body"`
	CreatedAt time.Time `json:"created_at"`
}

func (r *ApplicationRepository) ListApplicationComments(ctx context.Context, applicationID int64) ([]StaffComment, error) {
	const q = `
		SELECT c.id, c.user_id, u.email, c.body, c.created_at
		FROM application_comments c
		INNER JOIN users u ON u.id = c.user_id
		WHERE c.application_id = $1
		ORDER BY c.created_at ASC, c.id ASC`
	rows, err := r.pool.Query(ctx, q, applicationID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []StaffComment
	for rows.Next() {
		var c StaffComment
		if err := rows.Scan(&c.ID, &c.UserID, &c.UserEmail, &c.Body, &c.CreatedAt); err != nil {
			return nil, err
		}
		out = append(out, c)
	}
	return out, rows.Err()
}

// StaffHistoryEvent — запись истории.
type StaffHistoryEvent struct {
	ID        int64           `json:"id"`
	UserID    *int64          `json:"user_id"`
	Event     string          `json:"event"`
	Payload   json.RawMessage `json:"payload"`
	CreatedAt time.Time       `json:"created_at"`
}

func (r *ApplicationRepository) ListApplicationHistory(ctx context.Context, applicationID int64) ([]StaffHistoryEvent, error) {
	const q = `
		SELECT id, user_id, event, payload, created_at
		FROM application_history
		WHERE application_id = $1
		ORDER BY created_at ASC, id ASC`
	rows, err := r.pool.Query(ctx, q, applicationID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []StaffHistoryEvent
	for rows.Next() {
		var h StaffHistoryEvent
		var uid pgtype.Int8
		var payload []byte
		if err := rows.Scan(&h.ID, &uid, &h.Event, &payload, &h.CreatedAt); err != nil {
			return nil, err
		}
		h.UserID = staffInt8Ptr(uid)
		if len(payload) > 0 {
			h.Payload = payload
		} else {
			h.Payload = json.RawMessage("{}")
		}
		out = append(out, h)
	}
	return out, rows.Err()
}

// AddApplicationComment — комментарий сотрудника.
func (r *ApplicationRepository) AddApplicationComment(ctx context.Context, applicationID, userID int64, body string) (int64, error) {
	const q = `
		INSERT INTO application_comments (application_id, user_id, body)
		VALUES ($1, $2, $3) RETURNING id`
	var id int64
	err := r.pool.QueryRow(ctx, q, applicationID, userID, body).Scan(&id)
	return id, err
}
