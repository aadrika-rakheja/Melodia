import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentSong, setQueue } from '../../features/playerSlice';
import axiosInstance from '../../api/axiosInstance';

const PlaylistCard = ({ playlist }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentSong = useSelector((state) => state.player.currentSong);
  const isPlaying = useSelector((state) => state.player.isPlaying);

  const handlePlayClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // Fetch complete playlist details including populated songs
      const response = await axiosInstance.get(`/playlists/${playlist._id}`);
      const fullPlaylist = response.data;

      if (fullPlaylist.songs && fullPlaylist.songs.length > 0) {
        dispatch(setQueue(fullPlaylist.songs));
        dispatch(setCurrentSong(fullPlaylist.songs[0]));
      } else {
        alert('This playlist is empty.');
      }
    } catch (error) {
      console.error('Failed to play playlist:', error);
    }
  };

  return (
    <Link
      to={`/playlists/${playlist._id}`}
      className="group bg-surface-container-low/40 border border-white/5 p-4 rounded-2xl hover:bg-surface-container/60 hover:border-white/10 transition-all duration-300 shadow-md block select-none"
    >
      {/* Cover Artwork */}
      <div className="aspect-square w-full rounded-xl overflow-hidden mb-4 relative bg-surface-container-high">
        <img
          src={playlist.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564'}
          alt={playlist.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={handlePlayClick}
            className="w-12 h-12 rounded-full bg-gradient-primary text-white flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.6)] transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 active:scale-95"
          >
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              play_arrow
            </span>
          </button>
        </div>
      </div>

      {/* Playlist info */}
      <h3 className="font-headline-sm text-[15px] truncate font-semibold leading-tight text-on-surface">
        {playlist.name}
      </h3>
      <p className="font-body-sm text-[12px] text-on-surface-variant truncate mt-1">
        {playlist.description || 'No description provided'}
      </p>
    </Link>
  );
};

export default PlaylistCard;
