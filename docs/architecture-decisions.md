# Архитектурные решения (зафиксировано)

## Заявки: поле `message`

- В БД колонка `applications.message` — **NULLABLE** (для `callback` часто только телефон).
- Валидация на уровне **DTO / use-case**, не только схемы БД:
  - `type = callback` → `message` **опционально** (пустая строка нормализуется в `NULL` или хранится как `''` — выбрать одно в коде и держать консистентно; предпочтительно **`NULL` = «не указали»**).
  - `type = question` | `service_request` → `message` **обязательно** (не пустая строка после trim).

## Капча: Cloudflare Turnstile

- На фронте: виджет Turnstile, в теле `POST /applications` передаётся поле **`turnstile_token`** (или согласованное имя в OpenAPI).
- На бэке: перед созданием заявки вызов **`POST https://challenges.cloudflare.com/turnstile/v0/siteverify`** с телом формы:
  - `secret` — из env (`TURNSTILE_SECRET_KEY`);
  - `response` — токен с клиента;
  - опционально `remoteip` — IP клиента (если доступен и нужен для жёсткости).
- При `success: false` — **422** с понятной ошибкой, без записи заявки.
- Env (черновик): `TURNSTILE_SECRET_KEY`, на фронте публичный `VITE_TURNSTILE_SITE_KEY` (или аналог).
- Локальная разработка: `TURNSTILE_SKIP=true` только на dev/stage; в проде не использовать.

---

Дальше: первая SQL-миграция с `message TEXT NULL`, enum/check на `type`, и контракт `POST /api/v1/applications` в OpenAPI.
