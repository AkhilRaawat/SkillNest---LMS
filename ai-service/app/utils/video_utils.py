import json
import re
from typing import List, Dict
from app.models.video_models import TranscriptSegment

def extract_transcript_text(transcript_segments: List[TranscriptSegment]) -> str:
    """Extract clean text from transcript segments"""
    text_parts = []
    for segment in transcript_segments:
        timestamp_info = f"[{segment.timestamp}] " if segment.timestamp else ""
        speaker_info = f"{segment.speaker}: " if segment.speaker else ""
        text_parts.append(f"{timestamp_info}{speaker_info}{segment.text}")
    
    return "\n".join(text_parts)

def parse_ai_response(response_text: str) -> Dict:
    """Parse AI response and extract JSON"""
    try:
        # Clean response
        clean_text = response_text.strip()
        
        # Remove markdown if present
        if "```json" in clean_text:
            clean_text = clean_text.split("```json")[1].split("```")[0]
        elif "```" in clean_text:
            parts = clean_text.split("```")
            if len(parts) >= 3:
                clean_text = parts[1]
        
        # Find JSON object
        json_match = re.search(r'\{[\s\S]*\}', clean_text)
        if json_match:
            json_str = json_match.group()
            return json.loads(json_str)
        
        # Try parsing entire response
        return json.loads(clean_text)
        
    except (json.JSONDecodeError, ValueError) as e:
        print(f"❌ JSON parsing error: {e}")
        return None

def generate_fallback_summary(transcript_text: str, summary_type: str) -> Dict:
    """Generate intelligent fallback summary when AI is unavailable"""
    lines = [line.strip() for line in transcript_text.split('\n') if line.strip()]
    
    # Extract key information
    important_lines = []
    for line in lines:
        # Look for lines that seem important
        if any(keyword in line.lower() for keyword in ['what is', 'define', 'important', 'key', 'remember', 'note that']):
            important_lines.append(line)
    
    # Basic summary based on content
    if summary_type == "brief":
        summary = f"This video covers educational content with {len(lines)} key discussion points. " + \
                 "The content appears to focus on learning concepts and practical applications."
        key_points = important_lines[:3] if important_lines else ["Key concept 1", "Key concept 2", "Key concept 3"]
    else:
        summary = f"This educational video provides comprehensive coverage of the subject matter. " + \
                 f"The transcript contains {len(lines)} segments of discussion, including explanations, " + \
                 "examples, and key learning points. The content is structured to facilitate understanding " + \
                 "and practical application of the concepts presented."
        key_points = important_lines[:5] if important_lines else [
            "Educational content overview",
            "Key concepts and definitions", 
            "Practical applications",
            "Important examples",
            "Learning objectives"
        ]
    
    return {
        "summary": summary,
        "key_points": key_points,
        "main_topics": ["Educational Content", "Learning Material"]
    }

def generate_fallback_answer(question: str, transcript_text: str) -> Dict:
    """Generate intelligent fallback answer when AI is unavailable"""
    # Simple keyword matching
    question_lower = question.lower()
    transcript_lower = transcript_text.lower()
    
    # Check if question keywords appear in transcript
    question_words = [word.strip('?.,!') for word in question_lower.split() if len(word) > 3]
    matches = [word for word in question_words if word in transcript_lower]
    
    if matches:
        confidence = "medium"
        answer = f"Based on the transcript content, there are references to: {', '.join(matches)}. " + \
                f"The transcript contains relevant information about your question regarding {question}. " + \
                "For detailed information, please review the specific sections of the video."
    else:
        confidence = "low"
        answer = f"I cannot find specific information about '{question}' in this video transcript. " + \
                "The question may be answered in a different video or section of the course."
    
    return {
        "answer": answer,
        "relevant_timestamps": [],
        "confidence": confidence,
        "additional_info": "This is a basic analysis. For more accurate answers, AI processing is recommended."
    }