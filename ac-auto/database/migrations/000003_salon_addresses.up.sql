-- Заголовок секции «Адреса» на главной (одна строка id=1)
CREATE TABLE salon_address_settings (
    id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    section_title VARCHAR(500) NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO salon_address_settings (id, section_title)
VALUES (1, 'Адрес автосалона и автосервиса «ACT AUTO»');

CREATE TABLE salon_addresses (
    id BIGSERIAL PRIMARY KEY,
    sort_order INT NOT NULL DEFAULT 0,
    image_url TEXT NOT NULL DEFAULT '',
    city VARCHAR(255) NOT NULL DEFAULT '',
    street VARCHAR(500) NOT NULL DEFAULT '',
    phone VARCHAR(100) NOT NULL DEFAULT '',
    yandex_maps_url TEXT NOT NULL DEFAULT '',
    gis_url TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_salon_addresses_sort ON salon_addresses (sort_order);

INSERT INTO salon_addresses (sort_order, image_url, city, street, phone, yandex_maps_url, gis_url)
VALUES
    (0, '/locations/salon-3a.jpg', 'г. Оренбург', 'ул. Авторемонтная, 3А', '+7 (961) 942-99-92',
     'https://yandex.ru/maps/org/ast_avto/211550710125/?ll=55.162301%2C51.794484&utm_source=share&z=18',
     'https://2gis.ru/orenburg/firm/70000001083243865?m=55.162139%2C51.794388%2F16'),
    (1, '/locations/salon-3.jpg', 'г. Оренбург', 'ул. Авторемонтная, 3', '+7 (903) 392-44-55',
     'https://yandex.ru/maps/org/ast_avto/211550710125/?ll=55.162301%2C51.794484&utm_source=share&z=18',
     'https://2gis.ru/orenburg/firm/70000001083243865?m=55.162139%2C51.794388%2F16');
