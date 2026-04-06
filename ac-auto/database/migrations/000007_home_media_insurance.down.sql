DELETE FROM home_media_slots WHERE section = 'insurance_services';

ALTER TABLE home_media_slots
  DROP CONSTRAINT IF EXISTS home_media_slots_section_check;

ALTER TABLE home_media_slots
  ADD CONSTRAINT home_media_slots_section_check
  CHECK (section IN ('our_services', 'car_inspection', 'happy_owners'));
