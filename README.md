# API Inventory

Simple TypeScript + Express 5 inventory API with in-memory storage, a lightweight message-bus core,
OpenAPI 3.1 spec, Vitest tests, and Docker support.

This README was updated to reflect the current code and organized for faster onboarding. The
detailed reference that existed before is still available below under “Additional details”.

## Quick start

- Prerequisites: Node 18+, npm
- Install and run (local):
  - `npm install`
  - `npm run env:from-dist`
  - `npm run env:test`
  - `PORT=3000 npm run dev`
- Health check: curl http://localhost:3000/health
- Test API: `npm run test:api`

## Environment variables

- Generate .env from template:

  - Local dev: `npm run env:from-dist` (creates .env by copying .env.dist)
  - Testing: `npm run env:test`
  - Production example:
    `NODE_ENV=production STORAGE_ADAPTER=sqlite SQLITE_DB_PATH=/data/inventory.db npm run env:from-dist`
  - Advanced:
    `npm run env:from-dist -- --out .env.prod --dist .env.dist --set PORT=8080 --set LOG_LEVEL=warn`

- PORT: Port the server listens on (example: 3000). Docker images expose 3000.
- STORAGE_ADAPTER: Storage backend. Options: "memory" (default) or "sqlite".
- SQLITE_DB_PATH: When STORAGE_ADAPTER=sqlite, path to the SQLite database file. Defaults to
  ./data/inventory.db locally, and /data/inventory.db in Docker.
- INITIAL_DATA: Optional path (relative or absolute) to a JSON file used to seed initial products at
  startup. Defaults to data/products.json. The file should contain an array of objects with fields:
  name, description, sku, stock, minStock, createdAt, updatedAt (optional), imageUrl (optional).

## CORS

CORS is enabled by default for all routes and all origins. This makes it easy to call the API
directly from a browser-based frontend during development without configuring proxies.

- Access-Control-Allow-Origin: \*
- Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE
- Preflight (OPTIONS) requests are handled automatically.

Security note: For production environments where you want to restrict who can call this API from a
browser, you can place a reverse proxy (e.g., Nginx) in front and enforce an allowlist of origins,
or adjust the server code to configure cors with a restricted origin list.

## API endpoints (current behavior)

- GET /health → 200
  - Example response: { "status": "ok" } (see openapi/openapi.yaml)
- GET /products → 200
  - Returns an array of products.
- POST /products → 201
  - Body: { name, description, sku, initialStock, minStock, imageUrl? }
  - Errors: 400 (missing fields), 409 (duplicated SKU)
- POST /products/:sku/add → 200
  - Body: { units: number > 0 }
  - Returns: { product } (updated product)
  - Errors: 400 (invalid body), 404 (SKU not found)
- POST /products/:sku/remove → 200
  - Body: { units: number > 0 }
  - Returns: { product } (updated product)
  - Errors: 400 (invalid body or would go negative), 404 (SKU not found)

Tip: The full OpenAPI spec is in openapi/openapi.yaml and is covered by tests in test/e2e.

## Project structure (high level)

This project is organized as a monorepo following Hexagonal Architecture principles.

- src/index.ts: Configurator (Express wiring and route registration)
- inventory/: Hexagonal Application core (ports, business logic)
- driving/: Primary adapters (API Rest)
- driven/: Secondary adapters (storage, time, message bus dispatch)
- openapi/: OpenAPI 3.1 definition
- test/: Unit and E2E tests (Vitest)
- lib/: Shared code that could be used by other projects

---

## Docker usage

### Force Docker to rebuild (images, containers, volumes)

Common scenarios and one-liners when Docker won’t pick up your changes or you need a clean slate.

- Rebuild image without using cache (single Dockerfile build):

  - `docker build --no-cache -t api-inventory .`

- Rebuild and recreate with Docker Compose (build fresh image and force new containers):

  - `docker compose up --build --force-recreate`
  - Tip: add --no-deps to recreate only the listed services.

- Rebuild compose images without cache first, then start:

  - `docker compose build --no-cache`
  - `docker compose up --force-recreate`

- Nuke containers, networks, and volumes created by compose (careful: deletes data volumes):

  - `docker compose down -v --remove-orphans`

- Remove images built by the compose project (to force a full re-pull/rebuild next time):

  - `docker compose down --rmi local`

- Aggressive prune (all dangling/unused images, containers, networks, caches, and volumes):

  - `docker system prune -af --volumes`

- Cache-busting trick in Dockerfile (optional):

  - Add an ARG and change it to invalidate cache across layers
  - Example lines you can add near the top of your Dockerfile build stage: ARG CACHE_BUST=0
    # bump the value: --build-arg CACHE_BUST=$(date +%s)

- Recreate only containers (without rebuilding images):

  - `docker compose up --force-recreate --no-build`

- Verify what will be used (images and configs):
  - `docker compose config`

If you prefer npm scripts, see package.json entries added below.

- Development (Compose dev profile): `npm run compose:up:dev`
- Production (Compose prod profile): `docker compose --profile prod up`
- Change host port only (container still listens on 3000 by default):
  `HOST_PORT=3001 docker compose up`
- Change container internal port too:
  - Compose: `HOST_PORT=4000 PORT=4000 docker compose up` (ports mapping uses
    `${HOST_PORT:-3000}:${PORT:-3000}`)
  - CLI: `docker run -e PORT=4000 -p 4000:4000 api-inventory`
- Override storage adapter/path at runtime (compose): `STORAGE_ADAPTER=memory docker compose up`
- Override from CLI:
  `docker run -e STORAGE_ADAPTER=sqlite -e SQLITE_DB_PATH=/data/inventory.db -p 3000:3000 api-inventory`
- Notes:
  - The image contains a generated .env with safe defaults, but any env provided by docker-compose
    or `docker run -e` overrides those values.
  - Healthcheck respects `PORT`. If you change `PORT`, ensure your ports mapping matches.
- ESM: Extensionless imports are supported in dev and prod containers.

## Frontend development

- CORS is enabled for all origins by default, so you can call the API directly from the browser.
- Base URL from your frontend: `http://localhost:3000` (or `http://localhost:${HOST_PORT}` if you
  set it).
- Optional: Use your dev server proxy for same-origin paths like `/api` (see detailed examples in
  README-ARCHIVE.md for Vite, Next.js, CRA).

## Testing

- Test runner: Vitest (see vitest.config.ts). Common commands:
  - `npm test` — watch mode
  - `npm run test:run` — run once
  - `npm run test:coverage` — with coverage
  - `npm run test:api` — OpenAPI E2E tests
- Locations: test/ contains E2E and unit tests. Some unit tests may also live next to source files.
- OpenAPI E2E tests: see [test/e2e/](test/e2e). They hit the running app in-memory. You can use
  SQLit in tests by setting STORAGE_ADAPTER=sqlite in the .env.test file.
- Database note: When STORAGE_ADAPTER=sqlite, database-related tests are executed inside a single
  long‑lived transaction. This keeps test data isolated and automatically rolled back at the end of
  the run, while allowing nested operations to use SAVEPOINTs.

For more details, including additional test commands and tips, see README-ARCHIVE.md.

## Additional details (archived)

To keep this README concise, the previous long-form reference has been moved to:

- [README-ARCHIVE.md](README-ARCHIVE.md) — full docs including testing, Docker details, CI notes,
  IDE debugging, and sample frontend proxy configs.
