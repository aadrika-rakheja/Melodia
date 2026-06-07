const express = require('express');
const router = express.Router();
const { getAIRecommendations, acceptAIRecommendations } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.get('/recommend', protect, getAIRecommendations);
router.post('/accept', protect, acceptAIRecommendations);

module.exports = router;
