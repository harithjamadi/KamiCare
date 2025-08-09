import uvicorn
from app.main import app
from app.core.config import settings

if __name__ == "__main__":
    print("🚀 Starting KamiCare API...")
    print(f"🌐 Server will run on: http://localhost:8000")
    print(f"📚 API Documentation: http://localhost:8000/docs")
    print(f"🔧 Debug mode: {settings.debug}")
    print("-" * 50)
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug
    )