from fastapi import Depends, HTTPException, Header
from typing import Optional, Dict
from app.services.auth_service import AuthService

async def get_session_token(authorization: Optional[str] = Header(None)) -> str:
    """
    Extract session token from Authorization header
    """
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Authorization header missing"
        )
    
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization header format"
        )
    
    return authorization.split("Bearer ")[1]

async def get_current_user(session_token: str = Depends(get_session_token)) -> Dict:
    """
    Get current authenticated user from session token
    """
    session = await AuthService.get_session(session_token)
    
    if not session:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired session"
        )
    
    return session

async def get_current_doctor(current_user: Dict = Depends(get_current_user)) -> Dict:
    """
    Ensure current user is a doctor
    """
    if current_user["user_type"] != "Doctor":
        raise HTTPException(
            status_code=403,
            detail="Doctor access required"
        )
    
    return current_user

async def get_current_patient(current_user: Dict = Depends(get_current_user)) -> Dict:
    """
    Ensure current user is a patient
    """
    if current_user["user_type"] != "Patient":
        raise HTTPException(
            status_code=403,
            detail="Patient access required"
        )
    
    return current_user

async def validate_patient_exists(patient_id: int) -> int:
    """
    Validate that patient exists (for dependency injection)
    """
    from app.services.patient_service import PatientService
    
    exists = await PatientService.verify_patient_exists(patient_id)  # Note: This should be verify_patient_exists
    if not exists:
        raise HTTPException(
            status_code=404,
            detail=f"Patient with ID {patient_id} not found"
        )
    
    return patient_id