// {{MODULE_NAME}}: USE CASES 
package {{MODULE_NAME}}

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
	r.POST("/{{MODULE_NAME}}", usecases.Create)
	r.GET("/{{MODULE_NAME}}/:id", usecases.Get)
	r.GET("/{{MODULE_NAME}}", usecases.List)
	r.PUT("/{{MODULE_NAME}}/:id", usecases.Update)
	r.DELETE("/{{MODULE_NAME}}/:id", usecases.Delete)
}

type Create{{MODULE_NAME_UPPER}}Req struct {
	// TODO: add fields for creation
}

type ErrorResponse struct {
	Error string `json:"error"`
}

// Handlers
func (usecases *UseCases) Create(c *gin.Context) {
	var req Create{{MODULE_NAME_UPPER}}Req
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
		return
	}
	// TODO: Map req to model
	model := &{{MODULE_NAME_UPPER}}{}
	if err := usecases.svc.Create(c.Request.Context(), model); err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusCreated, model)
}

func (usecases *UseCases) Get(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "invalid id"})
		return
	}
	model, err := usecases.svc.FindByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, ErrorResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, model)
}

func (usecases *UseCases) List(c *gin.Context) {
	list, err := usecases.svc.List(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, list)
}

func (usecases *UseCases) Update(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "invalid id"})
		return
	}
	var req Create{{MODULE_NAME_UPPER}}Req // TODO: Replace with Update req if needed
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
		return
	}
	model := &{{MODULE_NAME_UPPER}}{ID: id}
	// TODO: Map req to model
	if err := usecases.svc.Update(c.Request.Context(), model); err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, model)
}

func (usecases *UseCases) Delete(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "invalid id"})
		return
	}
	if err := usecases.svc.Delete(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}
