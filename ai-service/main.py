# /ai-service/main.py - Clean and organized
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from dotenv import load_dotenv

# Import route modules
from app.api.routes.quiz_routes import router as quiz_router
from app.api.routes.chatbot_routes import router as chatbot_router

# Load environment variables
load_dotenv()

app = FastAPI(title="LMS AI Service", version="1.0.0", description="AI Service with Quiz Generator and Bobby Chatbot")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:5173",
        "https://skill-nest-lms.vercel.app",  # Your Vercel frontend
        "https://skillnest-ai-service.onrender.com",  # Your Render URL
        "*"  
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(quiz_router, prefix="/api/ai", tags=["Quiz Generator"])
app.include_router(chatbot_router, prefix="/api/chatbot", tags=["Bobby Chatbot"])

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "LMS AI Service is running",
        "services": ["Quiz Generator", "Bobby Chatbot"],
        "endpoints": {
            "quiz": "/api/ai/generate-quiz",
            "bobby_chat": "/api/chatbot/chat",
            "health": "/api/ai/health, /api/chatbot/health"
        }
    }

# Combined health check
@app.get("/api/health")
async def combined_health():
    """Combined health check for all AI services"""
    # Import health functions from routes
    from app.api.routes.quiz_routes import GEMINI_AVAILABLE
    from app.api.routes.chatbot_routes import GROQ_AVAILABLE, MONGO_AVAILABLE
    
    return {
        "status": "healthy",
        "services": {
            "quiz_generator": {
                "ai_available": GEMINI_AVAILABLE,
                "model": "gemini-1.5-flash" if GEMINI_AVAILABLE else "intelligent_fallback"
            },
            "bobby_chatbot": {
                "ai_available": GROQ_AVAILABLE,
                "database_available": MONGO_AVAILABLE,
                "model": "llama-3.1-8b-instant" if GROQ_AVAILABLE else "intelligent_fallback"
            }
        }
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8001))
    print(f"🚀 Starting LMS AI Service on port {port}...")
    print("📋 Services: Quiz Generator (Gemini) + Bobby Chatbot (Groq)")
    print(f"🌐 Server will be available on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)