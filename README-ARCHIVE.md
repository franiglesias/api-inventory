# API Inventory — Reference (Archive)

This document is the long-form reference for the project. It mirrors the current codebase and
package.json scripts. For a concise overview, see README.md.

<!-- TOC -->

- [API Inventory — Reference (Archive)](#api-inventory--reference-archive)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Available Commands](#available-commands)
    - [Development](#development)
    - [Testing with Vitest](#testing-with-vitest)
    - [Docker](#docker)
      - [Docker Commands](#docker-commands)
      - [Docker Compose](#docker-compose)
    - [Environment](#environment)
  - [Project Structure](#project-structure)
  - [Testing Setup](#testing-setup)
    - [Features](#features)
    - [Test Commands](#test-commands)
    - [Test File Patterns](#test-file-patterns)
    - [Coverage Reports](#coverage-reports)
  - [Docker Support](#docker-support)
    - [Docker Files](#docker-files)
    - [Docker Commands (NPM Scripts)](#docker-commands-npm-scripts)
    - [Quick Start with Docker](#quick-start-with-docker)
    - [Manual Docker Commands](#manual-docker-commands)
    - [Docker Architecture](#docker-architecture)
    - [Force Docker to rebuild (images, containers, volumes)](#force-docker-to-rebuild-images-containers-volumes)
  - [Development Workflow](#development-workflow)
    - [Local Development](#local-development)
    - [Docker Development](#docker-development)
    - [Production Build](#production-build)
  - [Testing Strategy](#testing-strategy)
    - [Test Types](#test-types)
    - [Writing Tests](#writing-tests)
    - [Test Configuration](#test-configuration)
  - [Debugging in IntelliJ IDEA](#debugging-in-intellij-idea)
    - [Option A: Use the provided Run/Debug configurations](#option-a-use-the-provided-rundebug-configurations)
    - [Option B: Create an NPM configuration manually](#option-b-create-an-npm-configuration-manually)
    - [Option C: Create a Node.js configuration manually](#option-c-create-a-nodejs-configuration-manually)
    - [Option D: Attach to a running process](#option-d-attach-to-a-running-process)
    - [Debugging tests (Vitest)](#debugging-tests-vitest)
    - [Troubleshooting](#troubleshooting)
  - [License](#license)
- [API Inventory](#api-inventory)
  - [Development](#development-1)
  - [Continuous Integration: Docker Publish via GitHub Actions](#continuous-integration-docker-publish-via-github-actions)
  - [Running with Docker Compose when port 3000 is in use](#running-with-docker-compose-when-port-3000-is-in-use)
  - [Docker Compose profiles note](#docker-compose-profiles-note)
  - [Using this API from a frontend during development](#using-this-api-from-a-frontend-during-development)
    - [1) Frontend runs on your host (recommended)](#1-frontend-runs-on-your-host-recommended)
    - [2) Frontend runs in Docker](#2-frontend-runs-in-docker)
    - [3) Example API calls from a frontend](#3-example-api-calls-from-a-frontend)

<!-- TOC -->

## Prerequisites

- Node.js (version 18 or higher recommended)
- npm (version 8 or higher recommended)
- Docker and Docker Compose (for containerized deployment)

## Installation

```bash
npm install
npm run env:from-dist
npm run env:test
```

## Available Commands

### Development

- `npm run dev` - Start development server with tsx (ESM)
- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Start production server (requires build first)

### Testing with Vitest

- `npm test` - Run tests in watch mode
- `npm run test:api` - Run API end-to-end tests
- `npm run test:run` - Run tests once and exit
- `npm run test:watch` - Run tests in watch mode (explicit)
- `npm run test:ui` - Open Vitest UI in browser for interactive testing
- `npm run test:coverage` - Run tests with coverage report

### Docker

#### Docker Commands

- `npm run docker:build` - Build Docker image
- `npm run docker:run` - Run Docker container on port 3000
- `npm run compose:up` - Start with Docker Compose (production)

#### Docker Compose

- `npm run compose:up:dev` - Start development environment with Docker Compose
- `npm run compose:down` - Stop Docker Compose services
- `npm run compose:build` - Build Docker Compose services

### Environment

The following commands use .env.dist as a template for creating an .env file prepared for an
environment.

- `npm run env:from-dist -- --out [file]` - Creates a default `.env` file
- `npm run env:prod` - Creates an .env file for production
- `npm run env:test` - Creates an .env file for testing

Examples:

- Customized production:
  `NODE_ENV=production STORAGE_ADAPTER=sqlite SQLITE_DB_PATH=/data/inventory.db npm run env:from-dist`
- Advanced:
  `npm run env:from-dist -- --out .env.prod --dist .env.dist --set PORT=8080 --set LOG_LEVEL=warn`

## Project Structure

```
api-inventory/
├── src/                    # Source code
│   └── index.ts           # Main application entry point
├── dist/                  # Compiled JavaScript (generated)
├── coverage/              # Test coverage reports (generated)
├── test/                  # Test files
├── vitest.config.ts       # Vitest configuration
├── tsconfig.json          # TypeScript configuration
├── package.json           # Dependencies and scripts
├── Dockerfile             # Docker image definition
├── docker-compose.yml     # Docker Compose configuration
└── .dockerignore         # Docker ignore file
```

## Testing Setup

This project uses **Vitest** as the testing framework, which provides:

### Features

- ⚡ **Fast**: Built on Vite for lightning-fast test execution
- 🔧 **TypeScript Support**: Native TypeScript support without additional configuration
- 📊 **Coverage Reports**: Built-in code coverage with V8 provider
- 🎯 **Watch Mode**: Automatic test re-running on file changes
- 🌐 **UI Interface**: Browser-based testing interface
- 🔍 **Debugging**: Easy debugging integration

### Test Commands

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage

# Open Vitest UI
npm run test:ui
```

### Test File Patterns

Vitest will automatically find test files in these patterns:

- `src/**/*.{test,spec}.{js,ts}`
- `test/**/*.{test,spec}.{js,ts}`
- `**/__tests__/**/*.{js,ts}`

### Coverage Reports

Coverage reports are generated in multiple formats:

- **Terminal**: Displayed in console
- **JSON**: `./coverage/test-results.json`
- **HTML**: `./coverage/test-results.html`

## Docker Support

This project includes full Docker support for both development and production environments.

### Docker Files

The project includes the following Docker-related files:

- `Dockerfile` - Multi-stage build for development and production
- `docker-compose.yml` - Orchestration for different environments
- `.dockerignore` - Excludes unnecessary files from Docker build context

### Docker Commands (NPM Scripts)

**Building and Running:**

- `npm run docker:build` - Build production Docker image
- `npm run docker:run` - Run production container on port 3000

**Docker Compose:**

- `npm run compose:up` - Start production service
- `npm run compose:up:dev` - Start development environment with hot reload
- `npm run compose:down` - Stop all services
- `npm run compose:build` - Build all services

### Quick Start with Docker

**Development with hot reload:**

```bash
npm run compose:up:dev
```

Access the API at: http://localhost:3000

**Production deployment:**

```bash
npm run compose:up
```

Access the API at: http://localhost:3000

### Manual Docker Commands

**Build and run production:**

```bash
docker build --target production -t api-inventory:prod .
docker run -p 3000:3000 api-inventory:prod
```

**Build and run development:**

```bash
docker build --target development -t api-inventory:dev .
docker run -p 3000:3000 -v $(pwd):/app -v /app/node_modules api-inventory:dev
```

**Using Docker Compose:**

```bash
# Development
docker compose --profile dev up

# Production
docker compose --profile prod up

# Default (production)
docker compose up
```

### Docker Architecture

The Dockerfile uses a multi-stage build:

1. **Builder stage**: Installs dependencies and compiles TypeScript
2. **Production stage**: Optimized runtime with only production dependencies
3. **Development stage**: Full development environment with hot reload

**Production optimizations:**

- Only production dependencies installed
- Non-root user for security
- Health check endpoint
- Minimal Alpine Linux base image
- Clean npm cache to reduce image size

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

## Development Workflow

### Local Development

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start development server:**

   ```bash
   npm run dev
   ```

3. **Run tests:**

   ```bash
   npm test
   ```

4. **Open test UI (optional):**
   ```bash
   npm run test:ui
   ```

### Docker Development

1. **Start with Docker Compose:**

   ```bash
   npm run compose:up:dev
   ```

2. **Run tests inside container:**
   ```bash
   docker compose exec api-dev npm test
   ```

### Production Build

**Local build:**

```bash
npm run build
npm run start
```

**Docker production:**

```bash
npm run compose:up
```

## Testing Strategy

### Test Types

- **Unit Tests**: Test individual functions and classes
- **Integration Tests**: Test API endpoints and database interactions
- **Coverage**: Maintain high code coverage with detailed reports

### Writing Tests

Create test files alongside your source code or in the `test/` directory:

```typescript
// Example: src/inventory.test.ts
import { describe, it, expect } from 'vitest'
import { Inventory } from './inventory'

describe('Inventory', () => {
  it('should create an empty inventory', () => {
    const inventory = new Inventory()
    expect(inventory.getProducts()).toHaveLength(0)
  })
})
```

### Test Configuration

The project uses `vitest.config.ts` for configuration:

- **Environment**: Node.js environment for API testing
- **Coverage**: V8 provider with HTML and JSON reports
- **Globals**: Global test functions available without imports
- **File patterns**: Automatic test discovery
- **Timeout**: 10 second timeout for async tests

---

## Debugging in IntelliJ IDEA

You can debug this project in IntelliJ IDEA (Ultimate recommended for full Node.js support) in
multiple ways. Breakpoints work in .ts files because the project uses tsx with source maps enabled.

Important context:

- Dev scripts use tsx with Node’s experimental specifier resolution for ESM TypeScript:
  - `npm run dev`
  - `npm run dev:debug` (starts Node inspector on port 9229)
- tsconfig: module=esnext, moduleResolution=bundler, sourceMap=true
- package.json: "type": "module" (ESM)

### Option A: Use the provided Run/Debug configurations

This repo includes .run/ configurations IntelliJ can import automatically:

- Dev (npm): runs `npm run dev`
- Dev Debug (npm): runs `npm run dev:debug` with Node inspector on 9229

In IDEA:

1. Open the project folder.
2. Go to Run > Run… and select "Dev (npm)" or "Dev Debug (npm)".
3. Set env vars if needed (HOST, PORT). The defaults are HOST=0.0.0.0, PORT=3000.
4. Click Debug for "Dev Debug (npm)" to attach the debugger and hit breakpoints.

### Option B: Create an NPM configuration manually

1. Run > Edit Configurations… > + > npm
2. Package.json: select your project package.json
3. Command: `run`
4. Script: `dev:debug` (or `dev` if you don’t need the debugger)
5. Node interpreter: "project"
6. Environment variables (optional): HOST=0.0.0.0, PORT=3000
7. Click Debug to start.

### Option C: Create a Node.js configuration manually

1. Run > Edit Configurations… > + > Node.js
2. Node interpreter: "project"
3. Working directory: project root
4. JavaScript file: `src/index.ts`
5. Node parameters:

- `--inspect=0.0.0.0:9229 --experimental-specifier-resolution=node`

6. Environment variables (optional): HOST=0.0.0.0, PORT=3000
7. Click Debug to start.

Note: Prefer the provided npm scripts (Option A/B), which run tsx and handle TypeScript/ESM
automatically.

### Option D: Attach to a running process

1. Start the app externally with debug enabled:
   ```bash
   npm run dev:debug
   ```
2. In IDEA: Run > Attach to Node.js/Chrome
3. Host: `localhost` (or the container/remote host)
4. Port: `9229`
5. Click OK; breakpoints in .ts files should be hit.

### Debugging tests (Vitest)

- Easiest: run tests in UI mode and use browser devtools where applicable:
  ```bash
  npm run test:ui
  ```
- Or create a Vitest run configuration (if plugin available) or a Node.js config that runs:
  - JavaScript file: `node_modules/vitest/vitest.mjs`
  - Application parameters: `run --inspect-brk --coverage` (as desired)
  - Working directory: project root

### Troubleshooting

- Breakpoints not hit:
  - Ensure you’re using the Dev Debug config or Node parameters include `--inspect`.
  - Confirm Node interpreter in IDEA matches the version used in your terminal.
  - Make sure tsconfig has `sourceMap: true` (already enabled).
  - With ESM and ts-node, keep the exact loader flags from the scripts.
- "Cannot GET /health" while debugging from another device/container:
  - Default HOST is 0.0.0.0 to listen on all interfaces. Verify your firewall and port mapping.
- Docker attach:
  - Expose/forward port 9229: e.g., `-p 9229:9229` and run with `--inspect=0.0.0.0:9229`.
- Stopping the server:
  - `npm run stop` will read `.server.pid` and send SIGTERM for graceful shutdown.

---

## License

ISC

# API Inventory

## Development

- Start the server (TypeScript, via ts-node):

  - npm run dev
  - For debugging with inspector on 9229: npm run dev:debug

- Stop the currently running server:
  - npm run stop
  - This reads the PID from .server.pid and sends SIGTERM for a graceful shutdown.

Notes:

- The server writes its process ID to .server.pid when it starts. On SIGINT/SIGTERM or normal exit,
  it will attempt to remove the file.
- If .server.pid is missing, the stop command will print a helpful message.
- If you started multiple instances manually, the PID file only tracks the last process that wrote
  it.

## Continuous Integration: Docker Publish via GitHub Actions

This repository includes a GitHub Actions workflow that builds the Docker image and publishes it to
Docker Hub.

Workflow file: .github/workflows/docker-publish.yml

Triggers:

- On push to main or master: publishes the image tagged as latest and with the branch name and
  commit SHA.
- On tag push (e.g., v1.2.3): publishes the image tagged with the Git tag (e.g., v1.2.3).
- Manual run via workflow_dispatch.

Setup required:

1. Create Docker Hub access token: Docker Hub > Account Settings > Security > New Access Token.
2. In your GitHub repository settings, add the following Secrets:

- DOCKERHUB_USERNAME: your Docker Hub username.
- DOCKERHUB_TOKEN: the Docker Hub access token.

3. Optionally, add a Repository Variable to override the image repository name:

- Variable name: DOCKERHUB_REPOSITORY
- Value example: username/api-inventory If not set, the workflow will default to
  DOCKERHUB_USERNAME/api-inventory.

Image tags produced:

- latest on the default branch.
- [branch-name] when pushing non-default branches.
- [git-tag] when pushing tags (e.g., v1.2.3).
- sha-[shortsha] for traceability.

Build context:

- The Dockerfile at the repository root is used for multi-stage builds.

Local testing:

- docker build -t api-inventory .
- docker run -p 3000:3000 api-inventory

## Running with Docker Compose when port 3000 is in use

If you see an error like:

> Bind for 0.0.0.0:3000 failed: port is already allocated

You can choose another host port without changing the app. The docker-compose file now supports a
HOST_PORT variable.

Examples:

- Use default (3000): docker compose up

- Use a different host port (e.g., 3001): HOST_PORT=3001 docker compose up

- Or create a .env file next to docker-compose.yml: HOST_PORT=3002 Then run: docker compose up

Inside the container the app still listens on PORT=3000 (configurable via env), and is mapped to
your chosen host port.

## Docker Compose profiles note

- The dev profile starts only the development service (api-dev). Run it with: npm run compose:up:dev
- The default production service (api) is now under the prod profile and will not start when using
  the dev profile. To run production with compose, use: docker compose --profile prod up

ESM imports without .js extensions are supported in both dev and production containers; the image
sets Node’s experimental specifier resolution for the dist runtime.

## Using this API from a frontend during development

There are several easy ways to develop a frontend (React/Vite/Next.js/etc.) that talks to this API
while keeping your source imports extensionless and your Docker setup simple.

Pick the approach that matches how you run your frontend (on your host machine or in Docker).

### 1) Frontend runs on your host (recommended)

- Start the API with Docker Compose (dev profile) and choose a host port if 3000 is taken:
  - Default: npm run compose:up:dev (maps 3000->3000)
  - Custom host port: HOST_PORT=3001 npm run compose:up:dev
- Your API base URL from the frontend is then:
  - http://localhost:3000 or http://localhost:3001 (if you set HOST_PORT=3001)

CORS note: The API now sends permissive CORS headers (Access-Control-Allow-Origin: \*), so you can
call it directly from the browser during development without a proxy. You can still use a frontend
dev-server proxy if you prefer same-origin paths like /api.

Examples:

- Vite (vite.config.ts): import { defineConfig } from 'vite' import react from
  '@vitejs/plugin-react'

  export default defineConfig({ plugins: [react()], server: { proxy: { // Frontend calls /api/...
  and Vite proxies to the API container '/api': { target: 'http://localhost:3000', // or
  http://localhost:3001 changeOrigin: true, rewrite: (path) => path.replace(/^\/api/, ''), }, }, },
  })

  // Example frontend fetch // fetch('/api/products') -> will be proxied to
  http://localhost:3000/products

- Next.js (next.config.js): const nextConfig = { async rewrites() { return [ { source:
  '/api/:path*', destination: 'http://localhost:3000/:path*', // or 3001 }, ] }, } module.exports =
  nextConfig

- Create React App (src/setupProxy.js): const { createProxyMiddleware } =
  require('http-proxy-middleware') module.exports = function (app) { app.use( '/api',
  createProxyMiddleware({ target: 'http://localhost:3000', // or 3001 changeOrigin: true,
  pathRewrite: { '^/api': '' }, }), ) }

With the proxy, your frontend code can call fetch('/api/products') without CORS errors, and you
don’t need to change the API.

If you prefer not to use a proxy, set a base URL variable and call the API directly, e.g.:

- Vite: VITE_API_URL=http://localhost:3000 (then use import.meta.env.VITE_API_URL)
- Next.js/CRA: NEXT_PUBLIC_API_URL=http://localhost:3000 (use process.env.NEXT_PUBLIC_API_URL)

### 2) Frontend runs in Docker

If your frontend lives in its own Docker container, you have two simple options.

Option A — Reach the API via the host mapping (no shared network):

- Run the API compose as above (exposes HOST_PORT on your host).
- From the frontend container, call http://host.docker.internal:HOST_PORT
  - Works out-of-the-box on macOS/Windows.
  - On Linux, recent Docker versions also support host.docker.internal. If not, you can add an
    extraHost in your frontend container (e.g., extra_hosts: - "host.docker.internal:host-gateway").

Option B — Put both containers on a shared user-defined network (container-to-container):

- Create a user-defined network once: docker network create devnet
- Start the API and connect it to that network (examples):

  - Using docker compose (API project):
    - Start normally: npm run compose:up:dev
    - Then connect the running API container to devnet: docker network connect devnet
      api-inventory-api-dev-1
    - Container name may differ; check with: docker ps
  - Or define an external network in your frontend’s docker-compose.yml:

    networks: devnet: external: true

    services: frontend: image: your-frontend-image networks:

    - devnet

- Now your frontend container can call the API by container name or service name across the shared
  network. If you connect api-inventory-api-dev-1 to devnet, the base URL would be
  http://api-inventory-api-dev-1:3000

Notes:

- Inside the API container the app listens on PORT=3000 by default. You can change it by setting
  PORT, but most setups keep it at 3000 and change only HOST_PORT for host mapping.
- The docker-compose file supports HOST_PORT overriding and Compose profiles (dev/prod). See the
  sections above for details.

### 3) Example API calls from a frontend

- GET products: GET /products
- Create product: POST /products with body { "sku": "ABC-123", "name": "Item name", "price": 12.34 }
- Add stock: POST /products/:sku/add with body { "units": 5 }
- Remove stock: POST /products/:sku/remove with body { "units": 2 }
- Health: GET /health

If you used a dev proxy mapped at /api, the corresponding frontend URLs would be:

- fetch('/api/products')
- fetch('/api/products', { method: 'POST', body: JSON.stringify({...}), headers: { 'Content-Type':
  'application/json' }})
- fetch(`/api/products/${sku}/add`, { method: 'POST', body: JSON.stringify({ units: 5 }), headers: {
  'Content-Type': 'application/json' }})

That’s it — you can develop your frontend against this API either on localhost with a proxy or by
linking containers via a shared Docker network.
