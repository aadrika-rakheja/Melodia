import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';

// Fetch user liked songs (by loading user details or filter songs by liked)
export const fetchLibraryData = createAsyncThunk('library/fetchData', async (_, { rejectWithValue }) => {
  try {
    // We load user details to get likedSongs, recentlyPlayed, playlists list
    const response = await axiosInstance.get('/auth/me');
    
    // We can also fetch the full Song metadata of liked songs and recently played
    // To do this, let's fetch all songs and filter them on the client,
    // or let's create a combined user profile load.
    // For convenience, let's query all songs and filter liked songs
    const songsResponse = await axiosInstance.get('/songs');
    const allSongs = songsResponse.data;
    
    const likedSongs = allSongs.filter(song => response.data.likedSongs.includes(song._id));
    const recentlyPlayed = response.data.recentlyPlayed.map(id => allSongs.find(s => s._id === id)).filter(Boolean);

    return {
      likedSongs,
      recentlyPlayed,
      userPlaylists: response.data.playlists
    };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch library data');
  }
});

// Toggle song like from catalog
export const toggleLikeSongInLibrary = createAsyncThunk('library/toggleLike', async (song, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/songs/${song._id}/like`);
    return { song, liked: response.data.liked };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to toggle like');
  }
});

// Log track history on server
export const logTrackPlayback = createAsyncThunk('library/logHistory', async ({ songId, duration, completed }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/history', { songId, duration, completed });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to log playback history');
  }
});

// Fetch AI recommendations
export const fetchAIRecommendations = createAsyncThunk('library/fetchAI', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/ai/recommend');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to generate recommendations');
  }
});

// Save AI recommendations
export const saveAIRecommendations = createAsyncThunk('library/saveAI', async ({ name, songIds }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/ai/accept', { name, songIds });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to save recommendations');
  }
});

const initialState = {
  likedSongs: [],
  recentlyPlayed: [],
  aiRecommendations: [],
  loading: false,
  error: null,
};

const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
    addRecentlyPlayedLocal: (state, action) => {
      // Add recently played song to local state immediately
      const song = action.payload;
      state.recentlyPlayed = state.recentlyPlayed.filter(s => s._id !== song._id);
      state.recentlyPlayed.unshift(song);
      if (state.recentlyPlayed.length > 15) {
        state.recentlyPlayed = state.recentlyPlayed.slice(0, 15);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch library data
      .addCase(fetchLibraryData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLibraryData.fulfilled, (state, action) => {
        state.loading = false;
        state.likedSongs = action.payload.likedSongs;
        state.recentlyPlayed = action.payload.recentlyPlayed;
      })
      .addCase(fetchLibraryData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle like in library
      .addCase(toggleLikeSongInLibrary.fulfilled, (state, action) => {
        const { song, liked } = action.payload;
        if (liked) {
          // If liked, push it to liked list
          if (!state.likedSongs.some(s => s._id === song._id)) {
            state.likedSongs.unshift(song);
          }
        } else {
          // If unliked, remove it
          state.likedSongs = state.likedSongs.filter(s => s._id !== song._id);
        }
      })
      // Fetch AI recommendations
      .addCase(fetchAIRecommendations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAIRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.aiRecommendations = action.payload;
      })
      .addCase(fetchAIRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { addRecentlyPlayedLocal } = librarySlice.actions;
export default librarySlice.reducer;
