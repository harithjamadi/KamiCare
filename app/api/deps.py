from fastapi import HTTPException, Depends
from app.services.blood_pressure_service import BloodPressureService

async def validate_patient_exists(patient_id: int):
    """
    Dependency to validate that a patient exists
    """
    if not await BloodPressureService.verify_patient_exists(patient_id):
        raise HTTPException(
            status_code=404, 
            detail=f"Patient with ID {patient_id} not found"
        )
    return patient_id