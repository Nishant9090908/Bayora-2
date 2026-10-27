"""
Pytest configuration and fixtures for Bayora test suite.
Uses an isolated in-memory SQLite database with StaticPool so all sessions share tables.
"""
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

# Ensure all models are registered on Base.metadata before create_all
import app.models  # noqa: F401
from app.database import Base, get_db
from app.main import app
from app.seed import DEFAULT_USERS
from app.models.user import User
from app.services.auth_service import hash_password, create_access_token

# Dedicated test SQLite database in memory with StaticPool
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    for u_data in DEFAULT_USERS:
        user = User(
            username=u_data["username"],
            password_hash=hash_password(u_data["password"]),
            role=u_data["role"],
            display_name=u_data["display_name"]
        )
        db.add(user)
    db.commit()
    db.close()
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def db_session():
    """Yield a transactional test database session."""
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()

@pytest.fixture
def client(db_session):
    """Test client with overridden get_db dependency."""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

@pytest.fixture
def red_token(db_session):
    user = db_session.query(User).filter(User.username == "red_operator").first()
    return create_access_token(data={"sub": str(user.id), "username": user.username, "role": user.role})

@pytest.fixture
def blue_token(db_session):
    user = db_session.query(User).filter(User.username == "blue_defender").first()
    return create_access_token(data={"sub": str(user.id), "username": user.username, "role": user.role})

@pytest.fixture
def auditor_token(db_session):
    user = db_session.query(User).filter(User.username == "compliance_auditor").first()
    return create_access_token(data={"sub": str(user.id), "username": user.username, "role": user.role})
