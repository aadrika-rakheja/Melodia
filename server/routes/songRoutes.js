const express = require('express');
const router = express.Router();
const { getSongs, getSongById, createSong, deleteSong, toggleLikeSong } = require('../controllers/songController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, getSongs);
router.get('/:id', protect, getSongById);
router.post('/', protect, adminOnly, createSong);
router.delete('/:id', protect, adminOnly, deleteSong);
router.post('/:id/like', protect, toggleLikeSong);

module.exports = router;
