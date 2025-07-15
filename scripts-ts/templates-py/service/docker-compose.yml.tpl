# {{SERVICE_NAME}}: docker‑compose
services:
  db:
    image: postgres:16
    restart: unless-stopped
    environment:
      - POSTGRES_USER=${DB_USER:-postgres}
      - POSTGRES_PASSWORD=${DB_PASSWORD:-postgres}
      - POSTGRES_DB=${DB_NAME:-{{SERVICE_NAME}}}
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $$POSTGRES_USER -d $$POSTGRES_DB"]
      interval: 5s
      timeout: 3s
      retries: 10

  {{SERVICE_NAME}}:
    build:
      context: .
      dockerfile: Dockerfile
    depends_on:
      db:
        condition: service_healthy
    env_file:
      - .env               # Re‑use same env you use locally
    environment:
      # Override DB_HOST so the app connects to *container* “db”
      - DB_HOST=db
      # FastAPI will still honour APP_PORT coming from .env
    ports:
      - "${APP_PORT:-8080}:8080"
    restart: unless-stopped

volumes:
  db_data:
