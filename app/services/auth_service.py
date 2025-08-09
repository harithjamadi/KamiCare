from datetime import datetime, timedelta
from typing import Optional, Dict
from app.core.database import db
from app.core.security import create_session_token

class UserData:
    def __init__(self, user_id: int, password_hash: str, name: str, is_active: bool):
        self.user_id = user_id
        self.password_hash = password_hash
        self.name = name
        self.is_active = is_active

class AuthService:
    @staticmethod
    async def authenticate_user(username: str, user_type: str) -> Optional[UserData]:
        """
        Authenticate user and return user data
        """
        try:
            if user_type == "Doctor":
                query = """
                SELECT id, password_hash, name, is_active 
                FROM doctor 
                WHERE username = %s AND is_active = 1
                """
            else:  # Patient
                query = """
                SELECT id, password_hash, name, is_active 
                FROM patient 
                WHERE username = %s AND is_active = 1
                """
            
            result = await db.execute_query(query, (username,))
            
            if result:
                user = result[0]
                return UserData(
                    user_id=user['id'],
                    password_hash=user['password_hash'],
                    name=user['name'],
                    is_active=user['is_active']
                )
            
            return None
            
        except Exception as e:
            print(f"Error authenticating user: {str(e)}")
            return None
    
    @staticmethod
    async def create_session(user_id: int, user_type: str, session_token: str, expires_at: datetime) -> bool:
        """
        Create a new user session
        """
        try:
            query = """
            INSERT INTO user_sessions (user_id, user_type, session_token, expires_at, ip_address, user_agent)
            VALUES (%s, %s, %s, %s, %s, %s)
            """
            
            await db.execute_insert(query, (
                user_id, user_type, session_token, expires_at, 
                "127.0.0.1", "KamiCare-API"  # Default values for demo
            ))
            
            return True
            
        except Exception as e:
            print(f"Error creating session: {str(e)}")
            return False
    
    @staticmethod
    async def get_session(session_token: str) -> Optional[Dict]:
        """
        Get session data by token
        """
        try:
            query = """
            SELECT user_id, user_type, expires_at, created_datetime
            FROM user_sessions 
            WHERE session_token = %s AND expires_at > NOW()
            """
            
            result = await db.execute_query(query, (session_token,))
            
            if result:
                session = result[0]
                
                # Update last activity
                await db.execute_update(
                    "UPDATE user_sessions SET last_activity = NOW() WHERE session_token = %s",
                    (session_token,)
                )
                
                return {
                    "user_id": session['user_id'],
                    "user_type": session['user_type'],
                    "expires_at": session['expires_at'],
                    "created_datetime": session['created_datetime']
                }
            
            return None
            
        except Exception as e:
            print(f"Error getting session: {str(e)}")
            return None
    
    @staticmethod
    async def invalidate_session(session_token: str) -> bool:
        """
        Invalidate a session (logout)
        """
        try:
            query = "DELETE FROM user_sessions WHERE session_token = %s"
            affected_rows = await db.execute_update(query, (session_token,))
            return affected_rows > 0
            
        except Exception as e:
            print(f"Error invalidating session: {str(e)}")
            return False
    
    @staticmethod
    async def cleanup_expired_sessions() -> int:
        """
        Clean up expired sessions
        """
        try:
            query = "DELETE FROM user_sessions WHERE expires_at <= NOW()"
            return await db.execute_update(query)
            
        except Exception as e:
            print(f"Error cleaning up sessions: {str(e)}")
            return 0