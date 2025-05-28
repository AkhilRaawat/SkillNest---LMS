// In your React app's API service
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-vercel-backend.vercel.app';

export const aiQuizApi = {
  generateQuiz: async (content, settings = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/generate-quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          settings: {
            questionCount: settings.questionCount || 10,
            difficulty: settings.difficulty || 'medium',
            questionTypes: settings.questionTypes || ['mcq']
          }
        })
      });
      return await response.json();
    } catch (error) {
      throw new Error('Failed to generate quiz');
    }
  }
};