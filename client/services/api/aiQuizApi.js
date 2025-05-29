const API_BASE_URL = 'https://skill-nest-lms-server.vercel.app';

export const aiQuizApi = {
  generateQuiz: async (content, settings = {}) => {
    const response = await fetch(`${API_BASE_URL}/api/ai/generate-quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, settings })
    });
    return response.json();
  }
};