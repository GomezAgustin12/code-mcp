# Template-Destination: internal/database/database.py
# Template-Dependencies: internal/database
# {{SERVICE_NAME}}/internal/database.py.tpl
"""Engine, session factory and FastAPI dependency."""

from contextlib import contextmanager
from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from .config.config import load

_cfg = load()

# Engine – echo=True for local debugging
engine = create_engine(_cfg.db.dsn, pool_pre_ping=True, echo=False, future=True)

# sessionmaker returns an "autocommit=False / autoflush=False" Session class – typical FastAPI recipe
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, expire_on_commit=False)


@contextmanager
def session_scope() -> Generator[Session, None, None]:
    """Provide a transactional scope around a series of operations."""
    session: Session = SessionLocal()
    try:
        yield session
        session.commit()
    except:   # noqa: E722 – re‑raise after rollback
        session.rollback()
        raise
    finally:
        session.close()


# FastAPI dependency used earlier in `use_cases.py.tpl`
def get_db() -> Generator[Session, None, None]:
    with session_scope() as db:
        yield db
