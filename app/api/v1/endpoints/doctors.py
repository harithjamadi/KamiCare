from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List

from app.schemas.doctor import (
    DoctorCreate,
    DoctorResponse,
    DoctorProfile
)
from app.schemas.patient import PatientBPSummary
from app.services.doctor_service import DoctorService
from app.api.deps import get_current_doctor

router = APIRouter()

@router.post("/", response_model=DoctorResponse)
async def create_doctor(doctor: DoctorCreate):
    """
    Create a new doctor account
    """
    try:
        # Check if username or email already exists
        existing = await DoctorService.check_existing_doctor(doctor.username, doctor.email)
        if existing:
            raise HTTPException(
                status_code=409,
                detail="Username or email already exists"
            )
        
        # Create doctor
        doctor_id = await DoctorService.create_doctor(doctor)
        created_doctor = await DoctorService.get_doctor_by_id(doctor_id)
        
        print("=" * 50)
        print("NEW DOCTOR CREATED")
        print("=" * 50)
        print(f"Doctor ID: {doctor_id}")
        print(f"Name: {doctor.name}")
        print(f"Username: {doctor.username}")
        print(f"Email: {doctor.email}")
        print(f"Specialization: {doctor.specialization}")
        print("=" * 50)
        
        return created_doctor
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating doctor: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/profile", response_model=DoctorProfile)
async def get_doctor_profile(current_doctor: dict = Depends(get_current_doctor)):
    """
    Get current doctor's profile information
    """
    try:
        profile = await DoctorService.get_doctor_profile(current_doctor["user_id"])
        return profile
        
    except Exception as e:
        print(f"Error retrieving doctor profile: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/patients", response_model=List[PatientBPSummary])
async def get_doctor_patients(
    current_doctor: dict = Depends(get_current_doctor),
    limit: int = Query(default=50, ge=1, le=100, description="Number of patients to return")
):
    """
    Get all patients assigned to current doctor with BP summary
    """
    try:
        patients = await DoctorService.get_doctor_patients_with_bp_summary(
            current_doctor["user_id"], 
            limit
        )
        return patients
        
    except Exception as e:
        print(f"Error retrieving doctor patients: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")