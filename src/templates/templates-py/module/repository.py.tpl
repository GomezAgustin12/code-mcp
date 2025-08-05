# {{MODULE_NAME}}: REPOSITORY
from typing import List, Optional
from uuid import UUID

from sqlalchemy.orm import Session

from .model import {{MODULE_NAME_UPPER}}

class Repository:
    """Thin SQLAlchemy wrapper."""

    def __init__(self, db: Session) -> None:
        self.db = db

    # CRUD -------------------------------------------------------------
    def create(self, m: {{MODULE_NAME_UPPER}}) -> {{MODULE_NAME_UPPER}}:
        self.db.add(m)
        self.db.commit()
        self.db.refresh(m)
        return m

    def find_by_id(self, id: UUID) -> Optional[{{MODULE_NAME_UPPER}}]:
        return (
            self.db
            .query({{MODULE_NAME_UPPER}})
            .filter({{MODULE_NAME_UPPER}}.id == id)
            .first()
        )

    def list(self) -> List[{{MODULE_NAME_UPPER}}]:
        return self.db.query({{MODULE_NAME_UPPER}}).all()

    def update(self, m: {{MODULE_NAME_UPPER}}) -> {{MODULE_NAME_UPPER}}:
        self.db.commit()
        self.db.refresh(m)
        return m

    def delete(self, id: UUID) -> None:
        obj = self.find_by_id(id)
        if obj:
            self.db.delete(obj)
            self.db.commit()
