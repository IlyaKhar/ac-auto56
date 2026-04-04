-- Роли и пользователи (админка без публичной регистрации)
CREATE TABLE roles (
    id SMALLSERIAL PRIMARY KEY,
    name VARCHAR(32) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO roles (name) VALUES ('moderator'), ('admin');

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id SMALLINT NOT NULL REFERENCES roles (id),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    totp_secret VARCHAR(255),
    totp_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_role_id ON users (role_id);

CREATE TABLE refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens (user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens (expires_at);

-- Услуги
CREATE TABLE service_categories (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE services (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    price NUMERIC(12, 2),
    duration VARCHAR(255),
    category_id BIGINT NOT NULL REFERENCES service_categories (id),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_services_category_active ON services (category_id, is_active);

-- Страницы и блоки (CMS)
CREATE TABLE pages (
    id BIGSERIAL PRIMARY KEY,
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(500) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('draft', 'published')),
    seo_title VARCHAR(500),
    seo_description TEXT,
    og_image_url TEXT,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pages_status ON pages (status);

CREATE TABLE blocks (
    id BIGSERIAL PRIMARY KEY,
    page_id BIGINT NOT NULL REFERENCES pages (id) ON DELETE CASCADE,
    block_type VARCHAR(100) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_blocks_page_sort ON blocks (page_id, sort_order);

-- Медиа (пока URL; под S3 расширим)
CREATE TABLE media (
    id BIGSERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    alt TEXT,
    mime VARCHAR(128),
    size_bytes INT CHECK (
        size_bytes IS NULL
        OR size_bytes <= 5242880
    ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Меню и футер
CREATE TABLE menu_items (
    id BIGSERIAL PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    href TEXT,
    page_id BIGINT REFERENCES pages (id) ON DELETE SET NULL,
    parent_id BIGINT REFERENCES menu_items (id) ON DELETE CASCADE,
    sort_order INT NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE footer_sections (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255),
    content TEXT NOT NULL DEFAULT '',
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Заявки
CREATE TYPE application_type AS ENUM ('callback', 'question', 'service_request');

CREATE TYPE application_status AS ENUM (
    'new',
    'in_progress',
    'completed',
    'rejected'
);

CREATE TABLE applications (
    id BIGSERIAL PRIMARY KEY,
    type application_type NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    car_brand VARCHAR(255),
    vin VARCHAR(64),
    service_id BIGINT REFERENCES services (id) ON DELETE SET NULL,
    message TEXT,
    status application_status NOT NULL DEFAULT 'new',
    assigned_manager_id BIGINT REFERENCES users (id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_applications_status_created ON applications (status, created_at DESC);
CREATE INDEX idx_applications_manager ON applications (assigned_manager_id);
CREATE INDEX idx_applications_type ON applications (type);

CREATE TABLE application_comments (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL REFERENCES applications (id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_application_comments_app ON application_comments (application_id);

CREATE TABLE application_history (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL REFERENCES applications (id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users (id) ON DELETE SET NULL,
    event VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_application_history_app_created ON application_history (application_id, created_at DESC);

CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users (id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id BIGINT,
    metadata JSONB NOT NULL DEFAULT '{}',
    ip INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_entity ON audit_logs (entity_type, entity_id);
CREATE INDEX idx_audit_user_created ON audit_logs (user_id, created_at DESC);
