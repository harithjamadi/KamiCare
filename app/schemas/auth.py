from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class LoginRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=100, description="Username")
    password: str = Field(..., min_length=6, description="Password")
    user_type: str = Field(..., pattern="^(Doctor|Patient)$", description="User type: Doctor or Patient")

class LoginResponse(BaseModel):
    message: str
    user_id: int
    user_type: str
    name: str
    session_token: str
    expires_at: datetime

class SessionData(BaseModel):
    user_id: int
    user_type: str
    name: str
    session_token: str
    expires_at: datetime