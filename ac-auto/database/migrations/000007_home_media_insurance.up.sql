ALTER TABLE home_media_slots
  DROP CONSTRAINT IF EXISTS home_media_slots_section_check;

ALTER TABLE home_media_slots
  ADD CONSTRAINT home_media_slots_section_check
  CHECK (section IN ('our_services', 'car_inspection', 'happy_owners', 'insurance_services'));

INSERT INTO home_media_slots (section, slot_index, image_url)
SELECT 'insurance_services', gs, '' FROM generate_series(0, 3) gs
ON CONFLICT (section, slot_index) DO NOTHING;
