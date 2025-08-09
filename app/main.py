from fastapi import FastAPI
from .core.config import settings
from .core.database import db
from .api.v1.endpoints import auth, doctors, patients, appointments

# Initialize FastAPI app
app = FastAPI(
    title=settings.project_name,
    description="API for KamiCare healthcare management system",
    version="1.0.0",
    debug=settings.debug
)

# Include API routers
app.include_router(
    auth.router, 
    prefix=f"{settings.api_v1_str}/auth", 
    tags=["Authentication"]
)
app.include_router(
    doctors.router, 
    prefix=f"{settings.api_v1_str}/doctors", 
    tags=["Doctors"]
)
app.include_router(
    patients.router, 
    prefix=f"{settings.api_v1_str}/patients", 
    tags=["Patients"]
)
app.include_router(
    appointments.router, 
    prefix=f"{settings.api_v1_str}/appointments", 
    tags=["Appointments"]
)

# Add startup/shutdown events
@app.on_event("startup")
async def startup_event():
    print("🚀 KamiCare API starting up...")
    print(f"📊 Project: {settings.project_name}")
    print(f"🔗 API Base URL: {settings.api_v1_str}")
    
    # Initialize database connection with individual parameters
    try:
        await db.connect(
            host=settings.db_host,
            port=settings.db_port,
            user=settings.db_user,
            password=settings.db_password,
            db=settings.db_name
        )
        print(f"💾 Database connected successfully to {settings.db_host}:{settings.db_port}/{settings.db_name}")
    except Exception as e:
        print(f"❌ Database connection failed: {str(e)}")
        raise

@app.on_event("shutdown")
async def shutdown_event():
    # Close database connection
    try:
        await db.disconnect()
        print("💾 Database connection closed")
    except Exception as e:
        print(f"⚠️ Error closing database: {str(e)}")
    
    print("🛑 KamiCare API shutting down...")

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": f"{settings.project_name} is running",
        "version": "1.0.0",
        "debug": settings.debug,
        "api_base": settings.api_v1_str
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    try:
        # Check database connection status
        db_status = "connected" if db.pool and not db.pool._closed else "disconnected"
        
        return {
            "status": "healthy",
            "database": {
                "status": db_status,
                "host": settings.db_host,
                "port": settings.db_port,
                "database": settings.db_name
            },
            "version": "1.0.0",
            "debug": settings.debug
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "debug": settings.debug
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug
    )