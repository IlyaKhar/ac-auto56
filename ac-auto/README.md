# AC Auto — платформа (каркас)

Монорепозиторий: **PostgreSQL** + **Go (Fiber) API** + **React (Vite) клиент**.

## Требования

- Docker + Docker Compose **или** локально: Go 1.22+, Node 20+, PostgreSQL 16.

## Быстрый старт (Docker)

В `docker-compose.yml` задано `name: acauto`, чтобы не падать с ошибкой `project name must not be empty` на путях с кириллицей. При необходимости: `docker compose -p myname up`.

**Один запуск (без обязательного `.env`):**

Запускай **из корня репозитория** (папка, где лежит `docker-compose.yml`), не из `server/`.

```bash
docker compose up --build
```

**Windows: ошибка `x-docker-expose-session-sharedkey` / non-printable ASCII** — баг связки BuildKit / Compose Bake (часто на путях с **кириллицей**). Сначала попробуй отключить bake и снова из корня:

```powershell
$env:COMPOSE_BAKE = "false"
docker compose up --build
```

Или скрипт: `.\scripts\docker-up.ps1`. Если не помогло — обнови Docker Desktop; в крайнем случае клонируй репу в путь **только из латиницы** (например `C:\dev\ac-auto`).

Поднимутся Postgres → API (миграции) → контейнер **`bootstrap`** создаёт админа (идемпотентно) → **Vite** на :5173. Корневой `.env` **не обязателен**: в compose заданы дефолты; свой `JWT_SECRET` / пароли — скопируй `.env.example` → `.env`.

**Вход в админку после первого старта (дефолты compose):** `admin@local.test` / `dev-AdminPass-change-me` (смени через `.env`: `ADMIN_EMAIL`, `ADMIN_PASSWORD`).

**Фронт в Docker** читает `VITE_*` из **подстановки** compose: положи в **корневой** `.env` строки `VITE_API_URL` и при необходимости `VITE_TURNSTILE_SITE_KEY` (или останутся дефолты). Файл `client/.env` для контейнера не используется — он для локального `npm run dev`.

Если Compose ругается на `service_completed_successfully`, обнови Docker Desktop / plugin Compose (нужен v2.23+); временно удали у сервиса `client` зависимость `bootstrap` в `docker-compose.yml`, оставь только `api`.

**Сборка Go падает с `missing go.sum entry`:** в `server/Dockerfile` уже стоит `go mod tidy` перед `go build`. Локально один раз: `cd server && go mod tidy` (и при открытии корня монорепы Cursor/gopls подхватит `go.work`). Закоммить `go.sum` — ускорит кэш слоёв Docker.

**Сотни «ошибок» в Go-файлах в IDE:** часто не было `go.sum` или корень не видел модуль. В репо добавлены `server/go.sum` и корневой `go.work` (`use ./server`). После обновления: в `server/` выполни `go mod tidy` (подтянет/почистит суммы), в Cursor/VS Code — **Go: Restart Language Server**. Папка `client` в `.vscode/settings.json` исключена из обхода gopls, чтобы не путать JS и Go.

**Клиент (`npm install` / `broken pipe` / `signal: killed`):** часто не хватает RAM у Docker Desktop. Увеличь память (Settings → Resources) или собери по очереди: `docker compose build api`, затем `docker compose build client`, потом `docker compose up`.

- API: http://localhost:8080/health и http://localhost:8080/api/v1/health  
- **Swagger UI:** http://localhost:8080/swagger/index.html — спецификация в репозитории: `server/docs/swagger.json` (OpenAPI 2.0)  
- Авторизация: `POST /api/v1/auth/login`, `POST /api/v1/auth/refresh`, `GET /api/v1/auth/me` (Bearer access)  
- Заявка с сайта: `POST /api/v1/applications` (с Turnstile или `TURNSTILE_SKIP=true`)  
- Публичный каталог: `GET /api/v1/service-categories`, `GET /api/v1/services` (`?category_id=&limit=&offset=`), `GET /api/v1/services/:id`, `GET /api/v1/pages/:slug` (только `published`)  
- Публично: `GET /api/v1/menu-items`, `GET /api/v1/footer-sections`  
- Сотрудники (Bearer, **moderator** или **admin**): `/api/v1/staff/applications` (список/деталь/PATCH/комменты), `GET /api/v1/staff/users` — список сотрудников для назначения менеджера  
- Админка (Bearer, **admin**): `/api/v1/admin/` — пользователи: `GET /roles`, `GET|POST /users`, `GET|PATCH /users/:id`, `POST /users/:id/reset-password`; меню: `GET|POST /menu-items`, `GET|PATCH|DELETE /menu-items/:id`, `POST /menu-items/reorder`; футер: `GET|POST /footer-sections`, `GET|PATCH|DELETE /footer-sections/:id`, `POST /footer-sections/reorder`; плюс ранее: категории, услуги, страницы, блоки  
- Клиент: http://localhost:5173  

В compose для разработки включён `TURNSTILE_SKIP=true`. В проде задай `TURNSTILE_SECRET_KEY` и выключи skip.

### Seed пользователей (admin / moderator)

При **`docker compose up`** сервис **`bootstrap`** уже создаёт админа из `ADMIN_*` (дефолты в compose или из корневого `.env`).

Повторно вручную (после поднятого API):

```bash
docker compose --profile seed run --rm seed
```

По умолчанию в compose: **admin** `admin@local.test` / `dev-AdminPass-change-me` (переопредели `ADMIN_EMAIL` / `ADMIN_PASSWORD` в `.env`).

Дополнительно **moderator** (для `/api/v1/staff/*`): задай переменные и снова запусти seed (повторный запуск не дублирует уже существующие email):

```bash
set MODERATOR_EMAIL=mod@mail.test
set MODERATOR_PASSWORD=ДругойПароль
docker compose --profile seed run --rm seed
```

Можно указать только пару **MODERATOR_*** (без админа) — тогда создастся только модератор; для админки контента всё равно понадобится admin.

(На Linux/macOS: `export MODERATOR_EMAIL=...`.)

### Дальше по проекту

1. **Фронт публичный** — сделано: каталог, страницы CMS, заявка; **Turnstile** — при `VITE_TURNSTILE_SITE_KEY` в клиенте (без ключа — пустой токен, на API нужен `TURNSTILE_SKIP=true` для dev).  
2. **Админ UI** — сделано: `/admin`, CRUD контента; **Staff** — `/staff` (заявки).  
3. **Меню и футер** — сделано: публичные GET + CRUD в админке.  
4. **Жёстче прод** — по желанию: rate limit по зонам, refresh rotation, `audit`, OpenAPI в `/docs`.

### Локально без Docker (API)

1. Создай БД и скопируй `.env.example` → `.env` в корне или экспортируй переменные.
2. `cd server && go mod tidy && go run ./cmd/api` (первая команда скачает модули и создаст `go.sum`).

Миграции применяются при старте API (`MIGRATIONS_PATH` указывает на `database/migrations`).

### Локально клиент

Проект фронта лежит в **`ac-auto/client`**, не в `сайцт/client`. Если открыть не ту папку, `npm run dev` сразу выходит или мигает чужое окно.

**Windows PowerShell (старые версии не понимают `&&`):**

```powershell
cd C:\Users\PC\Desktop\сайцт\ac-auto\client
npm install
npm run dev
```

Или из корня репозитория `ac-auto`:

```powershell
.\scripts\dev-client.ps1
```

Двойной клик по **`ac-auto\scripts\dev-client.cmd`** — окно не закроется при ошибке (`pause`).

В Git Bash / Linux / macOS из папки, где лежит `ac-auto`:

```bash
cd ac-auto/client && npm install && npm run dev
```

Vite сам подхватывает правки в `.jsx`/`.css` — **достаточно сохранить файл и обновить страницу** (часто и без F5). API и Postgres при этом могут крутиться в Docker: в `client/.env` укажи `VITE_API_URL=http://localhost:8080`.

**Шапка/футер без бэка:** по умолчанию `VITE_LAYOUT_FROM_API` **не задан** — меню и футер с API не запрашиваются, используются локальные макеты + `VITE_PUBLIC_PHONE_*` и т.д. Чтобы подтянуть контент из админки, задай `VITE_LAYOUT_FROM_API=true` (в Docker compose это уже `true` по умолчанию).

**Почему в Docker «каждый раз билд»:** образ клиента собирается со снимком файлов на момент `docker compose build`. Чтобы правки из папки `client/` попадали в контейнер **без rebuild**, добавь в сервис `client` том (пример для `docker-compose.override.yml`, файл не в репо):

```yaml
services:
  client:
    volumes:
      - ./client:/app
      - /app/node_modules
```

Второй том оставляет `node_modules` из образа, иначе Windows-директория затрёт их. После изменения `package.json` один раз пересобери образ или выполни `docker compose exec client npm install`. Для ежедневной вёрстки удобнее **локальный** `npm run dev`, а Docker только для API+БД.

Переменные в `.env` клиента (или shell): `VITE_API_URL=http://localhost:8080` при необходимости; для капчи на форме заявки — `VITE_TURNSTILE_SITE_KEY`; бренд в шапке — `VITE_SITE_BRAND`; телефон в шапке без пункта меню `tel:` — `VITE_PUBLIC_PHONE_TEL` / `VITE_PUBLIC_PHONE_LABEL` (в Docker compose заданы дефолты). Пустое меню в админке → в шапке показываются запасные ссылки как на макете (каталог, Trade-In и т.д. на `/page/...`).

**Публичная страница «каталог»** (`/` и `/katalog`): в админке создай страницу со **slug `katalog`**, статус **опубликовано** — заголовок, SEO и блоки подтянутся с `GET /api/v1/pages/katalog`. Меню и футер — из `menu-items` и `footer-sections`.

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
