#!/bin/bash
# scripts/new-service/init-go.sh
# Usage: source this file after setting SERVICE_NAME

go mod init "$SERVICE_NAME"

go get github.com/gin-gonic/gin
go get github.com/swaggo/gin-swagger
go get github.com/swaggo/files
go get gorm.io/gorm
go get gorm.io/driver/postgres
