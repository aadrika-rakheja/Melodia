const mongoose = require('mongoose');
const crypto = require('crypto');

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Playlist name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  coverImage: {
    type: String,
    default: ''
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  songs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song'
  }],
  isAIGenerated: {
    type: Boolean,
    default: false
  },
  shareToken: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Generate shareToken before saving if it doesn't exist
playlistSchema.pre('save', function (next) {
  if (!this.shareToken) {
    this.shareToken = crypto.randomBytes(16).toString('hex');
  }
  next();
});

module.exports = mongoose.model('Playlist', playlistSchema);
