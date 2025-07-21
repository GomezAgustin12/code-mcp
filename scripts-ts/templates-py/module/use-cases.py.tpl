# {{MODULE_NAME}}: USE CASES (HTTP transport layer)
from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field, UUID4
from sqlalchemy.orm import Session

from .service import Service
from .repository import Repository
from .model import {{MODULE_NAME_UPPER}}
from .database import get_db  # ← supply a Session‑scoped dependency

router = APIRouter(prefix="/{{MODULE_NAME}}", tags=["{{MODULE_NAME}}"])

# -------------------------- DTOs / Schemas ---------------------------
class Create{{MODULE_NAME_UPPER}}Req(BaseModel):
    # TODO: add fields for creation, e.g. name: str = Field(...)
    pass

class ErrorResponse(BaseModel):
    error: str

# -------------------------- Dependencies -----------------------------
def get_service(db: Session = Depends(get_db)) -> Service:
    return Service(Repository(db))

# --------------------------- Handlers --------------------------------
@router.post(
    "",
    response_model={{MODULE_NAME_UPPER}},
    status_code=status.HTTP_201_CREATED,
    responses={400: {"model": ErrorResponse},
               500: {"model": ErrorResponse}},
)
def create(
    req: Create{{MODULE_NAME_UPPER}}Req,
    service: Service = Depends(get_service),
):
    model = {{MODULE_NAME_UPPER}}(**req.dict())  # map DTO → ORM
    try:
        return service.create(model)
    except Exception as e:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.get(
    "/{id}",
    response_model={{MODULE_NAME_UPPER}},
    responses={404: {"model": ErrorResponse}},
)
def get(
    id: UUID4,
    service: Service = Depends(get_service),
):
    model = service.find_by_id(UUID(str(id)))
    if model is None:
        raise HTTPException(status_code=404, detail="not found")
    return model


@router.get(
    "",
    response_model=List[{{MODULE_NAME_UPPER}}],
)
def list(
    service: Service = Depends(get_service),
):
    return service.list()


@router.put(
    "/{id}",
    response_model={{MODULE_NAME_UPPER}},
)
def update(
    id: UUID4,
    req: Create{{MODULE_NAME_UPPER}}Req,  # replace with dedicated Update DTO if needed
    service: Service = Depends(get_service),
):
    model = service.find_by_id(UUID(str(id)))
    if model is None:
        raise HTTPException(status_code=404, detail="not found")

    # partial update – copy only provided fields
    for field, value in req.dict(exclude_unset=True).items():
        setattr(model, field, value)

    try:
        return service.update(model)
    except Exception as e:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete(
    id: UUID4,
    service: Service = Depends(get_service),
):
    try:
        service.delete(UUID(str(id)))
    except Exception as e:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=str(e)) from e
