# {{MODULE_NAME}}: MODEL
from datetime import datetime
import uuid

from sqlalchemy import Column, DateTime
from sqlalchemy.dialects.postgresql import UUID  # use sqlalchemy_utils if you prefer
from sqlalchemy.orm import declarative_base

Base = declarative_base()  # or import your own shared Base

class {{MODULE_NAME_UPPER}}(Base):
    __tablename__ = "{{MODULE_NAME}}"

    id         = Column(UUID(as_uuid=True), primary_key=True,
                        default=uuid.uuid4, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow,
                        onupdate=datetime.utcnow, nullable=False)

    # Optional—for nicer logging
    def __repr__(self) -> str:                       # pragma: no cover
        return f"<{{MODULE_NAME_UPPER}} id={self.id}>"
