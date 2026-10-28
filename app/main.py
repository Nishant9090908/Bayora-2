"""
Bayora - Securing Adversarial AI Safety Testing Infrastructure.
Main FastAPI application entry point.
"""
import sys
from pathlib import Path
from contextlib import asynccontextmanager

# Ensure repository root is in sys.path when running app/main.py directly
_root_dir = Path(__file__).resolve().parent.parent
if str(_root_dir) not in sys.path:
    sys.path.insert(0, str(_root_dir))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import Base, engine
from app.seed import seed_users
from app.api.routes_auth import router as auth_router
from app.api.routes_audit import router as audit_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB schema & seed demo users on startup
    Base.metadata.create_all(bind=engine)
    seed_users()
    yield

app = FastAPI(
    title=settings.APP_NAME,
    description="Securing Adversarial AI Safety Testing Infrastructure",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for local cross-origin development if needed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth_router)
app.include_router(audit_router)

@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "environment": settings.APP_ENV,
        "version": "1.0.0"
    }

# Mount static frontend assets & root route
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

_frontend_dir = _root_dir / "frontend"
if _frontend_dir.exists():
    app.mount("/css", StaticFiles(directory=_frontend_dir / "css"), name="css")
    app.mount("/js", StaticFiles(directory=_frontend_dir / "js"), name="js")
    app.mount("/admin", StaticFiles(directory=_frontend_dir / "admin"), name="admin")
    app.mount("/blue-team", StaticFiles(directory=_frontend_dir / "blue-team"), name="blue-team")
    app.mount("/red-team", StaticFiles(directory=_frontend_dir / "red-team"), name="red-team")
    app.mount("/common", StaticFiles(directory=_frontend_dir / "common"), name="common")

    @app.get("/", include_in_schema=False)
    async def serve_index():
        return FileResponse(_frontend_dir / "index.html")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
