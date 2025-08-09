from typing import List, Optional, Dict
from datetime import datetime
from app.core.database import db
from app.core.security import hash_password
from app.schemas.doctor import DoctorCreate, DoctorResponse, DoctorProfile
from app.schemas.patient import PatientBPSummary

class DoctorService:
    @staticmethod
    async def create_doctor(doctor: DoctorCreate) -> int:
        """
        Create a new doctor
        """
        try:
            hashed_password = hash_password(doctor.password)
            
            query = """
            INSERT INTO doctor (name, username, email, password_hash, phone_number, specialization, license_number)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            
            doctor_id = await db.execute_insert(query, (
                doctor.name,
                doctor.username,
                doctor.email,
                hashed_password,
                doctor.phone_number,
                doctor.specialization,
                doctor.license_number
            ))
            
            return doctor_id
            
        except Exception as e:
            print(f"Error creating doctor: {str(e)}")
            raise Exception("Failed to create doctor")
    
    @staticmethod
    async def get_doctor_by_id(doctor_id: int) -> Optional[DoctorResponse]:
        """
        Get doctor by ID
        """
        try:
            query = """
            SELECT id, name, username, email, phone_number, specialization, 
                   license_number, is_active, created_datetime, updated_datetime
            FROM doctor 
            WHERE id = %s
            """
            
            result = await db.execute_query(query, (doctor_id,))
            
            if result:
                doctor = result[0]
                return DoctorResponse(
                    id=doctor['id'],
                    name=doctor['name'],
                    username=doctor['username'],
                    email=doctor['email'],
                    phone_number=doctor['phone_number'],
                    specialization=doctor['specialization'],
                    license_number=doctor['license_number'],
                    is_active=doctor['is_active'],
                    created_datetime=doctor['created_datetime'],
                    updated_datetime=doctor['updated_datetime']
                )
            
            return None
            
        except Exception as e:
            print(f"Error getting doctor: {str(e)}")
            return None
    
    @staticmethod
    async def check_existing_doctor(username: str, email: str) -> bool:
        """
        Check if doctor with username or email already exists
        """
        try:
            query = """
            SELECT COUNT(*) as count 
            FROM doctor 
            WHERE username = %s OR email = %s
            """
            
            result = await db.execute_query(query, (username, email))
            return result[0]['count'] > 0
            
        except Exception as e:
            print(f"Error checking existing doctor: {str(e)}")
            return True  # Assume exists to prevent duplicates on error
    
    @staticmethod
    async def get_doctor_profile(doctor_id: int) -> Optional[DoctorProfile]:
        """
        Get doctor profile with patient count
        """
        try:
            query = """
            SELECT d.id, d.name, d.email, d.phone_number, d.specialization, 
                   d.license_number, COUNT(p.id) as patient_count
            FROM doctor d
            LEFT JOIN patient p ON d.id = p.doctor_id AND p.is_active = 1
            WHERE d.id = %s AND d.is_active = 1
            GROUP BY d.id
            """
            
            result = await db.execute_query(query, (doctor_id,))
            
            if result:
                profile = result[0]
                return DoctorProfile(
                    id=profile['id'],
                    name=profile['name'],
                    email=profile['email'],
                    phone_number=profile['phone_number'],
                    specialization=profile['specialization'],
                    license_number=profile['license_number'],
                    patient_count=profile['patient_count']
                )
            
            return None
            
        except Exception as e:
            print(f"Error getting doctor profile: {str(e)}")
            return None
    
    @staticmethod
    async def get_doctor_patients_with_bp_summary(doctor_id: int, limit: int = 50) -> List[PatientBPSummary]:
        """
        Get all patients assigned to doctor with BP summary
        """
        try:
            query = """
            SELECT p.id as patient_id, p.name as patient_name, 
                   COUNT(bp.id) as total_readings,
                   AVG(bp.systolic_reading) as avg_systolic,
                   AVG(bp.diastolic_reading) as avg_diastolic,
                   MAX(bp.reading_time_taken) as last_reading_time
            FROM patient p
            LEFT JOIN patient_bp_record bp ON p.id = bp.patient_id
            WHERE p.doctor_id = %s AND p.is_active = 1
            GROUP BY p.id, p.name
            ORDER BY p.name
            LIMIT %s
            """
            
            result = await db.execute_query(query, (doctor_id, limit))
            
            patients = []
            for row in result:
                patients.append(PatientBPSummary(
                    patient_id=row['patient_id'],
                    patient_name=row['patient_name'],
                    total_readings=row['total_readings'] or 0,
                    avg_systolic=round(row['avg_systolic'], 1) if row['avg_systolic'] else None,
                    avg_diastolic=round(row['avg_diastolic'], 1) if row['avg_diastolic'] else None,
                    last_reading_time=row['last_reading_time']
                ))
            
            return patients
            
        except Exception as e:
            print(f"Error getting doctor patients: {str(e)}")
            return []
