import express from 'express';
import {
  initializeShowcaseData,
  getAvailableVideos,
  generateSummary,
  askQuestion,
  getQuestionHistory,
  getUserSummaries,
  healthCheck
} from '../controllers/videoAiController.js';

const videoAiRouter = express.Router();

// Health check
videoAiRouter.get('/health', healthCheck);

// Showcase initialization (run once to seed data)
videoAiRouter.post('/initialize-showcase', initializeShowcaseData);

// Get available videos for showcase
videoAiRouter.get('/videos', getAvailableVideos);

// AI features
videoAiRouter.post('/summarize', generateSummary);
videoAiRouter.post('/ask-question', askQuestion);

// User history
videoAiRouter.get('/questions/:videoId', getQuestionHistory);
videoAiRouter.get('/summaries/:videoId', getUserSummaries);

export default videoAiRouter;