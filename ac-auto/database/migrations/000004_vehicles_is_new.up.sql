-- Признак «новый / с пробегом» для карточек и фильтров каталога
ALTER TABLE vehicles
  ADD COLUMN IF NOT EXISTS is_new BOOLEAN NOT NULL DEFAULT false;
