from fastapi import APIRouter, HTTPException, Depends
from typing import Dict
from datetime import datetime, timedelta
import secrets

from app.schemas.auth import LoginRequest, LoginResponse
from app.services.auth_service import AuthService
from app.core.security import verify_password, create_session_token

router = APIRouter()

@router.post("/login", response_model=LoginResponse)
async def login(credentials: LoginRequest):
    """
    Authenticate user (doctor or patient) and create session
    """
    try:
        # Authenticate user
        user_data = await AuthService.authenticate_user(
            credentials.username, 
            credentials.user_type
        )
        
        if not user_data:
            raise HTTPException(
                status_code=401,
                detail=f"{credentials.user_type} not found"
            )
        
        # Verify password
        if not verify_password(credentials.password, user_data.password_hash):
            raise HTTPException(
                status_code=401,
                detail="Invalid password"
            )
        
        # Create session token
        session_token = create_session_token()
        expires_at = datetime.now() + timedelta(hours=24)  # 24 hour session
        
        # Save session to database
        await AuthService.create_session(
            user_data.user_id,
            credentials.user_type,
            session_token,
            expires_at
        )
        
        print("=" * 50)
        print("USER LOGIN SUCCESSFUL")
        print("=" * 50)
        print(f"User Type: {credentials.user_type}")
        print(f"User ID: {user_data.user_id}")
        print(f"Username: {credentials.username}")
        print(f"Name: {user_data.name}")
        print(f"Session Token: {session_token[:10]}...")
        print("=" * 50)
        
        return LoginResponse(
            message=f"{credentials.user_type} login successful",
            user_id=user_data.user_id,
            user_type=credentials.user_type,
            name=user_data.name,
            session_token=session_token,
            expires_at=expires_at
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error during login: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/logout")
async def logout(session_token: str):
    """
    Logout user and invalidate session
    """
    try:
        success = await AuthService.invalidate_session(session_token)
        if success:
            return {"message": "Logout successful"}
        else:
            raise HTTPException(status_code=404, detail="Session not found")
            
    except Exception as e:
        print(f"Error during logout: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")