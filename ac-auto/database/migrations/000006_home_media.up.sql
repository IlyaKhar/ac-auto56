-- Фото для трёх блоков на главной:
-- 1) Наши услуги (8 слотов)
-- 2) Как мы проверяем автомобиль (6 слотов)
-- 3) Счастливые обладатели наших машин (9 слотов)
CREATE TABLE home_media_slots (
    section TEXT NOT NULL CHECK (section IN ('our_services', 'car_inspection', 'happy_owners')),
    slot_index SMALLINT NOT NULL CHECK (slot_index >= 0),
    image_url TEXT NOT NULL DEFAULT '',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (section, slot_index)
);

INSERT INTO home_media_slots (section, slot_index, image_url)
SELECT 'our_services', gs, '' FROM generate_series(0, 7) gs;

INSERT INTO home_media_slots (section, slot_index, image_url)
SELECT 'car_inspection', gs, '' FROM generate_series(0, 5) gs;

INSERT INTO home_media_slots (section, slot_index, image_url)
SELECT 'happy_owners', gs, '' FROM generate_series(0, 8) gs;
