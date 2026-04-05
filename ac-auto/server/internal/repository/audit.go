package repository

import (
	"context"
	"encoding/json"
	"net"
	"strings"

	"github.com/jackc/pgx/v5/pgxpool"
)

type AuditRepository struct {
	pool *pgxpool.Pool
}

func NewAuditRepository(pool *pgxpool.Pool) *AuditRepository {
	return &AuditRepository{pool: pool}
}

// Log пишет audit_logs (user_id из JWT; IP опционально).
func (r *AuditRepository) Log(ctx context.Context, userID int64, action, entityType string, entityID *int64, meta map[string]any, clientIP string) error {
	var metaJSON []byte
	if meta != nil {
		var err error
		metaJSON, err = json.Marshal(meta)
		if err != nil {
			metaJSON = []byte("{}")
		}
	} else {
		metaJSON = []byte("{}")
	}
	var ip any
	raw := strings.TrimSpace(clientIP)
	if raw != "" {
		if p := net.ParseIP(raw); p != nil {
			ip = p.String()
		} else if h, _, err := net.SplitHostPort(raw); err == nil {
			if p := net.ParseIP(h); p != nil {
				ip = p.String()
			}
		}
	}
	const q = `
		INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata, ip)
		VALUES ($1, $2, $3, $4, $5, $6::inet)`
	_, err := r.pool.Exec(ctx, q, userID, action, entityType, entityID, metaJSON, ip)
	return err
}
