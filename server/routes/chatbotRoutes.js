// /server/routes/chatbotRoutes.js
import express from 'express';
import { 
  chatWithBobby, 
  getChatHistory, 
  clearConversation, 
  bobbyHealthCheck 
} from '../controllers/chatbotController.js';
import { 
  chatbotRateLimit, 
  validateChatRequest, 
  logChatbotRequest 
} from '../middlewares/chatbotMiddleware.js';

const router = express.Router();

// @route   POST /api/chatbot/chat
// @desc    Chat with Bobby AI assistant
// @access  Public
router.post('/chat', chatbotRateLimit, validateChatRequest, logChatbotRequest, chatWithBobby);

// @route   GET /api/chatbot/history/:sessionId
// @desc    Get conversation history for a session
// @access  Public
router.get('/history/:sessionId', getChatHistory);

// @route   DELETE /api/chatbot/conversation/:sessionId
// @desc    Clear conversation for a session
// @access  Public
router.delete('/conversation/:sessionId', clearConversation);

// @route   GET /api/chatbot/health
// @desc    Check Bobby AI service health
// @access  Public
router.get('/health', bobbyHealthCheck);

export default router;