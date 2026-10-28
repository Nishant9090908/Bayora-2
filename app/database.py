"""
Database setup for Bayora using SQLAlchemy.
Configured for SQLite by default with thread safety.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings, BASE_DIR

db_url = settings.DATABASE_URL
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

try:
    connect_args = {"check_same_thread": False} if db_url.startswith("sqlite") else {}
    engine = create_engine(
        db_url,
        connect_args=connect_args,
        echo=False
    )
    with engine.connect():
        pass
except Exception:
    fallback_url = f"sqlite:///{BASE_DIR / 'bayora.db'}"
    engine = create_engine(
        fallback_url,
        connect_args={"check_same_thread": False},
        echo=False
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """Dependency for yielding a scoped database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
