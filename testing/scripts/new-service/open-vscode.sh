#!/bin/bash
# scripts/new-service/open-vscode.sh
# Usage: source this file at the end of the process
cd /Users/agustin.gomez/Desktop/my-projects/mc-project/${SERVICE_NAME}
sh ./new-module.sh ${MODULE_NAME}
go mod tidy
code .
