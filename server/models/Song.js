const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Song title is required'],
    trim: true,
    index: true
  },
  artist: {
    type: String,
    required: [true, 'Artist is required'],
    trim: true,
    index: true
  },
  album: {
    type: String,
    trim: true,
    default: ''
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    trim: true,
    index: true
  },
  mood: {
    type: String,
    enum: ['happy', 'sad', 'energetic', 'calm', 'focus', 'relaxed'],
    default: 'calm',
    index: true
  },
  duration: {
    type: Number,
    required: [true, 'Song duration is required'] // in seconds
  },
  audioUrl: {
    type: String,
    required: [true, 'Audio URL is required'] // Firebase URL
  },
  coverImage: {
    type: String,
    default: '' // Firebase URL
  },
  playCount: {
    type: Number,
    default: 0
  },
  likeCount: {
    type: Number,
    default: 0
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Song', songSchema);
