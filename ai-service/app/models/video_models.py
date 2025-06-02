from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class TranscriptSegment(BaseModel):
    timestamp: Optional[str] = None
    text: str
    speaker: Optional[str] = None

class VideoTranscript(BaseModel):
    video_id: str
    course_id: str
    title: str
    transcript: List[TranscriptSegment]
    duration: Optional[str] = None

class SummarizationRequest(BaseModel):
    video_id: str
    transcript: List[TranscriptSegment]
    summary_type: str = "detailed"  # detailed, brief, key_points
    focus_area: Optional[str] = None

class QARequest(BaseModel):
    video_id: str
    transcript: List[TranscriptSegment]
    question: str
    context: Optional[str] = None

class SummaryResponse(BaseModel):
    video_id: str
    summary_type: str
    summary: str
    key_points: List[str]
    duration_covered: Optional[str] = None
    generated_at: str
    ai_powered: bool = False

class QAResponse(BaseModel):
    video_id: str
    question: str
    answer: str
    relevant_timestamps: List[str]
    confidence: str
    sources: List[str]
    ai_powered: bool = False