const express = require('express');
const router = express.Router();
const {
  getPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  getSharedPlaylist
} = require('../controllers/playlistController');
const { protect } = require('../middleware/authMiddleware');

// Public access shared playlist (does not require auth)
router.get('/share/:token', getSharedPlaylist);

// Protected playlist CRUD
router.get('/', protect, getPlaylists);
router.get('/:id', protect, getPlaylistById);
router.post('/', protect, createPlaylist);
router.put('/:id', protect, updatePlaylist);
router.delete('/:id', protect, deletePlaylist);

// Modify songs inside playlist
router.post('/:id/songs', protect, addSongToPlaylist);
router.delete('/:id/songs/:sid', protect, removeSongFromPlaylist);

module.exports = router;
