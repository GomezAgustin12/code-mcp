# {{SERVICE_NAME}}/cmd/main.py.tpl
"""
Entry‑point:

* Boots FastAPI
* Connects DB
* Auto‑migrates metadata in dev
* Mounts Swagger (FastAPI serves it at /docs & /redoc automatically)
"""
import logging
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from internal.config.config import load
from internal.database import engine
from internal.{{MODULE_NAME}}.model import Base as {{MODULE_NAME}}Base
# IMPORT NEW MODULE MODELS HERE – keep this comment for code‑gen marker

from internal.{{MODULE_NAME}}.use_cases import router as {{MODULE_NAME}}_router
# REGISTER NEW MODULE ROUTERS HERE – keep this comment for code‑gen marker

log = logging.getLogger("uvicorn.error")

# ────────────────────────────────────────────────────────────────────────────────
# Settings & DB
cfg = load()

# Auto‑migrate: create tables if they don't exist (dev‑only)
log.info("Running migrations (SQLAlchemy create_all)")
{{MODULE_NAME}}Base.metadata.create_all(bind=engine)
# ADD NEW MODULE metadata.create_all(...) HERE IF NECESSARY

# ────────────────────────────────────────────────────────────────────────────────
# FastAPI app
app = FastAPI(
    title="{{SERVICE_NAME}} API",
    version="1.0",
    description=f"This is a sample server for {{SERVICE_NAME}}.",
    docs_url="/swagger/docs",
    redoc_url="/swagger/redoc",
    openapi_url="/swagger/openapi.json",
)

# CORS example (customise/remove)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health‑check
@app.get("/ping")
def ping() -> dict[str, str]:
    return {"message": "pong"}

# Routers (end‑points)
app.include_router({{MODULE_NAME}}_router)
# AUTO‑INCLUDE NEW ROUTERS ABOVE THIS LINE

# ────────────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    log.info("🌱 listening on :%s", cfg.port)
    uvicorn.run(
        "internal.cmd.main:app",
        host="0.0.0.0",
        port=int(cfg.port),
        reload=True,          # hot‑reload in dev
        log_level="info",
    )
