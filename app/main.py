"""
Bayora - Securing Adversarial AI Safety Testing Infrastructure.
Main FastAPI application entry point.
"""
from contextlib import asynccontextmanager
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
