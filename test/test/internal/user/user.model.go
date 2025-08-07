// user: MODEL 
package user

import (
	"time"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID        uuid.UUID `gorm:"type:uuid;primary_key"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}

func (m *User) BeforeCreate(tx *gorm.DB) error {
	if m.ID == uuid.Nil || m.ID.String() == "00000000-0000-0000-0000-000000000000" {
		m.ID = uuid.New()
	}
	return nil
}
