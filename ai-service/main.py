from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="LMS AI Service", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple models
class QuizSettings(BaseModel):
    question_count: int = 10
    difficulty: str = "medium"
    question_types: List[str] = ["mcq"]

class QuizGenerationRequest(BaseModel):
    content: str
    settings: QuizSettings
    course_id: str = "default"
    user_id: str = "default"

class QuizQuestion(BaseModel):
    question: str
    type: str
    options: Optional[List[str]] = None
    correct_answer: str
    explanation: Optional[str] = None
    difficulty: str
    points: int = 1

class QuizGenerationResponse(BaseModel):
    quiz_id: str
    questions: List[QuizQuestion]
    status: str

@app.get("/")
async def root():
    return {"message": "LMS AI Service is running"}

@app.get("/api/ai/health")
async def health_check():
    return {"status": "healthy", "service": "AI Quiz Generator"}

@app.post("/api/ai/generate-quiz", response_model=QuizGenerationResponse)
async def generate_quiz(request: QuizGenerationRequest):
    """Generate quiz from text content"""
    try:
        # For now, return a sample quiz to test the structure
        sample_questions = [
            QuizQuestion(
                question="What is the main topic of the provided content?",
                type="mcq",
                options=["Option A", "Option B", "Option C", "Option D"],
                correct_answer="Option A",
                explanation="This is a sample explanation",
                difficulty=request.settings.difficulty,
                points=1
            )
        ]
        
        return QuizGenerationResponse(
            quiz_id="sample-quiz-123",
            questions=sample_questions,
            status="completed"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    print("Starting LMS AI Service...")
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)