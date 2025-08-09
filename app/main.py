from fastapi import FastAPI
from .api.v1.api import api_router
from .core.config import settings

# Initialize FastAPI app
app = FastAPI(
    title=settings.project_name,
    description="API for KamiCare healthcare management system",
    version="1.0.0",
    debug=settings.debug
)

# Include API router
app.include_router(api_router, prefix=settings.api_v1_str)

# Add startup/shutdown events
@app.on_event("startup")
async def startup_event():
    print("🚀 KamiCare API starting up...")
    print(f"📊 Project: {settings.project_name}")
    print(f"🔗 API Base URL: {settings.api_v1_str}")

@app.on_event("shutdown")
async def shutdown_event():
    from .database.connection import db_manager
    db_manager.close_connection()
    print("🛑 KamiCare API shutting down...")