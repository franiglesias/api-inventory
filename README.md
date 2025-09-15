# API Inventory

Simple TypeScript + Express 5 inventory API with in-memory storage, a lightweight message-bus core,
OpenAPI 3.1 spec, Vitest tests, and Docker support.

This README is a high-level overview of the project structure and usage. For detailed information,
see [README-ARCHIVE.md](README-ARCHIVE.md).

## Quick start

- Prerequisites: Node 18+, npm
- Install and run (local):
  - `npm install`
  - `npm run env:from-dist` - generate .env from .env.dist
  - `npm run env:test` - generate .env.test for testing
  - `npm run dev` - run in dev mode with hot reload
- Install and run (Docker):
  - `docker compose up`
  - `docker compose up --build` (force rebuild)
- Run in dev mode (local):
  - `PORT=3000 npm run dev`
- Health check: curl http://localhost:3000/health
- Test API: `npm run test:api`

## Environment variables

- Generate .env from template:

  - Local dev: `npm run env:from-dist` -- creates .env by copying .env.dist
  - Testing: `npm run env:test` -- generates a sensible .env.test used in testing

You can override any of these values in your .env file.

- **PORT**: Port the server listens on (example: 3000). Docker images expose 3000.
- **STORAGE_ADAPTER**: Storage backend. Options: "memory" (default) or "sqlite".
- **SQLITE_DB_PATH**: When STORAGE_ADAPTER=sqlite, path to the SQLite database file. Defaults to
  `./data/inventory.db` locally, and `/data/inventory.db` in Docker.
- **INITIAL_DATA**: Optional path (relative or absolute) to a JSON file used to seed initial
  products at startup. Defaults to `data/products.json`. The file should contain an array of objects
  with fields:
  - name
  - description
  - sku
  - stock
  - minStock
  - imageUrl (optional)
  - createdAt
  - updatedAt (optional)

## CORS

CORS is enabled by default for all routes and all origins. This makes it easy to call the API
directly from a browser-based frontend during development without configuring proxies.

- Access-Control-Allow-Origin: \*
- Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE
- Preflight (OPTIONS) requests are handled automatically.

_Security note_: For production environments where you want to restrict who can call this API from a
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

_Tip_: The full OpenAPI spec is in `openapi/openapi.yaml` and is covered by tests in `test/e2e`. You
can visualize an interact with the API using several tools.

## Project structure (high level)

This project follows Hexagonal Architecture principles.

- src/index.ts: Startup script and coordinates the app lifecycle.
- configurator/: Configurator (Express wiring and route registration)
- inventory/: Hexagonal Application core (ports, business logic)
  - driving/: Primary ports
  - driven/: Secondary ports
- driving/: Primary adapters (API Rest)
- driven/: Secondary adapters (storage, time, message bus dispatch)
- openapi/: OpenAPI 3.1 definition
- test/: Unit and E2E tests (Vitest)
- lib/: Shared code that could be used by other projects

---

## Docker usage

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

Notes:

- The image contains a generated .env with safe defaults, but any env provided by docker-compose or
  `docker run -e` overrides those values.
- Health check respects `PORT`. If you change `PORT`, ensure your port mapping matches.
- ESM: Extensionless imports are supported in dev and prod containers.

## Frontend development

- CORS is enabled for all origins by default, so you can call the API directly from the browser.
- Base URL from your frontend: `http://localhost:3000` (or `http://localhost:${HOST_PORT}` if you
  set it).
- Optional: Use your dev server proxy for same-origin paths like `/api` (see detailed examples in
  [README-ARCHIVE.md](README-ARCHIVE.md) for Vite, Next.js, CRA).

## Testing

- Test runner: Vitest (see vitest.config.ts). Common commands:
  - `npm test` — watch mode
  - `npm run test:run` — run once
  - `npm run test:coverage` — with coverage
  - `npm run test:api` — OpenAPI E2E tests
- Locations: test/ contains E2E and unit tests. Some unit tests may also live next to source files.
- OpenAPI E2E tests: see [test/e2e/](test/e2e). They hit the running app in-memory. You can use
  SQLite in tests by setting STORAGE_ADAPTER=sqlite in the .env.test file.
- Database note: When STORAGE_ADAPTER=sqlite, database-related tests are executed inside a
  transaction. Also, the db file is recreated on each run.

For more details, including additional test commands and tips, see
[README-ARCHIVE.md](README-ARCHIVE.md).

## Additional details

To keep this README concise, the previous long-form reference has been moved to:

- [README-ARCHIVE.md](README-ARCHIVE.md) — full docs including testing, Docker details, CI notes,
  IDE debugging, and sample frontend proxy configs.
