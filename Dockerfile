## Stage 1: Frontend builder
FROM node:18 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN (npm ci --legacy-peer-deps || npm install --legacy-peer-deps)
COPY frontend/ ./
RUN npm run build

## Stage 2: Final image (runtime)
FROM node:18-slim

ENV DEBIAN_FRONTEND=noninteractive

# Install Python, pip, PostgreSQL, and build deps required by Python wheels
RUN apt-get update && \
    apt-get install -y python3 python3-venv python3-pip postgresql postgresql-contrib supervisor ca-certificates build-essential wget git libgomp1 && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# FIX HERE: Changed source path from /app/frontend/dist to /app/frontend/build
COPY --from=frontend-builder /app/frontend/build /app/frontend/dist

# Install backend dependencies
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json* ./
RUN npm install --legacy-peer-deps --production || npm install --legacy-peer-deps

# Copy backend and ML code
COPY backend /app/backend
COPY ml_n_xai /app/ml_n_xai

# Setup Python virtualenv and install ML requirements into venv
WORKDIR /app/ml_n_xai
RUN python3 -m venv /opt/venv && \
    /opt/venv/bin/pip install --upgrade pip setuptools wheel && \
    /opt/venv/bin/pip install --no-cache-dir -r requirements.txt
ENV PATH="/opt/venv/bin:$PATH"

# Copy built frontend into backend dist so server.js finds it by default
RUN mkdir -p /app/backend/dist && cp -r /app/frontend/dist/* /app/backend/dist/ || true

# Copy entrypoint
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 5000 8000 5432

CMD ["/usr/local/bin/docker-entrypoint.sh"]