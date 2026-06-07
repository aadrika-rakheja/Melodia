const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Song = require('./models/Song');
const User = require('./models/User');

dotenv.config();

const initialSongs = [
  {
    title: 'Neon Nights',
    artist: 'Midnight Synthwave Collective',
    album: 'Neon Lights',
    genre: 'Electronic',
    mood: 'energetic',
    duration: 245,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    coverImage: 'https://picsum.photos/id/1011/600/600'
  },
  {
    title: 'Acoustic Sunrise',
    artist: 'Various Artists',
    album: 'Morning Acoustic',
    genre: 'Acoustic',
    mood: 'calm',
    duration: 215,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    coverImage: 'https://picsum.photos/id/1015/600/600'
  },
  {
    title: 'Deep Focus Studio',
    artist: 'Binaural Beats',
    album: 'Focus Waves',
    genre: 'Ambient',
    mood: 'focus',
    duration: 312,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    coverImage: 'https://picsum.photos/id/1025/600/600'
  },
  {
    title: 'Echoes of Time',
    artist: 'The Horizon Project',
    album: 'Future Past',
    genre: 'Electronic',
    mood: 'focus',
    duration: 285,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    coverImage: 'https://picsum.photos/id/1035/600/600'
  },
  {
    title: 'Midnight Jazz',
    artist: 'Blue Note Ensemble',
    album: 'Late Sessions',
    genre: 'Jazz',
    mood: 'calm',
    duration: 268,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    coverImage: 'https://picsum.photos/id/1040/600/600'
  },
  {
    title: 'Urban Flow',
    artist: 'DJ Kinetic',
    album: 'Street Beats',
    genre: 'Electronic',
    mood: 'energetic',
    duration: 295,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    coverImage: 'https://picsum.photos/id/1049/600/600'
  },
  {
    title: 'Desert Rose',
    artist: 'Acoustic Sessions',
    album: 'Desert Wind',
    genre: 'Acoustic',
    mood: 'sad',
    duration: 185,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverImage: 'https://picsum.photos/id/1056/600/600'
  },
  {
    title: 'Midnight Echoes',
    artist: 'The Synthetics',
    album: 'Retro Wave Vol 1',
    genre: 'Electronic',
    mood: 'calm',
    duration: 372,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    coverImage: 'https://picsum.photos/id/1062/600/600'
  },
  {
    title: 'Urban Drift',
    artist: 'Neon Horizon',
    album: 'City Lights',
    genre: 'Electronic',
    mood: 'focus',
    duration: 423,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    coverImage: 'https://picsum.photos/id/1069/600/600'
  },
  {
    title: 'Pulse Rate',
    artist: 'DJ Velocity',
    album: 'Velocity Shift',
    genre: 'Pop',
    mood: 'energetic',
    duration: 302,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    coverImage: 'https://picsum.photos/id/1074/600/600'
  },
  {
    title: 'Sunset Boulevard',
    artist: 'Golden Horizon',
    album: 'Evening Glow',
    genre: 'Pop',
    mood: 'relaxed',
    duration: 210,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    coverImage: 'https://picsum.photos/id/1084/600/600'
  },
  {
    title: 'Rainy Day Jazz',
    artist: 'Smooth Sax',
    album: 'Rainy Moods',
    genre: 'Jazz',
    mood: 'calm',
    duration: 240,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    coverImage: 'https://picsum.photos/id/1080/600/600'
  },
  {
    title: 'Forest Whisper',
    artist: 'Nature Sounds',
    album: 'Ambient Forest',
    genre: 'Ambient',
    mood: 'focus',
    duration: 300,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
    coverImage: 'https://picsum.photos/id/1081/600/600'
  },
  {
    title: 'City Lights',
    artist: 'Urban Beats',
    album: 'Night Drive',
    genre: 'Electronic',
    mood: 'energetic',
    duration: 260,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
    coverImage: 'https://picsum.photos/id/1082/600/600'
  },
  {
    title: 'Ocean Breeze',
    artist: 'Sea Waves',
    album: 'Relaxing Waves',
    genre: 'Ambient',
    mood: 'calm',
    duration: 280,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
    coverImage: 'https://picsum.photos/id/1083/600/600'
  },
  {
    title: 'Morning Motivation',
    artist: 'Upbeat Pulse',
    album: 'Rise and Shine',
    genre: 'Pop',
    mood: 'energetic',
    duration: 230,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
    coverImage: 'https://picsum.photos/seed/morningmotivation/600/600'
  },
  {
    title: 'Late Night Chill',
    artist: 'Smooth Vibes',
    album: 'Midnight Lounge',
    genre: 'Jazz',
    mood: 'relaxed',
    duration: 250,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3',
    coverImage: 'https://picsum.photos/seed/latenightchill/600/600'
  }, {
    title: 'Golden Horizon',
    artist: 'Skyline Dreams',
    album: 'Sun Chaser',
    genre: 'Pop',
    mood: 'relaxed',
    duration: 225,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverImage: 'https://picsum.photos/id/200/600/600'
  },
  {
    title: 'Electric Dreams',
    artist: 'Nova Pulse',
    album: 'Future Beats',
    genre: 'Electronic',
    mood: 'energetic',
    duration: 245,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    coverImage: 'https://picsum.photos/id/201/600/600'
  },
  {
    title: 'Moonlit Drive',
    artist: 'Night Motion',
    album: 'After Dark',
    genre: 'Electronic',
    mood: 'calm',
    duration: 260,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    coverImage: 'https://picsum.photos/id/202/600/600'
  },
  {
    title: 'Summer Waves',
    artist: 'Coastal Vibes',
    album: 'Ocean Days',
    genre: 'Pop',
    mood: 'relaxed',
    duration: 210,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    coverImage: 'https://picsum.photos/id/203/600/600'
  },
  {
    title: 'Velvet Sky',
    artist: 'Dreamscape',
    album: 'Cloud Atlas',
    genre: 'Ambient',
    mood: 'calm',
    duration: 300,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    coverImage: 'https://picsum.photos/id/204/600/600'
  },
  {
    title: 'Crimson Sunset',
    artist: 'Aurora Lane',
    album: 'Evening Glow',
    genre: 'Acoustic',
    mood: 'sad',
    duration: 240,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    coverImage: 'https://picsum.photos/id/1018/600/600'
  },
  {
    title: 'Silent Reflections',
    artist: 'Piano Stories',
    album: 'Inner Peace',
    genre: 'Ambient',
    mood: 'focus',
    duration: 310,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    coverImage: 'https://picsum.photos/id/206/600/600'
  },
  {
    title: 'Wildfire',
    artist: 'Voltage',
    album: 'Burn Bright',
    genre: 'Rock',
    mood: 'energetic',
    duration: 250,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    coverImage: 'https://picsum.photos/id/1076/600/600'
  },
  {
    title: 'Blue Lagoon',
    artist: 'Oceanic',
    album: 'Sea Breeze',
    genre: 'Ambient',
    mood: 'relaxed',
    duration: 280,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    coverImage: 'https://picsum.photos/id/208/600/600'
  },
  {
    title: 'Northern Lights',
    artist: 'Arctic Pulse',
    album: 'Frozen Dreams',
    genre: 'Electronic',
    mood: 'focus',
    duration: 290,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    coverImage: 'https://picsum.photos/id/209/600/600'
  },
  {
    title: 'Infinite Roads',
    artist: 'Traveller',
    album: 'Open Skies',
    genre: 'Rock',
    mood: 'energetic',
    duration: 235,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    coverImage: 'https://picsum.photos/id/210/600/600'
  },
  {
    title: 'Crystal Rain',
    artist: 'Soft Echo',
    album: 'Rainfall',
    genre: 'Jazz',
    mood: 'calm',
    duration: 270,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    coverImage: 'https://picsum.photos/id/211/600/600'
  },
  {
    title: 'Fading Memories',
    artist: 'Lost Pages',
    album: 'Yesterday',
    genre: 'Acoustic',
    mood: 'sad',
    duration: 220,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
    coverImage: 'https://picsum.photos/id/212/600/600'
  },
  {
    title: 'Dream Chaser',
    artist: 'Rise Up',
    album: 'Motivation',
    genre: 'Pop',
    mood: 'energetic',
    duration: 215,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
    coverImage: 'https://picsum.photos/id/213/600/600'
  },
  {
    title: 'Silver Clouds',
    artist: 'Sky Wanderer',
    album: 'Above Us',
    genre: 'Ambient',
    mood: 'focus',
    duration: 305,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
    coverImage: 'https://picsum.photos/id/214/600/600'
  },
  {
    title: 'Hidden Path',
    artist: 'Forest Trails',
    album: 'Nature Walk',
    genre: 'Acoustic',
    mood: 'relaxed',
    duration: 230,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
    coverImage: 'https://picsum.photos/id/215/600/600'
  },
  {
    title: 'Broken Compass',
    artist: 'Lost Voyage',
    album: 'Wander',
    genre: 'Rock',
    mood: 'sad',
    duration: 255,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverImage: 'https://picsum.photos/id/216/600/600'
  },
  {
    title: 'Aurora Pulse',
    artist: 'Neon Nova',
    album: 'Sky Frequencies',
    genre: 'Electronic',
    mood: 'energetic',
    duration: 245,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    coverImage: 'https://picsum.photos/id/217/600/600'
  },
  {
    title: 'Night Rider',
    artist: 'Midnight Run',
    album: 'City Drive',
    genre: 'Electronic',
    mood: 'focus',
    duration: 275,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    coverImage: 'https://picsum.photos/id/218/600/600'
  },
  {
    title: 'Coffee & Vinyl',
    artist: 'LoFi Lounge',
    album: 'Weekend Mood',
    genre: 'Jazz',
    mood: 'calm',
    duration: 240,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    coverImage: 'https://picsum.photos/id/219/600/600'
  }, {
    title: 'Wandering Soul',
    artist: 'Free Spirit',
    album: 'Open Roads',
    genre: 'Acoustic',
    mood: 'relaxed',
    duration: 228,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    coverImage: 'https://picsum.photos/id/220/600/600'
  },
  {
    title: 'Beyond Tomorrow',
    artist: 'Future State',
    album: 'Horizons',
    genre: 'Electronic',
    mood: 'focus',
    duration: 286,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    coverImage: 'https://picsum.photos/id/221/600/600'
  },
  {
    title: 'Lost in Motion',
    artist: 'Velocity X',
    album: 'Fast Lane',
    genre: 'Rock',
    mood: 'energetic',
    duration: 251,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    coverImage: 'https://picsum.photos/id/222/600/600'
  },
  {
    title: 'Skyline Escape',
    artist: 'Urban Dreamers',
    album: 'City Pulse',
    genre: 'Electronic',
    mood: 'focus',
    duration: 267,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    coverImage: 'https://picsum.photos/id/223/600/600'
  },
  {
    title: 'Parallel Dreams',
    artist: 'Dream Circuit',
    album: 'Alternate Reality',
    genre: 'Ambient',
    mood: 'calm',
    duration: 312,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80'
  },
  {
    title: 'Starlight Journey',
    artist: 'Cosmic Echo',
    album: 'Galaxy Drive',
    genre: 'Ambient',
    mood: 'relaxed',
    duration: 301,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    coverImage: 'https://picsum.photos/id/225/600/600'
  },
  {
    title: 'Open Highway',
    artist: 'Roadside Rebels',
    album: 'Miles Ahead',
    genre: 'Rock',
    mood: 'energetic',
    duration: 243,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    coverImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&q=80'
  },
  {
    title: 'Amber Glow',
    artist: 'Golden Skies',
    album: 'Twilight',
    genre: 'Pop',
    mood: 'relaxed',
    duration: 219,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    coverImage: 'https://picsum.photos/id/227/600/600'
  },
  {
    title: 'Shoreline Stories',
    artist: 'Sea Breeze',
    album: 'Coastal Nights',
    genre: 'Acoustic',
    mood: 'calm',
    duration: 236,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
    coverImage: 'https://picsum.photos/id/228/600/600'
  },
  {
    title: 'Midnight Voyage',
    artist: 'Night Sailor',
    album: 'Dark Waters',
    genre: 'Jazz',
    mood: 'calm',
    duration: 274,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
    coverImage: 'https://picsum.photos/id/229/600/600'
  },
  {
    title: 'Echo Chamber',
    artist: 'Resonance',
    album: 'Reflections',
    genre: 'Electronic',
    mood: 'focus',
    duration: 292,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
    coverImage: 'https://picsum.photos/id/230/600/600'
  },
  {
    title: 'Ocean Lights',
    artist: 'Blue Horizon',
    album: 'Deep Blue',
    genre: 'Ambient',
    mood: 'relaxed',
    duration: 285,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
    coverImage: 'https://picsum.photos/id/231/600/600'
  },
  {
    title: 'Timeless Rhythm',
    artist: 'Soul Collective',
    album: 'Forever Beats',
    genre: 'Jazz',
    mood: 'calm',
    duration: 248,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverImage: 'https://picsum.photos/id/232/600/600'
  },
  {
    title: 'Gravity Falls',
    artist: 'Orbit',
    album: 'Space Motion',
    genre: 'Electronic',
    mood: 'focus',
    duration: 309,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    coverImage: 'https://picsum.photos/id/233/600/600'
  },
  {
    title: 'Cloud Nine',
    artist: 'Skybound',
    album: 'Dream High',
    genre: 'Pop',
    mood: 'energetic',
    duration: 214,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    coverImage: 'https://picsum.photos/id/234/600/600'
  },
  {
    title: 'Velvet Rain',
    artist: 'Soft Storm',
    album: 'Rain Diaries',
    genre: 'Jazz',
    mood: 'sad',
    duration: 261,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    coverImage: 'https://picsum.photos/id/235/600/600'
  },
  {
    title: 'Last Horizon',
    artist: 'Sun Chasers',
    album: 'Golden Endings',
    genre: 'Rock',
    mood: 'relaxed',
    duration: 247,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    coverImage: 'https://picsum.photos/id/236/600/600'
  },
  {
    title: 'Phoenix Rising',
    artist: 'Firebird',
    album: 'Rise Again',
    genre: 'Rock',
    mood: 'energetic',
    duration: 258,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    coverImage: 'https://picsum.photos/id/237/600/600'
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || `mongodb+srv://aadrika20:5xO43ykbjBl69waY@cluster0.ioa4xfk.mongodb.net/melodia?appName=Cluster0`;
    await mongoose.connect(mongoUri);
    console.log('Seed: Connected to MongoDB.');

    // Clear existing songs
    await Song.deleteMany({});
    console.log('Seed: Deleted existing songs.');

    // Insert new songs
    const seededSongs = await Song.insertMany(initialSongs);
    console.log(`Seed: Successfully seeded ${seededSongs.length} songs.`);

    // Set first user to admin role if exists
    const users = await User.find({});
    if (users.length > 0) {
      users[0].role = 'admin';
      await users[0].save();
      console.log(`Seed: Set user ${users[0].username} as admin.`);
    }

    mongoose.connection.close();
    console.log('Seed: Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedDB();
