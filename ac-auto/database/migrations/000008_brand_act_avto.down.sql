UPDATE salon_address_settings
SET section_title = 'Адрес автосалона и автосервиса «ACT AUTO»',
    updated_at = NOW()
WHERE section_title LIKE '%ACT АВТО%';
