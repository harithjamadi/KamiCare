from typing import List, Optional, Dict
from datetime import datetime, date
from app.core.database import db
from app.core.security import hash_password
from app.schemas.patient import PatientCreate, PatientResponse, PatientProfile

class PatientService:
    @staticmethod
    async def create_patient(patient: PatientCreate) -> int:
        """
        Create a new patient
        """
        try:
            # Calculate BMI if height and weight provided
            bmi = None
            age = None
            
            if patient.weight and patient.height:
                height_m = patient.height / 100  # Convert cm to meters
                bmi = round(patient.weight / (height_m ** 2), 1)
            
            if patient.date_of_birth:
                today = date.today()
                age = today.year - patient.date_of_birth.year
                if today < date(today.year, patient.date_of_birth.month, patient.date_of_birth.day):
                    age -= 1
            
            # Hash password if provided
            password_hash = None
            if patient.password:
                password_hash = hash_password(patient.password)
            
            query = """
            INSERT INTO patient (
                doctor_id, name, username, email, password_hash, idNumber, 
                phone_number, date_of_birth, age, weight, height, body_mass_index,
                gender, emergency_contact_name, emergency_contact_phone
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            
            patient_id = await db.execute_insert(query, (
                patient.doctor_id,
                patient.name,
                patient.username,
                patient.email,
                password_hash,
                patient.idNumber,
                patient.phone_number,
                patient.date_of_birth,
                age,
                patient.weight,
                patient.height,
                bmi,
                patient.gender,
                patient.emergency_contact_name,
                patient.emergency_contact_phone
            ))
            
            return patient_id
            
        except Exception as e:
            print(f"Error creating patient: {str(e)}")
            raise Exception("Failed to create patient")
    
    @staticmethod
    async def get_patient_by_id(patient_id: int) -> Optional[PatientResponse]:
        """
        Get patient by ID with doctor name
        """
        try:
            query = """
            SELECT p.id, p.doctor_id, p.name, p.username, p.email, p.idNumber,
                   p.phone_number, p.date_of_birth, p.age, p.weight, p.height,
                   p.body_mass_index, p.gender, p.emergency_contact_name,
                   p.emergency_contact_phone, p.is_active, p.created_datetime,
                   p.updated_datetime, d.name as doctor_name
            FROM patient p
            LEFT JOIN doctor d ON p.doctor_id = d.id
            WHERE p.id = %s
            """
            
            result = await db.execute_query(query, (patient_id,))
            
            if result:
                patient = result[0]
                return PatientResponse(
                    id=patient['id'],
                    doctor_id=patient['doctor_id'],
                    name=patient['name'],
                    username=patient['username'],
                    email=patient['email'],
                    idNumber=patient['idNumber'],
                    phone_number=patient['phone_number'],
                    date_of_birth=patient['date_of_birth'],
                    age=patient['age'],
                    weight=patient['weight'],
                    height=patient['height'],
                    body_mass_index=patient['body_mass_index'],
                    gender=patient['gender'],
                    emergency_contact_name=patient['emergency_contact_name'],
                    emergency_contact_phone=patient['emergency_contact_phone'],
                    is_active=patient['is_active'],
                    created_datetime=patient['created_datetime'],
                    updated_datetime=patient['updated_datetime'],
                    doctor_name=patient['doctor_name']
                )
            
            return None
            
        except Exception as e:
            print(f"Error getting patient: {str(e)}")
            return None
    
    @staticmethod
    async def check_existing_patient(id_number: str) -> bool:
        """
        Check if patient with IC number already exists
        """
        try:
            query = "SELECT COUNT(*) as count FROM patient WHERE idNumber = %s"
            result = await db.execute_query(query, (id_number,))
            return result[0]['count'] > 0
            
        except Exception as e:
            print(f"Error checking existing patient: {str(e)}")
            return True  # Assume exists to prevent duplicates on error
    
    @staticmethod
    async def verify_doctor_exists(doctor_id: int) -> bool:
        """
        Verify if doctor exists and is active
        """
        try:
            query = "SELECT COUNT(*) as count FROM doctor WHERE id = %s AND is_active = 1"
            result = await db.execute_query(query, (doctor_id,))
            return result[0]['count'] > 0
            
        except Exception as e:
            print(f"Error verifying doctor: {str(e)}")
            return False
    
    @staticmethod
    async def verify_clinic_exists(clinic_id: int) -> bool:
        """
        Verify if clinic exists and is active
        """
        try:
            query = "SELECT COUNT(*) as count FROM clinic WHERE id = %s AND is_active = 1"
            result = await db.execute_query(query, (clinic_id,))
            return result[0]['count'] > 0
            
        except Exception as e:
            print(f"Error verifying clinic: {str(e)}")
            return False