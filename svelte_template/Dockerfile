# Multi-stage Dockerfile for SvelteKit application

# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# TODO: Set your build-time environment variables here
# Example: ENV VITE_API_BASE_URL=https://api.example.com

# Build the application
RUN npm run build

# Stage 2: Serve with Node (adapter-node)
FROM node:20-alpine

WORKDIR /app

# Copy built application from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json

# Install production dependencies only
RUN npm ci --omit=dev

# Expose port
EXPOSE 5713

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5713/ || exit 1

# Set environment variables
ENV PORT=5713
ENV HOST=0.0.0.0

# Start the application
CMD ["node", "build"]
