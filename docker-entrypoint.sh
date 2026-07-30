#!/bin/bash
set -e

echo "Starting DiaSense container entrypoint..."

# Default Postgres credentials (can be overridden at runtime)
POSTGRES_USER=${POSTGRES_USER:-diasense}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-diasense}
POSTGRES_DB=${POSTGRES_DB:-diasense}

echo "Initializing PostgreSQL..."
service postgresql start

echo "Ensuring database and user exist..."
su - postgres -c "psql -tc \"SELECT 1 FROM pg_roles WHERE rolname='${POSTGRES_USER}'\" | grep -q 1 || psql -c \"CREATE ROLE ${POSTGRES_USER} WITH LOGIN PASSWORD '${POSTGRES_PASSWORD}';\""
su - postgres -c "psql -tc \"SELECT 1 FROM pg_database WHERE datname='${POSTGRES_DB}'\" | grep -q 1 || psql -c \"CREATE DATABASE ${POSTGRES_DB} OWNER ${POSTGRES_USER};\""

# Export database env for backend
export DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB}"
export DB_HOST=localhost
export DB_PORT=5432
export DB_USER=${POSTGRES_USER}
export DB_PASSWORD=${POSTGRES_PASSWORD}
export DB_NAME=${POSTGRES_DB}

echo "Starting ML service (uvicorn)..."
cd /app/ml_n_xai
# Run uvicorn in background
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 &

echo "Starting backend (Node.js)..."
cd /app/backend
node server.js &

echo "All services started. Tailing logs..."
exec tail -f /var/log/postgresql/postgresql-* || exec sleep infinity
