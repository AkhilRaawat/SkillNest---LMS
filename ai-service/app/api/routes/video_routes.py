from fastapi import APIRouter, HTTPException
from app.models.video_models import (
    SummarizationRequest, QARequest, SummaryResponse, QAResponse, TranscriptSegment
)
from app.services.video_ai_services import VideoAIService

# Initialize router and service
router = APIRouter()
video_ai_service = VideoAIService()

@router.get("/health")
async def health_check():
    """Health check endpoint for video AI service"""
    status = video_ai_service.get_service_status()
    return {
        "status": "healthy",
        **status,
        "endpoints": ["/summarize", "/ask-question", "/test-sample"]
    }

@router.post("/summarize", response_model=SummaryResponse)
async def summarize_video(request: SummarizationRequest):
    """Generate summary from video transcript"""
    try:
        return await video_ai_service.summarize_transcript(request)
    except Exception as e:
        print(f"💥 Error in summarization endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"Summarization failed: {str(e)}")

@router.post("/ask-question", response_model=QAResponse)
async def ask_question(request: QARequest):
    """Answer questions based on video transcript"""
    try:
        return await video_ai_service.answer_question(request)
    except Exception as e:
        print(f"💥 Error in Q&A endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"Question answering failed: {str(e)}")

@router.post("/test-sample")
async def test_with_sample():
    """Test endpoint with sample transcript data"""
    
    sample_transcript = [
        TranscriptSegment(
            timestamp="00:00", 
            text="Welcome to this introduction to machine learning course."
        ),
        TranscriptSegment(
            timestamp="00:30", 
            text="Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions from data."
        ),
        TranscriptSegment(
            timestamp="01:00", 
            text="There are three main types of machine learning: supervised, unsupervised, and reinforcement learning."
        ),
        TranscriptSegment(
            timestamp="01:30", 
            text="Supervised learning uses labeled data to train models, like predicting house prices based on features."
        ),
        TranscriptSegment(
            timestamp="02:00", 
            text="Unsupervised learning finds patterns in data without labels, such as customer segmentation."
        ),
        TranscriptSegment(
            timestamp="02:30", 
            text="Reinforcement learning learns through interaction with an environment, like training a game-playing AI."
        )
    ]
    
    try:
        # Test summarization
        summary_request = SummarizationRequest(
            video_id="test-video-001",
            transcript=sample_transcript,
            summary_type="detailed"
        )
        
        summary = await video_ai_service.summarize_transcript(summary_request)
        
        # Test Q&A
        qa_request = QARequest(
            video_id="test-video-001",
            transcript=sample_transcript,
            question="What are the three types of machine learning?"
        )
        
        qa_response = await video_ai_service.answer_question(qa_request)
        
        return {
            "test_status": "completed",
            "service_info": video_ai_service.get_service_status(),
            "summary_test": summary,
            "qa_test": qa_response
        }
    
    except Exception as e:
        print(f"💥 Error in test endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"Test failed: {str(e)}")