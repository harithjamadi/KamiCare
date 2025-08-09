import bcrypt
import secrets
from datetime import datetime, timedelta
from typing import Optional

def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt
    """
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against its hash
    """
    try:
        password_bytes = plain_password.encode('utf-8')
        hashed_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(password_bytes, hashed_bytes)
    except Exception:
        return False

def create_session_token() -> str:
    """
    Generate a secure session token
    """
    return secrets.token_urlsafe(32)

def is_session_expired(expires_at: datetime) -> bool:
    """
    Check if a session has expired
    """
    return datetime.now() > expires_at