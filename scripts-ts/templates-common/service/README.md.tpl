# Template-Destination: README.md
# Template-Variables: SERVICE_NAME
# {{SERVICE_NAME}} Service

This is the {{SERVICE_NAME}} microservice.

## Getting Started

1. Copy `.env.example` to `.env` and configure your environment variables
2. Install dependencies
3. Run the service

## Environment Variables

- `DB_HOST`: Database host (default: localhost)
- `DB_USER`: Database user (default: postgres)
- `DB_PASSWORD`: Database password (default: postgres)
- `DB_NAME`: Database name (default: {{SERVICE_NAME}})
- `DB_PORT`: Database port (default: 5432)
- `APP_PORT`: Application port (default: 8080)

## Development

See language-specific instructions in the main service file.