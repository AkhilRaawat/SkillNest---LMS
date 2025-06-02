import os
from datetime import datetime
from typing import Dict
import google.generativeai as genai
from app.models.video_models import SummarizationRequest, QARequest, SummaryResponse, QAResponse, TranscriptSegment
from app.prompts.video_prompts import SUMMARIZATION_PROMPTS, QA_PROMPT
from app.utils.video_utils import extract_transcript_text, parse_ai_response, generate_fallback_summary, generate_fallback_answer

class VideoAIService:
    def __init__(self):
        self.model = None
        self.gemini_available = False
        self._initialize_ai()
    
    def _initialize_ai(self):
        """Initialize Gemini AI"""
        try:
            api_key = os.getenv("GEMINI_API_KEY")
            if api_key and api_key != "your_gemini_api_key_here":
                genai.configure(api_key=api_key)
                self.model = genai.GenerativeModel('gemini-1.5-flash')
                print("✅ Video AI - Gemini configured successfully")
                self.gemini_available = True
            else:
                print("⚠️ Video AI - Gemini API key not found, using fallback mode")
        except Exception as e:
            print(f"⚠️ Video AI - Gemini configuration error: {e}")
    
    async def summarize_transcript(self, request: SummarizationRequest) -> SummaryResponse:
        """Generate summary from video transcript"""
        
        print(f"\n🎥 Summarizing video: {request.video_id}")
        print(f"📝 Summary type: {request.summary_type}")
        print(f"📊 Transcript segments: {len(request.transcript)}")
        
        transcript_text = extract_transcript_text(request.transcript)
        summary_data = None
        ai_powered = False
        
        # Try AI first if available
        if self.gemini_available and self.model:
            try:
                prompt_template = SUMMARIZATION_PROMPTS.get(
                    request.summary_type, 
                    SUMMARIZATION_PROMPTS["detailed"]
                )
                prompt = prompt_template.format(transcript=transcript_text[:4000])
                
                print("🧠 Calling Gemini AI for summarization...")
                response = self.model.generate_content(prompt)
                response_text = response.text
                
                summary_data = parse_ai_response(response_text)
                
                if summary_data:
                    print("✅ AI summarization successful")
                    ai_powered = True
                else:
                    print("⚠️ AI response parsing failed, using fallback")
                    summary_data = generate_fallback_summary(transcript_text, request.summary_type)
                    
            except Exception as ai_error:
                print(f"❌ AI error: {ai_error}")
                summary_data = generate_fallback_summary(transcript_text, request.summary_type)
        else:
            print("🔄 Using fallback summarization...")
            summary_data = generate_fallback_summary(transcript_text, request.summary_type)
        
        # Ensure we have valid data
        if not summary_data:
            summary_data = generate_fallback_summary(transcript_text, request.summary_type)
        
        return SummaryResponse(
            video_id=request.video_id,
            summary_type=request.summary_type,
            summary=summary_data.get("summary", "Summary generated successfully"),
            key_points=summary_data.get("key_points", ["Key point 1", "Key point 2"]),
            duration_covered="Full video",
            generated_at=datetime.now().isoformat(),
            ai_powered=ai_powered
        )
    
    async def answer_question(self, request: QARequest) -> QAResponse:
        """Answer questions based on video transcript"""
        
        print(f"\n❓ Question for video: {request.video_id}")
        print(f"🔍 Question: {request.question}")
        print(f"📊 Transcript segments: {len(request.transcript)}")
        
        transcript_text = extract_transcript_text(request.transcript)
        qa_data = None
        ai_powered = False
        
        # Try AI first if available
        if self.gemini_available and self.model:
            try:
                prompt = QA_PROMPT.format(
                    transcript=transcript_text[:4000],
                    question=request.question
                )
                
                print("🧠 Calling Gemini AI for Q&A...")
                response = self.model.generate_content(prompt)
                response_text = response.text
                
                qa_data = parse_ai_response(response_text)
                
                if qa_data:
                    print("✅ AI Q&A successful")
                    ai_powered = True
                else:
                    print("⚠️ AI response parsing failed, using fallback")
                    qa_data = generate_fallback_answer(request.question, transcript_text)
                    
            except Exception as ai_error:
                print(f"❌ AI error: {ai_error}")
                qa_data = generate_fallback_answer(request.question, transcript_text)
        else:
            print("🔄 Using fallback Q&A...")
            qa_data = generate_fallback_answer(request.question, transcript_text)
        
        # Ensure we have valid data
        if not qa_data:
            qa_data = generate_fallback_answer(request.question, transcript_text)
        
        return QAResponse(
            video_id=request.video_id,
            question=request.question,
            answer=qa_data.get("answer", "I'll help you find the answer based on the video content."),
            relevant_timestamps=qa_data.get("relevant_timestamps", []),
            confidence=qa_data.get("confidence", "medium"),
            sources=["Video transcript analysis"],
            ai_powered=ai_powered
        )
    
    def get_service_status(self) -> Dict:
        """Get service status information"""
        return {
            "service": "Video AI Service",
            "ai_available": self.gemini_available,
            "model": "gemini-1.5-flash" if self.gemini_available else "intelligent_fallback",
            "features": ["summarization", "question-answering", "key-points-extraction"]
        }