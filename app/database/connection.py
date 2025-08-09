import mysql.connector
from mysql.connector import Error
from fastapi import HTTPException
from app.core.config import settings

class DatabaseManager:
    def __init__(self):
        self.connection_config = settings.database_config
        self.connection = None
        self._test_connection()
    
    def _test_connection(self):
        """Test database connection on startup"""
        try:
            test_conn = mysql.connector.connect(**self.connection_config)
            if test_conn.is_connected():
                print("✅ Database connection successful!")
                print(f"   Connected to MySQL Server: {test_conn.get_server_info()}")
                print(f"   Database: {self.connection_config['database']}")
                test_conn.close()
        except Error as e:
            print(f"❌ Database connection failed: {e}")
            print("   Please check your .env file and database credentials")
            raise e
    
    def get_connection(self):
        """Get a fresh database connection"""
        try:
            if self.connection is None or not self.connection.is_connected():
                self.connection = mysql.connector.connect(**self.connection_config)
            return self.connection
        except Error as e:
            print(f"❌ Failed to get database connection: {e}")
            raise HTTPException(status_code=500, detail="Database connection failed")
    
    def close_connection(self):
        """Close database connection"""
        if self.connection and self.connection.is_connected():
            self.connection.close()
            print("🔌 Database connection closed")

# Global database manager instance
db_manager = DatabaseManager()