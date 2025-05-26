const express = require('express');
const aiController = require('../controllers/aiController');

const router = express.Router();

router.post('/generate-quiz', aiController.generateQuiz);
router.get('/health', aiController.healthCheck);

module.exports = router;