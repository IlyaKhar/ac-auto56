-- Бренд на сайте: ACT AUTO → ACT АВТО (уже развёрнутые БД)
UPDATE salon_address_settings
SET section_title = 'Адрес автосалона и автосервиса «ACT АВТО»',
    updated_at = NOW()
WHERE section_title LIKE '%ACT AUTO%';
