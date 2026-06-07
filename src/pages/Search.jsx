import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import Layout from '../components/layout/Layout';
import Navbar from '../components/layout/Navbar';
import SongCard from '../components/songs/SongCard';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debouncing search query: wait 300ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch songs based on debounced search query and filter pills
  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        let url = `/songs?search=${encodeURIComponent(debouncedQuery)}`;
        
        // If selected filter is not "All" and we're searching by genre/mood/etc.
        if (selectedFilter !== 'All') {
          if (selectedFilter === 'Pop' || selectedFilter === 'Electronic' || selectedFilter === 'Hip Hop' || selectedFilter === 'Rock') {
            url += `&genre=${selectedFilter}`;
          }
        }
        
        const response = await axiosInstance.get(url);
        setSongs(response.data);
      } catch (error) {
        console.error('Failed to load search results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [debouncedQuery, selectedFilter]);

  const handleClear = () => {
    setSearchQuery('');
  };

  const categories = [
    { name: 'Pop', color: 'from-[#ec4899] to-[#7c3aed]', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600' },
    { name: 'Electronic', color: 'from-[#10b981] to-[#059669]', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600' },
    { name: 'Hip Hop', color: 'from-[#f59e0b] to-[#d97706]', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600' },
    { name: 'Rock', color: 'from-[#3b82f6] to-[#1d4ed8]', image: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=600' }
  ];

  return (
    <Layout>
      <Navbar>
        {/* Glow Search Bar inside the Navbar */}
        <div className="relative w-full max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-on-surface-variant text-xl">search</span>
          </div>
          
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="What do you want to listen to?"
            className="glow-input w-full bg-surface-container-low border border-surface-variant text-on-surface font-body-md rounded-full pl-11 pr-10 py-3 focus:ring-0 focus:outline-none transition-colors shadow-sm"
          />

          {searchQuery && (
            <button
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          )}
        </div>
      </Navbar>

      <div className="flex-1 px-container-padding-mobile md:px-container-padding-desktop pb-8">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
          
          {/* Quick Filter Pills */}
          <div className="flex items-center gap-2 select-none">
            {['All', 'Genre', 'Artist', 'Mood', 'Duration'].map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setSelectedFilter(filter);
                  // Reset search query if switching filter categories to show baseline
                  if (filter !== 'All' && filter !== 'Genre') {
                    setSearchQuery('');
                  }
                }}
                className={`px-5 py-2 rounded-full font-label-md text-xs font-semibold transition-all ${
                  selectedFilter === filter
                    ? 'bg-[#7c3aed] text-white shadow-sm'
                    : 'bg-surface-container-low border border-white/5 text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Conditional View: Search Results vs Browse All Categories Grid */}
          {!searchQuery && !debouncedQuery ? (
            /* Browse All Grid */
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-6 font-bold select-none">Browse all</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {categories.map((cat) => (
                  <div
                    key={cat.name}
                    onClick={() => {
                      setSearchQuery(cat.name);
                      setSelectedFilter(cat.name);
                    }}
                    className={`aspect-[4/3] rounded-2xl p-6 relative overflow-hidden bg-gradient-to-br ${cat.color} hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:scale-[1.02] cursor-pointer transition-all duration-300 select-none shadow-md`}
                  >
                    {/* Background Overlay */}
                    <div className="absolute inset-0 bg-black/20 z-0"></div>
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="absolute -right-4 -bottom-4 w-28 h-28 object-cover rounded-xl rotate-[25deg] opacity-70 group-hover:scale-110 transition-transform duration-300 z-0"
                    />
                    <h3 className="font-headline-md text-headline-md text-white font-bold relative z-10">{cat.name}</h3>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Search Results Grid */
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-6 font-bold select-none">
                {loading ? 'Searching...' : `Results for "${searchQuery}"`}
              </h2>
              
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : songs.length === 0 ? (
                <div className="glass-panel rounded-2xl p-16 text-center text-on-surface-variant select-none">
                  <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-3">search_off</span>
                  <p className="text-sm font-semibold">No results match your search query.</p>
                  <p className="text-xs text-on-surface-variant/60 mt-1">Try double checking spelling or searching for another song, artist, or genre.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                  {songs.map((song) => (
                    <SongCard key={song._id} song={song} listContext={songs} />
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

export default Search;
