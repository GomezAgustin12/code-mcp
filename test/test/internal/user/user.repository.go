// user: Repository 
package user

import (
	"context"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Repository interface {
	Create(ctx context.Context, m *User) error
	FindByID(ctx context.Context, id uuid.UUID) (*User, error)
	List(ctx context.Context) ([]User, error)
	Update(ctx context.Context, m *User) error
	Delete(ctx context.Context, id uuid.UUID) error
}

type gormRepo struct{ db *gorm.DB }

func NewRepository(db *gorm.DB) Repository { return &gormRepo{db: db} }

func (repo *gormRepo) Create(ctx context.Context, m *User) error {
	return repo.db.WithContext(ctx).Create(m).Error
}

func (repo *gormRepo) FindByID(ctx context.Context, id uuid.UUID) (*User, error) {
	var m User
	err := repo.db.WithContext(ctx).First(&m, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &m, nil
}

func (repo *gormRepo) List(ctx context.Context) ([]User, error) {
	var list []User
	return list, repo.db.WithContext(ctx).Find(&list).Error
}

func (repo *gormRepo) Update(ctx context.Context, m *User) error {
	return repo.db.WithContext(ctx).Save(m).Error
}

func (repo *gormRepo) Delete(ctx context.Context, id uuid.UUID) error {
	return repo.db.WithContext(ctx).Delete(&User{}, "id = ?", id).Error
}
