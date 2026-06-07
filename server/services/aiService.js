const ListeningHistory = require('../models/ListeningHistory');
const Song = require('../models/Song');
const User = require('../models/User');

const generateAIPlaylist = async (userId) => {
  try {
    // 1. Fetch User Data & History
    const user = await User.findById(userId).populate('likedSongs');
    if (!user) {
      throw new Error('User not found');
    }

    const history = await ListeningHistory.find({ userId })
      .populate('songId')
      .sort({ playedAt: -1 })
      .limit(30);

    const likedSongIds = new Set(user.likedSongs.map(s => s._id.toString()));
    
    // 2. Count genre, artist, and mood affinity
    const genreCounts = {};
    const artistCounts = {};
    const moodCounts = {};

    // Weight recent history (more recent plays have higher weights)
    history.forEach((h, index) => {
      if (!h.songId) return;
      const weight = (30 - index) / 30; // 1.0 down to 0.03
      const { genre, artist, mood } = h.songId;
      
      if (genre) genreCounts[genre] = (genreCounts[genre] || 0) + weight;
      if (artist) artistCounts[artist] = (artistCounts[artist] || 0) + weight;
      if (mood) moodCounts[mood] = (moodCounts[mood] || 0) + weight;
    });

    // Include liked songs in weights (high priority)
    user.likedSongs.forEach(s => {
      if (s.genre) genreCounts[s.genre] = (genreCounts[s.genre] || 0) + 1.5;
      if (s.artist) artistCounts[s.artist] = (artistCounts[s.artist] || 0) + 1.5;
      if (s.mood) moodCounts[s.mood] = (moodCounts[s.mood] || 0) + 1.5;
    });

    // 3. Score all songs in database
    const allSongs = await Song.find({});
    
    // If database is empty, return empty list
    if (allSongs.length === 0) {
      return [];
    }

    const scoredSongs = allSongs.map(song => {
      let score = 0;
      const songIdStr = song._id.toString();

      // Avoid recommending songs played in the last 5 plays (negative weight)
      const playIndex = history.slice(0, 5).findIndex(h => h.songId && h.songId._id.toString() === songIdStr);
      if (playIndex !== -1) {
        score -= 5;
      }

      // Liked songs get a slight boost but we want discovery too
      if (likedSongIds.has(songIdStr)) {
        score += 2;
      }

      // Genre alignment score
      if (genreCounts[song.genre]) {
        score += genreCounts[song.genre] * 2;
      }

      // Artist alignment score
      if (artistCounts[song.artist]) {
        score += artistCounts[song.artist] * 3;
      }

      // Mood alignment score
      if (song.mood && moodCounts[song.mood]) {
        score += moodCounts[song.mood] * 1.5;
      }

      // Add a small random factor to ensure fresh recommendations and discovery
      score += Math.random() * 0.5;

      return { song, score };
    });

    // Sort by score descending
    scoredSongs.sort((a, b) => b.score - a.score);

    // Return the top 15 songs
    return scoredSongs.slice(0, 15).map(item => item.song);
  } catch (error) {
    console.error('Error generating AI playlist:', error);
    throw error;
  }
};

module.exports = { generateAIPlaylist };
