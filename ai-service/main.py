# /ai-service/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from dotenv import load_dotenv

# Import route modules
from app.api.routes.quiz_routes import router as quiz_router
from app.api.routes.chatbot_routes import router as chatbot_router
from app.api.routes.video_routes import router as video_router 

# Load environment variables
load_dotenv()

app = FastAPI(title="LMS AI Service", version="1.0.0", description="AI Service with Quiz Generator, Bobby Chatbot, and Video AI")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:5173",
        "http://localhost:5000",
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
app.include_router(video_router, prefix="/api/video-ai", tags=["Video AI"])  # ADD THIS LINE

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "LMS AI Service is running",
        "services": ["Quiz Generator", "Bobby Chatbot", "Video AI"],  # UPDATE THIS LINE
        "endpoints": {
            "quiz": "/api/ai/generate-quiz",
            "bobby_chat": "/api/chatbot/chat",
            "video_summarize": "/api/video-ai/summarize",  # ADD THIS LINE
            "video_qa": "/api/video-ai/ask-question",      # ADD THIS LINE
            "health": "/api/ai/health, /api/chatbot/health, /api/video-ai/health"  # UPDATE THIS LINE
        }
    }

# Combined health check
@app.get("/api/health")
async def combined_health():
    """Combined health check for all AI services"""
    # Import health functions from routes
    from app.api.routes.quiz_routes import GEMINI_AVAILABLE
    from app.api.routes.chatbot_routes import GROQ_AVAILABLE, MONGO_AVAILABLE
    from app.api.routes.video_routes import GEMINI_AVAILABLE as VIDEO_GEMINI_AVAILABLE  # ADD THIS LINE
        
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
            },
            # ADD THIS BLOCK
            "video_ai": {
                "ai_available": VIDEO_GEMINI_AVAILABLE,
                "model": "gemini-1.5-flash" if VIDEO_GEMINI_AVAILABLE else "intelligent_fallback",
                "features": ["summarization", "question-answering"]
            }
        }
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8001))
    print(f"🚀 Starting LMS AI Service on port {port}...")
    print("📋 Services: Quiz Generator (Gemini) + Bobby Chatbot (Groq) + Video AI (Gemini)")  # UPDATE THIS LINE
    print(f"🌐 Server will be available on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)