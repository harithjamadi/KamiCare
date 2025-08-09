from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List

from app.schemas.blood_pressure import (
    BloodPressureCreate, 
    BloodPressureResponse, 
    BloodPressureRecord
)
from app.services.blood_pressure_service import BloodPressureService
from app.core.utils import get_bp_category
from app.api.deps import validate_patient_exists

router = APIRouter()

@router.post("/readings", response_model=BloodPressureResponse)
async def create_blood_pressure_reading(reading: BloodPressureCreate):
    """
    Create a new blood pressure reading for a patient
    """
    try:
        # Verify patient exists
        if not await BloodPressureService.verify_patient_exists(reading.patient_id):
            raise HTTPException(
                status_code=404,
                detail=f"Patient with ID {reading.patient_id} not found"
            )
        
        # Save reading to database
        record_id = await BloodPressureService.create_reading(reading)
        
        # Calculate BP category
        bp_category = get_bp_category(reading.systolic, reading.diastolic)
        
        # Print to console for logging
        print("=" * 50)
        print("NEW BLOOD PRESSURE READING RECEIVED")
        print("=" * 50)
        print(f"Patient ID: {reading.patient_id}")
        print(f"DateTime: {reading.datetime}")
        print(f"Systolic: {reading.systolic} mmHg")
        print(f"Diastolic: {reading.diastolic} mmHg")
        print(f"Blood Pressure Category: {bp_category}")
        print("=" * 50)
        
        return BloodPressureResponse(
            message="Blood pressure reading logged successfully",
            record_id=record_id,
            patient_id=reading.patient_id,
            systolic=reading.systolic,
            diastolic=reading.diastolic,
            reading_time=reading.datetime,
            bp_category=bp_category
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error logging blood pressure reading: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/readings/{patient_id}", response_model=List[BloodPressureRecord])
async def get_patient_blood_pressure_readings(
    patient_id: int = Depends(validate_patient_exists),
    limit: int = Query(default=10, ge=1, le=100, description="Number of readings to return")
):
    """
    Get blood pressure readings for a specific patient
    """
    try:
        readings = await BloodPressureService.get_patient_readings(patient_id, limit)
        return readings
        
    except Exception as e:
        print(f"Error retrieving blood pressure readings: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")