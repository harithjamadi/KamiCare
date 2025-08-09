from fastapi import APIRouter

from app.api.v1.endpoints import health, blood_pressure

api_router = APIRouter()

# Include health endpoints (no prefix for root endpoints)
api_router.include_router(health.router, tags=["health"])

# Include blood pressure endpoints
api_router.include_router(
    blood_pressure.router, 
    prefix="/blood-pressure", 
    tags=["blood-pressure"]
)
