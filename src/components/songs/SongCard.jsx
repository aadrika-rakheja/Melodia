import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentSong, setQueue } from '../../features/playerSlice';

const SongCard = ({ song, listContext = [] }) => {
  const dispatch = useDispatch();
  const currentSong = useSelector((state) => state.player.currentSong);
  const isPlaying = useSelector((state) => state.player.isPlaying);

  const isCurrent = currentSong && currentSong._id === song._id;

  const handlePlayClick = (e) => {
    e.stopPropagation();

    // Set the current track
    dispatch(setCurrentSong(song));

    // If a list context was supplied, load it as the queue
    if (listContext.length > 0) {
      dispatch(setQueue(listContext));
    } else {
      dispatch(setQueue([song]));
    }
  };

  return (
    <div className="group bg-surface-container-low/40 border border-white/5 p-4 rounded-2xl hover:bg-surface-container/60 hover:border-white/10 transition-all duration-300 shadow-md cursor-pointer select-none">
      {/* Cover Image Wrapper */}
      <div className="aspect-square w-full rounded-xl overflow-hidden mb-4 relative bg-surface-container-high">
        <img
          src={song.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564'}
          alt={song.title}
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
              {isCurrent && isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>
        </div>
      </div>

      {/* Track info text */}
      <h3 className={`font-headline-sm text-[15px] truncate font-semibold leading-tight ${isCurrent ? 'text-primary' : 'text-on-surface'}`}>
        {song.title}
      </h3>
      <p className="font-body-sm text-[12px] text-on-surface-variant truncate mt-1">
        {song.artist}
      </p>
    </div>
  );
};

export default SongCard;
