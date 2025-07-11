#!/bin/bash
# scripts/new-service/create-env.sh
# Usage: source this file after setting SERVICE_NAME
cat <<EODOTENV > .env
# Database configuration
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=${SERVICE_NAME}
DB_PORT="5432"
EODOTENV
