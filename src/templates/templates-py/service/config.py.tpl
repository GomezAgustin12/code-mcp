# {{SERVICE_NAME}}/internal/config/config.py.tpl
"""Application and DB configuration loader (dotenv‑friendly)."""
from dataclasses import dataclass
import os
from pathlib import Path

from dotenv import load_dotenv

# ────────────────────────────────────────────────────────────────────────────────
# .env loading
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent.parent / ".env", override=False)

# ────────────────────────────────────────────────────────────────────────────────
@dataclass(slots=True, frozen=True)
class DBConfig:
    host:     str
    user:     str
    password: str
    name:     str
    port:     str = "5432"

    @property
    def dsn(self) -> str:
        """Return a Postgres SQLAlchemy DSN string."""
        return (
            "postgresql+psycopg2://"
            f"{self.user}:{self.password}@{self.host}:{self.port}/{self.name}"
        )


@dataclass(slots=True, frozen=True)
class AppConfig:
    port: str
    db:   DBConfig


def _getenv(key: str, default: str) -> str:        # small helper
    return os.getenv(key, default)


def load() -> AppConfig:
    """Read environment variables and return an AppConfig instance."""
    return AppConfig(
        port=_getenv("APP_PORT", "8080"),
        db=DBConfig(
            host=_getenv("DB_HOST", "localhost"),
            user=_getenv("DB_USER", "postgres"),
            password=_getenv("DB_PASSWORD", "postgres"),
            name=_getenv("DB_NAME", "{{SERVICE_NAME}}"),
            port=_getenv("DB_PORT", "5432"),
        ),
    )
