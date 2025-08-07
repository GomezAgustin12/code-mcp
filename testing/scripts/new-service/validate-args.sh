#!/bin/bash
# scripts/new-service/validate-args.sh
# Usage: source this file to validate $1 and $2 as service and module names
set -e
if [ -z "$1" ] && [ -z "$2" ]; then
  echo "Error: Missing service and module name."
  echo "Usage: $0 <service-name> <module-name>"
  echo "Example: sh new-service.sh catalog product"
  exit 1
fi
if [ -z "$1" ]; then
  echo "Error: Missing service name."
  echo "Usage: $0 <service-name> <module-name>"
  echo "Example: sh new-service.sh catalog product"
  exit 1
fi
if [ -z "$2" ]; then
  echo "Error: Missing module name."
  echo "Usage: $0 <service-name> <module-name>"
  echo "Example: sh new-service.sh catalog product"
  exit 1
fi
