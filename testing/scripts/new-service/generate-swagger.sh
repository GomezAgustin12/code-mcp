#!/bin/bash
# scripts/new-service/generate-swagger.sh
# Usage: source this file after Go code is ready
export PATH="$(go env GOPATH)/bin:$PATH"
swag init -g ./cmd/main.go -o ./docs/swagger || echo "⚠️  swag CLI not found or failed, please ensure it's installed and in your PATH."
