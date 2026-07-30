# DiaSense

DiaSense is an end-to-end solution that identifies individuals at risk of undiagnosed diabetes using only non-clinical data (lifestyle, socioeconomic and behavioral features). The goal is a low-cost, privacy-preserving early screening flow that can run in resource-constrained environments.

This repository contains three main parts:

- `frontend/` — React + Vite single page application (Homepage UI and assessment forms).
- `backend/` — Node.js (Express) API for user management, assessments and a proxy to the ML prediction service.
- `ml_n_xai/` — FastAPI-based ML service that loads an XGBoost model and returns risk predictions plus SHAP explanations.

Key design points:

- Non-clinical features only — the ML model expects a fixed set of 21 features and returns a risk score and top contributing factors (SHAP).
- Modular architecture — frontend and backend are independent processes; the backend forwards ML requests to the FastAPI ML service on port 8000.
- PostgreSQL-ready backend — database connection is implemented via `pg` and configured with environment variables.

## Features

- User registration, login and profile endpoints.
- Create/read/update health assessments.
- ML prediction endpoint (backend forwards to ML service at `http://127.0.0.1:8000/predict`).
- SHAP-based explainability returned to the frontend.

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL (optional for local DB-backed flows) or a hosted Postgres instance
- Python 3.9+ and pip (for the ML service)

## Getting Started (development)

Follow these steps to run the full stack locally on Windows.

1) Backend

  - Open a terminal and install dependencies:

  ```bash
  cd backend
  npm install
  ```

  - The backend listens on port `5000` and currently allows CORS from `http://localhost:3000`.
    - You can either run the frontend on port `3000` (see frontend step) or update the origin in `backend/server.js`.

  - The backend expects a Postgres connection. You can provide a full `DATABASE_URL` or individual variables. Example environment variables:

  ```text
  # backend/.env
  DATABASE_URL=postgres://user:password@host:5432/dbname
  # or
  DB_HOST=localhost
  DB_PORT=5432
  DB_USER=postgres
  DB_PASSWORD=postgres
  DB_NAME=diasense
  ```

  - Start the backend (option A: nodemon; option B: node):

  ```bash
  # Option A (recommended for dev): install nodemon first if not present
  npm install -D nodemon
  npm run dev

  # Option B: run directly
  node server.js
  ```

2) Frontend

  - Open a separate terminal and install dependencies:

  ```bash
  cd frontend
  npm install
  ```

  - The project uses Vite. By default Vite serves on port `5173`. The backend's CORS is configured to accept `http://localhost:3000`, so either run Vite on port 3000 or update the backend CORS origin.

  ```bash
  # Run Vite on port 3000 so the backend CORS matches
  npm run dev -- --port 3000
  ```

  - Dev server scripts available:

  ```bash
  npm run dev   # start vite dev server
  npm run build # build production assets
  ```

3) ML service (FastAPI)

  - The ML service exposes `POST /predict` on port `8000` and is expected to run locally. It loads `xgboost_model.pkl` and uses `xre_train.csv` to initialize the SHAP explainer.

  - Create a virtual environment and install the requirements:

  ```bash
  cd ml_n_xai
  python -m venv .venv
  .venv\Scripts\activate    # Windows
  pip install --upgrade pip
  pip install fastapi uvicorn xgboost shap pandas scikit-learn
  ```

  - Place your trained model file at `ml_n_xai/xgboost_model.pkl`. If you used scaling during training, also place `scaler.pkl` in the same folder and uncomment the scaler usage in `main.py`.

  - Start the ML server:

  ```bash
  uvicorn main:app --reload --port 8000
  ```

4) End-to-end

  - With the ML service (8000), backend (5000) and frontend (3000) running, open the frontend URL printed by Vite (e.g., `http://localhost:3000`) and use the UI to submit assessments. The frontend will call the backend (`/api/predict`) which forwards the request to the ML service and returns a risk score and top factors.

## Database schema

- A SQL schema file is included at `backend/models/schema.sql` (create required tables before using DB-backed features).

## Useful endpoints

- `POST /api/register` — body: `{ name, email, password }`
- `POST /api/login` — body: `{ email, password }`
- `GET /api/me` — get profile (expects `user-id` header or middleware-auth)
- `POST /api/assessment` — create assessment
- `GET /api/assessment/:userId` — fetch assessments for user
- `PUT /api/assessment/:id` — update assessment
- `POST /api/predict` — forwarded to ML server, accepts form payload used by frontend

## Notes & Troubleshooting

- CORS: `backend/server.js` currently allows origin `http://localhost:3000`. If you prefer the Vite default port (`5173`), update the CORS origin or launch Vite with `--port 3000`.
- Nodemon: the backend `dev` script expects `nodemon`. Install it locally or globally if `npm run dev` fails.
- ML model: predictions will be incorrect if you trained with scaling but do not provide `scaler.pkl`. The FastAPI `main.py` contains comments showing where to load and apply the scaler.
- PostgreSQL: ensure your database is reachable and credentials match the `.env` values. The backend will attempt a `SELECT NOW()` on startup to verify the connection.

## Project structure

- frontend/ — React + Vite UI
- backend/ — Express API
- ml_n_xai/ — FastAPI ML + SHAP explainer and sample CSVs

## Docker (single-container quickstart)

A single Docker image is provided that builds the frontend, installs the backend and ML dependencies, and starts PostgreSQL, the ML FastAPI service, and the Node backend. This is intended as a self-contained development/demo image — for production use prefer separate containers or managed services.

Build the image from the repository root:

```bash
docker build -t diasense:latest .
```

Run the container (example):

```bash
docker run --rm -p 5000:5000 -p 8000:8000 -p 5432:5432 \
  -e POSTGRES_USER=diasense -e POSTGRES_PASSWORD=diasense -e POSTGRES_DB=diasense \
  diasense:latest
```

- Frontend / backend: http://localhost:5000
- ML API: http://localhost:8000/predict

Notes:
- If you build the image but the backend shows a plain "Hello from Diasense", the frontend build may have failed during image build; check the `npm run build` output in the `docker build` logs and ensure `/app/backend/dist` contains files.
- The ML image installs Python packages into a virtualenv. Building Python packages like `xgboost` and `shap` can be slow and may require build tools; the Dockerfile installs common build deps. If the build fails, consider using a base image with prebuilt wheels or installing platform-specific packages.
- For production, use a multi-container `docker-compose` or Kubernetes setup (separate Postgres, backend, and ML services) and do not run Postgres inside the same container.
