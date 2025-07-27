# Template-Destination: .env
# Template-Variables: SERVICE_NAME
# Common environment configuration for all languages
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME={{SERVICE_NAME}}
DB_PORT=5432

# App configuration
APP_PORT=8080