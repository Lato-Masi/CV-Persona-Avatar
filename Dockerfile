# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package management files
COPY package.json package-lock.json* bun.lock* ./

# Install all dependencies (including devDependencies required for vite & esbuild)
RUN npm install

# Copy source files
COPY . .

# Build Vite frontend and esbuild server bundle to dist/
RUN npm run build

# Stage 2: Production runtime
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package files and install production dependencies only
COPY package.json package-lock.json* ./
RUN npm install --only=production --ignore-scripts

# Copy built dist directory from builder stage
COPY --from=builder /app/dist ./dist

# Expose server port
EXPOSE 3000

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start production server
CMD ["node", "dist/server.cjs"]
