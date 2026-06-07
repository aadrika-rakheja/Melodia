import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAIRecommendations, saveAIRecommendations } from '../features/librarySlice';
import { fetchPlaylists } from '../features/playlistSlice';
import { setCurrentSong, setQueue } from '../features/playerSlice';
import Layout from '../components/layout/Layout';
import Navbar from '../components/layout/Navbar';
import SongCard from '../components/songs/SongCard';

const AIRecommendation = () => {
  const dispatch = useDispatch();
  const { aiRecommendations, loading } = useSelector((state) => state.library);
  const [selectedMood, setSelectedMood] = useState('Calm');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchAIRecommendations());
  }, [dispatch]);

  const handleSaveAIPlaylist = async () => {
    if (aiRecommendations.length === 0) return;
    setSaving(true);
    try {
      const songIds = aiRecommendations.map(s => s._id);
      await dispatch(saveAIRecommendations({
        name: 'AI Soundscape - ' + selectedMood,
        songIds
      })).unwrap();
      
      setSaveSuccess(true);
      dispatch(fetchPlaylists()); // Refresh sidebar playlists
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      alert('Failed to save AI playlist');
    } finally {
      setSaving(false);
    }
  };

  // Filter recommendations based on selected mood/genre helper
  const filteredSongs = aiRecommendations.filter(song => {
    if (selectedMood === 'Calm') return song.mood === 'calm' || song.genre.toLowerCase() === 'ambient' || song.genre.toLowerCase() === 'lo-fi';
    if (selectedMood === 'Energetic') return song.mood === 'energetic' || song.genre.toLowerCase() === 'pop' || song.genre.toLowerCase() === 'rock';
    if (selectedMood === 'Focus') return song.mood === 'focus' || song.genre.toLowerCase() === 'classical' || song.genre.toLowerCase() === 'electronic';
    if (selectedMood === 'Melancholy') return song.mood === 'sad' || song.genre.toLowerCase() === 'acoustic';
    return true;
  });

  const displaySongs = filteredSongs.length > 0 ? filteredSongs : aiRecommendations;

  const handlePlayAll = () => {
    if (displaySongs.length > 0) {
      dispatch(setQueue(displaySongs));
      dispatch(setCurrentSong(displaySongs[0]));
    }
  };

  return (
    <Layout>
      <Navbar>
        <div className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant">
          <span>AI Assistant</span>
          <span className="text-xs">/</span>
          <span className="text-on-surface">Recommendations</span>
        </div>
      </Navbar>

      <div className="flex-1 px-container-padding-mobile md:px-container-padding-desktop pb-8">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
          
          {/* AI Banner Section */}
          <div className="relative rounded-3xl overflow-hidden p-8 md:p-12 bg-surface-container-high/40 border border-white/5 shadow-lg select-none">
            <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564')]"></div>
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-background via-background/60 to-transparent"></div>

            <div className="relative z-10 max-w-2xl flex flex-col items-start gap-4">
              <span className="font-label-sm text-label-sm text-primary tracking-widest uppercase font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                AI Generation Complete
              </span>
              <h2 className="font-display-lg-mobile md:font-headline-md text-display-lg-mobile md:text-[36px] font-bold text-on-surface leading-tight">
                Your AI-Generated Soundscape
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                A curated journey based on your recent deep-focus sessions and late-night listening habits.
              </p>
              
              <div className="flex items-center gap-4 mt-2">
                {aiRecommendations.length > 0 && (
                  <button
                    onClick={handleSaveAIPlaylist}
                    disabled={saving}
                    className="bg-[#7c3aed] text-white hover:bg-[#8b5cf6] font-label-md text-label-md px-6 py-3 rounded-full transition-all flex items-center gap-2 hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-lg">bookmark</span>
                    {saving ? 'Saving...' : saveSuccess ? 'Saved to Library!' : 'Save to Library'}
                  </button>
                )}
                {displaySongs.length > 0 && (
                  <button
                    onClick={handlePlayAll}
                    className="border border-white/20 hover:bg-white/5 font-label-md text-label-md px-6 py-3 rounded-full transition-colors"
                  >
                    Play Mix
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Metrics Bento Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-44 select-none">
              <div>
                <span className="material-symbols-outlined text-primary text-3xl mb-4">equalizer</span>
                <h3 className="font-headline-sm text-[18px] text-on-surface font-semibold leading-tight">Dominant Vibe</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Lofi & Ambient</p>
              </div>
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Based on 42 hours this week</span>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-44 select-none">
              <div>
                <span className="material-symbols-outlined text-secondary text-3xl mb-4">schedule</span>
                <h3 className="font-headline-sm text-[18px] text-on-surface font-semibold leading-tight">Peak Listening</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">11:00 PM - 2:00 AM</p>
              </div>
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Late night studio focus</span>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-44">
              <div>
                <span className="material-symbols-outlined text-tertiary text-3xl mb-4">psychology</span>
                <h3 className="font-headline-sm text-[18px] text-on-surface font-semibold leading-tight">Refine Mood</h3>
              </div>
              <div className="flex flex-wrap gap-2 mb-1">
                {['Calm', 'Energetic', 'Focus', 'Melancholy'].map((mood) => (
                  <button
                    key={mood}
                    onClick={() => setSelectedMood(mood)}
                    className={`px-4 py-1.5 rounded-full font-label-md text-[11px] font-semibold transition-all ${
                      selectedMood === mood ? 'bg-[#7c3aed] text-white shadow-sm' : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Up Next list */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline-md text-[20px] text-on-surface font-bold">Recommended Tracks</h3>
              <button onClick={handlePlayAll} className="font-label-md text-xs text-primary hover:underline">
                Play All
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : displaySongs.length === 0 ? (
              <div className="glass-panel rounded-2xl p-12 text-center text-on-surface-variant select-none">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-3">music_note</span>
                <p className="text-sm">Listen to songs and like them to generate custom AI recommendations!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                {displaySongs.map((song) => (
                  <SongCard key={song._id} song={song} listContext={displaySongs} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default AIRecommendation;
