#!/usr/bin/env sh
# Простой дамп PostgreSQL. Нужен pg_dump в PATH.
# Пример: DATABASE_URL=postgres://user:pass@localhost:5432/dbname ./scripts/backup-db.sh

set -eu

if [ -z "${DATABASE_URL:-}" ]; then
  echo "Задай DATABASE_URL" >&2
  exit 1
fi

out="${BACKUP_DIR:-./backups}"
mkdir -p "$out"
file="$out/pg-$(date +%Y%m%d-%H%M%S).sql.gz"
pg_dump "$DATABASE_URL" | gzip -c >"$file"
echo "OK: $file"
