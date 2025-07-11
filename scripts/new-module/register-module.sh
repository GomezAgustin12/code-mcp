#!/bin/zsh
# Register the new module in main.go
MODULE_NAME=$1
MAIN_GO="cmd/product-service/main.go"
MODULE_CAMEL="$(tr '[:lower:]' '[:upper:]' <<< ${MODULE_NAME:0:1})${MODULE_NAME:1}"
MODULE_VAR="${MODULE_NAME}"
MODULE_PASCAL="${MODULE_CAMEL}"

REGISTRATION_CODE="    // Register ${MODULE_PASCAL}s\n    ${MODULE_VAR}Repo := ${MODULE_NAME}.NewRepository(db)\n    ${MODULE_VAR}Service := ${MODULE_NAME}.NewService(${MODULE_VAR}Repo)\n    ${MODULE_VAR}UseCases := ${MODULE_NAME}.NewUseCases(${MODULE_VAR}Service)\n    ${MODULE_VAR}UseCases.Register(router)\n\n    // USE THIS COMMENT TO AUTO-GENERATE NEW MODULES"

awk -v reg_code="$REGISTRATION_CODE" '
/USE THIS COMMENT TO AUTO-GENERATE NEW MODULES/ {
    print reg_code
    next
}
{ print }
' "$MAIN_GO" > "$MAIN_GO.tmp" && mv "$MAIN_GO.tmp" "$MAIN_GO"

echo "\tModule registration for $MODULE_NAME added to $MAIN_GO."
echo "\n"
