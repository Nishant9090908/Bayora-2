"""
Audit and security event logging service for Bayora.
Guarantees append-only persistence of actions and intrusion events.
"""
import json
from datetime import datetime, timezone
from typing import Optional, Any
from sqlalchemy.orm import Session
from app.models.audit import AuditLog, SecurityEvent

def log_audit(
    db: Session,
    action: str,
    resource: str,
    status: str,
    actor_id: Optional[int] = None,
    actor_username: Optional[str] = None,
    actor_role: Optional[str] = None,
    details: Optional[dict[str, Any]] = None
) -> AuditLog:
    """Record an operational activity in the immutable audit log."""
    details_str = json.dumps(details) if details else None
    audit_entry = AuditLog(
        timestamp=datetime.now(timezone.utc),
        actor_id=actor_id,
        actor_username=actor_username,
        actor_role=actor_role,
        action=action,
        resource=resource,
        status=status,
        details=details_str
    )
    db.add(audit_entry)
    db.commit()
    db.refresh(audit_entry)
    return audit_entry

def log_security_event(
    db: Session,
    event_type: str,
    actor_id: Optional[int] = None,
    actor_role: Optional[str] = None,
    ip_address: Optional[str] = None,
    path: Optional[str] = None,
    method: Optional[str] = None,
    severity: str = "HIGH",
    details: Optional[dict[str, Any]] = None
) -> SecurityEvent:
    """Record a security violation or intrusion attempt in the security events table."""
    details_str = json.dumps(details) if details else None
    event_entry = SecurityEvent(
        timestamp=datetime.now(timezone.utc),
        actor_id=actor_id,
        actor_role=actor_role,
        event_type=event_type,
        ip_address=ip_address,
        path=path,
        method=method,
        severity=severity,
        details=details_str
    )
    db.add(event_entry)
    db.commit()
    db.refresh(event_entry)
    return event_entry
