import React, { useState, useEffect, useRef } from 'react';
import './QuizGenerator.css'; // Import your CSS styles for QuizGenerator

const QuizGenerator = ({ content: initialContent }) => {
  const [content, setContent] = useState(initialContent || '');
  const [settings, setSettings] = useState({
    questionCount: 5,
    difficulty: 'medium',
    questionTypes: ['mcq']
  });
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quizGenerated, setQuizGenerated] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0, percentage: 0 });
  
  const scoreSummaryRef = useRef(null);

  const API_BASE_URL = 'https://skill-nest-lms-server.vercel.app'; // Use the original working URL

  useEffect(() => {
    if (initialContent) {
      handleGenerate();
    }
  }, [initialContent]);

  useEffect(() => {
    // Check if all questions are answered
    if (questions.length > 0 && answeredQuestions.size === questions.length) {
      const correctAnswers = questions.reduce((count, question, index) => {
        return count + (selectedAnswers[index] === question.correct_answer ? 1 : 0);
      }, 0);
      
      setScore({
        correct: correctAnswers,
        total: questions.length,
        percentage: Math.round((correctAnswers / questions.length) * 100)
      });
      setQuizCompleted(true);

      // Scroll to score summary with a slight delay to ensure rendering
      setTimeout(() => {
        scoreSummaryRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 300);
    }
  }, [answeredQuestions, questions, selectedAnswers]);

  const getPerformanceMessage = (percentage) => {
    if (percentage === 100) return "🏆 Perfect Score! Outstanding!";
    if (percentage >= 90) return "🌟 Excellent Performance!";
    if (percentage >= 80) return "👏 Great Job!";
    if (percentage >= 70) return "👍 Good Work!";
    if (percentage >= 60) return "💪 Keep Practicing!";
    return "📚 More Review Needed";
  };

  const handleGenerate = async () => {
    if (!content.trim()) {
      setError('No content available to generate quiz');
      return;
    }

    setLoading(true);
    setError('');
    setQuizGenerated(false);
    setAnsweredQuestions(new Set());
    setSelectedAnswers({});
    setQuizCompleted(false);
    setScore({ correct: 0, total: 0, percentage: 0 });

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

  const handleSettingsChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    // Generate new quiz with updated settings
    handleGenerate();
  };

  const handleReset = () => {
    setContent(initialContent || '');
    handleGenerate();
  };

  const handleOptionSelect = (questionIndex, selectedOption) => {
    if (answeredQuestions.has(questionIndex)) {
      return; // Don't allow changing answer once selected
    }

    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: selectedOption
    }));

    setAnsweredQuestions(prev => new Set([...prev, questionIndex]));
  };

  const isQuestionAnswered = (questionIndex) => answeredQuestions.has(questionIndex);
  const getSelectedOption = (questionIndex) => selectedAnswers[questionIndex];

  if (loading) {
    return (
      <div className="quiz-loading">
        <div className="loading-spinner"></div>
        <p>🧠 Generating your quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-error">
        <p>❌ {error}</p>
        <button onClick={handleGenerate} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  if (!quizGenerated) {
    return (
      <div className="quiz-loading">
        <div className="loading-spinner"></div>
        <p>Preparing quiz...</p>
      </div>
    );
  }

  return (
    <div className="quiz-generator">
      <div className="quiz-generator-header">
        <h2>🤖 AI Quiz Generator</h2>
        <p>Generate intelligent quizzes from any content using AI</p>
      </div>

      <div className="quiz-results">
        <div className="results-header">
          <div>
            <h3>🎯 Practice Quiz ({questions.length} questions)</h3>
            <div className="quiz-settings mt-4">
              <div className="settings-row">
                <div className="setting-group">
                  <label htmlFor="questionCount">Number of Questions:</label>
                  <select
                    id="questionCount"
                    value={settings.questionCount}
                    onChange={(e) => handleSettingsChange('questionCount', parseInt(e.target.value))}
                    className="quiz-select"
                  >
                    <option value={3}>3 Questions</option>
                    <option value={5}>5 Questions</option>
                    <option value={10}>10 Questions</option>
                    <option value={15}>15 Questions</option>
                  </select>
                </div>
                <div className="setting-group">
                  <label htmlFor="difficulty">Difficulty:</label>
                  <select
                    id="difficulty"
                    value={settings.difficulty}
                    onChange={(e) => handleSettingsChange('difficulty', e.target.value)}
                    className="quiz-select"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
              <button className="generate-quiz-btn" onClick={handleReset}>
                Generate Quiz
              </button>
            </div>
          </div>
        </div>

        {quizCompleted && (
          <div className="score-summary" ref={scoreSummaryRef}>
            <div className="score-header">
              <h3>{getPerformanceMessage(score.percentage)}</h3>
              <div className="score-stats">
                <div className="score-circle">
                  <div className="score-percentage">{score.percentage}%</div>
                  <div className="score-label">Score</div>
                </div>
                <div className="score-details">
                  <div className="score-item">
                    <span>✅ Correct:</span> {score.correct}
                  </div>
                  <div className="score-item">
                    <span>❌ Incorrect:</span> {score.total - score.correct}
                  </div>
                  <div className="score-item">
                    <span>📝 Total Questions:</span> {score.total}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="questions-list">
          {questions.map((question, index) => {
            const isAnswered = isQuestionAnswered(index);
            const selectedOption = getSelectedOption(index);
            
            return (
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
                    {question.options.map((option, optIndex) => {
                      const isSelected = selectedOption === option;
                      const isCorrect = isAnswered && option === question.correct_answer;
                      
                      return (
                        <div 
                          key={optIndex} 
                          className={`option 
                            ${!isAnswered ? 'clickable' : ''}
                            ${isSelected ? 'selected' : ''}
                            ${isAnswered && isSelected ? (isCorrect ? 'correct' : 'incorrect') : ''}
                            ${isAnswered && isCorrect ? 'correct' : ''}`}
                          onClick={() => handleOptionSelect(index, option)}
                        >
                          <span className={`option-letter ${isAnswered && (isSelected || isCorrect) ? (isCorrect ? 'correct' : 'incorrect') : ''}`}>
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          <span className="option-text">{option}</span>
                          {isAnswered && (
                            isCorrect ? (
                              <span className="correct-indicator">✓</span>
                            ) : (
                              isSelected && <span className="incorrect-indicator">✗</span>
                            )
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {isAnswered && (
                  <div className="feedback-section">
                    <div className="result-message">
                      {selectedOption === question.correct_answer ? (
                        <div className="correct-message">✨ Correct!</div>
                      ) : (
                        <div className="incorrect-message">
                          ❌ Incorrect
                        </div>
                      )}
                    </div>
                    <div className="explanation">
                      <strong>💡 Explanation:</strong> {question.explanation}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizGenerator;