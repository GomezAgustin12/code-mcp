#!/bin/zsh
# Print the pending migration step for the new module
MODULE_NAME=$1
MODULE_CAMEL="$(tr '[:lower:]' '[:upper:]' <<< ${MODULE_NAME:0:1})${MODULE_NAME:1}"
cat <<EOL
        PENDING STEP:

        Add the module to the database migration script in 
        cmd/product-service/main.go

        if err := db.AutoMigrate( 
         &${MODULE_NAME}.${MODULE_CAMEL}{}, // <--- Add this line
         ...
        ); err != nil {
          log.Fatalf("failed to migrate database: %v", err)
        }
EOL

echo "------------------------------------------------------------------------------------------------"
