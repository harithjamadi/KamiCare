from pydantic import BaseModel, Field, EmailStr, validator
from datetime import datetime, date
from typing import Optional

class PatientBase(BaseModel):
    doctor_id: int = Field(..., ge=1, description="Assigned doctor ID")
    name: str = Field(..., min_length=2, max_length=100, description="Patient's full name")
    email: EmailStr = Field(..., description="Patient's email address")
    idNumber: str = Field(..., min_length=12, max_length=12, description="Malaysian IC number")
    phone_number: Optional[str] = Field(None, max_length=20, description="Phone number")
    date_of_birth: Optional[date] = Field(None, description="Date of birth")
    weight: Optional[float] = Field(None, ge=20.0, le=300.0, description="Weight in kg")
    height: Optional[float] = Field(None, ge=50.0, le=250.0, description="Height in cm")
    gender: Optional[str] = Field(None, pattern="^(Male|Female|Other)$", description="Gender")
    emergency_contact_name: Optional[str] = Field(None, max_length=100)
    emergency_contact_phone: Optional[str] = Field(None, max_length=20)

class PatientCreate(PatientBase):
    username: Optional[str] = Field(None, min_length=3, max_length=100, description="Username for login")
    password: Optional[str] = Field(None, min_length=6, description="Password for login")
    
    @validator('idNumber')
    def validate_ic_number(cls, v):
        if not v.isdigit() or len(v) != 12:
            raise ValueError('IC number must be exactly 12 digits')
        return v
    
    @validator('weight', 'height')
    def validate_measurements(cls, v):
        if v is not None and v <= 0:
            raise ValueError('Measurements must be positive numbers')
        return v

class PatientResponse(PatientBase):
    id: int
    username: Optional[str]
    age: Optional[int]
    body_mass_index: Optional[float]
    is_active: bool
    created_datetime: datetime
    updated_datetime: datetime
    doctor_name: Optional[str]
    
    class Config:
        from_attributes = True

class PatientProfile(BaseModel):
    id: int
    name: str
    email: str
    phone_number: Optional[str]
    age: Optional[int]
    weight: Optional[float]
    height: Optional[float]
    body_mass_index: Optional[float]
    doctor_name: str
    total_bp_readings: int
    last_bp_reading: Optional[datetime]
    
    class Config:
        from_attributes = True

class PatientBPSummary(BaseModel):
    patient_id: int
    patient_name: str
    total_readings: int
    avg_systolic: Optional[float]
    avg_diastolic: Optional[float]
    last_reading_time: Optional[datetime]
    
    class Config:
        from_attributes = True
