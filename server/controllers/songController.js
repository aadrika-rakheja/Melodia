const Song = require('../models/Song');
const User = require('../models/User');
const Playlist = require('../models/Playlist');

// @desc    Get all songs with filtering & search
// @route   GET /api/songs
// @access  Private
const getSongs = async (req, res) => {
  try {
    const { search, genre, artist, mood, duration } = req.query;
    let query = {};

    // Real-time Search by title, artist, or genre
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { artist: { $regex: search, $options: 'i' } },
        { genre: { $regex: search, $options: 'i' } }
      ];
    }

    // Genre filter
    if (genre && genre !== 'All') {
      query.genre = genre;
    }

    // Artist filter
    if (artist) {
      query.artist = { $regex: artist, $options: 'i' };
    }

    // Mood filter
    if (mood) {
      query.mood = mood;
    }

    // Duration filter
    // e.g. "short" (< 3 mins), "medium" (3-5 mins), "long" (> 5 mins)
    if (duration) {
      if (duration === 'short') {
        query.duration = { $lt: 180 };
      } else if (duration === 'medium') {
        query.duration = { $gte: 180, $lte: 300 };
      } else if (duration === 'long') {
        query.duration = { $gt: 300 };
      }
    }

    const songs = await Song.find(query).sort({ createdAt: -1 });
    res.json(songs);
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).json({ message: 'Server error retrieving song list' });
  }
};

// @desc    Get a single song
// @route   GET /api/songs/:id
// @access  Private
const getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (song) {
      res.json(song);
    } else {
      res.status(404).json({ message: 'Song not found' });
    }
  } catch (error) {
    console.error('Error fetching song:', error);
    res.status(500).json({ message: 'Server error retrieving song details' });
  }
};

// @desc    Create a new song (Admin only)
// @route   POST /api/songs
// @access  Private/Admin
const createSong = async (req, res) => {
  const { title, artist, album, genre, mood, duration, audioUrl, coverImage } = req.body;

  if (!title || !artist || !genre || !duration || !audioUrl) {
    return res.status(400).json({ message: 'Title, artist, genre, duration, and audioUrl are required' });
  }

  try {
    const song = await Song.create({
      title,
      artist,
      album: album || '',
      genre,
      mood: mood || 'calm',
      duration: Number(duration),
      audioUrl,
      coverImage: coverImage || '',
      uploadedBy: req.user._id
    });

    res.status(201).json(song);
  } catch (error) {
    console.error('Error creating song:', error);
    res.status(500).json({ message: 'Server error creating song records' });
  }
};

// @desc    Delete a song (Admin only)
// @route   DELETE /api/songs/:id
// @access  Private/Admin
const deleteSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (song) {
      await song.deleteOne();

      // Remove from all user likedLists
      await User.updateMany(
        { likedSongs: req.params.id },
        { $pull: { likedSongs: req.params.id } }
      );

      // Remove from all playlists
      await Playlist.updateMany(
        { songs: req.params.id },
        { $pull: { songs: req.params.id } }
      );

      res.json({ message: 'Song deleted successfully' });
    } else {
      res.status(404).json({ message: 'Song not found' });
    }
  } catch (error) {
    console.error('Error deleting song:', error);
    res.status(500).json({ message: 'Server error deleting song' });
  }
};

// @desc    Toggle like status of a song
// @route   POST /api/songs/:id/like
// @access  Private
const toggleLikeSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    const user = await User.findById(req.user._id);
    const likeIndex = user.likedSongs.indexOf(song._id);

    let liked = false;

    if (likeIndex !== -1) {
      // Unlike
      user.likedSongs.splice(likeIndex, 1);
      song.likeCount = Math.max(0, song.likeCount - 1);
      liked = false;
    } else {
      // Like
      user.likedSongs.push(song._id);
      song.likeCount += 1;
      liked = true;
    }

    await user.save();
    await song.save();

    res.json({ liked, likeCount: song.likeCount });
  } catch (error) {
    console.error('Error toggling song like:', error);
    res.status(500).json({ message: 'Server error updating like status' });
  }
};

module.exports = {
  getSongs,
  getSongById,
  createSong,
  deleteSong,
  toggleLikeSong
};
