#!/bin/bash
# scripts/new-service/create-structure.sh
# Usage: source this file after setting SERVICE_NAME
mkdir "$SERVICE_NAME"
cd "$SERVICE_NAME"
mkdir -p cmd
mkdir -p internal
mkdir -p internal/config
mkdir -p diagrams
