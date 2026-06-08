-- Откат демо-контента (ручной down; на проде обычно не нужен).

DELETE FROM vehicles
WHERE title IN (
    'Toyota Camry 2.5 AT, 2019',
    'Kia Rio 1.6 AT, 2020',
    'Hyundai Solaris 1.6 AT, 2021',
    'Volkswagen Polo 1.6 AT, 2018'
);

UPDATE home_media_slots SET image_url = '', updated_at = NOW()
WHERE image_url LIKE '/home/%'
   OR image_url LIKE '/car-inspection/%'
   OR image_url LIKE '/happy-owners/%'
   OR image_url LIKE '/insurance-services/%';

UPDATE about_gallery_slots SET image_url = '', updated_at = NOW()
WHERE image_url LIKE '/about-gallery/%';
