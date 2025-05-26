from fastapi import APIRouter, HTTPException, UploadFile, File
from app.models.quiz_models import QuizGenerationRequest, QuizGenerationResponse
from app.services.quiz_generator import QuizGeneratorService
import uuid
from datetime import datetime

router = APIRouter()
quiz_service = QuizGeneratorService()

@router.post("/generate-quiz", response_model=QuizGenerationResponse)
async def generate_quiz(request: QuizGenerationRequest):
    """Generate quiz from text content"""
    try:
        questions = await quiz_service.generate_quiz_from_content(
            request.content, 
            request.settings
        )
        
        quiz_id = str(uuid.uuid4())
        
        return QuizGenerationResponse(
            quiz_id=quiz_id,
            questions=questions,
            status="completed"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "AI Quiz Generator"}