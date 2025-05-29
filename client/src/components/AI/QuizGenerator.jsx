import React, { useState } from 'react';
import './QuizGenerator.css'; // Import your CSS styles for QuizGenerator

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
  const [quizGenerated, setQuizGenerated] = useState(false);

  const API_BASE_URL = 'https://skill-nest-lms-server.vercel.app'; // Replace with your actual backend URL

  const handleGenerate = async () => {
    if (!content.trim()) {
      setError('Please enter some content to generate quiz from');
      return;
    }

    setLoading(true);
    setError('');
    setQuizGenerated(false);

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/generate-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          settings: {
            questionCount: settings.questionCount,
            difficulty: settings.difficulty,
            questionTypes: settings.questionTypes
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setQuestions(result.questions || []);
      setQuizGenerated(true);
    } catch (err) {
      setError(err.message || 'Failed to generate quiz');
      console.error('Quiz generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setContent('');
    setQuestions([]);
    setError('');
    setQuizGenerated(false);
  };

  return (
    <div className="quiz-generator">
      <div className="quiz-generator-header">
        <h2>🤖 AI Quiz Generator</h2>
        <p>Generate intelligent quizzes from any content using AI</p>
      </div>

      {!quizGenerated ? (
        <div className="quiz-input-section">
          <div className="content-input">
            <label htmlFor="content">Enter Course Content:</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your lecture notes, textbook content, or any educational material here..."
              rows={8}
              className="content-textarea"
            />
            <div className="content-counter">
              {content.length} characters
            </div>
          </div>

          <div className="quiz-settings">
            <h3>Quiz Settings</h3>
            
            <div className="settings-row">
              <div className="setting-group">
                <label htmlFor="questionCount">Number of Questions:</label>
                <select
                  id="questionCount"
                  value={settings.questionCount}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    questionCount: parseInt(e.target.value)
                  }))}
                >
                  <option value={3}>3 Questions</option>
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                  <option value={15}>15 Questions</option>
                  <option value={20}>20 Questions</option>
                </select>
              </div>

              <div className="setting-group">
                <label htmlFor="difficulty">Difficulty Level:</label>
                <select
                  id="difficulty"
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
          </div>

          <button 
            className="generate-btn"
            onClick={handleGenerate} 
            disabled={loading || !content.trim()}
          >
            {loading ? '🧠 Generating Quiz...' : '✨ Generate Quiz with AI'}
          </button>

          {error && <div className="error-message">❌ {error}</div>}
        </div>
      ) : (
        <div className="quiz-results">
          <div className="results-header">
            <h3>🎯 Generated Quiz ({questions.length} questions)</h3>
            <button className="new-quiz-btn" onClick={handleReset}>
              + Generate New Quiz
            </button>
          </div>

          <div className="questions-list">
            {questions.map((question, index) => (
              <div key={index} className="question-card">
                <div className="question-header">
                  <span className="question-number">Q{index + 1}</span>
                  <span className="difficulty-badge">{question.difficulty}</span>
                </div>
                
                <div className="question-text">
                  {question.question}
                </div>

                {question.options && (
                  <div className="options-list">
                    {question.options.map((option, optIndex) => (
                      <div 
                        key={optIndex} 
                        className={`option ${option === question.correct_answer ? 'correct' : ''}`}
                      >
                        <span className="option-letter">{String.fromCharCode(65 + optIndex)}</span>
                        <span className="option-text">{option}</span>
                        {option === question.correct_answer && <span className="correct-indicator">✓</span>}
                      </div>
                    ))}
                  </div>
                )}

                {question.explanation && (
                  <div className="explanation">
                    <strong>💡 Explanation:</strong> {question.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizGenerator;