QUIZ_GENERATION_PROMPT = """
Based on the following content, generate {num_questions} {difficulty} level quiz questions.

Content:
{content}

Requirements:
- Question types: {question_types}
- Difficulty: {difficulty}
- Return response in JSON format
- Each question should have: question, type, options (for MCQ), correct_answer, explanation

Format your response as a JSON array of questions:
[
  {{
    "question": "Your question here?",
    "type": "mcq",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer": "Option A",
    "explanation": "Brief explanation",
    "difficulty": "{difficulty}",
    "points": 1
  }}
]
"""