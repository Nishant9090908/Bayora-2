"""
Integration tests for server-side Role-Based Access Control (RBAC).
Verifies:
1. Role boundaries are strictly enforced.
2. Cross-role unauthorized access returns 403 Forbidden.
3. Access violations automatically trigger security event logging.
"""
from app.models.audit import SecurityEvent

def test_auditor_can_access_audit_logs(client, auditor_token):
    response = client.get(
        "/api/audit/logs",
        headers={"Authorization": f"Bearer {auditor_token}"}
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_auditor_can_access_audit_summary(client, auditor_token):
    response = client.get(
        "/api/audit/summary",
        headers={"Authorization": f"Bearer {auditor_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "total_audit_logs" in data
    assert "total_security_events" in data

def test_red_team_cannot_access_audit_logs(client, red_token, db_session):
    response = client.get(
        "/api/audit/logs",
        headers={"Authorization": f"Bearer {red_token}"}
    )
    assert response.status_code == 403
    assert "Access forbidden" in response.json()["detail"]

    # Verify intrusion event was logged in SecurityEvent table
    event = db_session.query(SecurityEvent).filter(
        SecurityEvent.event_type == "UNAUTHORIZED_ROLE_ACCESS_ATTEMPT",
        SecurityEvent.actor_role == "red_team"
    ).order_by(SecurityEvent.id.desc()).first()
    assert event is not None
    assert event.severity == "HIGH"
    assert event.path == "/api/audit/logs"

def test_blue_team_cannot_access_audit_logs(client, blue_token, db_session):
    response = client.get(
        "/api/audit/logs",
        headers={"Authorization": f"Bearer {blue_token}"}
    )
    assert response.status_code == 403
    assert "Access forbidden" in response.json()["detail"]

    event = db_session.query(SecurityEvent).filter(
        SecurityEvent.event_type == "UNAUTHORIZED_ROLE_ACCESS_ATTEMPT",
        SecurityEvent.actor_role == "blue_team"
    ).order_by(SecurityEvent.id.desc()).first()
    assert event is not None
    assert event.severity == "HIGH"

def test_unauthenticated_cannot_access_audit_logs(client):
    response = client.get("/api/audit/logs")
    assert response.status_code == 401
