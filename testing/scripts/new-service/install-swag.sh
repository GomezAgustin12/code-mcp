#!/bin/bash
# scripts/new-service/install-swag.sh
# Usage: source this file to ensure swag CLI is installed and in PATH
export PATH="$(go env GOPATH)/bin:$PATH"
if ! command -v swag &> /dev/null; then
  go install github.com/swaggo/swag/cmd/swag@latest
fi
