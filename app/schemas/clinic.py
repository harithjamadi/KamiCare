from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class ClinicBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Clinic name")
    clinic_address: str = Field(..., min_length=5, max_length=100, description="Clinic address")
    postcode: Optional[str] = Field(None, max_length=5, description="Postcode")
    state: Optional[str] = Field(None, max_length=15, description="State")
    country: Optional[str] = Field("Malaysia", max_length=50, description="Country")
    phone_number: Optional[str] = Field(None, max_length=20, description="Phone number")
    email: Optional[str] = Field(None, description="Clinic email")

class ClinicCreate(ClinicBase):
    pass

class ClinicResponse(ClinicBase):
    id: int
    is_active: bool
    created_datetime: datetime
    
    class Config:
        from_attributes = True