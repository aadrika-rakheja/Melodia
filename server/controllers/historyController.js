const ListeningHistory = require('../models/ListeningHistory');
const Song = require('../models/Song');
const User = require('../models/User');

// @desc    Log a listening event
// @route   POST /api/history
// @access  Private
const logHistory = async (req, res) => {
  const { songId, duration, completed } = req.body;

  if (!songId || duration === undefined) {
    return res.status(400).json({ message: 'songId and duration are required' });
  }

  try {
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    // Save listening history entry
    const entry = await ListeningHistory.create({
      userId: req.user._id,
      songId,
      duration: Number(duration),
      completed: !!completed
    });

    // If completed (>80% duration or explicitly completed), increment playCount
    if (completed) {
      song.playCount += 1;
      await song.save();
    }

    // Update User's recently played tracks (max 15 tracks)
    const user = await User.findById(req.user._id);
    
    // Pull song if already in recently played to shift it to the front
    user.recentlyPlayed = user.recentlyPlayed.filter(id => id.toString() !== songId.toString());
    
    // Add to front of array
    user.recentlyPlayed.unshift(songId);

    // Keep size limited to 15
    if (user.recentlyPlayed.length > 15) {
      user.recentlyPlayed = user.recentlyPlayed.slice(0, 15);
    }

    await user.save();

    res.status(201).json(entry);
  } catch (error) {
    console.error('Error logging listening history:', error);
    res.status(500).json({ message: 'Server error saving play log' });
  }
};

module.exports = { logHistory };
