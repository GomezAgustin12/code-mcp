#!/bin/zsh
# Create use-cases file for the new module
MODULE_NAME=$1
MODULE_DIR="internal/$MODULE_NAME"
cat <<EOL > "$MODULE_DIR/$MODULE_NAME.use-cases.go"
// $MODULE_NAME: USE CASES 
package $MODULE_NAME

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
)

type UseCases struct {
	svc       *Service
	validator *validator.Validate
}

func NewUseCases(svc *Service) *UseCases {
	return &UseCases{
		svc:       svc,
		validator: validator.New(),
	}
}

func (usecases *UseCases) Register(r *gin.Engine) {
	r.POST("/$MODULE_NAME", usecases.Create)
	r.GET("/$MODULE_NAME/:id", usecases.Get)
	r.GET("/$MODULE_NAME", usecases.List)
	r.PUT("/$MODULE_NAME/:id", usecases.Update)
	r.DELETE("/$MODULE_NAME/:id", usecases.Delete)
}

type Create$(tr '[:lower:]' '[:upper:]' <<< ${MODULE_NAME:0:1})${MODULE_NAME:1}Req struct {
	// TODO: add fields for creation
}

type ErrorResponse struct {
	Error string \`json:"error"\`
}

func (usecases *UseCases) Create(ctx *gin.Context) {
	var req Create$(tr '[:lower:]' '[:upper:]' <<< ${MODULE_NAME:0:1})${MODULE_NAME:1}Req
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
		return
	}
	if err := usecases.validator.Struct(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
		return
	}
	$MODULE_NAME := &$(tr '[:lower:]' '[:upper:]' <<< ${MODULE_NAME:0:1})${MODULE_NAME:1}{}
	if err := usecases.svc.Create(ctx.Request.Context(), $MODULE_NAME); err != nil {
		ctx.JSON(http.StatusConflict, ErrorResponse{Error: err.Error()})
		return
	}
	ctx.JSON(http.StatusCreated, $MODULE_NAME)
}

func (usecases *UseCases) Get(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, ErrorResponse{Error: "invalid uuid"})
		return
	}
	$MODULE_NAME, err := usecases.svc.FindByID(ctx.Request.Context(), id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, ErrorResponse{Error: err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, $MODULE_NAME)
}

func (usecases *UseCases) List(ctx *gin.Context) {
	list, _ := usecases.svc.List(ctx.Request.Context())
	ctx.JSON(http.StatusOK, list)
}

func (usecases *UseCases) Update(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, ErrorResponse{Error: "invalid uuid"})
		return
	}
	var req Create$(tr '[:lower:]' '[:upper:]' <<< ${MODULE_NAME:0:1})${MODULE_NAME:1}Req
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
		return
	}
	$MODULE_NAME := &$(tr '[:lower:]' '[:upper:]' <<< ${MODULE_NAME:0:1})${MODULE_NAME:1}{ 
    ID: id,
  }
	if err := usecases.svc.Update(ctx.Request.Context(), $MODULE_NAME); err != nil {
		ctx.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}
	ctx.Status(http.StatusNoContent)
}

func (usecases *UseCases) Delete(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, ErrorResponse{Error: "invalid uuid"})
		return
	}
	if err := usecases.svc.Delete(ctx.Request.Context(), id); err != nil {
		ctx.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}
	ctx.Status(http.StatusNoContent)
}
EOL
