"""
Authentication endpoints for Bayora.
Handles login, token issuance, user profile verification, and demo user discovery.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse, UserResponse
from app.services.auth_service import verify_password, create_access_token
from app.services.audit_service import log_audit, log_security_event
from app.api.deps import get_current_user
from app.config import settings

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
def login(login_req: LoginRequest, request: Request, db: Session = Depends(get_db)):
    """
    Authenticate user credentials, record audit event, and issue signed JWT.
    """
    client_ip = request.client.host if request.client else "unknown"

    user = db.query(User).filter(User.username == login_req.username).first()
    if not user or not verify_password(login_req.password, user.password_hash):
        # Log failed authentication attempt
        log_security_event(
            db=db,
            event_type="AUTH_FAILED_CREDENTIALS",
            actor_id=user.id if user else None,
            actor_role=user.role if user else None,
            ip_address=client_ip,
            path=request.url.path,
            method="POST",
            severity="MEDIUM",
            details={"attempted_username": login_req.username}
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Generate JWT containing server-verified role
    token_payload = {
        "sub": str(user.id),
        "username": user.username,
        "role": user.role
    }
    access_token = create_access_token(data=token_payload)

    # Log successful login in audit trail
    log_audit(
        db=db,
        action="AUTH_LOGIN",
        resource="auth/login",
        status="SUCCESS",
        actor_id=user.id,
        actor_username=user.username,
        actor_role=user.role,
        details={"ip": client_ip}
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user_id=user.id,
        username=user.username,
        role=user.role,
        display_name=user.display_name,
        expires_in_minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )


@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """
    Return currently authenticated user profile from verified token.
    """
    return current_user


@router.get("/demo-users")
def list_demo_users(db: Session = Depends(get_db)):
    """
    Convenience endpoint for hackathon demo to list active test roles.
    Does NOT expose password hashes.
    """
    users = db.query(User).all()
    return [
        {
            "id": u.id,
            "username": u.username,
            "role": u.role,
            "display_name": u.display_name
        }
        for u in users
    ]
