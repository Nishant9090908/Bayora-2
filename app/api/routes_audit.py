"""
Audit and Security Event routes for Bayora.
Accessible exclusively to users with the 'auditor' role.
"""
from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import get_db
from app.models.audit import AuditLog, SecurityEvent
from app.schemas.audit import AuditLogResponse, SecurityEventResponse
from app.api.deps import require_role

router = APIRouter(prefix="/api/audit", tags=["Audit & Security Monitoring"])

@router.get("/logs", response_model=List[AuditLogResponse])
def get_audit_logs(
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    _current_user = Depends(require_role(["auditor"]))
):
    """
    Retrieve append-only audit trail. Requires 'auditor' role.
    """
    return db.query(AuditLog).order_by(desc(AuditLog.timestamp)).limit(limit).all()


@router.get("/events", response_model=List[SecurityEventResponse])
def get_security_events(
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    _current_user = Depends(require_role(["auditor"]))
):
    """
    Retrieve security intrusion events and access violation records.
    Requires 'auditor' role.
    """
    return db.query(SecurityEvent).order_by(desc(SecurityEvent.timestamp)).limit(limit).all()


@router.get("/summary")
def get_audit_summary(
    db: Session = Depends(get_db),
    _current_user = Depends(require_role(["auditor"]))
):
    """
    Retrieve high-level security metrics for the Auditor dashboard.
    """
    total_logs = db.query(AuditLog).count()
    total_events = db.query(SecurityEvent).count()
    critical_events = db.query(SecurityEvent).filter(SecurityEvent.severity.in_(["HIGH", "CRITICAL"])).count()
    
    recent_events = (
        db.query(SecurityEvent)
        .order_by(desc(SecurityEvent.timestamp))
        .limit(5)
        .all()
    )

    return {
        "total_audit_logs": total_logs,
        "total_security_events": total_events,
        "critical_violations": critical_events,
        "recent_alerts": [
            {
                "id": ev.id,
                "type": ev.event_type,
                "severity": ev.severity,
                "timestamp": ev.timestamp.isoformat(),
                "path": ev.path,
                "role": ev.actor_role
            }
            for ev in recent_events
        ]
    }
