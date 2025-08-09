import aiomysql
from typing import List, Dict, Any, Optional

class DatabaseManager:
    def __init__(self):
        self.pool: Optional[aiomysql.Pool] = None
    
    async def connect(self, host: str, port: int, user: str, password: str, db: str):
        """Connect to MySQL database using individual parameters"""
        try:
            self.pool = await aiomysql.create_pool(
                host=host,
                port=port,
                user=user,
                password=password,
                db=db,
                charset='utf8mb4',
                autocommit=True,
                maxsize=10,
                minsize=1
            )
            print(f"✅ Database pool created successfully")
        except Exception as e:
            print(f"❌ Failed to create database pool: {str(e)}")
            raise
    
    async def disconnect(self):
        """Close database connection pool"""
        if self.pool:
            self.pool.close()
            await self.pool.wait_closed()
            print("✅ Database pool closed successfully")
    
    async def execute_query(self, query: str, params: tuple = None) -> List[Dict[str, Any]]:
        """Execute a SELECT query and return results"""
        if not self.pool:
            raise Exception("Database pool not initialized")
        
        async with self.pool.acquire() as conn:
            async with conn.cursor(aiomysql.DictCursor) as cursor:
                await cursor.execute(query, params)
                result = await cursor.fetchall()
                return result
    
    async def execute_insert(self, query: str, params: tuple = None) -> int:
        """Execute an INSERT query and return the last inserted ID"""
        if not self.pool:
            raise Exception("Database pool not initialized")
        
        async with self.pool.acquire() as conn:
            async with conn.cursor() as cursor:
                await cursor.execute(query, params)
                await conn.commit()
                return cursor.lastrowid
    
    async def execute_update(self, query: str, params: tuple = None) -> int:
        """Execute an UPDATE/DELETE query and return affected rows"""
        if not self.pool:
            raise Exception("Database pool not initialized")
        
        async with self.pool.acquire() as conn:
            async with conn.cursor() as cursor:
                await cursor.execute(query, params)
                await conn.commit()
                return cursor.rowcount

# Create global database manager instance
db = DatabaseManager()