import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentSong: null,
  queue: [],
  isPlaying: false,
  volume: 0.8,
  progress: 0,
  shuffle: false,
  repeat: 'none', // 'none' | 'one' | 'all'
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setCurrentSong: (state, action) => {
      state.currentSong = action.payload;
      state.isPlaying = true;
    },
    setQueue: (state, action) => {
      state.queue = action.payload;
    },
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
    setVolume: (state, action) => {
      state.volume = action.payload;
    },
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
    toggleShuffle: (state) => {
      state.shuffle = !state.shuffle;
    },
    setRepeat: (state, action) => {
      state.repeat = action.payload; // 'none', 'one', 'all'
    },
    nextSong: (state) => {
      if (state.queue.length === 0) return;
      const currentIndex = state.queue.findIndex(s => s._id === state.currentSong?._id);
      
      if (currentIndex === -1) {
        state.currentSong = state.queue[0];
      } else if (state.shuffle) {
        const randomIndex = Math.floor(Math.random() * state.queue.length);
        state.currentSong = state.queue[randomIndex];
      } else if (currentIndex < state.queue.length - 1) {
        state.currentSong = state.queue[currentIndex + 1];
      } else if (state.repeat === 'all') {
        state.currentSong = state.queue[0];
      } else {
        state.isPlaying = false;
      }
    },
    prevSong: (state) => {
      if (state.queue.length === 0) return;
      const currentIndex = state.queue.findIndex(s => s._id === state.currentSong?._id);
      
      if (currentIndex > 0) {
        state.currentSong = state.queue[currentIndex - 1];
      } else if (state.repeat === 'all') {
        state.currentSong = state.queue[state.queue.length - 1];
      }
    }
  }
});

export const {
  setCurrentSong,
  setQueue,
  togglePlay,
  setIsPlaying,
  setVolume,
  setProgress,
  toggleShuffle,
  setRepeat,
  nextSong,
  prevSong
} = playerSlice.actions;

export default playerSlice.reducer;
