import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../api/axiosInstance';
import Layout from '../components/layout/Layout';
import Navbar from '../components/layout/Navbar';
import { setQueue, setCurrentSong, togglePlay } from '../features/playerSlice';

const MoodPlaylist = () => {
  const { mood } = useParams();
  const dispatch = useDispatch();
  const { currentSong, isPlaying } = useSelector(state => state.player);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/songs?mood=${encodeURIComponent(mood)}`);
        setSongs(response.data);
      } catch (err) {
        console.error('Failed to fetch mood songs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, [mood]);

  const handlePlayAll = () => {
    if (songs.length > 0) {
      dispatch(setQueue(songs));
      dispatch(setCurrentSong(songs[0]));
    }
  };

  const handleShufflePlay = () => {
    if (songs.length > 0) {
      const shuffled = [...songs].sort(() => Math.random() - 0.5);
      dispatch(setQueue(shuffled));
      dispatch(setCurrentSong(shuffled[0]));
    }
  };

  const handleTrackClick = (song) => {
    if (currentSong && currentSong._id === song._id) {
      dispatch(togglePlay());
    } else {
      dispatch(setQueue(songs));
      dispatch(setCurrentSong(song));
    }
  };

  const formatDuration = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <Layout>
      <Navbar />
      <div className="flex-1 px-container-padding-mobile md:px-container-padding-desktop pb-8">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <Link to="/explore" className="text-primary hover:underline">← Back to Explore</Link>
            <h1 className="font-headline-md text-[32px] font-bold text-on-surface">{mood.charAt(0).toUpperCase() + mood.slice(1)} Mood</h1>
          </div>
          {songs.length > 0 && (
            <div className="flex gap-2">
              <button onClick={handlePlayAll} className="bg-[#7c3aed] text-white font-label-md text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#8b5cf6] transition-colors">
                Play All
              </button>
              <button onClick={handleShufflePlay} className="border border-white/20 font-label-md text-xs font-semibold px-4 py-2 rounded-full hover:bg-white/5 transition-colors">
                Shuffle
              </button>
            </div>
          )}
          {loading ? (
            <div className="flex justify-center py-6"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
          ) : songs.length === 0 ? (
            <p className="text-center text-on-surface-variant">No songs found for this mood.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {songs.map(song => (
                <div key={song._id} className="glass-panel p-4 rounded-xl flex flex-col cursor-pointer hover:bg-white/5 transition-colors" onClick={() => handleTrackClick(song)}>
                  <img src={song.coverImage} alt={song.title} className="w-full h-48 object-cover rounded-lg mb-2" />
                  <h3 className="font-headline-sm text-on-surface truncate">{song.title}</h3>
                  <p className="text-sm text-on-surface-variant truncate">{song.artist}</p>
                  <p className="text-xs text-on-surface-variant mt-1">{formatDuration(song.duration)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MoodPlaylist;
