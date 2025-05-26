import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const aiQuizApi = {
  generateQuiz: async (content, settings = {}) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/ai/generate-quiz`, {
        content,
        settings: {
          question_count: settings.questionCount || 10,
          difficulty: settings.difficulty || 'medium',
          question_types: settings.questionTypes || ['mcq'],
          courseId: settings.courseId,
          userId: settings.userId
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to generate quiz');
    }
  },

  checkAiHealth: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/ai/health`);
      return response.data;
    } catch (error) {
      return { status: 'unavailable' };
    }
  }
};