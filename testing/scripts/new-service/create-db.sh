#!/bin/bash
# scripts/new-service/create-db.sh
# Usage: source this file after service dir is ready
if ! command -v createdb &> /dev/null; then
  echo "'createdb' not found. Attempting to create database using Docker..."
  POSTGRES_CONTAINER=$(docker ps --filter ancestor=postgres --format '{{.ID}}' | head -n 1)
  if [ -z "$POSTGRES_CONTAINER" ]; then
    echo "Error: No running postgres Docker container found. Please start your postgres container."
  else
    docker exec -u postgres "$POSTGRES_CONTAINER" psql -tc "SELECT 1 FROM pg_database WHERE datname = '$SERVICE_NAME'" | grep -q 1 || \
      docker exec -u postgres "$POSTGRES_CONTAINER" createdb "$SERVICE_NAME" && \
      echo "Database '$SERVICE_NAME' created successfully in Docker." || \
      echo "Database '$SERVICE_NAME' already exists in Docker or error occurred."
  fi
else
  createdb_output=$(createdb "$SERVICE_NAME" 2>&1 || true)
  if [[ "$createdb_output" == *"already exists"* ]]; then
    echo "Database '$SERVICE_NAME' already exists. Skipping creation."
  elif [[ "$createdb_output" != "" ]]; then
    echo "Error creating database: $createdb_output"
  else
    echo "Database '$SERVICE_NAME' created successfully."
  fi
fi
