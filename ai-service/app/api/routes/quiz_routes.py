# /ai-service/routes/quiz_routes.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
import json
import re
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()
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
You are an expert educational quiz generator. Your task is to generate EXACTLY {num_questions} questions. No more, no less.

CONTENT TO GENERATE QUESTIONS FROM:
{content}

STRICT REQUIREMENTS:
1. Generate EXACTLY {num_questions} questions - this is a hard requirement
2. Difficulty level: {difficulty}
3. Each question must have exactly 4 options
4. Questions should test comprehension and understanding
5. Make questions specific to the content
6. Avoid generic questions
7. Include clear explanations

FORMAT YOUR RESPONSE AS A VALID JSON ARRAY:
[
  {{
    "question": "Specific question from the content?",
    "type": "mcq",
    "options": ["Specific option A", "Specific option B", "Specific option C", "Specific option D"],
    "correct_answer": "Specific option A",
    "explanation": "Clear explanation why this is correct",
    "difficulty": "{difficulty}",
    "points": 1
  }},
  ... EXACTLY {num_questions} questions total
]

IMPORTANT: Your response must contain EXACTLY {num_questions} questions. This is critical.
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
    
    key_terms = list(set(key_terms))  # Get unique terms
    
    questions = []
    content_preview = content[:100].replace('"', "'")
    
    # Generate a pool of potential questions
    question_pool = [
        # Main concept question
        {
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
        },
        # Content type question
        {
            "question": "What type of content is this based on its structure and presentation?",
            "type": "mcq",
            "options": [
                "Educational material",
                "Entertainment content",
                "Technical documentation",
                "Opinion piece"
            ],
            "correct_answer": "Educational material",
            "explanation": "The content is structured to provide educational value and information.",
            "difficulty": settings.difficulty,
            "points": 1
        },
        # Content depth question
        {
            "question": "How would you characterize the depth of information in this content?",
            "type": "mcq",
            "options": [
                "Comprehensive coverage",
                "Basic overview",
                "Technical deep-dive",
                "Surface-level introduction"
            ],
            "correct_answer": "Comprehensive coverage",
            "explanation": "The content provides detailed information about its subject matter.",
            "difficulty": settings.difficulty,
            "points": 1
        }
    ]
    
    # Add questions based on key terms if available
    for term in key_terms:
        question_pool.append({
            "question": f"What role does '{term}' play in the content?",
            "type": "mcq",
            "options": [
                "Central concept",
                "Supporting detail",
                "Background information",
                "Unrelated reference"
            ],
            "correct_answer": "Central concept",
            "explanation": f"'{term}' is a key term that plays a central role in explaining the main concepts.",
            "difficulty": settings.difficulty,
            "points": 1
        })
    
    # Add content structure questions if we have enough sentences
    if len(sentences) > 3:
        question_pool.append({
            "question": "How is the information primarily organized in this content?",
            "type": "mcq",
            "options": [
                "Logical progression of concepts",
                "Random collection of facts",
                "Chronological order",
                "Comparative analysis"
            ],
            "correct_answer": "Logical progression of concepts",
            "explanation": "The content follows a structured approach in presenting information.",
            "difficulty": settings.difficulty,
            "points": 1
        })
    
    # If we still need more questions, generate additional ones based on content length
    while len(question_pool) < settings.question_count:
        question_pool.append({
            "question": f"Question {len(question_pool) + 1}: What can be inferred from the content?",
            "type": "mcq",
            "options": [
                "It provides valuable information",
                "It lacks essential details",
                "It contains irrelevant material",
                "It needs more context"
            ],
            "correct_answer": "It provides valuable information",
            "explanation": "The content contains meaningful and relevant information about its subject.",
            "difficulty": settings.difficulty,
            "points": 1
        })
    
    # Return exactly the number of questions requested
    return question_pool[:settings.question_count]

@router.get("/health")
async def quiz_health():
    return {
        "service": "quiz_generator",
        "ai_available": GEMINI_AVAILABLE,
        "model": "gemini-1.5-flash" if GEMINI_AVAILABLE else "intelligent_fallback"
    }

@router.post("/generate-quiz", response_model=QuizGenerationResponse)
async def generate_quiz(request: QuizGenerationRequest):
    """Generate quiz from text content using Gemini AI or intelligent fallback"""
    
    try:
        print(f"\n🚀 Generating quiz...")
        print(f"📝 Content length: {len(request.content)} characters")
        print(f"❓ Questions requested: {request.settings.question_count}")
        print(f"📊 Difficulty: {request.settings.difficulty}")
        
        questions_data = []
        ai_powered = False
        
        if GEMINI_AVAILABLE and model:
            try:
                # Make up to 3 attempts to get the correct number of questions
                for attempt in range(3):
                    print(f"\n🔄 Attempt {attempt + 1} to generate {request.settings.question_count} questions...")
                    
                    prompt = GEMINI_PROMPT.format(
                        content=request.content[:4000],
                        num_questions=request.settings.question_count,
                        difficulty=request.settings.difficulty
                    )
                    
                    response = model.generate_content(prompt)
                    response_text = response.text
                    
                    questions = parse_gemini_response(response_text)
                    
                    # Validate question count
                    if len(questions) == request.settings.question_count:
                        print(f"✅ Successfully generated exactly {len(questions)} questions!")
                        questions_data = questions
                        ai_powered = True
                        break
                    else:
                        print(f"⚠️ Got {len(questions)} questions instead of {request.settings.question_count}")
                        
                # If we still don't have the right number of questions, use fallback
                if len(questions_data) != request.settings.question_count:
                    print("⚠️ Failed to get correct number of questions, using fallback")
                    questions_data = generate_intelligent_fallback(request.content, request.settings)
                    
            except Exception as gemini_error:
                print(f"❌ Gemini AI error: {gemini_error}")
                questions_data = generate_intelligent_fallback(request.content, request.settings)
        else:
            print("🔄 Using fallback generation...")
            questions_data = generate_intelligent_fallback(request.content, request.settings)
        
        # Final validation to ensure exact question count
        if len(questions_data) > request.settings.question_count:
            questions_data = questions_data[:request.settings.question_count]
        elif len(questions_data) < request.settings.question_count:
            # Add generic questions to make up the difference
            while len(questions_data) < request.settings.question_count:
                questions_data.append({
                    "question": f"Additional question about the content ({len(questions_data) + 1})?",
                    "type": "mcq",
                    "options": [
                        "Main point from the content",
                        "Secondary detail",
                        "Related concept",
                        "Unrelated information"
                    ],
                    "correct_answer": "Main point from the content",
                    "explanation": "This tests understanding of the main concepts in the content.",
                    "difficulty": request.settings.difficulty,
                    "points": 1
                })
        
        # Generate unique quiz ID
        quiz_id = f"{'ai' if ai_powered else 'smart'}-quiz-{abs(hash(request.content + str(request.settings.question_count))) % 100000}"
        
        print(f"\n✅ Quiz generation complete!")
        print(f"🆔 Quiz ID: {quiz_id}")
        print(f"📝 Final question count: {len(questions_data)}")
        print(f"🤖 AI Powered: {ai_powered}\n")
        
        return QuizGenerationResponse(
            quiz_id=quiz_id,
            questions=questions_data,
            status="completed",
            ai_powered=ai_powered
        )
        
    except Exception as e:
        print(f"💥 Error generating quiz: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate quiz: {str(e)}")