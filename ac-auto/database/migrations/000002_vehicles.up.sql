-- Каталог авто для сайта и админки
CREATE TABLE vehicles (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    brand_label VARCHAR(255) NOT NULL DEFAULT '',
    price_rub BIGINT NOT NULL DEFAULT 0 CHECK (price_rub >= 0),
    description TEXT NOT NULL DEFAULT '',
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vehicles_published_sort ON vehicles (is_published, sort_order, id);
