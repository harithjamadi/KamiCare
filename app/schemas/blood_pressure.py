from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import Optional

class BloodPressureCreate(BaseModel):
    patient_id: int = Field(..., ge=1, description="Patient ID")
    datetime: str = Field(..., description="ISO 8601 datetime string of the reading")
    systolic: int = Field(..., ge=50, le=300, description="Systolic pressure (50-300 mmHg)")
    diastolic: int = Field(..., ge=30, le=200, description="Diastolic pressure (30-200 mmHg)")
    
    @validator('datetime')
    def validate_datetime(cls, v):
        try:
            # Parse ISO 8601 datetime string to ensure it's valid
            parsed_dt = datetime.fromisoformat(v.replace('Z', '+00:00'))
            return v
        except ValueError:
            raise ValueError('datetime must be a valid ISO 8601 string')
    
    @validator('systolic')
    def validate_systolic(cls, v, values):
        if 'diastolic' in values and v <= values['diastolic']:
            raise ValueError('systolic pressure must be greater than diastolic pressure')
        return v

class BloodPressureResponse(BaseModel):
    message: str
    record_id: Optional[int] = None
    patient_id: int
    systolic: int
    diastolic: int
    reading_time: str
    bp_category: str

class BloodPressureRecord(BaseModel):
    id: int
    patient_id: int
    systolic_reading: int
    diastolic_reading: int
    reading_time_taken: datetime
    
    class Config:
        from_attributes = True