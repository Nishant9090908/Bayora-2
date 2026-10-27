"""
Pydantic schemas for authentication and user identities.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

class LoginRequest(BaseModel):
    username: str = Field(..., min_length=2, max_length=50, description="Username")
    password: str = Field(..., min_length=4, max_length=100, description="Password")

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    username: str
    role: str
    display_name: Optional[str] = None
    expires_in_minutes: int

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    role: str
    display_name: Optional[str] = None
    created_at: datetime

class UserCreate(BaseModel):
    username: str = Field(..., min_length=2, max_length=50)
    password: str = Field(..., min_length=6, max_length=100)
    role: str = Field(..., pattern="^(red_team|blue_team|auditor)$")
    display_name: Optional[str] = None
