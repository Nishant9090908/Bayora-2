"""
Unit and integration tests for authentication and token validation.
"""
from app.models.audit import SecurityEvent, AuditLog

def test_health_check(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "Bayora"

def test_login_success(client, db_session):
    response = client.post("/api/auth/login", json={
        "username": "red_operator",
        "password": "RedOperator2026!"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "red_team"
    assert data["username"] == "red_operator"

    # Verify audit log was recorded
    audit = db_session.query(AuditLog).filter(
        AuditLog.action == "AUTH_LOGIN",
        AuditLog.actor_username == "red_operator"
    ).first()
    assert audit is not None
    assert audit.status == "SUCCESS"

def test_login_wrong_password(client, db_session):
    response = client.post("/api/auth/login", json={
        "username": "red_operator",
        "password": "WrongPassword999!"
    })
    assert response.status_code == 401
    assert "Incorrect username or password" in response.json()["detail"]

    # Verify security event was recorded
    sec_event = db_session.query(SecurityEvent).filter(
        SecurityEvent.event_type == "AUTH_FAILED_CREDENTIALS"
    ).order_by(SecurityEvent.id.desc()).first()
    assert sec_event is not None
    assert "red_operator" in sec_event.details

def test_login_nonexistent_user(client):
    response = client.post("/api/auth/login", json={
        "username": "ghost_hacker",
        "password": "AnyPassword!"
    })
    assert response.status_code == 401

def test_me_authenticated(client, red_token):
    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {red_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "red_operator"
    assert data["role"] == "red_team"

def test_me_unauthenticated(client, db_session):
    response = client.get("/api/auth/me")
    assert response.status_code == 401

    sec_event = db_session.query(SecurityEvent).filter(
        SecurityEvent.event_type == "UNAUTHENTICATED_ACCESS_ATTEMPT"
    ).order_by(SecurityEvent.id.desc()).first()
    assert sec_event is not None
    assert sec_event.path == "/api/auth/me"

def test_me_tampered_token(client, db_session):
    tampered = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwicm9sZSI6ImF1ZGl0b3IifQ.invalid_signature_here"
    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {tampered}"}
    )
    assert response.status_code == 401

    sec_event = db_session.query(SecurityEvent).filter(
        SecurityEvent.event_type == "INVALID_TOKEN_SIGNATURE"
    ).order_by(SecurityEvent.id.desc()).first()
    assert sec_event is not None
