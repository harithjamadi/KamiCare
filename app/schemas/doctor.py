from pydantic import BaseModel, Field, EmailStr, validator
from datetime import datetime
from typing import Optional, List


class DoctorBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Doctor's full name")
    username: str = Field(..., min_length=3, max_length=100, description="Username for login")
    email: EmailStr = Field(..., description="Doctor's email address")
    phone_number: Optional[str] = Field(None, max_length=20, description="Phone number")
    specialization: Optional[str] = Field(None, max_length=100, description="Medical specialization")
    license_number: Optional[str] = Field(None, max_length=50, description="Medical license number")

class DoctorCreate(DoctorBase):
    password: str = Field(..., min_length=6, description="Password for login")
    
    @validator('phone_number')
    def validate_phone(cls, v):
        if v and not v.replace('+', '').replace('-', '').replace(' ', '').isdigit():
            raise ValueError('Phone number must contain only digits, +, -, and spaces')
        return v

class DoctorResponse(DoctorBase):
    id: int
    is_active: bool
    created_datetime: datetime
    updated_datetime: datetime
    
    class Config:
        from_attributes = True

class DoctorProfile(BaseModel):
    id: int
    name: str
    email: str
    phone_number: Optional[str]
    specialization: Optional[str]
    license_number: Optional[str]
    patient_count: int
    
    class Config:
        from_attributes = True