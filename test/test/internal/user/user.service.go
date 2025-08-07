// user: SERVICE logic 
package user

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

func (service *Service) Create(ctx context.Context, m *User) error {
	return service.repo.Create(ctx, m)
}

func (service *Service) FindByID(ctx context.Context, id uuid.UUID) (*User, error) {
	return service.repo.FindByID(ctx, id)
}

func (service *Service) List(ctx context.Context) ([]User, error) {
	return service.repo.List(ctx)
}

func (service *Service) Update(ctx context.Context, m *User) error {
	return service.repo.Update(ctx, m)
}

func (service *Service) Delete(ctx context.Context, id uuid.UUID) error {
	return service.repo.Delete(ctx, id)
}
