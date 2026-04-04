# AC Auto — платформа (каркас)

Монорепозиторий: **PostgreSQL** + **Go (Fiber) API** + **React (Vite) клиент**.

## Требования

- Docker + Docker Compose **или** локально: Go 1.22+, Node 20+, PostgreSQL 16.

## Быстрый старт (Docker)

В `docker-compose.yml` задано `name: acauto`, чтобы не падать с ошибкой `project name must not be empty` на путях с кириллицей. При необходимости: `docker compose -p myname up`.

```bash
docker compose up --build
```

**Сборка Go падает с `missing go.sum entry`:** в `server/Dockerfile` уже стоит `go mod tidy` перед `go build`. Локально один раз: `cd server && go mod tidy` (и при открытии корня монорепы Cursor/gopls подхватит `go.work`). Закоммить `go.sum` — ускорит кэш слоёв Docker.

**Сотни «ошибок» в Go-файлах в IDE:** часто не было `go.sum` или корень не видел модуль. В репо добавлены `server/go.sum` и корневой `go.work` (`use ./server`). После обновления: в `server/` выполни `go mod tidy` (подтянет/почистит суммы), в Cursor/VS Code — **Go: Restart Language Server**. Папка `client` в `.vscode/settings.json` исключена из обхода gopls, чтобы не путать JS и Go.

**Клиент (`npm install` / `broken pipe` / `signal: killed`):** часто не хватает RAM у Docker Desktop. Увеличь память (Settings → Resources) или собери по очереди: `docker compose build api`, затем `docker compose build client`, потом `docker compose up`.

- API: http://localhost:8080/health и http://localhost:8080/api/v1/health  
- **Swagger UI:** http://localhost:8080/swagger/index.html — спецификация в репозитории: `server/docs/swagger.json` (OpenAPI 2.0)  
- Авторизация: `POST /api/v1/auth/login`, `POST /api/v1/auth/refresh`, `GET /api/v1/auth/me` (Bearer access)  
- Заявка с сайта: `POST /api/v1/applications` (с Turnstile или `TURNSTILE_SKIP=true`)  
- Публичный каталог: `GET /api/v1/service-categories`, `GET /api/v1/services` (`?category_id=&limit=&offset=`), `GET /api/v1/services/:id`, `GET /api/v1/pages/:slug` (только `published`)  
- Публично: `GET /api/v1/menu-items`, `GET /api/v1/footer-sections`  
- Сотрудники (Bearer, **moderator** или **admin**): `/api/v1/staff/applications` (список/деталь/PATCH/комменты), `GET /staff/users` — список сотрудников для назначения менеджера  
- Админка (Bearer, **admin**): `/api/v1/admin/` — пользователи: `GET /roles`, `GET|POST /users`, `GET|PATCH /users/:id`, `POST /users/:id/reset-password`; меню: `GET|POST /menu-items`, `GET|PATCH|DELETE /menu-items/:id`, `POST /menu-items/reorder`; футер: `GET|POST /footer-sections`, `GET|PATCH|DELETE /footer-sections/:id`, `POST /footer-sections/reorder`; плюс ранее: категории, услуги, страницы, блоки  
- Клиент: http://localhost:5173  

В compose для разработки включён `TURNSTILE_SKIP=true`. В проде задай `TURNSTILE_SECRET_KEY` и выключи skip.

### Seed пользователей (admin / moderator)

После `docker compose up` (миграции уже применил API):

```bash
docker compose --profile seed run --rm seed
```

По умолчанию создаётся только **admin** (`ADMIN_EMAIL` / `ADMIN_PASSWORD` в compose).

Дополнительно **moderator** (для `/api/v1/staff/*`): задай переменные и снова запусти seed (повторный запуск не дублирует уже существующие email):

```bash
set MODERATOR_EMAIL=mod@mail.test
set MODERATOR_PASSWORD=ДругойПароль
docker compose --profile seed run --rm seed
```

Можно указать только пару **MODERATOR_*** (без админа) — тогда создастся только модератор; для админки контента всё равно понадобится admin.

(На Linux/macOS: `export MODERATOR_EMAIL=...`.)

### Дальше по проекту

1. **Фронт публичный** — тянуть `service-categories`, `services`, `pages/:slug`, формы заявок + Turnstile.  
2. **Админ UI** — layout `/admin`, логин, CRUD страниц/блоков/услуг, список заявок (staff).  
3. **Меню и футер** — API + админка (таблицы уже в миграции).  
4. **Жёстче прод** — rate limit по зонам, refresh rotation, `audit` на критичные staff-действия, OpenAPI в `/docs`.  
5. **Уведомления** — очередь + Telegram/email (как планировали).

### Локально без Docker (API)

1. Создай БД и скопируй `.env.example` → `.env` в корне или экспортируй переменные.
2. `cd server && go mod tidy && go run ./cmd/api` (первая команда скачает модули и создаст `go.sum`).

Миграции применяются при старте API (`MIGRATIONS_PATH` указывает на `database/migrations`).

### Локально клиент

```bash
cd client && npm install && npm run dev
```

Переменная `VITE_API_URL=http://localhost:8080` (в `.env` клиента или в shell).

## Структура

- `database/migrations` — SQL для golang-migrate  
- `server` — Fiber API  
- `client` — Vite + React + Tailwind  
- `docs` — решения и дальше OpenAPI  

## Скрипт бэкапа (заготовка)

```bash
scripts/backup-db.sh
```

Задай `DATABASE_URL` или параметры `PGHOST`, `PGUSER`, `PGDATABASE`. На Windows используй WSL или аналог `pg_dump`.
