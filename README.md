# API Inventory

A TypeScript Express API for inventory management with comprehensive testing and Docker support.

## Prerequisites

- Node.js (version 18 or higher recommended)
- npm (version 8 or higher recommended)
- Docker and Docker Compose (for containerized deployment)

## Installation

```bash
npm install
```

## Available Commands

### Development

- `npm run dev` - Start development server using Node's ts-node ESM loader
- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Start production server (requires build first)

### Testing with Vitest

- `npm test` - Run tests in watch mode
- `npm run test:run` - Run tests once and exit
- `npm run test:watch` - Run tests in watch mode (explicit)
- `npm run test:ui` - Open Vitest UI in browser for interactive testing
- `npm run test:coverage` - Run tests with coverage report

### Docker

- `npm run docker:build` - Build Docker image
- `npm run docker:run` - Run Docker container on port 3000
- `npm run compose:up` - Start with Docker Compose (production)
- `npm run compose:up:dev` - Start development environment with Docker Compose
- `npm run compose:down` - Stop Docker Compose services
- `npm run compose:build` - Build Docker Compose services

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
docker-compose --profile dev up

# Production
docker-compose --profile prod up

# Default (production)
docker-compose up
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
   docker-compose exec api-dev npm test
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
import { describe, it, expect } from "vitest"
import { Inventory } from "./inventory"

describe("Inventory", () => {
  it("should create an empty inventory", () => {
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

## API Endpoints

_Note: Add your specific API endpoints documentation here as you develop them._

### Health Check

- `GET /health` - Returns API health status (used by Docker health check)

## Environment Variables

Create a `.env` file for local development:

```bash
# Example environment variables
NODE_ENV=development
PORT=3000
```

## Troubleshooting

### Common Issues

**Port already in use:**

```bash
# Check what's using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

**Docker build issues:**

```bash
# Clean Docker cache
docker system prune

# Rebuild without cache
docker-compose build --no-cache
```

**Test issues:**

```bash
# Clear Vitest cache
npx vitest --run --reporter=verbose --clearCache
```

### Development Server Issues

If the development server doesn't start:

1. Check if port 3000 is available
2. Verify all dependencies are installed
3. Check for TypeScript compilation errors
4. Review the terminal output for specific error messages

### Docker Issues

If Docker containers fail to start:

1. Check Docker Desktop is running
2. Verify the Dockerfile syntax
3. Check for port conflicts
4. Review Docker logs: `docker-compose logs`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for your changes
4. Ensure all tests pass: `npm run test:run`
5. Check code coverage: `npm run test:coverage`
6. Submit a pull request

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

# API Inventory

A TypeScript Node.js API starter using Express and Vitest.

## Prerequisites

- Node.js >= 18 (LTS or newer)
- npm (or pnpm/yarn)

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start in dev mode (TypeScript via ts-node loader):

   ```bash
   npm run dev
   ```

3. Run tests:

   ```bash
   npm test
   ```

4. Open test UI (optional):
   ```bash
   npm run test:ui
   ```

### Docker Development

1. Start with Docker Compose:

   ```bash
   npm run compose:up:dev
   ```

2. Run tests inside container:
   ```bash
   docker-compose exec api-dev npm test
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
import { describe, it, expect } from "vitest"
import { Inventory } from "./inventory"

describe("Inventory", () => {
  it("should create an empty inventory", () => {
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
multiple ways. Breakpoints work in .ts files because the project uses ts-node with source maps
enabled.

Important context:

- Dev scripts use the ts-node ESM loader and Node’s experimental specifier resolution for .ts
  imports:
  - `npm run dev`
  - `npm run dev:debug` (starts Node inspector on port 9229)
- tsconfig: module=esnext, moduleResolution=bundler, sourceMap=true, allowImportingTsExtensions=true
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
   - `--inspect=0.0.0.0:9229 --loader ts-node/esm --no-warnings=ExperimentalWarning --experimental-specifier-resolution=node`
6. Environment variables (optional): HOST=0.0.0.0, PORT=3000
7. Click Debug to start.

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
