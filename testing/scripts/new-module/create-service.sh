#!/bin/zsh
# Create service file for the new module
MODULE_NAME=$1
MODULE_DIR="internal/$MODULE_NAME"
cat <<EOL > "$MODULE_DIR/$MODULE_NAME.service.go"
// $MODULE_NAME: SERVICE logic 
package $MODULE_NAME

import (
	"context"

  "github.com/google/uuid"
)

type Service struct {
	repo Repository
}

func NewService(repo Repository) *Service {
	return &Service{repo: repo}
}

func (service *Service) Create(ctx context.Context, $MODULE_NAME *$(tr '[:lower:]' '[:upper:]' <<< ${MODULE_NAME:0:1})${MODULE_NAME:1}) error {
	return service.repo.Create(ctx, $MODULE_NAME)
}

func (service *Service) FindByID(ctx context.Context, id uuid.UUID) (*$(tr '[:lower:]' '[:upper:]' <<< ${MODULE_NAME:0:1})${MODULE_NAME:1}, error) {
	// TODO: convert id to uuid.UUID if needed
	return service.repo.FindByID(ctx, id)
}

func (service *Service) List(ctx context.Context) ([]$(tr '[:lower:]' '[:upper:]' <<< ${MODULE_NAME:0:1})${MODULE_NAME:1}, error) {
	return service.repo.List(ctx)
}

func (service *Service) Update(ctx context.Context, $MODULE_NAME *$(tr '[:lower:]' '[:upper:]' <<< ${MODULE_NAME:0:1})${MODULE_NAME:1}) error {
	return service.repo.Update(ctx, $MODULE_NAME)
}

func (service *Service) Delete(ctx context.Context, id uuid.UUID) error {
	return service.repo.Delete(ctx, id)
}
EOL
