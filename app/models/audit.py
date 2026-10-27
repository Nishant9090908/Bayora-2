"""
Audit logging and security event models for Bayora.
These tables provide immutable activity tracking and intrusion detection.
"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime
from app.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True)
    actor_id = Column(Integer, nullable=True, index=True)
    actor_username = Column(String(50), nullable=True)
    actor_role = Column(String(20), nullable=True)
    action = Column(String(50), nullable=False, index=True)  # e.g., "AUTH_LOGIN", "SUBMIT_PROMPT", "RUN_EVALUATION"
    resource = Column(String(100), nullable=False)           # e.g., "prompts/4", "evaluations/12"
    status = Column(String(20), nullable=False)              # "SUCCESS", "FAILURE", "BLOCKED"
    details = Column(Text, nullable=True)                    # JSON string with structured metadata

    def __repr__(self):
        return f"<AuditLog id={self.id} action='{self.action}' actor='{self.actor_username}' status='{self.status}'>"


class SecurityEvent(Base):
    __tablename__ = "security_events"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True)
    actor_id = Column(Integer, nullable=True, index=True)
    actor_role = Column(String(20), nullable=True)
    event_type = Column(String(50), nullable=False, index=True) # e.g., "UNAUTHORIZED_ACCESS_ATTEMPT", "FORGED_ROLE"
    ip_address = Column(String(45), nullable=True)
    path = Column(String(255), nullable=True)
    method = Column(String(10), nullable=True)
    severity = Column(String(20), default="HIGH", nullable=False) # "LOW", "MEDIUM", "HIGH", "CRITICAL"
    details = Column(Text, nullable=True)

    def __repr__(self):
        return f"<SecurityEvent id={self.id} type='{self.event_type}' severity='{self.severity}'>"
