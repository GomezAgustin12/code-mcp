# {{SERVICE_NAME}}: Dockerfile (multi‑stage)

# ───── Build image ─────────────────────────────────────────────────────────────
FROM python:3.12-slim AS build

WORKDIR /app

# Install runtime deps first so they’re cached
RUN apt-get update \
 && apt-get install -y --no-install-recommends gcc libpq-dev \
 && rm -rf /var/lib/apt/lists/*

# Poetry? Pip? We’ll stay with requirements.txt to match earlier template
COPY requirements.txt ./
RUN pip install --upgrade pip \
 && pip install --no-cache-dir -r requirements.txt

# ───── Production image ────────────────────────────────────────────────────────
FROM python:3.12-slim

# Add a non‑root user
RUN addgroup --system app && adduser --system --ingroup app app
USER app

ENV PYTHONUNBUFFERED=1 \
    # honour $APP_PORT from .env
    APP_PORT=${APP_PORT:-8080}

WORKDIR /app

# Copy installed site‑packages from the build stage
COPY --from=build /usr/local/lib/python*/site-packages /usr/local/lib/python*/site-packages
COPY --from=build /usr/local/bin /usr/local/bin

# Copy service source
COPY --chown=app:app . .

EXPOSE 8080

CMD ["uvicorn", "internal.cmd.main:app", "--host", "0.0.0.0", "--port", "8080"]
