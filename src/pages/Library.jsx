import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchLibraryData } from '../features/librarySlice';
import { fetchPlaylists } from '../features/playlistSlice';
import { setCurrentSong, setQueue } from '../features/playerSlice';
import Layout from '../components/layout/Layout';
import Navbar from '../components/layout/Navbar';
import PlaylistCard from '../components/playlists/PlaylistCard';
import SongCard from '../components/songs/SongCard';

const Library = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { likedSongs, loading } = useSelector((state) => state.library);
  const { playlists } = useSelector((state) => state.playlist);
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('playlists'); // 'playlists' | 'likes'

  useEffect(() => {
    dispatch(fetchLibraryData());
    dispatch(fetchPlaylists());
  }, [dispatch]);

  const handlePlayLikedSongs = () => {
    if (likedSongs.length > 0) {
      dispatch(setQueue(likedSongs));
      dispatch(setCurrentSong(likedSongs[0]));
    } else {
      alert('Your Liked Songs list is empty.');
    }
  };

  return (
    <Layout>
      <Navbar>
        <div className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant">
          <span className="text-on-surface">Library</span>
          <span className="text-xs">/</span>
          <span>Personal Sanctuary</span>
        </div>
      </Navbar>

      <div className="flex-1 px-container-padding-mobile md:px-container-padding-desktop pb-8">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-8">

          {/* Header Row: Welcome and AI Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
            <div>
              <h1 className="font-headline-md text-[28px] font-bold text-on-surface leading-tight">
                Welcome back.
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Your personal sanctuary of sound.
              </p>
            </div>

            <Link
              to="/recommend"
              className="bg-[#7c3aed] text-white hover:bg-[#8b5cf6] font-label-md text-xs font-semibold px-5 py-3 rounded-full transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] select-none w-fit shrink-0 active:scale-95"
            >
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              Create AI Smart Playlist
            </Link>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center border-b border-white/5 pb-4 select-none">
            <div className="flex bg-surface-container-low/60 border border-white/5 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('playlists')}
                className={`px-6 py-2 rounded-lg font-label-md text-xs font-semibold transition-all ${activeTab === 'playlists' ? 'bg-surface-container-high text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
              >
                My Playlists
              </button>
              <button
                onClick={() => setActiveTab('likes')}
                className={`px-6 py-2 rounded-lg font-label-md text-xs font-semibold transition-all ${activeTab === 'likes' ? 'bg-surface-container-high text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
              >
                Liked Songs
              </button>
            </div>
          </div>

          {/* Library Content */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : activeTab === 'playlists' ? (
            /* Playlists Tab View */
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Liked Songs Quick Play Banner Card */}
                <div
                  onClick={handlePlayLikedSongs}
                  className="md:col-span-2 relative rounded-2xl overflow-hidden p-8 flex flex-col justify-between h-56 bg-gradient-to-br from-[#1d1b32] via-[#101419] to-background border border-white/5 hover:border-white/10 cursor-pointer shadow-lg group select-none"
                >
                  {/* Subtle Wave Backdrop */}
                  <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>

                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <h3 className="font-headline-md text-headline-md text-white font-bold">Liked Songs</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                        {likedSongs.length} tracks
                      </p>
                    </div>

                    {/* Pulsing play icon */}
                    <div className="w-12 h-12 rounded-full bg-[#7c3aed] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 shadow-md">
                      <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                    </div>
                  </div>

                  <div className="relative z-10">
                    <span className="font-label-sm text-[10px] text-primary font-bold uppercase tracking-wider">Your personal library</span>
                  </div>
                </div>

                {/* AI Suggestion Promo Card */}
                <div
                  onClick={() => navigate('/recommend')}
                  className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-56 cursor-pointer hover:border-white/10 transition-all shadow-md select-none group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#7c3aed]/10 text-[#7c3aed] flex items-center justify-center">
                      <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                    </div>
                    <span className="text-[10px] bg-surface-container-high text-[#ddb7ff] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">AI Mix</span>
                  </div>

                  <div>
                    <h3 className="font-headline-sm text-[16px] text-on-surface font-semibold leading-tight group-hover:text-primary transition-colors">Late Night Vibes</h3>
                    <p className="font-body-sm text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                      Custom electronic, lo-fi, and ambient mix compiled by our preference engine.
                    </p>
                  </div>

                  <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Configure Soundscape</span>
                </div>

              </div>

              {/* Your Collections List */}
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-6 font-bold select-none">Your Collections</h3>

                {playlists.length === 0 ? (
                  <div className="glass-panel rounded-2xl p-12 text-center text-on-surface-variant select-none">
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-3">queue_music</span>
                    <p className="text-sm">You haven't created any playlists yet.</p>
                    <p className="text-xs text-on-surface-variant/60 mt-1">Create one using the sidebar button to start organizing your tracks!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {playlists.map((playlist) => (
                      <PlaylistCard key={playlist._id} playlist={playlist} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Liked Songs Tab View */
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold select-none">Liked Tracks</h3>
                {likedSongs.length > 0 && (
                  <button onClick={handlePlayLikedSongs} className="font-label-md text-xs text-primary hover:underline">
                    Play All
                  </button>
                )}
              </div>

              {likedSongs.length === 0 ? (
                <div className="glass-panel rounded-2xl p-16 text-center text-on-surface-variant select-none">
                  <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-3">favorite</span>
                  <p className="text-sm font-semibold">Your Liked Songs list is empty.</p>
                  <p className="text-xs text-on-surface-variant/60 mt-1">Click the heart button on songs anywhere in the app to save them here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                  {likedSongs.map((song) => (
                    <SongCard key={song._id} song={song} listContext={likedSongs} />
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
};

export default Library;
