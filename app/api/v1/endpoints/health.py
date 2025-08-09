from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "KamiCare API is running"}

@router.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "service": "kamicare-api",
        "version": "1.0.0"
    }