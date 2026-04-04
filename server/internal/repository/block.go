package repository

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Block struct {
	ID        int64  `json:"id"`
	PageID    int64  `json:"page_id"`
	BlockType string `json:"block_type"`
	SortOrder int    `json:"sort_order"`
	Data      []byte `json:"-"`
}

// BlockJSON — отдача в API (data как JSON).
type BlockJSON struct {
	ID        int64           `json:"id"`
	PageID    int64           `json:"page_id,omitempty"`
	BlockType string          `json:"block_type"`
	SortOrder int             `json:"sort_order"`
	Data      jsonRaw         `json:"data"`
}

// jsonRaw оборачивает []byte для json.Marshal.
type jsonRaw []byte

func (j jsonRaw) MarshalJSON() ([]byte, error) {
	if j == nil || len(j) == 0 {
		return []byte("{}"), nil
	}
	return j, nil
}

func BlockToJSON(b Block) BlockJSON {
	return BlockJSON{
		ID: b.ID, PageID: b.PageID, BlockType: b.BlockType, SortOrder: b.SortOrder, Data: jsonRaw(b.Data),
	}
}

type BlockRepository struct {
	pool *pgxpool.Pool
}

func NewBlockRepository(pool *pgxpool.Pool) *BlockRepository {
	return &BlockRepository{pool: pool}
}

func (r *BlockRepository) ListByPage(ctx context.Context, pageID int64) ([]Block, error) {
	const q = `
		SELECT id, page_id, block_type, sort_order, data
		FROM blocks WHERE page_id = $1
		ORDER BY sort_order ASC, id ASC`
	rows, err := r.pool.Query(ctx, q, pageID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []Block
	for rows.Next() {
		var b Block
		if err := rows.Scan(&b.ID, &b.PageID, &b.BlockType, &b.SortOrder, &b.Data); err != nil {
			return nil, err
		}
		out = append(out, b)
	}
	return out, rows.Err()
}

func (r *BlockRepository) NextSortOrder(ctx context.Context, pageID int64) (int, error) {
	const q = `SELECT COALESCE(MAX(sort_order), -1) + 1 FROM blocks WHERE page_id = $1`
	var n int
	err := r.pool.QueryRow(ctx, q, pageID).Scan(&n)
	return n, err
}

func (r *BlockRepository) Create(ctx context.Context, pageID int64, blockType string, sortOrder int, data []byte) (int64, error) {
	if len(data) == 0 {
		data = []byte("{}")
	}
	const q = `
		INSERT INTO blocks (page_id, block_type, sort_order, data)
		VALUES ($1, $2, $3, $4) RETURNING id`
	var id int64
	err := r.pool.QueryRow(ctx, q, pageID, blockType, sortOrder, data).Scan(&id)
	return id, err
}

func (r *BlockRepository) GetByID(ctx context.Context, id int64) (*Block, error) {
	const q = `SELECT id, page_id, block_type, sort_order, data FROM blocks WHERE id = $1`
	var b Block
	err := r.pool.QueryRow(ctx, q, id).Scan(&b.ID, &b.PageID, &b.BlockType, &b.SortOrder, &b.Data)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &b, nil
}

func (r *BlockRepository) Update(ctx context.Context, id int64, blockType string, sortOrder int, data []byte) error {
	if len(data) == 0 {
		data = []byte("{}")
	}
	const q = `
		UPDATE blocks SET block_type = $2, sort_order = $3, data = $4, updated_at = NOW()
		WHERE id = $1`
	ct, err := r.pool.Exec(ctx, q, id, blockType, sortOrder, data)
	if err != nil {
		return err
	}
	if ct.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

func (r *BlockRepository) Delete(ctx context.Context, id int64) error {
	const q = `DELETE FROM blocks WHERE id = $1`
	ct, err := r.pool.Exec(ctx, q, id)
	if err != nil {
		return err
	}
	if ct.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

func (r *BlockRepository) Reorder(ctx context.Context, pageID int64, blockIDs []int64) error {
	if len(blockIDs) == 0 {
		return nil
	}
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	for i, bid := range blockIDs {
		const q = `UPDATE blocks SET sort_order = $1, updated_at = NOW() WHERE id = $2 AND page_id = $3`
		ct, err := tx.Exec(ctx, q, i, bid, pageID)
		if err != nil {
			return err
		}
		if ct.RowsAffected() == 0 {
			return pgx.ErrNoRows
		}
	}
	return tx.Commit(ctx)
}
