from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import Optional
import uvicorn

app = FastAPI(
    title="Hypertension Data Logger",
    description="API for logging hypertension readings",
    version="1.0.0"
)

class HypertensionReading(BaseModel):
    datetime: str = Field(..., description="ISO 8601 datetime string of the reading")
    sys: int = Field(..., ge=50, le=300, description="Systolic pressure (50-300 mmHg)")
    dia: int = Field(..., ge=30, le=200, description="Diastolic pressure (30-200 mmHg)")
    
    @validator('datetime')
    def validate_datetime(cls, v):
        try:
            # Parse ISO 8601 datetime string to ensure it's valid
            parsed_dt = datetime.fromisoformat(v.replace('Z', '+00:00'))
            return v
        except ValueError:
            raise ValueError('datetime must be a valid ISO 8601 string')
    
    @validator('sys')
    def validate_systolic(cls, v, values):
        if 'dia' in values and v <= values['dia']:
            raise ValueError('systolic pressure must be greater than diastolic pressure')
        return v

# Response model
class HypertensionResponse(BaseModel):
    message: str
    id: Optional[int] = None  # Will be used when database is integrated
    received_data: HypertensionReading

# Database connection placeholder
# TODO: Add MySQL connection setup
class DatabaseManager:
    def __init__(self):
        # TODO: Initialize MySQL connection
        # self.connection = mysql.connector.connect(
        #     host='localhost',
        #     database='hypertension_db',
        #     user='your_username',
        #     password='your_password'
        # )
        pass
    
    async def save_reading(self, reading: HypertensionReading) -> int:
        """
        Save hypertension reading to database
        TODO: Implement MySQL INSERT query
        Returns: ID of inserted record
        """
        # Placeholder for database insertion
        # cursor = self.connection.cursor()
        # query = """
        # INSERT INTO hypertension_readings (datetime, systolic, diastolic, created_at)
        # VALUES (%s, %s, %s, NOW())
        # """
        # cursor.execute(query, (reading.datetime, reading.sys, reading.dia))
        # self.connection.commit()
        # return cursor.lastrowid
        
        # For now, return a mock ID
        return 1

# Initialize database manager
db_manager = DatabaseManager()

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Hypertension Data Logger API is running"}

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "service": "hypertension-api",
        "version": "1.0.0"
    }

@app.post("/hypertension", response_model=HypertensionResponse)
async def log_hypertension_reading(reading: HypertensionReading):
    """
    Log a hypertension reading
    """
    try:
        # Print to console for now
        print("=" * 50)
        print("NEW HYPERTENSION READING RECEIVED")
        print("=" * 50)
        print(f"DateTime: {reading.datetime}")
        print(f"Systolic: {reading.sys} mmHg")
        print(f"Diastolic: {reading.dia} mmHg")
        print(f"Blood Pressure Category: {get_bp_category(reading.sys, reading.dia)}")
        print("=" * 50)
        
        # TODO: Save to database
        # record_id = await db_manager.save_reading(reading)
        
        # For now, use a mock ID
        record_id = await db_manager.save_reading(reading)
        
        return HypertensionResponse(
            message="Hypertension reading logged successfully",
            id=record_id,
            received_data=reading
        )
        
    except Exception as e:
        print(f"Error logging hypertension reading: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

def get_bp_category(sys: int, dia: int) -> str:
    """
    Categorize blood pressure reading according to AHA guidelines
    """
    if sys < 120 and dia < 80:
        return "Normal"
    elif sys < 130 and dia < 80:
        return "Elevated"
    elif (130 <= sys <= 139) or (80 <= dia <= 89):
        return "High Blood Pressure Stage 1"
    elif sys >= 140 or dia >= 90:
        return "High Blood Pressure Stage 2"
    elif sys > 180 or dia > 120:
        return "Hypertensive Crisis"
    else:
        return "Unknown"

# Error handlers
@app.exception_handler(422)
async def validation_exception_handler(request, exc):
    """Custom validation error handler"""
    return HTTPException(
        status_code=422,
        detail={
            "message": "Validation error",
            "errors": exc.errors()
        }
    )

if __name__ == "__main__":
    # Run the application
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

# TODO: Future MySQL integration steps:
# 1. Install mysql-connector-python: pip install mysql-connector-python
# 2. Create database schema:
#    CREATE DATABASE hypertension_db;
#    CREATE TABLE hypertension_readings (
#        id INT AUTO_INCREMENT PRIMARY KEY,
#        datetime DATETIME NOT NULL,
#        systolic INT NOT NULL,
#        diastolic INT NOT NULL,
#        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
#        INDEX idx_datetime (datetime)
#    );
# 3. Add environment variables for database credentials
# 4. Implement proper connection pooling
# 5. Add error handling for database operations
# 6. Consider adding migration scripts