// {{MODULE_NAME}}: Repository 
package {{MODULE_NAME}}

import (
	"context"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Repository interface {
	Create(ctx context.Context, m *{{MODULE_NAME_UPPER}}) error
	FindByID(ctx context.Context, id uuid.UUID) (*{{MODULE_NAME_UPPER}}, error)
	List(ctx context.Context) ([]{{MODULE_NAME_UPPER}}, error)
	Update(ctx context.Context, m *{{MODULE_NAME_UPPER}}) error
	Delete(ctx context.Context, id uuid.UUID) error
}

type gormRepo struct{ db *gorm.DB }

func NewRepository(db *gorm.DB) Repository { return &gormRepo{db: db} }

func (repo *gormRepo) Create(ctx context.Context, m *{{MODULE_NAME_UPPER}}) error {
	return repo.db.WithContext(ctx).Create(m).Error
}

func (repo *gormRepo) FindByID(ctx context.Context, id uuid.UUID) (*{{MODULE_NAME_UPPER}}, error) {
	var m {{MODULE_NAME_UPPER}}
	err := repo.db.WithContext(ctx).First(&m, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &m, nil
}

func (repo *gormRepo) List(ctx context.Context) ([]{{MODULE_NAME_UPPER}}, error) {
	var list []{{MODULE_NAME_UPPER}}
	return list, repo.db.WithContext(ctx).Find(&list).Error
}

func (repo *gormRepo) Update(ctx context.Context, m *{{MODULE_NAME_UPPER}}) error {
	return repo.db.WithContext(ctx).Save(m).Error
}

func (repo *gormRepo) Delete(ctx context.Context, id uuid.UUID) error {
	return repo.db.WithContext(ctx).Delete(&{{MODULE_NAME_UPPER}}{}, "id = ?", id).Error
}
