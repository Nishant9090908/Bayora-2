"""
FastAPI dependency injection utilities for authentication, database sessions,
and server-side Role-Based Access Control (RBAC).
"""
from typing import Optional, Callable
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import jwt

from app.database import get_db
from app.models.user import User
from app.services.auth_service import decode_access_token
from app.services.audit_service import log_security_event

# Optional HTTPBearer to manually handle missing or malformed tokens cleanly
security_scheme = HTTPBearer(auto_error=False)

def get_current_user(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    Extracts and cryptographically verifies the JWT from Authorization header.
    Resolves the server-side User identity from the database.
    """
    client_ip = request.client.host if request.client else "unknown"
    path = request.url.path
    method = request.method

    if not credentials or not credentials.credentials:
        # Log unauthenticated attempt on protected endpoint
        log_security_event(
            db=db,
            event_type="UNAUTHENTICATED_ACCESS_ATTEMPT",
            actor_id=None,
            actor_role=None,
            ip_address=client_ip,
            path=path,
            method=method,
            severity="MEDIUM",
            details={"error": "Missing Authorization Bearer token"}
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    try:
        payload = decode_access_token(token)
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token payload invalid: missing subject",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except jwt.ExpiredSignatureError:
        log_security_event(
            db=db,
            event_type="EXPIRED_TOKEN_USED",
            actor_id=None,
            actor_role=None,
            ip_address=client_ip,
            path=path,
            method=method,
            severity="LOW",
            details={"error": "Token has expired"}
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.PyJWTError as e:
        log_security_event(
            db=db,
            event_type="INVALID_TOKEN_SIGNATURE",
            actor_id=None,
            actor_role=None,
            ip_address=client_ip,
            path=path,
            method=method,
            severity="HIGH",
            details={"error": str(e)}
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User identity no longer exists",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


def require_role(allowed_roles: list[str]) -> Callable:
    """
    Dependency factory enforcing server-side Role-Based Access Control.
    If the authenticated user does not have an allowed role, logs an intrusion
    security event and returns HTTP 403 Forbidden.
    """
    def role_checker(
        request: Request,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
    ) -> User:
        if current_user.role not in allowed_roles:
            client_ip = request.client.host if request.client else "unknown"
            path = request.url.path
            method = request.method

            # Log unauthorized cross-role access attempt
            log_security_event(
                db=db,
                event_type="UNAUTHORIZED_ROLE_ACCESS_ATTEMPT",
                actor_id=current_user.id,
                actor_role=current_user.role,
                ip_address=client_ip,
                path=path,
                method=method,
                severity="HIGH",
                details={
                    "user_role": current_user.role,
                    "required_roles": allowed_roles,
                    "violation": f"User '{current_user.username}' ({current_user.role}) attempted unauthorized access to {path}"
                }
            )

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden: role '{current_user.role}' is not authorized for this resource"
            )
        return current_user

    return role_checker
