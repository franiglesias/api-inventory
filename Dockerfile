# Multi-stage Dockerfile for Express TypeScript API

# Multi-stage Dockerfile for Express TypeScript API

# Stage 1: Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy source code
COPY . .

# Generate production .env from template (will be copied into the final image)
RUN NODE_ENV=production STORAGE_ADAPTER=sqlite SQLITE_DB_PATH=/data/inventory.db node scripts/generate-env.mjs --out .env

# Build the application
RUN npm run build

# Stage 2: Production stage
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Ensure Node resolves extensionless ESM specifiers in dist
ENV NODE_OPTIONS="--experimental-specifier-resolution=node"

# System deps needed to build better-sqlite3
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy generated .env from builder
COPY --from=builder /app/.env ./.env

# Prepare data directory for SQLite
RUN mkdir -p /data && chown -R node:node /data

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const p=process.env.PORT||3000; require('http').get(`http://localhost:${p}/health`, (res)=>process.exit(res.statusCode===200?0:1)).on('error',()=>process.exit(1));"

# Start the application
CMD ["node", "dist/index.js"]

# Stage 3: Development stage
FROM node:18-alpine AS development

# Set working directory
WORKDIR /app

# System deps needed to build better-sqlite3 in dev
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start development server with hot reload
CMD ["sh", "-c", "npm ci && npm run dev"]
