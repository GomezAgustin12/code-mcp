#!/bin/zsh
# Usage: ./new-module.sh <module_name>
# Creates a new module structure under internal/<module_name>/
echo "------------------------------------------------------------------------------------------------"


set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <module_name>"
  exit 1
fi

MODULE_NAME=$1

scripts/new-module/create-model.sh "$MODULE_NAME"
echo "\tFile internal/$MODULE_NAME/$MODULE_NAME.model.go created."

scripts/new-module/create-repository.sh "$MODULE_NAME"
echo "\tFile internal/$MODULE_NAME/$MODULE_NAME.repository.go created."

scripts/new-module/create-service.sh "$MODULE_NAME"
echo "\tFile internal/$MODULE_NAME/$MODULE_NAME.service.go created."

scripts/new-module/create-use-cases.sh "$MODULE_NAME"
echo "\tFile internal/$MODULE_NAME/$MODULE_NAME.use-cases.go created."

scripts/new-module/register-module.sh "$MODULE_NAME"

scripts/new-module/print-pending-step.sh "$MODULE_NAME"