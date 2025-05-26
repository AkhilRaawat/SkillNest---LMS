import React, { useState } from 'react';
import { aiQuizApi } from '../../services/api/aiQuizApi';

const QuizGenerator = () => {
  const [content, setContent] = useState('');
  const [settings, setSettings] = useState({
    questionCount: 10,
    difficulty: 'medium',
    questionTypes: ['mcq']
  });
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!content.trim()) {
      setError('Please enter some content to generate quiz from');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await aiQuizApi.generateQuiz(content, settings);
      setQuestions(result.questions || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quiz-generator">
      <h2>AI Quiz Generator</h2>
      
      <div className="content-input">
        <label>Enter Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste your course content here..."
          rows={10}
          cols={50}
        />
      </div>

      <div className="settings">
        <div>
          <label>Number of Questions:</label>
          <input
            type="number"
            value={settings.questionCount}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              questionCount: parseInt(e.target.value) || 10
            }))}
            min="1"
            max="50"
          />
        </div>

        <div>
          <label>Difficulty:</label>
          <select
            value={settings.difficulty}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              difficulty: e.target.value
            }))}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Quiz'}
      </button>

      {error && <div className="error">{error}</div>}

      {questions.length > 0 && (
        <div className="generated-questions">
          <h3>Generated Questions</h3>
          {questions.map((q, index) => (
            <div key={index} className="question">
              <h4>Question {index + 1}: {q.question}</h4>
              {q.options && (
                <ul>
                  {q.options.map((option, optIndex) => (
                    <li key={optIndex}>{option}</li>
                  ))}
                </ul>
              )}
              <p><strong>Answer:</strong> {q.correct_answer}</p>
              {q.explanation && <p><strong>Explanation:</strong> {q.explanation}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizGenerator;