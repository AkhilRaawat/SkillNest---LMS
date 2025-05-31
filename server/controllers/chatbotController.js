// /server/controllers/chatbotController.js
import axios from 'axios';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'https://your-ai-service.onrender.com';

// Chat with Bobby
export const chatWithBobby = async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    // Validation
    if (!message || !sessionId) {
      return res.status(400).json({ 
        success: false,
        error: 'Message and sessionId are required' 
      });
    }

    console.log(`🤖 Bobby chat request: ${message.substring(0, 50)}...`);

    // Forward request to AI service
    const response = await axios.post(`${AI_SERVICE_URL}/api/chatbot/chat`, {
      message,
      sessionId
    }, {
      timeout: 30000, // 30 second timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log(`✅ Bobby responded successfully`);

    res.status(200).json({
      success: true,
      data: {
        response: response.data.response,
        sessionId: response.data.sessionId
      }
    });

  } catch (error) {
    console.error('❌ Bobby chat error:', error.message);
    
    if (error.response) {
      // Error from AI service
      res.status(error.response.status).json({
        success: false,
        error: error.response.data.detail || 'AI service error',
        fallback: "I'm experiencing technical difficulties. Please try again in a moment."
      });
    } else if (error.code === 'ECONNREFUSED' || error.code === 'TIMEOUT') {
      // Connection error
      res.status(503).json({
        success: false,
        error: 'AI service unavailable',
        fallback: "I'm currently offline. Please try again later."
      });
    } else {
      // Unknown error
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        fallback: "Something went wrong. Please try again."
      });
    }
  }
};

// Get conversation history
export const getChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ 
        success: false,
        error: 'Session ID is required' 
      });
    }

    const response = await axios.get(`${AI_SERVICE_URL}/api/chatbot/history/${sessionId}`, {
      timeout: 10000
    });

    res.status(200).json({
      success: true,
      data: {
        messages: response.data.messages || []
      }
    });

  } catch (error) {
    console.error('❌ Chat history error:', error.message);
    
    if (error.response?.status === 404) {
      res.status(200).json({
        success: true,
        data: { messages: [] }
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch conversation history',
        data: { messages: [] }
      });
    }
  }
};

// Clear conversation
export const clearConversation = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ 
        success: false,
        error: 'Session ID is required' 
      });
    }

    await axios.delete(`${AI_SERVICE_URL}/api/chatbot/conversation/${sessionId}`, {
      timeout: 10000
    });

    res.status(200).json({
      success: true,
      message: 'Conversation cleared successfully'
    });

  } catch (error) {
    console.error('❌ Clear conversation error:', error.message);
    
    res.status(500).json({
      success: false,
      error: 'Failed to clear conversation'
    });
  }
};

// Health check for Bobby
export const bobbyHealthCheck = async (req, res) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/api/chatbot/health`, {
      timeout: 5000
    });

    res.status(200).json({
      success: true,
      data: {
        bobby_status: 'healthy',
        ai_service: response.data,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Bobby health check failed:', error.message);
    
    res.status(503).json({
      success: false,
      error: 'Bobby AI service unavailable',
      data: {
        bobby_status: 'unhealthy',
        timestamp: new Date().toISOString()
      }
    });
  }
};