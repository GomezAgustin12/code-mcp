// {{MODULE_NAME}}: SERVICE logic 
package {{MODULE_NAME}}

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

func (service *Service) Create(ctx context.Context, m *{{MODULE_NAME_UPPER}}) error {
	return service.repo.Create(ctx, m)
}

func (service *Service) FindByID(ctx context.Context, id uuid.UUID) (*{{MODULE_NAME_UPPER}}, error) {
	return service.repo.FindByID(ctx, id)
}

func (service *Service) List(ctx context.Context) ([]{{MODULE_NAME_UPPER}}, error) {
	return service.repo.List(ctx)
}

func (service *Service) Update(ctx context.Context, m *{{MODULE_NAME_UPPER}}) error {
	return service.repo.Update(ctx, m)
}

func (service *Service) Delete(ctx context.Context, id uuid.UUID) error {
	return service.repo.Delete(ctx, id)
}
