// /server/middlewares/chatbotMiddleware.js
import rateLimit from 'express-rate-limit';

// Rate limiting for chatbot to prevent abuse
export const chatbotRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit each session to 30 requests per minute
  message: {
    success: false,
    error: 'Too many messages sent. Please wait a moment before sending another message.',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Use sessionId from request body for rate limiting
  keyGenerator: (req) => {
    return req.body?.sessionId || req.ip;
  }
});

// Validate chat request
export const validateChatRequest = (req, res, next) => {
  const { message, sessionId } = req.body;

  // Check if required fields are present
  if (!message || !sessionId) {
    return res.status(400).json({
      success: false,
      error: 'Message and sessionId are required'
    });
  }

  // Validate message length
  if (typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Message must be a non-empty string'
    });
  }

  if (message.length > 1000) {
    return res.status(400).json({
      success: false,
      error: 'Message too long. Maximum 1000 characters allowed.'
    });
  }

  // Validate sessionId format
  if (typeof sessionId !== 'string' || sessionId.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'SessionId must be a non-empty string'
    });
  }

  // Sanitize message (basic XSS prevention)
  req.body.message = message.trim();
  req.body.sessionId = sessionId.trim();

  next();
};

// Log chatbot requests for monitoring
export const logChatbotRequest = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const { sessionId, message } = req.body;
  
  console.log(`[${timestamp}] 🤖 Bobby Chat Request:`);
  console.log(`  Session: ${sessionId}`);
  console.log(`  Message: ${message?.substring(0, 100)}${message?.length > 100 ? '...' : ''}`);
  console.log(`  IP: ${req.ip}`);
  
  next();
};

// Handle chatbot errors consistently
export const handleChatbotError = (error, req, res, next) => {
  console.error('🚨 Chatbot Error:', error);

  // If response already sent, delegate to default Express error handler
  if (res.headersSent) {
    return next(error);
  }

  // Send consistent error response
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    fallback: "I'm having trouble processing your request. Please try again."
  });
};