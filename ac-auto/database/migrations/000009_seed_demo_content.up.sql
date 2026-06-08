-- Демо-контент из client/public (фото копируются scripts/sync-media-to-public.sh).
-- Идемпотентно: только UPDATE пустых слотов и INSERT авто если каталог пуст.

-- Главная: блоки с фото
UPDATE home_media_slots SET image_url = '/home/our-services/01-vykup.jpg', updated_at = NOW()
WHERE section = 'our_services' AND slot_index = 0 AND image_url = '';

UPDATE home_media_slots SET image_url = '/home/our-services/02-trade-in.jpg', updated_at = NOW()
WHERE section = 'our_services' AND slot_index = 1 AND image_url = '';

UPDATE home_media_slots SET image_url = '/home/our-services/03-komissiya.jpg', updated_at = NOW()
WHERE section = 'our_services' AND slot_index = 2 AND image_url = '';

UPDATE home_media_slots SET image_url = '/home/our-services/04-avtokredit.jpg', updated_at = NOW()
WHERE section = 'our_services' AND slot_index = 3 AND image_url = '';

UPDATE home_media_slots SET image_url = '/home/our-services/05-strakhovanie.png', updated_at = NOW()
WHERE section = 'our_services' AND slot_index = 4 AND image_url = '';

UPDATE home_media_slots SET image_url = '/home/our-services/06-avtoservis.png', updated_at = NOW()
WHERE section = 'our_services' AND slot_index = 5 AND image_url = '';

UPDATE home_media_slots SET image_url = '/home/our-services/07-malyarka.jpg', updated_at = NOW()
WHERE section = 'our_services' AND slot_index = 6 AND image_url = '';

UPDATE home_media_slots SET image_url = '/home/our-services/08-avtomoyka.jpg', updated_at = NOW()
WHERE section = 'our_services' AND slot_index = 7 AND image_url = '';

UPDATE home_media_slots SET image_url = '/car-inspection/01-dvigatel.png', updated_at = NOW()
WHERE section = 'car_inspection' AND slot_index = 0 AND image_url = '';

UPDATE home_media_slots SET image_url = '/car-inspection/02-kuzov.jpg', updated_at = NOW()
WHERE section = 'car_inspection' AND slot_index = 1 AND image_url = '';

UPDATE home_media_slots SET image_url = '/car-inspection/03-salon.jpg', updated_at = NOW()
WHERE section = 'car_inspection' AND slot_index = 2 AND image_url = '';

UPDATE home_media_slots SET image_url = '/car-inspection/04-hodovaya.jpg', updated_at = NOW()
WHERE section = 'car_inspection' AND slot_index = 3 AND image_url = '';

UPDATE home_media_slots SET image_url = '/car-inspection/05-diagnostika.jpg', updated_at = NOW()
WHERE section = 'car_inspection' AND slot_index = 4 AND image_url = '';

UPDATE home_media_slots SET image_url = '/car-inspection/06-dokumenty.jpg', updated_at = NOW()
WHERE section = 'car_inspection' AND slot_index = 5 AND image_url = '';

UPDATE home_media_slots SET image_url = '/happy-owners/01.jpg', updated_at = NOW()
WHERE section = 'happy_owners' AND slot_index = 0 AND image_url = '';

UPDATE home_media_slots SET image_url = '/happy-owners/02.jpg', updated_at = NOW()
WHERE section = 'happy_owners' AND slot_index = 1 AND image_url = '';

UPDATE home_media_slots SET image_url = '/happy-owners/03.jpg', updated_at = NOW()
WHERE section = 'happy_owners' AND slot_index = 2 AND image_url = '';

UPDATE home_media_slots SET image_url = '/happy-owners/04.jpg', updated_at = NOW()
WHERE section = 'happy_owners' AND slot_index = 3 AND image_url = '';

UPDATE home_media_slots SET image_url = '/happy-owners/05.jpg', updated_at = NOW()
WHERE section = 'happy_owners' AND slot_index = 4 AND image_url = '';

UPDATE home_media_slots SET image_url = '/happy-owners/06.jpg', updated_at = NOW()
WHERE section = 'happy_owners' AND slot_index = 5 AND image_url = '';

UPDATE home_media_slots SET image_url = '/happy-owners/07.jpg', updated_at = NOW()
WHERE section = 'happy_owners' AND slot_index = 6 AND image_url = '';

UPDATE home_media_slots SET image_url = '/happy-owners/08.jpg', updated_at = NOW()
WHERE section = 'happy_owners' AND slot_index = 7 AND image_url = '';

UPDATE home_media_slots SET image_url = '/happy-owners/09.jpg', updated_at = NOW()
WHERE section = 'happy_owners' AND slot_index = 8 AND image_url = '';

UPDATE home_media_slots SET image_url = '/insurance-services/osago.png', updated_at = NOW()
WHERE section = 'insurance_services' AND slot_index = 0 AND image_url = '';

UPDATE home_media_slots SET image_url = '/insurance-services/kasko.jpg', updated_at = NOW()
WHERE section = 'insurance_services' AND slot_index = 1 AND image_url = '';

UPDATE home_media_slots SET image_url = '/insurance-services/life.jpg', updated_at = NOW()
WHERE section = 'insurance_services' AND slot_index = 2 AND image_url = '';

UPDATE home_media_slots SET image_url = '/insurance-services/gap.jpg', updated_at = NOW()
WHERE section = 'insurance_services' AND slot_index = 3 AND image_url = '';

-- Слайдер «О компании»
UPDATE about_gallery_slots SET image_url = '/about-gallery/01.jpg', updated_at = NOW()
WHERE slot_index = 0 AND image_url = '';

UPDATE about_gallery_slots SET image_url = '/about-gallery/02.jpg', updated_at = NOW()
WHERE slot_index = 1 AND image_url = '';

UPDATE about_gallery_slots SET image_url = '/about-gallery/03.jpg', updated_at = NOW()
WHERE slot_index = 2 AND image_url = '';

UPDATE about_gallery_slots SET image_url = '/about-gallery/04.jpg', updated_at = NOW()
WHERE slot_index = 3 AND image_url = '';

UPDATE about_gallery_slots SET image_url = '/about-gallery/05.jpg', updated_at = NOW()
WHERE slot_index = 4 AND image_url = '';

-- Демо-каталог (только если пусто)
INSERT INTO vehicles (title, brand_label, price_rub, description, features, images, sort_order, is_published, is_new)
SELECT *
FROM (
    VALUES
        (
            'Toyota Camry 2.5 AT, 2019',
            'Toyota',
            1850000,
            'Один владелец, сервисная история, полный комплект ключей.',
            '["АКПП", "Кожа", "Камера заднего вида", "Круиз-контроль"]'::jsonb,
            '["/vehicles/toyota-camry-1.jpg"]'::jsonb,
            0,
            true,
            false
        ),
        (
            'Kia Rio 1.6 AT, 2020',
            'Kia',
            1290000,
            'Экономичный городской седан в отличном состоянии.',
            '["АКПП", "Климат", "Мультируль", "ABS"]'::jsonb,
            '["/vehicles/kia-rio-1.jpg"]'::jsonb,
            1,
            true,
            false
        ),
        (
            'Hyundai Solaris 1.6 AT, 2021',
            'Hyundai',
            1420000,
            'Проверен юридически и технически, готов к выдаче.',
            '["АКПП", "Подогрев сидений", "Bluetooth", "ESP"]'::jsonb,
            '["/vehicles/hyundai-solaris-1.jpg"]'::jsonb,
            2,
            true,
            false
        ),
        (
            'Volkswagen Polo 1.6 AT, 2018',
            'Volkswagen',
            1180000,
            'Надёжный вариант для города, без ДТП по базе.',
            '["АКПП", "Кондиционер", "2 комплекта резины"]'::jsonb,
            '["/vehicles/vw-polo-1.jpg"]'::jsonb,
            3,
            true,
            false
        )
) AS v(title, brand_label, price_rub, description, features, images, sort_order, is_published, is_new)
WHERE NOT EXISTS (SELECT 1 FROM vehicles LIMIT 1);
