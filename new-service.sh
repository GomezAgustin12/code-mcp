#!/bin/bash
# Usage: ./new-service.sh <service-name> <module-name>
set -e

# Modular orchestrator for new service creation
SCRIPTS_DIR="$(cd "$(dirname "$0")/scripts/new-service" && pwd)"

# Validate arguments
source "$SCRIPTS_DIR/validate-args.sh" "$@"

SERVICE_NAME=$1
MODULE_NAME=$2
MODULE_NAME_UPPER=$(tr '[:lower:]' '[:upper:]' <<< ${MODULE_NAME:0:1})${MODULE_NAME:1}

# Create structure and config
source "$SCRIPTS_DIR/create-structure.sh"
source "$SCRIPTS_DIR/create-env.sh"
source "$SCRIPTS_DIR/create-config.sh"

# Go module and dependencies
source "$SCRIPTS_DIR/init-go.sh"
source "$SCRIPTS_DIR/install-swag.sh"

# Main.go and scripts
source "$SCRIPTS_DIR/create-main.sh"
source "$SCRIPTS_DIR/copy-module-scripts.sh"

# Git and Swagger
source "$SCRIPTS_DIR/init-git.sh"
source "$SCRIPTS_DIR/generate-swagger.sh"

echo
source "$SCRIPTS_DIR/final-message.sh"

# Create DB
source "$SCRIPTS_DIR/create-db.sh"

# Open in VSCode and run module script
go mod tidy
source "$SCRIPTS_DIR/open-vscode.sh"