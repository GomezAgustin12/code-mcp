#!/bin/zsh
# Create model file for the new module
MODULE_NAME=$1
MODULE_DIR="internal/$MODULE_NAME"
mkdir -p "$MODULE_DIR"
cat <<EOL > "$MODULE_DIR/$MODULE_NAME.model.go"
// $MODULE_NAME: MODEL 
package $MODULE_NAME

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type $(tr '[:lower:]' '[:upper:]' <<< ${MODULE_NAME:0:1})${MODULE_NAME:1} struct {
	ID            uuid.UUID \`gorm:"type:uuid;primary_key"\`

  	CreatedAt     time.Time \`gorm:"autoCreateTime"\`
	UpdatedAt     time.Time \`gorm:"autoUpdateTime"\`
  
}

func ($MODULE_NAME *$(tr '[:lower:]' '[:upper:]' <<< ${MODULE_NAME:0:1})${MODULE_NAME:1}) BeforeCreate(tx *gorm.DB) error {
	// TODO: implement 

	if $MODULE_NAME.ID == uuid.Nil || $MODULE_NAME.ID.String() == "00000000-0000-0000-0000-000000000000" {
		$MODULE_NAME.ID = uuid.New()
	}

	return nil
}

EOL
