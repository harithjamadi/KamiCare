from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import Optional

class AppointmentBase(BaseModel):
    patient_id: int = Field(..., ge=1, description="Patient ID")
    doctor_id: int = Field(..., ge=1, description="Doctor ID")
    clinic_id: int = Field(..., ge=1, description="Clinic ID")
    appointment_datetime: datetime = Field(..., description="Appointment date and time")
    appointment_type: Optional[str] = Field("General Consultation", max_length=50, description="Type of appointment")
    duration_minutes: Optional[int] = Field(30, ge=15, le=180, description="Duration in minutes")
    notes: Optional[str] = Field(None, description="Additional notes")
    symptoms: Optional[str] = Field(None, description="Patient symptoms")

class AppointmentCreate(AppointmentBase):
    created_by: str = Field("Doctor", pattern="^(Doctor|Patient|Admin)$", description="Who created the appointment")
    
    @validator('appointment_datetime')
    def validate_future_datetime(cls, v):
        if v <= datetime.now():
            raise ValueError('Appointment must be scheduled for a future date and time')
        return v

class AppointmentUpdate(BaseModel):
    appointment_datetime: Optional[datetime] = Field(None, description="New appointment date and time")
    status: Optional[str] = Field(None, pattern="^(Scheduled|Confirmed|Completed|Cancelled|No Show)$")
    notes: Optional[str] = Field(None, description="Updated notes")
    symptoms: Optional[str] = Field(None, description="Updated symptoms")
    
    @validator('appointment_datetime')
    def validate_future_datetime(cls, v):
        if v and v <= datetime.now():
            raise ValueError('Appointment must be scheduled for a future date and time')
        return v

class AppointmentResponse(AppointmentBase):
    id: int
    status: str
    created_by: str
    created_datetime: datetime
    updated_datetime: datetime
    patient_name: str
    doctor_name: str
    clinic_name: str
    
    class Config:
        from_attributes = True

class AppointmentSummary(BaseModel):
    id: int
    patient_name: str
    doctor_name: str
    clinic_name: str
    appointment_datetime: datetime
    status: str
    appointment_type: str
    duration_minutes: int
    
    class Config:
        from_attributes = True