from pydantic import BaseModel
from typing import List, Optional
from enum import Enum

class QuestionType(str, Enum):
    MCQ = "mcq"
    TRUE_FALSE = "true_false"
    SHORT_ANSWER = "short_answer"

class Difficulty(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"

class QuizSettings(BaseModel):
    question_count: int = 10
    difficulty: Difficulty = Difficulty.MEDIUM
    question_types: List[QuestionType] = [QuestionType.MCQ]

class QuizQuestion(BaseModel):
    question: str
    type: QuestionType
    options: Optional[List[str]] = None
    correct_answer: str
    explanation: Optional[str] = None
    difficulty: Difficulty
    points: int = 1

class QuizGenerationRequest(BaseModel):
    content: str
    settings: QuizSettings
    course_id: str
    user_id: str

class QuizGenerationResponse(BaseModel):
    quiz_id: str
    questions: List[QuizQuestion]
    status: str