// Template-Destination: internal/{{MODULE_NAME}}/{{MODULE_NAME}}.model.go
// Template-Variables: MODULE_NAME, MODULE_NAME_UPPER
// Template-Dependencies: internal/{{MODULE_NAME}}
// {{MODULE_NAME}}: MODEL 
package {{MODULE_NAME}}

import (
	"time"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type {{MODULE_NAME_UPPER}} struct {
	ID        uuid.UUID `gorm:"type:uuid;primary_key"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}

func (m *{{MODULE_NAME_UPPER}}) BeforeCreate(tx *gorm.DB) error {
	if m.ID == uuid.Nil || m.ID.String() == "00000000-0000-0000-0000-000000000000" {
		m.ID = uuid.New()
	}
	return nil
}
