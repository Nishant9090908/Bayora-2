"""
Pydantic schemas for audit logs and security events.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class AuditLogResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    timestamp: datetime
    actor_id: Optional[int] = None
    actor_username: Optional[str] = None
    actor_role: Optional[str] = None
    action: str
    resource: str
    status: str
    details: Optional[str] = None

class SecurityEventResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    timestamp: datetime
    actor_id: Optional[int] = None
    actor_role: Optional[str] = None
    event_type: str
    ip_address: Optional[str] = None
    path: Optional[str] = None
    method: Optional[str] = None
    severity: str
    details: Optional[str] = None
