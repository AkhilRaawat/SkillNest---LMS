from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import os
import json
import re
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

app = FastAPI(title="LMS AI Service", version="1.0.0")

# Configure Gemini with error handling
try:
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key and api_key != "your_gemini_api_key_here":
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        print("✅ Gemini AI configured successfully")
        GEMINI_AVAILABLE = True
    else:
        print("⚠️ Gemini API key not found - using fallback mode")
        model = None
        GEMINI_AVAILABLE = False
except Exception as e:
    print(f"⚠️ Gemini configuration error: {e}")
    model = None
    GEMINI_AVAILABLE = False

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:5173",
        "https://skill-nest-lms.vercel.app",  # Your Vercel frontend
        "https://skillnest-ai-service.onrender.com",  # Your Render URL (update with actual)
        "*"  # Temporary for testing - remove in production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
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
    ai_powered: bool = False

# Gemini prompt template
GEMINI_PROMPT = """
You are an expert educational quiz generator. Create {num_questions} {difficulty} level multiple choice questions based on this content:

CONTENT:
{content}

REQUIREMENTS:
- Generate exactly {num_questions} questions
- Difficulty: {difficulty}
- Each question must have exactly 4 options
- Questions should test comprehension, analysis, and application
- Make questions specific to the content provided
- Avoid generic or obvious questions
- Provide clear explanations for correct answers

RESPONSE FORMAT:
Return ONLY a valid JSON array with this exact structure:
[
  {{
    "question": "What is the primary concept discussed in the content?",
    "type": "mcq",
    "options": ["Specific concept A", "Specific concept B", "Specific concept C", "Specific concept D"],
    "correct_answer": "Specific concept A",
    "explanation": "Detailed explanation based on the content",
    "difficulty": "{difficulty}",
    "points": 1
  }}
]

Return only the JSON array, no markdown formatting, no additional text.
"""

def clean_gemini_response(response_text: str) -> str:
    """Clean and extract JSON from Gemini response"""
    # Remove markdown code blocks
    if "```json" in response_text:
        response_text = response_text.split("```json")[1].split("```")[0]
    elif "```" in response_text:
        # Handle any code blocks
        parts = response_text.split("```")
        if len(parts) >= 3:
            response_text = parts[1]
    
    # Clean up whitespace
    response_text = response_text.strip()
    
    return response_text

def parse_gemini_response(response_text: str) -> List[dict]:
    """Parse Gemini response and extract questions"""
    try:
        clean_text = clean_gemini_response(response_text)
        
        # Try to find JSON array
        json_match = re.search(r'\[[\s\S]*\]', clean_text)
        if json_match:
            json_str = json_match.group()
            questions = json.loads(json_str)
            
            # Validate structure
            if isinstance(questions, list) and len(questions) > 0:
                for q in questions:
                    if not all(key in q for key in ["question", "options", "correct_answer"]):
                        raise ValueError("Invalid question structure")
                return questions
        
        # If no valid JSON found, try parsing entire response
        return json.loads(clean_text)
        
    except (json.JSONDecodeError, ValueError) as e:
        print(f"❌ JSON parsing error: {e}")
        print(f"Raw response: {response_text[:300]}...")
        return []

def generate_intelligent_fallback(content: str, settings: QuizSettings) -> List[dict]:
    """Generate intelligent fallback questions based on content analysis"""
    
    # Extract key information from content
    sentences = [s.strip() for s in content.split('.') if s.strip()]
    words = content.lower().split()
    
    # Find important terms (capitalized words, longer words)
    key_terms = []
    for word in content.split():
        if (word[0].isupper() and len(word) > 3) or len(word) > 8:
            if word.replace(',', '').replace('.', '').isalpha():
                key_terms.append(word.replace(',', '').replace('.', ''))
    
    key_terms = list(set(key_terms))[:5]  # Top 5 unique terms
    
    questions = []
    content_preview = content[:100].replace('"', "'")
    
    # Question 1: Main concept
    questions.append({
        "question": f"What is the primary subject discussed in this content about '{content_preview}...'?",
        "type": "mcq",
        "options": [
            "The main topic explained in the text",
            "A supporting detail mentioned briefly",
            "Background or historical context",
            "An unrelated external concept"
        ],
        "correct_answer": "The main topic explained in the text",
        "explanation": "This question tests understanding of the central theme and main focus of the provided content.",
        "difficulty": settings.difficulty,
        "points": 1
    })
    
    # Question 2: Key terms (if found)
    if key_terms:
        questions.append({
            "question": f"Which term is most central to understanding the concepts in this content?",
            "type": "mcq",
            "options": [
                key_terms[0] if len(key_terms) > 0 else "Primary concept",
                "Secondary terminology",
                "Background vocabulary",
                "Unrelated terminology"
            ],
            "correct_answer": key_terms[0] if len(key_terms) > 0 else "Primary concept",
            "explanation": f"The term '{key_terms[0] if key_terms else 'Primary concept'}' is fundamental to the main concepts discussed in this content.",
            "difficulty": settings.difficulty,
            "points": 1
        })
    
    # Question 3: Content analysis
    if len(sentences) > 2:
        questions.append({
            "question": "Based on the structure and information provided, what type of content is this?",
            "type": "mcq",
            "options": [
                "Educational or informational material",
                "Entertainment or fictional content",
                "Advertisement or promotional text",
                "Personal opinion or blog post"
            ],
            "correct_answer": "Educational or informational material",
            "explanation": "The content is structured to provide factual information and educational value on its topic.",
            "difficulty": settings.difficulty,
            "points": 1
        })
    
    # Additional questions based on content length
    if len(words) > 50:
        questions.append({
            "question": "What can be concluded from the information presented in this content?",
            "type": "mcq",
            "options": [
                "It provides comprehensive information on the topic",
                "It only gives surface-level details",
                "It focuses mainly on historical aspects",
                "It presents only theoretical concepts"
            ],
            "correct_answer": "It provides comprehensive information on the topic",
            "explanation": "The content appears to offer detailed information and explanations about its subject matter.",
            "difficulty": settings.difficulty,
            "points": 1
        })
    
    return questions[:settings.question_count]

@app.get("/")
async def root():
    return {
        "message": "LMS AI Service with Gemini is running",
        "ai_status": "enabled" if GEMINI_AVAILABLE else "fallback_mode"
    }

@app.get("/api/ai/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "AI Quiz Generator with Gemini",
        "ai_available": GEMINI_AVAILABLE,
        "model": "gemini-1.5-flash" if GEMINI_AVAILABLE else "intelligent_fallback"
    }

@app.post("/api/ai/generate-quiz", response_model=QuizGenerationResponse)
async def generate_quiz(request: QuizGenerationRequest):
    """Generate quiz from text content using Gemini AI or intelligent fallback"""
    
    try:
        print(f"\n🚀 Generating quiz...")
        print(f"📝 Content length: {len(request.content)} characters")
        print(f"❓ Questions requested: {request.settings.question_count}")
        print(f"📊 Difficulty: {request.settings.difficulty}")
        print(f"🤖 AI Mode: {'Gemini' if GEMINI_AVAILABLE else 'Intelligent Fallback'}")
        
        questions_data = []
        ai_powered = False
        
        # Try Gemini AI first if available
        if GEMINI_AVAILABLE and model:
            try:
                prompt = GEMINI_PROMPT.format(
                    content=request.content[:4000],  # Limit content length
                    num_questions=min(request.settings.question_count, 8),
                    difficulty=request.settings.difficulty
                )
                
                print("🧠 Calling Gemini AI...")
                response = model.generate_content(prompt)
                response_text = response.text
                
                print(f"✅ Gemini responded with {len(response_text)} characters")
                
                questions_data = parse_gemini_response(response_text)
                
                if questions_data:
                    print(f"🎯 Successfully parsed {len(questions_data)} AI-generated questions")
                    ai_powered = True
                else:
                    print("⚠️ Gemini parsing failed, using intelligent fallback")
                    questions_data = generate_intelligent_fallback(request.content, request.settings)
                    
            except Exception as gemini_error:
                print(f"❌ Gemini AI error: {gemini_error}")
                print("🔄 Falling back to intelligent question generation...")
                questions_data = generate_intelligent_fallback(request.content, request.settings)
        else:
            print("🔄 Using intelligent fallback question generation...")
            questions_data = generate_intelligent_fallback(request.content, request.settings)
        
        # Convert to QuizQuestion objects
        questions = []
        for i, q_data in enumerate(questions_data):
            try:
                question = QuizQuestion(
                    question=q_data.get("question", f"Question {i+1} about the content"),
                    type=q_data.get("type", "mcq"),
                    options=q_data.get("options", ["Option A", "Option B", "Option C", "Option D"]),
                    correct_answer=q_data.get("correct_answer", q_data.get("options", ["Option A"])[0]),
                    explanation=q_data.get("explanation", "This question tests understanding of the content"),
                    difficulty=q_data.get("difficulty", request.settings.difficulty),
                    points=q_data.get("points", 1)
                )
                questions.append(question)
            except Exception as e:
                print(f"⚠️ Error creating question {i+1}: {e}")
                continue
        
        # Ensure we have at least one question
        if not questions:
            fallback_question = QuizQuestion(
                question="What is the main focus of the provided content?",
                type="mcq",
                options=["Primary topic", "Secondary information", "Background details", "Unrelated content"],
                correct_answer="Primary topic",
                explanation="This question tests basic comprehension of the content's main theme",
                difficulty=request.settings.difficulty,
                points=1
            )
            questions = [fallback_question]
        
        # Generate unique quiz ID
        quiz_id = f"{'ai' if ai_powered else 'smart'}-quiz-{abs(hash(request.content + str(request.settings.question_count))) % 100000}"
        
        print(f"✅ Quiz generated successfully!")
        print(f"🆔 Quiz ID: {quiz_id}")
        print(f"📝 Questions: {len(questions)}")
        print(f"🤖 AI Powered: {ai_powered}\n")
        
        return QuizGenerationResponse(
            quiz_id=quiz_id,
            questions=questions[:request.settings.question_count],
            status="completed",
            ai_powered=ai_powered
        )
        
    except Exception as e:
        print(f"💥 Error generating quiz: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate quiz: {str(e)}")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8001))
    print(f"🚀 Starting LMS AI Service on port {port}...")
    print("📋 Make sure your GEMINI_API_KEY is set")
    print(f"🌐 Server will be available on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)