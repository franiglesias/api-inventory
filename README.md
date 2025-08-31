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
import { describe, it, expect } from 'vitest';
import { Inventory } from './inventory';

describe('Inventory', () => {
  it('should create an empty inventory', () => {
    const inventory = new Inventory();
    expect(inventory.getProducts()).toHaveLength(0);
  });
});
```

### Test Configuration

The project uses `vitest.config.ts` for configuration:
- **Environment**: Node.js environment for API testing
- **Coverage**: V8 provider with HTML and JSON reports
- **Globals**: Global test functions available without imports
- **File patterns**: Automatic test discovery
- **Timeout**: 10 second timeout for async tests

## API Endpoints

*Note: Add your specific API endpoints documentation here as you develop them.*

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
