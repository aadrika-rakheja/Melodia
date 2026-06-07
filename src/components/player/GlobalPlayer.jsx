import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nextSong, prevSong, setProgress, togglePlay, setVolume, toggleShuffle, setRepeat, setIsPlaying } from '../../features/playerSlice';
import { toggleLikeSongInLibrary, logTrackPlayback } from '../../features/librarySlice';

const GlobalPlayer = () => {
  const dispatch = useDispatch();
  const audioRef = useRef(null);
  
  // Redux state
  const { currentSong, queue, isPlaying, volume, progress, shuffle, repeat } = useSelector((state) => state.player);
  const likedSongs = useSelector((state) => state.library.likedSongs);
  
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.8);
  const [historyLogged, setHistoryLogged] = useState(false);
  const [localProgress, setLocalProgress] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  const isLiked = currentSong && likedSongs.some(s => s._id === currentSong._id);

  // Sync volume with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Sync play/pause with audio element
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.error('Playback failed:', err.message);
        dispatch(setIsPlaying(false));
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong, dispatch]);

  // Reset completion tracking on song change
  useEffect(() => {
    setHistoryLogged(false);
    setLocalProgress(0);
  }, [currentSong]);

  // Track progress and trigger completion logging
  const handleTimeUpdate = () => {
    if (!audioRef.current || isSeeking) return;
    const curTime = audioRef.current.currentTime;
    setLocalProgress(curTime);
    dispatch(setProgress(curTime));

    // If played >80% of song, log listening history once
    if (duration > 0 && !historyLogged && curTime / duration >= 0.8) {
      setHistoryLogged(true);
      dispatch(logTrackPlayback({
        songId: currentSong._id,
        duration: Math.round(curTime),
        completed: true
      }));
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSongEnded = () => {
    // Log final history if not already completed
    if (!historyLogged) {
      dispatch(logTrackPlayback({
        songId: currentSong._id,
        duration: Math.round(audioRef.current.currentTime),
        completed: false
      }));
    }

    if (repeat === 'one') {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      dispatch(nextSong());
    }
  };

  // Format seconds to MM:SS
  const formatTime = (secs) => {
    if (isNaN(secs)) return '0:00';
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeekChange = (e) => {
    setIsSeeking(true);
    setLocalProgress(parseFloat(e.target.value));
  };

  const handleSeekEnd = (e) => {
    setIsSeeking(false);
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
    dispatch(setProgress(newTime));
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      dispatch(setVolume(prevVolume));
    } else {
      setPrevVolume(volume);
      setIsMuted(true);
      dispatch(setVolume(0));
    }
  };

  const handleLikeClick = () => {
    if (currentSong) {
      dispatch(toggleLikeSongInLibrary(currentSong));
    }
  };

  const handlePlayPause = () => {
    if (currentSong) {
      dispatch(togglePlay());
    }
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full h-24 bg-surface-container-low border-t border-white/5 z-50 flex items-center justify-between px-container-padding-mobile md:px-container-padding-desktop">
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={currentSong.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleSongEnded}
        autoPlay
      />

      {/* Left: Track Info */}
      <div className="flex items-center gap-4 w-1/4 min-w-[200px]">
        <img
          src={currentSong.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564'}
          alt={currentSong.title}
          className="w-14 h-14 rounded-lg object-cover bg-surface-container-high"
        />
        <div className="overflow-hidden">
          <h4 className="font-headline-sm text-[16px] text-on-surface truncate leading-tight">{currentSong.title}</h4>
          <p className="font-body-sm text-[13px] text-on-surface-variant truncate mt-0.5">{currentSong.artist}</p>
        </div>
        <button
          onClick={handleLikeClick}
          className="text-on-surface-variant hover:text-[#7c3aed] transition-colors ml-2"
        >
          <span
            className={`material-symbols-outlined text-2xl ${isLiked ? 'material-symbols-filled text-[#7c3aed]' : ''}`}
            style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
        </button>
      </div>

      {/* Center: Controls & Seek */}
      <div className="flex flex-col items-center flex-1 max-w-xl px-4">
        {/* Playback Button Panel */}
        <div className="flex items-center gap-6 mb-2">
          <button
            onClick={() => dispatch(toggleShuffle())}
            className={`text-on-surface-variant hover:text-on-surface transition-colors ${shuffle ? 'text-[#7c3aed]' : ''}`}
          >
            <span className="material-symbols-outlined text-xl">shuffle</span>
          </button>
          
          <button
            onClick={() => dispatch(prevSong())}
            className="text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>skip_previous</span>
          </button>

          <button
            onClick={handlePlayPause}
            className="w-10 h-10 rounded-full bg-on-surface text-background flex items-center justify-center hover:scale-105 transition-transform active:scale-95 shadow-md"
          >
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>

          <button
            onClick={() => dispatch(nextSong())}
            className="text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>skip_next</span>
          </button>

          <button
            onClick={() => {
              if (repeat === 'none') dispatch(setRepeat('all'));
              else if (repeat === 'all') dispatch(setRepeat('one'));
              else dispatch(setRepeat('none'));
            }}
            className={`text-on-surface-variant hover:text-on-surface transition-colors relative ${repeat !== 'none' ? 'text-[#7c3aed]' : ''}`}
          >
            <span className="material-symbols-outlined text-xl">repeat</span>
            {repeat === 'one' && (
              <span className="absolute -top-1 -right-1 text-[8px] bg-[#7c3aed] text-white px-0.5 rounded-full leading-none font-bold">1</span>
            )}
          </button>
        </div>

        {/* Seekbar navigation */}
        <div className="flex items-center gap-3 w-full font-label-sm text-label-sm text-on-surface-variant">
          <span>{formatTime(localProgress)}</span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={localProgress}
            onChange={handleSeekChange}
            onMouseUp={handleSeekEnd}
            onTouchEnd={handleSeekEnd}
            className="flex-1 h-1 rounded-full bg-surface-variant accent-[#7c3aed] cursor-pointer hover:h-1.5 transition-all"
            style={{
              background: `linear-gradient(to right, #7c3aed 0%, #7c3aed ${(localProgress / (duration || 1)) * 100}%, #31353b ${(localProgress / (duration || 1)) * 100}%, #31353b 100%)`
            }}
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: Audio Volume and Utilities */}
      <div className="flex items-center justify-end gap-4 w-1/4 min-w-[150px]">
        <button className="text-on-surface-variant hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined text-xl">mic</span>
        </button>
        <button className="text-on-surface-variant hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined text-xl">queue_music</span>
        </button>
        
        <div className="flex items-center gap-2">
          <button onClick={toggleMute} className="text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-xl">
              {isMuted || volume === 0 ? 'volume_off' : volume < 0.4 ? 'volume_down' : 'volume_up'}
            </span>
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              dispatch(setVolume(val));
              if (val > 0 && isMuted) setIsMuted(false);
            }}
            className="w-20 h-1 rounded-full bg-surface-variant accent-[#7c3aed] cursor-pointer"
            style={{
              background: `linear-gradient(to right, #7c3aed 0%, #7c3aed ${(isMuted ? 0 : volume) * 100}%, #31353b ${(isMuted ? 0 : volume) * 100}%, #31353b 100%)`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default GlobalPlayer;
