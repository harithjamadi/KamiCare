from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    # Project settings
    project_name: str = "KamiCare Healthcare Management System"
    debug: bool = True
    api_v1_str: str = "/api/v1"
    
    # Database settings
    db_host: str = "localhost"
    db_port: int = 3306
    db_user: str = "root"
    db_password: str = ""
    db_name: str = "KamiCare"
    
    # JWT settings
    secret_key: str = "your-secret-key-change-this-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()