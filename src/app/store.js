import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import playerReducer from '../features/playerSlice';
import playlistReducer from '../features/playlistSlice';
import libraryReducer from '../features/librarySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    player: playerReducer,
    playlist: playlistReducer,
    library: libraryReducer,
  },
});
