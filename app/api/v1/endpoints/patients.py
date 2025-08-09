from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List

from app.schemas.patient import (
    PatientCreate,
    PatientResponse,
    PatientProfile
)
from app.schemas.blood_pressure import BloodPressureRecord
from app.services.patient_service import PatientService
from app.services.blood_pressure_service import BloodPressureService
from app.api.deps import get_current_patient, get_current_doctor

router = APIRouter()

@router.post("/", response_model=PatientResponse)
async def create_patient(
    patient: PatientCreate,
    current_doctor: dict = Depends(get_current_doctor)
):
    """
    Create a new patient (only doctors can create patients)
    """
    try:
        # Verify doctor exists
        if not await PatientService.verify_doctor_exists(patient.doctor_id):
            raise HTTPException(
                status_code=404,
                detail=f"Doctor with ID {patient.doctor_id} not found"
            )
        
        # Check if IC number already exists
        existing = await PatientService.check_existing_patient(patient.idNumber)
        if existing:
            raise HTTPException(
                status_code=409,
                detail="Patient with this IC number already exists"
            )
        
        # Create patient
        patient_id = await PatientService.create_patient(patient)
        created_patient = await PatientService.get_patient_by_id(patient_id)
        
        print("=" * 50)
        print("NEW PATIENT CREATED")
        print("=" * 50)
        print(f"Patient ID: {patient_id}")
        print(f"Name: {patient.name}")
        print(f"IC Number: {patient.idNumber}")
        print(f"Email: {patient.email}")
        print(f"Assigned Doctor ID: {patient.doctor_id}")
        print("=" * 50)
        
        return created_patient
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating patient: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/profile", response_model=PatientProfile)
async def get_patient_profile(current_patient: dict = Depends(get_current_patient)):
    """
    Get current patient's profile information
    """
    try:
        profile = await PatientService.get_patient_profile(current_patient["user_id"])
        return profile
        
    except Exception as e:
        print(f"Error retrieving patient profile: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/bp-records", response_model=List[BloodPressureRecord])
async def get_patient_bp_records(
    current_patient: dict = Depends(get_current_patient),
    limit: int = Query(default=10, ge=1, le=100, description="Number of readings to return")
):
    """
    Get blood pressure records for current patient
    """
    try:
        patient_id = current_patient["user_id"]
        readings = await BloodPressureService.get_patient_readings(patient_id, limit)
        
        print("=" * 50)
        print("PATIENT BP RECORDS RETRIEVED")
        print("=" * 50)
        print(f"Patient ID: {patient_id}")
        print(f"Records Found: {len(readings)}")
        print("=" * 50)
        
        return readings
        
    except Exception as e:
        print(f"Error retrieving BP records: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")