const AiService = require('..services\aiService.js');

class AiController {
  constructor() {
    this.aiService = new AiService();
  }

  async generateQuiz(req, res) {
    try {
      const { content, settings } = req.body;
      
      if (!content) {
        return res.status(400).json({ error: 'Content is required' });
      }

      const result = await this.aiService.generateQuiz(content, settings || {});
      
      res.json(result);
    } catch (error) {
      console.error('Generate Quiz Error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async healthCheck(req, res) {
    try {
      const health = await this.aiService.checkHealth();
      res.json(health);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AiController();