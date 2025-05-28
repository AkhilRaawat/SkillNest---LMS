import express from 'express';
import aiController from '../controllers/aiController.js'; // Note the .js extension

const router = express.Router();

router.post('/generate-quiz', aiController.generateQuiz.bind(aiController));
router.get('/health', aiController.healthCheck.bind(aiController));

export default router;