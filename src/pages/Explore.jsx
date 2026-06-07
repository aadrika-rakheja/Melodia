import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { setCurrentSong, setQueue } from '../features/playerSlice';
import Layout from '../components/layout/Layout';
import Navbar from '../components/layout/Navbar';

const Explore = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExploreSongs = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/songs');
        setSongs(response.data);
      } catch (err) {
        console.error('Failed to load explore songs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExploreSongs();
  }, []);

  const handlePlaySong = (song) => {
    dispatch(setQueue(songs));
    dispatch(setCurrentSong(song));
  };

  const handleMoodClick = (mood) => {
    navigate(`/mood/${mood.toLowerCase()}`);
  };

  // Divide songs into categories dynamically
  const trendingMain = songs[0] || {
    title: 'Neon Nights',
    artist: 'Midnight Synthwave Collective',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600',
    audioUrl: ''
  };

  const trendingSiblings = songs.slice(1, 3);
  const newReleases = songs;

  return (
    <Layout>
      <Navbar>
        <div className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant select-none">
          <span className="text-on-surface">Explore</span>
          <span className="text-xs">/</span>
          <span>Discover</span>
        </div>
      </Navbar>

      <div className="flex-1 px-container-padding-mobile md:px-container-padding-desktop pb-8">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-10">
          
          {/* Page Heading */}
          <div className="select-none">
            <h1 className="font-headline-md text-[32px] font-bold text-on-surface tracking-tight">Explore</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Discover the sound of tomorrow, curated for you today.
            </p>
          </div>

          {/* Section 1: Trending Now */}
          <div>
            <div className="flex items-center justify-between mb-6 select-none">
              <h2 className="font-headline-sm text-[18px] text-on-surface font-bold">Trending Now</h2>
              <button onClick={() => navigate('/search')} className="font-label-md text-xs text-on-surface-variant hover:text-primary tracking-widest uppercase font-bold">
                View All
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Large Card (Left) */}
              <div
                onClick={() => handlePlaySong(trendingMain)}
                className="lg:col-span-2 relative rounded-3xl overflow-hidden p-8 md:p-12 h-64 md:h-72 border border-white/5 hover:border-[#7c3aed]/40 cursor-pointer shadow-lg group select-none flex flex-col justify-between"
              >
                {/* Background Image Overlay */}
                <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('${trendingMain.coverImage}')` }}></div>
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-background via-background/60 to-transparent"></div>

                <div className="relative z-10">
                  <span className="inline-block bg-primary-container text-on-primary-container text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                    #1 Trending
                  </span>
                  <h3 className="font-headline-md text-[24px] md:text-[28px] font-bold text-white leading-tight">{trendingMain.title}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{trendingMain.artist}</p>
                </div>

                {/* Hover Play Circle indicator */}
                <div className="relative z-10 w-12 h-12 rounded-full bg-[#7c3aed] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-md">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                </div>
              </div>

              {/* Sibling Cards (Right) */}
              <div className="flex flex-col gap-6">
                {trendingSiblings.length === 0 ? (
                  // Fallbacks if no extra songs exist
                  <>
                    <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 h-[132px] hover:border-white/10 transition-all select-none">
                      <div className="w-20 h-20 bg-surface-container-high rounded-xl shrink-0 flex items-center justify-center">
                        <span className="material-symbols-outlined text-on-surface-variant/40">album</span>
                      </div>
                      <div>
                        <h4 className="font-headline-sm text-sm text-on-surface font-semibold truncate max-w-[150px]">Acoustic Sunrise</h4>
                        <p className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">Various Artists</p>
                      </div>
                    </div>
                    <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 h-[132px] hover:border-white/10 transition-all select-none">
                      <div className="w-20 h-20 bg-surface-container-high rounded-xl shrink-0 flex items-center justify-center">
                        <span className="material-symbols-outlined text-on-surface-variant/40">album</span>
                      </div>
                      <div>
                        <h4 className="font-headline-sm text-sm text-on-surface font-semibold truncate max-w-[150px]">Deep Focus Studio</h4>
                        <p className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">Binaural Beats</p>
                      </div>
                    </div>
                  </>
                ) : (
                  trendingSiblings.map((sibling) => (
                    <div
                      key={sibling._id}
                      onClick={() => handlePlaySong(sibling)}
                      className="glass-panel p-5 rounded-2xl flex items-center gap-4 h-[132px] hover:border-[#7c3aed]/30 hover:bg-surface-container/30 cursor-pointer transition-all select-none group"
                    >
                      <img src={sibling.coverImage} className="w-20 h-20 object-cover rounded-xl shrink-0 shadow-md bg-surface-container-high" alt="" />
                      <div className="overflow-hidden">
                        <h4 className="font-headline-sm text-sm text-on-surface font-semibold truncate group-hover:text-primary transition-colors">{sibling.title}</h4>
                        <p className="font-body-sm text-[11px] text-on-surface-variant mt-0.5 truncate">{sibling.artist}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Section 2: New Releases */}
          <div>
            <h2 className="font-headline-sm text-[18px] text-on-surface font-bold mb-6 select-none">New Releases</h2>

            {loading ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : newReleases.length === 0 ? (
              <p className="text-xs text-on-surface-variant italic px-2">No tracks added to database yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {newReleases.map((release) => (
                  <div
                    key={release._id}
                    onClick={() => handlePlaySong(release)}
                    className="glass-panel p-4 rounded-xl flex items-center gap-4 hover:bg-surface-container-high/40 hover:border-[#7c3aed]/20 cursor-pointer transition-all select-none group"
                  >
                    <img src={release.coverImage} className="w-12 h-12 object-cover rounded-lg shrink-0 shadow bg-surface-container-high" alt="" />
                    <div className="overflow-hidden">
                      <h4 className="font-headline-sm text-xs font-semibold text-on-surface truncate group-hover:text-primary transition-colors">{release.title}</h4>
                      <p className="text-[10px] text-on-surface-variant truncate mt-0.5">{release.artist}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Browse by Mood */}
          <div>
            <h2 className="font-headline-sm text-[18px] text-on-surface font-bold mb-6 select-none">Browse by Mood</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 select-none">
              {/* Workout */}
              <div
                onClick={() => handleMoodClick('energetic')}
                className="h-28 rounded-2xl p-6 relative overflow-hidden bg-gradient-to-br from-[#b91c1c] to-[#f43f5e] cursor-pointer hover:scale-[1.02] active:scale-95 transition-all shadow-md flex items-end justify-between group"
              >
                <h3 className="font-headline-sm text-sm font-bold text-white">Workout</h3>
                <span className="material-symbols-outlined text-white/40 group-hover:text-white/80 transition-colors text-2xl">fitness_center</span>
              </div>

              {/* Chill */}
              <div
                onClick={() => handleMoodClick('calm')}
                className="h-28 rounded-2xl p-6 relative overflow-hidden bg-gradient-to-br from-[#1d4ed8] to-[#60a5fa] cursor-pointer hover:scale-[1.02] active:scale-95 transition-all shadow-md flex items-end justify-between group"
              >
                <h3 className="font-headline-sm text-sm font-bold text-white">Chill</h3>
                <span className="material-symbols-outlined text-white/40 group-hover:text-white/80 transition-colors text-2xl">spa</span>
              </div>

              {/* Focus */}
              <div
                onClick={() => handleMoodClick('focus')}
                className="h-28 rounded-2xl p-6 relative overflow-hidden bg-gradient-to-br from-[#5b21b6] to-[#a78bfa] cursor-pointer hover:scale-[1.02] active:scale-95 transition-all shadow-md flex items-end justify-between group"
              >
                <h3 className="font-headline-sm text-sm font-bold text-white">Focus</h3>
                <span className="material-symbols-outlined text-white/40 group-hover:text-white/80 transition-colors text-2xl">psychology</span>
              </div>

              {/* Party */}
              <div
                onClick={() => handleMoodClick('happy')}
                className="h-28 rounded-2xl p-6 relative overflow-hidden bg-gradient-to-br from-[#c2410c] to-[#fb923c] cursor-pointer hover:scale-[1.02] active:scale-95 transition-all shadow-md flex items-end justify-between group"
              >
                <h3 className="font-headline-sm text-sm font-bold text-white">Party</h3>
                <span className="material-symbols-outlined text-white/40 group-hover:text-white/80 transition-colors text-2xl">celebration</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Explore;
