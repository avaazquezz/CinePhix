# Multi-stage Dockerfile for CinePhix Frontend
# Supports both development and production modes

# ===========================================
# Development stage
# ===========================================
FROM node:20-alpine AS development

WORKDIR /app

# Install dependencies
COPY web_app/package*.json ./
RUN npm install --include=dev

# Copy source
COPY web_app/ ./

# Expose Vite dev server port
EXPOSE 3000

# Start dev server with host binding
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ===========================================
# Production stage (default)
# ===========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY web_app/package*.json ./
RUN npm install

# Copy source and build
COPY web_app/ ./
RUN npm run build

# Production nginx serve
FROM nginx:alpine AS production

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY web_app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# ===========================================
# Build arguments
# ===========================================
ARG BUILD_MODE=production
ARG NODE_ENV=production