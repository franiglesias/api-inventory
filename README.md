# API Inventory

Simple TypeScript + Express 5 inventory API with in-memory storage, a lightweight message-bus core,
OpenAPI 3.1 spec, Vitest tests, and Docker support.

This README was updated to reflect the current code and organized for faster onboarding. The
detailed reference that existed before is still available below under “Additional details”.

## Quick start

- Prerequisites: Node 18+, npm
- Install and run (local):
  - npm install
  - PORT=3000 npm run dev
- Health check: curl http://localhost:3000/health

## Environment variables

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

- src/index.ts: Express wiring and route registration
- inventory/: Application core (commands/handlers)
- driving/: HTTP adapters (route handlers)
- driven/: Infrastructure adapters (storage, time, message bus dispatch)
- openapi/: OpenAPI 3.1 definition
- test/: Unit and E2E tests (Vitest)

---

## Docker usage

- Development (Compose dev profile): `npm run compose:up:dev`
- Production (Compose prod profile): `docker compose --profile prod up`
- Change host port: `HOST_PORT=3001 docker compose up` (maps `HOST_PORT:3000`). The app listens on
  `PORT` inside the container (default `3000`).
- ESM: Extensionless imports are supported in dev and prod containers.

## Frontend development

- CORS is enabled for all origins by default, so you can call the API directly from the browser.
- Base URL from your frontend: `http://localhost:3000` (or `http://localhost:${HOST_PORT}` if you
  set it).
- Optional: Use your dev server proxy for same-origin paths like `/api` (see detailed examples in
  README-ARCHIVE.md for Vite, Next.js, CRA).

## Testing

- Test runner: Vitest (see vitest.config.ts). Common commands:
  - npm test — watch mode
  - npm run test:run — run once
  - npm run test:coverage — with coverage
  - npm run test:api — OpenAPI E2E tests
- Locations: test/ contains E2E and unit tests. Some unit tests may also live next to source files.
- OpenAPI E2E tests: see test/e2e/\*. They hit the running app in-memory.
- Database note: When STORAGE_ADAPTER=sqlite, database-related tests are executed inside a single
  long‑lived transaction. This keeps test data isolated and automatically rolled back at the end of
  the run, while allowing nested operations to use SAVEPOINTs.

For more details, including additional test commands and tips, see README-ARCHIVE.md.

## Additional details (archived)

To keep this README concise, the previous long-form reference has been moved to:

- README-ARCHIVE.md — full docs including testing, Docker details, CI notes, IDE debugging, and
  sample frontend proxy configs.
