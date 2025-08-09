from typing import List, Optional
from datetime import datetime, timedelta
from app.core.database import db
from app.schemas.appointment import (
    AppointmentCreate, 
    AppointmentUpdate, 
    AppointmentResponse, 
    AppointmentSummary
)

class AppointmentService:
    
    @staticmethod
    async def create_appointment(appointment_data: AppointmentCreate) -> int:
        """
        Create a new appointment in the database
        Returns the ID of the created appointment
        """
        try:
            query = """
                INSERT INTO appointment_data 
                (patient_id, doctor_id, clinic_id, visit_datetime, created_datetime)
                VALUES (%s, %s, %s, %s, %s)
            """
            
            appointment_id = await db.execute_insert(query, (
                appointment_data.patient_id,
                appointment_data.doctor_id,
                appointment_data.clinic_id,
                appointment_data.appointment_datetime,
                datetime.now()
            ))
            
            return appointment_id
            
        except Exception as e:
            print(f"Error creating appointment: {str(e)}")
            raise Exception("Failed to create appointment")

    @staticmethod
    async def get_appointment_by_id(appointment_id: int) -> Optional[AppointmentResponse]:
        """
        Get a specific appointment by ID with related data
        """
        try:
            query = """
                SELECT 
                    a.id,
                    a.patient_id,
                    a.doctor_id,
                    a.clinic_id,
                    a.visit_datetime as appointment_datetime,
                    a.created_datetime,
                    a.created_datetime as updated_datetime,
                    p.name as patient_name,
                    d.name as doctor_name,
                    c.name as clinic_name,
                    'General Consultation' as appointment_type,
                    30 as duration_minutes,
                    '' as notes,
                    '' as symptoms,
                    'Scheduled' as status,
                    'Doctor' as created_by
                FROM appointment_data a
                JOIN patient p ON a.patient_id = p.id
                JOIN doctor d ON a.doctor_id = d.id
                JOIN clinic c ON a.clinic_id = c.id
                WHERE a.id = %s
            """
            
            result = await db.execute_query(query, (appointment_id,))
            
            if result:
                return AppointmentResponse(**result[0])
            return None
            
        except Exception as e:
            print(f"Error getting appointment by ID: {str(e)}")
            return None

    @staticmethod
    async def get_doctor_appointments(
        doctor_id: int, 
        status: Optional[str] = None, 
        limit: int = 20
    ) -> List[AppointmentSummary]:
        """
        Get appointments for a specific doctor
        """
        try:
            query = """
                SELECT 
                    a.id,
                    p.name as patient_name,
                    d.name as doctor_name,
                    c.name as clinic_name,
                    a.visit_datetime as appointment_datetime,
                    'Scheduled' as status,
                    'General Consultation' as appointment_type,
                    30 as duration_minutes
                FROM appointment_data a
                JOIN patient p ON a.patient_id = p.id
                JOIN doctor d ON a.doctor_id = d.id
                JOIN clinic c ON a.clinic_id = c.id
                WHERE a.doctor_id = %s
                ORDER BY a.visit_datetime ASC 
                LIMIT %s
            """
            
            result = await db.execute_query(query, (doctor_id, limit))
            
            appointments = []
            for row in result:
                appointments.append(AppointmentSummary(**row))
            
            return appointments
            
        except Exception as e:
            print(f"Error getting doctor appointments: {str(e)}")
            return []

    @staticmethod
    async def get_patient_appointments(
        patient_id: int, 
        status: Optional[str] = None, 
        limit: int = 20
    ) -> List[AppointmentSummary]:
        """
        Get appointments for a specific patient
        """
        try:
            query = """
                SELECT 
                    a.id,
                    p.name as patient_name,
                    d.name as doctor_name,
                    c.name as clinic_name,
                    a.visit_datetime as appointment_datetime,
                    'Scheduled' as status,
                    'General Consultation' as appointment_type,
                    30 as duration_minutes
                FROM appointment_data a
                JOIN patient p ON a.patient_id = p.id
                JOIN doctor d ON a.doctor_id = d.id
                JOIN clinic c ON a.clinic_id = c.id
                WHERE a.patient_id = %s
                ORDER BY a.visit_datetime ASC 
                LIMIT %s
            """
            
            result = await db.execute_query(query, (patient_id, limit))
            
            appointments = []
            for row in result:
                appointments.append(AppointmentSummary(**row))
            
            return appointments
            
        except Exception as e:
            print(f"Error getting patient appointments: {str(e)}")
            return []

    @staticmethod
    async def update_appointment(appointment_id: int, appointment_update: AppointmentUpdate) -> bool:
        """
        Update an existing appointment
        Returns True if successful, False otherwise
        """
        try:
            # Build dynamic update query based on provided fields
            update_fields = []
            values = []
            
            if appointment_update.appointment_datetime:
                update_fields.append("visit_datetime = %s")
                values.append(appointment_update.appointment_datetime)
            
            if not update_fields:
                return True  # No updates needed
            
            query = f"""
                UPDATE appointment_data 
                SET {', '.join(update_fields)}
                WHERE id = %s
            """
            values.append(appointment_id)
            
            # Use execute_query for UPDATE operations
            await db.execute_query(query, tuple(values))
            return True
            
        except Exception as e:
            print(f"Error updating appointment: {str(e)}")
            return False

    @staticmethod
    async def verify_patient_exists(patient_id: int) -> bool:
        """
        Verify if a patient exists in the database
        """
        try:
            query = "SELECT COUNT(*) as count FROM patient WHERE id = %s"
            result = await db.execute_query(query, (patient_id,))
            return result[0]['count'] > 0
            
        except Exception as e:
            print(f"Error verifying patient: {str(e)}")
            return False

    @staticmethod
    async def verify_doctor_exists(doctor_id: int) -> bool:
        """
        Verify if a doctor exists in the database
        """
        try:
            query = "SELECT COUNT(*) as count FROM doctor WHERE id = %s"
            result = await db.execute_query(query, (doctor_id,))
            return result[0]['count'] > 0
            
        except Exception as e:
            print(f"Error verifying doctor: {str(e)}")
            return False

    @staticmethod
    async def verify_clinic_exists(clinic_id: int) -> bool:
        """
        Verify if a clinic exists in the database
        """
        try:
            query = "SELECT COUNT(*) as count FROM clinic WHERE id = %s"
            result = await db.execute_query(query, (clinic_id,))
            return result[0]['count'] > 0
            
        except Exception as e:
            print(f"Error verifying clinic: {str(e)}")
            return False

    @staticmethod
    async def check_appointment_conflict(
        doctor_id: int, 
        appointment_datetime: datetime, 
        duration_minutes: int = 30
    ) -> bool:
        """
        Check if there's a scheduling conflict for a doctor at the specified time
        Returns True if there's a conflict, False otherwise
        """
        try:
            # Calculate the time range for the new appointment
            start_time = appointment_datetime
            end_time = appointment_datetime + timedelta(minutes=duration_minutes)
            
            # Check for overlapping appointments
            query = """
                SELECT COUNT(*) as count FROM appointment_data 
                WHERE doctor_id = %s 
                AND (
                    (visit_datetime < %s AND DATE_ADD(visit_datetime, INTERVAL 30 MINUTE) > %s)
                    OR (visit_datetime >= %s AND visit_datetime < %s)
                )
            """
            
            result = await db.execute_query(query, (
                doctor_id, 
                end_time, start_time,  # New appointment overlaps with existing
                start_time, end_time   # Existing appointment falls within new appointment
            ))
            
            return result[0]['count'] > 0
            
        except Exception as e:
            print(f"Error checking appointment conflict: {str(e)}")
            return False

    @staticmethod
    async def get_appointments_by_date_range(
        start_date: datetime, 
        end_date: datetime, 
        doctor_id: Optional[int] = None,
        patient_id: Optional[int] = None
    ) -> List[AppointmentSummary]:
        """
        Get appointments within a date range, optionally filtered by doctor or patient
        """
        try:
            base_query = """
                SELECT 
                    a.id,
                    p.name as patient_name,
                    d.name as doctor_name,
                    c.name as clinic_name,
                    a.visit_datetime as appointment_datetime,
                    'Scheduled' as status,
                    'General Consultation' as appointment_type,
                    30 as duration_minutes
                FROM appointment_data a
                JOIN patient p ON a.patient_id = p.id
                JOIN doctor d ON a.doctor_id = d.id
                JOIN clinic c ON a.clinic_id = c.id
                WHERE a.visit_datetime BETWEEN %s AND %s
            """
            
            params = [start_date, end_date]
            
            if doctor_id:
                base_query += " AND a.doctor_id = %s"
                params.append(doctor_id)
            
            if patient_id:
                base_query += " AND a.patient_id = %s"
                params.append(patient_id)
            
            base_query += " ORDER BY a.visit_datetime ASC"
            
            result = await db.execute_query(base_query, tuple(params))
            
            appointments = []
            for row in result:
                appointments.append(AppointmentSummary(**row))
            
            return appointments
            
        except Exception as e:
            print(f"Error getting appointments by date range: {str(e)}")
            return []

    @staticmethod
    async def delete_appointment(appointment_id: int) -> bool:
        """
        Delete an appointment by ID
        Returns True if successful, False otherwise
        """
        try:
            query = "DELETE FROM appointment_data WHERE id = %s"
            await db.execute_query(query, (appointment_id,))
            return True
            
        except Exception as e:
            print(f"Error deleting appointment: {str(e)}")
            return False

    @staticmethod
    async def get_upcoming_appointments(
        user_id: int, 
        user_type: str, 
        days_ahead: int = 7
    ) -> List[AppointmentSummary]:
        """
        Get upcoming appointments for a user (doctor or patient) within specified days
        """
        try:
            start_date = datetime.now()
            end_date = start_date + timedelta(days=days_ahead)
            
            if user_type.lower() == "doctor":
                return await AppointmentService.get_appointments_by_date_range(
                    start_date, end_date, doctor_id=user_id
                )
            else:
                return await AppointmentService.get_appointments_by_date_range(
                    start_date, end_date, patient_id=user_id
                )
                
        except Exception as e:
            print(f"Error getting upcoming appointments: {str(e)}")
            return []

    @staticmethod
    async def check_existing_appointment(
        patient_id: int, 
        doctor_id: int, 
        appointment_datetime: datetime
    ) -> bool:
        """
        Check if an appointment already exists for the same patient, doctor, and time
        Returns True if exists, False otherwise
        """
        try:
            query = """
                SELECT COUNT(*) as count FROM appointment_data 
                WHERE patient_id = %s AND doctor_id = %s AND visit_datetime = %s
            """
            result = await db.execute_query(query, (patient_id, doctor_id, appointment_datetime))
            return result[0]['count'] > 0
            
        except Exception as e:
            print(f"Error checking existing appointment: {str(e)}")
            return False

    @staticmethod
    async def get_appointment_count_by_doctor(doctor_id: int) -> int:
        """
        Get total number of appointments for a doctor
        """
        try:
            query = "SELECT COUNT(*) as count FROM appointment_data WHERE doctor_id = %s"
            result = await db.execute_query(query, (doctor_id,))
            return result[0]['count']
            
        except Exception as e:
            print(f"Error getting appointment count by doctor: {str(e)}")
            return 0

    @staticmethod
    async def get_appointment_count_by_patient(patient_id: int) -> int:
        """
        Get total number of appointments for a patient
        """
        try:
            query = "SELECT COUNT(*) as count FROM patient_data WHERE patient_id = %s"
            result = await db.execute_query(query, (patient_id,))
            return result[0]['count']
            
        except Exception as e:
            print(f"Error getting appointment count by patient: {str(e)}")
            return 0