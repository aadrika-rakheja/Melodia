const express = require('express');
const router = express.Router();
const { logHistory } = require('../controllers/historyController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, logHistory);

module.exports = router;
