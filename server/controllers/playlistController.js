const Playlist = require('../models/Playlist');
const Song = require('../models/Song');
const User = require('../models/User');

// @desc    Get all user playlists
// @route   GET /api/playlists
// @access  Private
const getPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(playlists);
  } catch (error) {
    console.error('Error fetching playlists:', error);
    res.status(500).json({ message: 'Server error retrieving playlists' });
  }
};

// @desc    Get playlist details by id
// @route   GET /api/playlists/:id
// @access  Private
const getPlaylistById = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id).populate('songs');
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // Verify ownership or check if it has a shareToken (we allow shared viewing)
    if (playlist.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this playlist' });
    }

    res.json(playlist);
  } catch (error) {
    console.error('Error fetching playlist:', error);
    res.status(500).json({ message: 'Server error retrieving playlist' });
  }
};

// @desc    Create a playlist
// @route   POST /api/playlists
// @access  Private
const createPlaylist = async (req, res) => {
  const { name, description, coverImage } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Playlist name is required' });
  }

  try {
    const playlist = await Playlist.create({
      name,
      description: description || '',
      coverImage: coverImage || '',
      userId: req.user._id,
      songs: []
    });

    // Add to user's playlists list
    await User.findByIdAndUpdate(req.user._id, {
      $push: { playlists: playlist._id }
    });

    res.status(201).json(playlist);
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).json({ message: 'Server error creating playlist' });
  }
};

// @desc    Update a playlist
// @route   PUT /api/playlists/:id
// @access  Private
const updatePlaylist = async (req, res) => {
  const { name, description, coverImage } = req.body;

  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // Check ownership
    if (playlist.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this playlist' });
    }

    playlist.name = name || playlist.name;
    playlist.description = description !== undefined ? description : playlist.description;
    playlist.coverImage = coverImage !== undefined ? coverImage : playlist.coverImage;

    const updatedPlaylist = await playlist.save();
    res.json(updatedPlaylist);
  } catch (error) {
    console.error('Error updating playlist:', error);
    res.status(500).json({ message: 'Server error updating playlist details' });
  }
};

// @desc    Delete a playlist
// @route   DELETE /api/playlists/:id
// @access  Private
const deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // Check ownership
    if (playlist.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this playlist' });
    }

    await playlist.deleteOne();

    // Pull from user's playlists list
    await User.findByIdAndUpdate(playlist.userId, {
      $pull: { playlists: req.params.id }
    });

    res.json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    console.error('Error deleting playlist:', error);
    res.status(500).json({ message: 'Server error deleting playlist' });
  }
};

// @desc    Add a song to a playlist
// @route   POST /api/playlists/:id/songs
// @access  Private
const addSongToPlaylist = async (req, res) => {
  const { songId } = req.body;

  if (!songId) {
    return res.status(400).json({ message: 'songId is required' });
  }

  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // Check ownership
    if (playlist.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this playlist' });
    }

    // Verify song exists
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    // Check if song already in playlist
    if (playlist.songs.includes(songId)) {
      return res.status(400).json({ message: 'Song already in this playlist' });
    }

    playlist.songs.push(songId);
    await playlist.save();
    
    const updatedPlaylist = await Playlist.findById(playlist._id).populate('songs');
    res.json(updatedPlaylist);
  } catch (error) {
    console.error('Error adding song to playlist:', error);
    res.status(500).json({ message: 'Server error adding song' });
  }
};

// @desc    Remove a song from a playlist
// @route   DELETE /api/playlists/:id/songs/:sid
// @access  Private
const removeSongFromPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // Check ownership
    if (playlist.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this playlist' });
    }

    const songId = req.params.sid;
    const songIndex = playlist.songs.indexOf(songId);

    if (songIndex === -1) {
      return res.status(404).json({ message: 'Song not found in this playlist' });
    }

    playlist.songs.splice(songIndex, 1);
    await playlist.save();

    const updatedPlaylist = await Playlist.findById(playlist._id).populate('songs');
    res.json(updatedPlaylist);
  } catch (error) {
    console.error('Error removing song from playlist:', error);
    res.status(500).json({ message: 'Server error removing song' });
  }
};

// @desc    Get shared playlist details by token (Public access)
// @route   GET /api/playlists/share/:token
// @access  Public
const getSharedPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ shareToken: req.params.token })
      .populate('songs')
      .populate('userId', 'username');

    if (!playlist) {
      return res.status(404).json({ message: 'Shared playlist not found' });
    }

    res.json(playlist);
  } catch (error) {
    console.error('Error fetching shared playlist:', error);
    res.status(500).json({ message: 'Server error retrieving shared playlist' });
  }
};

module.exports = {
  getPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  getSharedPlaylist
};
