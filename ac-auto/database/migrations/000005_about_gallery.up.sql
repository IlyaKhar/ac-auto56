-- 5 слотов для слайдера «О компании» (пути к файлам в public или URL)
CREATE TABLE about_gallery_slots (
    slot_index SMALLINT PRIMARY KEY CHECK (slot_index >= 0 AND slot_index < 5),
    image_url TEXT NOT NULL DEFAULT '',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO about_gallery_slots (slot_index, image_url) VALUES
    (0, ''),
    (1, ''),
    (2, ''),
    (3, ''),
    (4, '');
