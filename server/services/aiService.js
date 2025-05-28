import axios from 'axios';

class AiService {
  constructor() {
    this.aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8001';
  }

  async generateQuiz(content, settings) {
    try {
      const response = await axios.post(`${this.aiServiceUrl}/api/ai/generate-quiz`, {
        content,
        settings: {
          question_count: settings.questionCount || 10,
          difficulty: settings.difficulty || 'medium',
          question_types: settings.questionTypes || ['mcq']
        },
        course_id: settings.courseId || 'default',
        user_id: settings.userId || 'default'
      });
      
      return response.data;
    } catch (error) {
      console.error('AI Service Error:', error.message);
      throw new Error(`AI Service Error: ${error.message}`);
    }
  }

  async checkHealth() {
    try {
      const response = await axios.get(`${this.aiServiceUrl}/api/ai/health`);
      return response.data;
    } catch (error) {
      return { status: 'unavailable', error: error.message };
    }
  }
}

export default AiService;