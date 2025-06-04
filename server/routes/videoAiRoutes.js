import express from 'express';
import {
  initializeShowcaseData,
  getAvailableVideos,
  getVideoSummary,
  askQuestion,
  getQuestionHistory,
  getUserSummaries,
  healthCheck,
  uploadTranscript
} from '../controllers/videoAiController.js';

const videoAiRouter = express.Router();

// Health check
videoAiRouter.get('/health', healthCheck);

// Showcase initialization (run once to seed data)
videoAiRouter.post('/initialize-showcase', initializeShowcaseData);

// Get available videos for showcase
videoAiRouter.get('/videos', getAvailableVideos);

// Upload transcript
videoAiRouter.post('/upload-transcript', uploadTranscript);

// AI features
videoAiRouter.post('/summarize/:videoId', getVideoSummary);
videoAiRouter.post('/ask-question/:videoId', askQuestion);

// User history
videoAiRouter.get('/questions/:videoId', getQuestionHistory);
videoAiRouter.get('/summaries/:videoId', getUserSummaries);

// Error handling middleware
videoAiRouter.use((err, req, res, next) => {
  console.error('Video AI Router Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

export default videoAiRouter;