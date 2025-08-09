from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional

from app.schemas.appointment import (
    AppointmentCreate,
    AppointmentUpdate,
    AppointmentResponse,
    AppointmentSummary
)
from app.services.appointment_service import AppointmentService
from app.api.deps import get_current_doctor, get_current_user

router = APIRouter()

@router.post("/", response_model=AppointmentResponse)
async def create_appointment(
    appointment: AppointmentCreate,
    current_doctor: dict = Depends(get_current_doctor)
):
    """
    Create a new appointment (only doctors can create appointments)
    """
    try:
        # Verify patient exists
        if not await AppointmentService.verify_patient_exists(appointment.patient_id):
            raise HTTPException(
                status_code=404,
                detail=f"Patient with ID {appointment.patient_id} not found"
            )
        
        # Verify doctor exists
        if not await AppointmentService.verify_doctor_exists(appointment.doctor_id):
            raise HTTPException(
                status_code=404,
                detail=f"Doctor with ID {appointment.doctor_id} not found"
            )
        
        # Verify clinic exists
        if not await AppointmentService.verify_clinic_exists(appointment.clinic_id):
            raise HTTPException(
                status_code=404,
                detail=f"Clinic with ID {appointment.clinic_id} not found"
            )
        
        # Check for appointment conflicts
        conflict = await AppointmentService.check_appointment_conflict(
            appointment.doctor_id,
            appointment.appointment_datetime,
            appointment.duration_minutes or 30
        )
        
        if conflict:
            raise HTTPException(
                status_code=409,
                detail="Doctor already has an appointment at this time"
            )
        
        # Create appointment
        appointment_id = await AppointmentService.create_appointment(appointment)
        created_appointment = await AppointmentService.get_appointment_by_id(appointment_id)
        
        print("=" * 50)
        print("NEW APPOINTMENT CREATED")
        print("=" * 50)
        print(f"Appointment ID: {appointment_id}")
        print(f"Patient ID: {appointment.patient_id}")
        print(f"Doctor ID: {appointment.doctor_id}")
        print(f"Clinic ID: {appointment.clinic_id}")
        print(f"Date/Time: {appointment.appointment_datetime}")
        print(f"Type: {appointment.appointment_type}")
        print("=" * 50)
        
        return created_appointment
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating appointment: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/my-appointments", response_model=List[AppointmentSummary])
async def get_user_appointments(
    current_user: dict = Depends(get_current_user),
    status: Optional[str] = Query(None, description="Filter by appointment status"),
    limit: int = Query(default=20, ge=1, le=100, description="Number of appointments to return")
):
    """
    Get appointments for current user (doctor or patient)
    """
    try:
        if current_user["user_type"] == "Doctor":
            appointments = await AppointmentService.get_doctor_appointments(
                current_user["user_id"], status, limit
            )
        else:
            appointments = await AppointmentService.get_patient_appointments(
                current_user["user_id"], status, limit
            )
        
        print("=" * 50)
        print("USER APPOINTMENTS RETRIEVED")
        print("=" * 50)
        print(f"User Type: {current_user['user_type']}")
        print(f"User ID: {current_user['user_id']}")
        print(f"Appointments Found: {len(appointments)}")
        print("=" * 50)
        
        return appointments
        
    except Exception as e:
        print(f"Error retrieving appointments: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.put("/{appointment_id}", response_model=AppointmentResponse)
async def update_appointment(
    appointment_id: int,
    appointment_update: AppointmentUpdate,
    current_doctor: dict = Depends(get_current_doctor)
):
    """
    Update an existing appointment (only doctors can update appointments)
    """
    try:
        # Verify appointment exists
        existing = await AppointmentService.get_appointment_by_id(appointment_id)
        if not existing:
            raise HTTPException(
                status_code=404,
                detail=f"Appointment with ID {appointment_id} not found"
            )
        
        # Update appointment
        success = await AppointmentService.update_appointment(appointment_id, appointment_update)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to update appointment")
        
        updated_appointment = await AppointmentService.get_appointment_by_id(appointment_id)
        
        print("=" * 50)
        print("APPOINTMENT UPDATED")
        print("=" * 50)
        print(f"Appointment ID: {appointment_id}")
        print(f"Updated by Doctor ID: {current_doctor['user_id']}")
        print("=" * 50)
        
        return updated_appointment
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating appointment: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")