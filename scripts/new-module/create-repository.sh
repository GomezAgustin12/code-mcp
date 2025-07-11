#!/bin/zsh
# Create repository file for the new module
MODULE_NAME=$1
MODULE_DIR="internal/$MODULE_NAME"
cat <<EOL > "$MODULE_DIR/$MODULE_NAME.repository.go"
// $MODULE_NAME: Repository 
package $MODULE_NAME

import (
	"context"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Repository interface {
	Create(ctx context.Context, $MODULE_NAME *$(tr '[:lower:]' '[:upper:]' <<< ${MODULE_NAME:0:1})${MODULE_NAME:1}) error
	FindByID(ctx context.Context, id uuid.UUID) (*$(tr '[:lower:]' '[:upper:]' <<< ${MODULE_NAME:0:1})${MODULE_NAME:1}, error)
	List(ctx context.Context) ([]$(tr '[:lower:]' '[:upper:]' <<< ${MODULE_NAME:0:1})${MODULE_NAME:1}, error)
	Update(ctx context.Context, $MODULE_NAME *$(tr '[:lower:]' '[:upper:]' <<< ${MODULE_NAME:0:1})${MODULE_NAME:1}) error
	Delete(ctx context.Context, id uuid.UUID) error
}

type gormRepo struct{ db *gorm.DB }

func NewRepository(db *gorm.DB) Repository { return &gormRepo{db: db} }

func (repo *gormRepo) Create(ctx context.Context, $MODULE_NAME *$(tr '[:lower:]' '[:upper:]' <<< ${MODULE_NAME:0:1})${MODULE_NAME:1}) error {
	return repo.db.WithContext(ctx).Create($MODULE_NAME).Error
}

func (repo *gormRepo) FindByID(ctx context.Context, id uuid.UUID) (*$(tr '[:lower:]' '[:upper:]' <<< ${MODULE_NAME:0:1})${MODULE_NAME:1}, error) {
	var $MODULE_NAME $(tr '[:lower:]' '[:upper:]' <<< ${MODULE_NAME:0:1})${MODULE_NAME:1}
	err := repo.db.WithContext(ctx).First(&$MODULE_NAME, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &$MODULE_NAME, nil
}

func (repo *gormRepo) List(ctx context.Context) ([]$(tr '[:lower:]' '[:upper:]' <<< ${MODULE_NAME:0:1})${MODULE_NAME:1}, error) {
	var list []$(tr '[:lower:]' '[:upper:]' <<< ${MODULE_NAME:0:1})${MODULE_NAME:1}
	err := repo.db.WithContext(ctx).Find(&list).Error
	if err != nil {
		return nil, err
	}
	return list, nil
}

func (repo *gormRepo) Update(ctx context.Context, $MODULE_NAME *$(tr '[:lower:]' '[:upper:]' <<< ${MODULE_NAME:0:1})${MODULE_NAME:1}) error {
	return repo.db.WithContext(ctx).Save($MODULE_NAME).Error
}

func (repo *gormRepo) Delete(ctx context.Context, id uuid.UUID) error {
	return repo.db.WithContext(ctx).Delete(&$(tr '[:lower:]' '[:upper:]' <<< ${MODULE_NAME:0:1})${MODULE_NAME:1}{}, "id = ?", id).Error
}
EOL
