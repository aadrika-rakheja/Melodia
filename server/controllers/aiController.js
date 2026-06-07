const { generateAIPlaylist } = require('../services/aiService');
const AIRecommendation = require('../models/AIRecommendation');
const Playlist = require('../models/Playlist');
const User = require('../models/User');

// @desc    Generate AI recommended tracks
// @route   GET /api/ai/recommend
// @access  Private
const getAIRecommendations = async (req, res) => {
  try {
    const recommendedSongs = await generateAIPlaylist(req.user._id);

    // Save recommendations history in DB
    await AIRecommendation.create({
      userId: req.user._id,
      recommendedSongs: recommendedSongs.map(s => s._id)
    });

    res.json(recommendedSongs);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ message: 'Server error generating AI smart list' });
  }
};

// @desc    Accept recommended songs and save as a playlist
// @route   POST /api/ai/accept
// @access  Private
const acceptAIRecommendations = async (req, res) => {
  const { name, songIds } = req.body;

  if (!name || !songIds || !Array.isArray(songIds)) {
    return res.status(400).json({ message: 'Playlist name and list of songIds are required' });
  }

  try {
    const playlist = await Playlist.create({
      name,
      description: 'AI-generated custom soundscape based on your recent listening history and liked songs.',
      userId: req.user._id,
      songs: songIds,
      isAIGenerated: true,
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop' // Gradient/abstract default cover
    });

    // Add to user's playlist references
    await User.findByIdAndUpdate(req.user._id, {
      $push: { playlists: playlist._id }
    });

    res.status(201).json(playlist);
  } catch (error) {
    console.error('Error saving AI playlist:', error);
    res.status(500).json({ message: 'Server error saving AI playlist' });
  }
};

module.exports = {
  getAIRecommendations,
  acceptAIRecommendations
};
