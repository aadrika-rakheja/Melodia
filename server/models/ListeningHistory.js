const mongoose = require('mongoose');

const listeningHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  songId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song',
    required: true
  },
  playedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  duration: {
    type: Number,
    required: true // Time in seconds user listened to the song
  },
  completed: {
    type: Boolean,
    default: false // Set to true if duration >= 80% of song length
  }
});

module.exports = mongoose.model('ListeningHistory', listeningHistorySchema);
