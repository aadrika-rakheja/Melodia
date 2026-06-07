import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';

// Fetch all playlists
export const fetchPlaylists = createAsyncThunk('playlist/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/playlists');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch playlists');
  }
});

// Fetch detailed playlist
export const fetchPlaylistById = createAsyncThunk('playlist/fetchById', async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/playlists/${id}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch playlist details');
  }
});

// Create new playlist
export const createPlaylist = createAsyncThunk('playlist/create', async (playlistData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/playlists', playlistData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create playlist');
  }
});

// Delete playlist
export const deletePlaylist = createAsyncThunk('playlist/delete', async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/playlists/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete playlist');
  }
});

// Add song to playlist
export const addSongToPlaylist = createAsyncThunk('playlist/addSong', async ({ id, songId }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/playlists/${id}/songs`, { songId });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add song to playlist');
  }
});

// Remove song from playlist
export const removeSongFromPlaylist = createAsyncThunk('playlist/removeSong', async ({ id, songId }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete(`/playlists/${id}/songs/${songId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to remove song');
  }
});

const initialState = {
  playlists: [],
  activePlaylist: null,
  loading: false,
  error: null,
};

const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    clearActivePlaylist: (state) => {
      state.activePlaylist = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch playlists
      .addCase(fetchPlaylists.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPlaylists.fulfilled, (state, action) => {
        state.loading = false;
        state.playlists = action.payload;
      })
      .addCase(fetchPlaylists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single playlist
      .addCase(fetchPlaylistById.pending, (state) => {
        state.loading = true;
        state.activePlaylist = null;
      })
      .addCase(fetchPlaylistById.fulfilled, (state, action) => {
        state.loading = false;
        state.activePlaylist = action.payload;
      })
      .addCase(fetchPlaylistById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create playlist
      .addCase(createPlaylist.fulfilled, (state, action) => {
        state.playlists.unshift(action.payload);
      })
      // Delete playlist
      .addCase(deletePlaylist.fulfilled, (state, action) => {
        state.playlists = state.playlists.filter(p => p._id !== action.payload);
        if (state.activePlaylist?._id === action.payload) {
          state.activePlaylist = null;
        }
      })
      // Add/Remove songs updates active playlist
      .addCase(addSongToPlaylist.fulfilled, (state, action) => {
        state.activePlaylist = action.payload;
      })
      .addCase(removeSongFromPlaylist.fulfilled, (state, action) => {
        state.activePlaylist = action.payload;
      });
  }
});

export const { clearActivePlaylist } = playlistSlice.actions;
export default playlistSlice.reducer;
