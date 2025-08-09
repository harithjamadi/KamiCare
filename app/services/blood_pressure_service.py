from datetime import datetime
from fastapi import HTTPException
from mysql.connector import Error
from typing import List, Optional

from app.database.connection import db_manager
from app.schemas.blood_pressure import BloodPressureCreate, BloodPressureRecord
from app.core.utils import get_bp_category

class BloodPressureService:
    
    @staticmethod
    async def create_reading(reading: BloodPressureCreate) -> int:
        """
        Save blood pressure reading to database
        
        Args:
            reading: BloodPressureCreate object
            
        Returns:
            ID of inserted record
            
        Raises:
            HTTPException: If database operation fails
        """
        connection = None
        cursor = None
        
        try:
            # Get database connection
            connection = db_manager.get_connection()
            cursor = connection.cursor()
            
            # Convert ISO datetime string to MySQL datetime format
            dt = datetime.fromisoformat(reading.datetime.replace('Z', '+00:00'))
            
            # Insert query
            query = """
                INSERT INTO patient_bp_record (
                    patient_id, systolic_reading, diastolic_reading, reading_time_taken
                ) VALUES (%s, %s, %s, %s)
            """
            
            # Execute the query
            cursor.execute(query, (reading.patient_id, reading.systolic, reading.diastolic, dt))
            
            # Get the ID of the inserted record
            record_id = cursor.lastrowid
            
            print(f"✅ Successfully saved BP reading with ID: {record_id}")
            print(f"   Patient ID: {reading.patient_id}")
            print(f"   Systolic: {reading.systolic}, Diastolic: {reading.diastolic}")
            print(f"   Time: {dt}")
            print(f"   Category: {get_bp_category(reading.systolic, reading.diastolic)}")
            
            return record_id
            
        except Error as e:
            print(f"❌ Database error: {e}")
            if connection:
                connection.rollback()
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
        
        finally:
            # Clean up
            if cursor:
                cursor.close()
    
    @staticmethod
    async def get_patient_readings(patient_id: int, limit: int = 10) -> List[BloodPressureRecord]:
        """
        Get blood pressure readings for a specific patient
        
        Args:
            patient_id: Patient ID
            limit: Maximum number of records to return
            
        Returns:
            List of BloodPressureRecord objects
        """
        connection = None
        cursor = None
        
        try:
            connection = db_manager.get_connection()
            cursor = connection.cursor(dictionary=True)
            
            query = """
                SELECT id, patient_id, systolic_reading, diastolic_reading, reading_time_taken
                FROM patient_bp_record 
                WHERE patient_id = %s 
                ORDER BY reading_time_taken DESC 
                LIMIT %s
            """
            
            cursor.execute(query, (patient_id, limit))
            records = cursor.fetchall()
            
            return [BloodPressureRecord(**record) for record in records]
            
        except Error as e:
            print(f"❌ Database error: {e}")
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
        
        finally:
            if cursor:
                cursor.close()
    
    @staticmethod
    async def verify_patient_exists(patient_id: int) -> bool:
        """
        Check if patient exists in database
        
        Args:
            patient_id: Patient ID to verify
            
        Returns:
            True if patient exists, False otherwise
        """
        connection = None
        cursor = None
        
        try:
            connection = db_manager.get_connection()
            cursor = connection.cursor()
            
            query = "SELECT 1 FROM patient WHERE id = %s"
            cursor.execute(query, (patient_id,))
            
            return cursor.fetchone() is not None
            
        except Error as e:
            print(f"❌ Database error: {e}")
            return False
        
        finally:
            if cursor:
                cursor.close()