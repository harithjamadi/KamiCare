from typing import List, Optional
from datetime import datetime
from app.core.database import db
from app.schemas.blood_pressure import BloodPressureCreate, BloodPressureRecord

class BloodPressureService:
    @staticmethod
    async def create_reading(reading: BloodPressureCreate) -> int:
        """
        Create a new blood pressure reading
        """
        try:
            # Parse ISO datetime string
            reading_datetime = datetime.fromisoformat(reading.datetime.replace('Z', '+00:00'))
            
            query = """
            INSERT INTO patient_bp_record (patient_id, systolic_reading, diastolic_reading, reading_time_taken)
            VALUES (%s, %s, %s, %s)
            """
            
            record_id = await db.execute_insert(query, (
                reading.patient_id,
                reading.systolic,
                reading.diastolic,
                reading_datetime
            ))
            
            return record_id
            
        except Exception as e:
            print(f"Error creating BP reading: {str(e)}")
            raise Exception("Failed to create blood pressure reading")
    
    @staticmethod
    async def get_patient_readings(patient_id: int, limit: int = 10) -> List[BloodPressureRecord]:
        """
        Get blood pressure readings for a patient
        """
        try:
            query = """
            SELECT id, patient_id, systolic_reading, diastolic_reading, reading_time_taken
            FROM patient_bp_record
            WHERE patient_id = %s
            ORDER BY reading_time_taken DESC
            LIMIT %s
            """
            
            result = await db.execute_query(query, (patient_id, limit))
            
            readings = []
            for row in result:
                readings.append(BloodPressureRecord(
                    id=row['id'],
                    patient_id=row['patient_id'],
                    systolic_reading=row['systolic_reading'],
                    diastolic_reading=row['diastolic_reading'],
                    reading_time_taken=row['reading_time_taken']
                ))
            
            return readings
            
        except Exception as e:
            print(f"Error getting BP readings: {str(e)}")
            return []
    
    @staticmethod
    async def verify_patient_exists(patient_id: int) -> bool:
        """
        Verify if patient exists and is active
        """
        try:
            query = "SELECT COUNT(*) as count FROM patient WHERE id = %s AND is_active = 1"
            result = await db.execute_query(query, (patient_id,))
            return result[0]['count'] > 0
            
        except Exception as e:
            print(f"Error verifying patient: {str(e)}")
            return False