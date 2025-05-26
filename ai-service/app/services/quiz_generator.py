from openai import OpenAI
from typing import List
import json
import re
from app.models.quiz_models import QuizQuestion, QuizSettings
from app.prompts.quiz_prompts import QUIZ_GENERATION_PROMPT
from app.config.settings import settings

class QuizGeneratorService:
    def __init__(self):
        self.client = OpenAI(api_key=settings.openai_api_key)
    
    async def generate_quiz_from_content(
        self, 
        content: str, 
        quiz_settings: QuizSettings
    ) -> List[QuizQuestion]:
        """Generate quiz questions from content using OpenAI"""
        
        cleaned_content = self._clean_content(content)
        questions = await self._generate_questions(cleaned_content, quiz_settings)
        
        return questions
    
    async def _generate_questions(
        self, 
        content: str, 
        quiz_settings: QuizSettings
    ) -> List[QuizQuestion]:
        """Use OpenAI to generate questions"""
        
        prompt = QUIZ_GENERATION_PROMPT.format(
            content=content,
            num_questions=quiz_settings.question_count,
            difficulty=quiz_settings.difficulty.value,
            question_types=", ".join([qt.value for qt in quiz_settings.question_types])
        )
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=2000
            )
            
            questions_data = self._parse_openai_response(response.choices[0].message.content)
            return [QuizQuestion(**q) for q in questions_data]
            
        except Exception as e:
            print(f"Error generating quiz: {e}")
            return []
    
    def _clean_content(self, content: str) -> str:
        """Clean and preprocess content"""
        cleaned = re.sub(r'\s+', ' ', content)
        return cleaned.strip()[:4000]  # Limit content length
    
    def _parse_openai_response(self, response: str) -> List[dict]:
        """Parse OpenAI response into structured question data"""
        try:
            # Try to find JSON in the response
            json_match = re.search(r'\[.*\]', response, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            else:
                return json.loads(response)
        except json.JSONDecodeError:
            print("Failed to parse JSON response")
            return []