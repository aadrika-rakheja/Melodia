import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlaylistById, removeSongFromPlaylist, addSongToPlaylist, deletePlaylist } from '../features/playlistSlice';
import { setCurrentSong, setQueue, togglePlay } from '../features/playerSlice';
import { toggleLikeSongInLibrary } from '../features/librarySlice';
import axiosInstance from '../api/axiosInstance';
import Layout from '../components/layout/Layout';
import Navbar from '../components/layout/Navbar';

const PlaylistDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { activePlaylist, loading } = useSelector((state) => state.playlist);
  const { currentSong, isPlaying } = useSelector((state) => state.player);
  const likedSongs = useSelector((state) => state.library.likedSongs);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showAddSection, setShowAddSection] = useState(false);

  useEffect(() => {
    dispatch(fetchPlaylistById(id));
  }, [id, dispatch]);

  // Fetch song catalog recommendations to add to this playlist
  useEffect(() => {
    if (!showAddSection) return;

    const searchCatalog = async () => {
      try {
        const response = await axiosInstance.get(`/songs?search=${encodeURIComponent(searchQuery)}`);
        // Filter out songs already in the playlist
        const existingIds = new Set(activePlaylist?.songs?.map(s => s._id) || []);
        const filtered = response.data.filter(s => !existingIds.has(s._id));
        setSearchResults(filtered.slice(0, 5));
      } catch (error) {
        console.error('Failed to search catalog:', error);
      }
    };

    const timer = setTimeout(searchCatalog, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, showAddSection, activePlaylist]);

  const handlePlayAll = () => {
    if (activePlaylist && activePlaylist.songs.length > 0) {
      dispatch(setQueue(activePlaylist.songs));
      dispatch(setCurrentSong(activePlaylist.songs[0]));
    }
  };

  const handleShufflePlay = () => {
    if (activePlaylist && activePlaylist.songs.length > 0) {
      const shuffled = [...activePlaylist.songs].sort(() => Math.random() - 0.5);
      dispatch(setQueue(shuffled));
      dispatch(setCurrentSong(shuffled[0]));
    }
  };

  const handleTrackClick = (song) => {
    if (currentSong && currentSong._id === song._id) {
      dispatch(togglePlay());
    } else {
      dispatch(setQueue(activePlaylist.songs));
      dispatch(setCurrentSong(song));
    }
  };

  const handleRemoveTrack = (songId) => {
    dispatch(removeSongFromPlaylist({ id, songId }));
  };

  const handleAddTrack = (songId) => {
    dispatch(addSongToPlaylist({ id, songId }));
  };

  const handleDeletePlaylistClick = async () => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      try {
        await dispatch(deletePlaylist(id)).unwrap();
        navigate('/library');
      } catch (err) {
        alert('Failed to delete playlist');
      }
    }
  };

  const handleCopyLink = () => {
    if (activePlaylist?.shareToken) {
      const url = `${window.location.origin}/share/${activePlaylist.shareToken}`;
      navigator.clipboard.writeText(url);
      alert('Shareable link copied to clipboard!');
    }
  };

  const formatDuration = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (loading && !activePlaylist) {
    return (
      <Layout>
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!activePlaylist) {
    return (
      <Layout>
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-3">error</span>
          <p className="text-sm font-semibold">Playlist not found or access denied.</p>
          <Link to="/library" className="text-primary text-xs hover:underline mt-2">Return to Library</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Navbar>
        <div className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant">
          <Link to="/library" className="hover:text-primary transition-colors">Library</Link>
          <span className="text-xs">/</span>
          <span className="text-on-surface">{activePlaylist.name}</span>
        </div>
      </Navbar>

      <div className="flex-1 px-container-padding-mobile md:px-container-padding-desktop pb-8">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
          
          {/* Header Card */}
          <div className="flex flex-col md:flex-row items-end gap-8 select-none">
            <img
              src={activePlaylist.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564'}
              alt={activePlaylist.name}
              className="w-48 h-48 md:w-56 md:h-56 rounded-2xl object-cover bg-surface-container-high shadow-lg"
            />
            
            <div className="flex-1 flex flex-col items-start gap-3">
              <span className="font-label-sm text-label-sm text-primary tracking-widest uppercase font-bold">
                {activePlaylist.isAIGenerated ? 'AI-Generated Playlist' : 'Public Playlist'}
              </span>
              
              <h1 className="font-headline-md text-[32px] md:text-[44px] font-bold text-on-surface leading-tight tracking-tight">
                {activePlaylist.name}
              </h1>
              
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl leading-relaxed">
                {activePlaylist.description || 'No description provided for this collection.'}
              </p>
              
              {/* Playback Controls & Utility Actions */}
              <div className="flex items-center gap-4 mt-2 w-full flex-wrap">
                {activePlaylist.songs.length > 0 ? (
                  <>
                    <button
                      onClick={handlePlayAll}
                      className="bg-[#7c3aed] text-white hover:bg-[#8b5cf6] font-label-md text-xs font-semibold px-6 py-3 rounded-full transition-all flex items-center gap-2 hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] active:scale-95"
                    >
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                      Play All
                    </button>
                    <button
                      onClick={handleShufflePlay}
                      className="border border-white/20 hover:bg-white/5 font-label-md text-xs font-semibold px-6 py-3 rounded-full transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-lg">shuffle</span>
                      Shuffle
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowAddSection(true)}
                    className="border border-white/20 hover:bg-white/5 font-label-md text-xs font-semibold px-6 py-3 rounded-full transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">add</span>
                    Add Songs
                  </button>
                )}

                <button
                  onClick={handleCopyLink}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-colors"
                  title="Copy share link"
                >
                  <span className="material-symbols-outlined text-lg">share</span>
                </button>
                
                <button
                  onClick={() => setShowAddSection(!showAddSection)}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${showAddSection ? 'border-primary text-primary' : 'border-white/10 text-on-surface-variant hover:text-on-surface hover:bg-white/5'}`}
                  title="Add tracks"
                >
                  <span className="material-symbols-outlined text-lg">playlist_add</span>
                </button>

                <button
                  onClick={handleDeletePlaylistClick}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-on-surface-variant hover:text-error hover:border-error/20 hover:bg-error-container/10 transition-colors ml-auto"
                  title="Delete playlist"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            </div>
          </div>

          {/* Optional Add Songs Section */}
          {showAddSection && (
            <div className="glass-panel p-6 rounded-2xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
              <div className="flex items-center justify-between">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Let's add some songs to your playlist</h3>
                <button onClick={() => setShowAddSection(false)} className="text-on-surface-variant hover:text-on-surface">
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for tracks to add..."
                className="glow-input w-full bg-surface-container-low border border-surface-variant text-on-surface font-body-md rounded-lg px-4 py-2.5 focus:ring-0 focus:outline-none transition-colors"
              />
              <div className="flex flex-col gap-2">
                {searchResults.length === 0 ? (
                  <p className="text-xs text-on-surface-variant/60 italic px-2">Type above to search songs in catalog...</p>
                ) : (
                  searchResults.map((song) => (
                    <div key={song._id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img src={song.coverImage} className="w-10 h-10 rounded object-cover" alt="" />
                        <div>
                          <p className="text-xs font-semibold text-on-surface truncate">{song.title}</p>
                          <p className="text-[10px] text-on-surface-variant truncate">{song.artist}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddTrack(song._id)}
                        className="bg-primary-container hover:bg-primary-container/80 text-on-primary-container p-1.5 rounded-full flex items-center justify-center transition-colors"
                      >
                        <span className="material-symbols-outlined text-md">add</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tracks List Table */}
          <div className="w-full overflow-x-auto">
            {activePlaylist.songs.length === 0 ? (
              <div className="glass-panel rounded-2xl p-16 text-center text-on-surface-variant select-none">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-3">music_note</span>
                <p className="text-sm font-semibold">This playlist is empty.</p>
                <p className="text-xs text-on-surface-variant/60 mt-1">Click the "Add tracks" button above to populate it with music.</p>
              </div>
            ) : (
              <table className="w-full border-collapse text-left text-sm text-on-surface-variant select-none">
                <thead>
                  <tr className="border-b border-white/5 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/80">
                    <th className="py-4 px-4 w-12 text-center">#</th>
                    <th className="py-4 px-4">Title</th>
                    <th className="py-4 px-4">Album</th>
                    <th className="py-4 px-4 hidden md:table-cell">Date Added</th>
                    <th className="py-4 px-4 w-20 text-center">
                      <span className="material-symbols-outlined text-lg">schedule</span>
                    </th>
                    <th className="py-4 px-4 w-16 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activePlaylist.songs.map((song, index) => {
                    const isCurrent = currentSong && currentSong._id === song._id;
                    return (
                      <tr
                        key={song._id}
                        onClick={() => handleTrackClick(song)}
                        className={`border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group ${isCurrent ? 'bg-surface-container-high/20 text-on-surface' : ''}`}
                      >
                        {/* Index / Play indicator */}
                        <td className="py-4 px-4 text-center">
                          <span className="group-hover:hidden text-xs">
                            {isCurrent && isPlaying ? (
                              <span className="text-primary font-bold">▶</span>
                            ) : (
                              index + 1
                            )}
                          </span>
                          <span className="hidden group-hover:inline text-primary">
                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                              {isCurrent && isPlaying ? 'pause' : 'play_arrow'}
                            </span>
                          </span>
                        </td>
                        
                        {/* Title & Artist */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-4 overflow-hidden">
                            <img src={song.coverImage} className="w-10 h-10 rounded object-cover shrink-0" alt="" />
                            <div className="overflow-hidden">
                              <p className={`font-semibold truncate ${isCurrent ? 'text-primary' : 'text-on-surface'}`}>{song.title}</p>
                              <p className="text-xs text-on-surface-variant truncate mt-0.5">{song.artist}</p>
                            </div>
                          </div>
                        </td>
                        
                        {/* Album */}
                        <td className="py-4 px-4 truncate max-w-[150px]">{song.album || 'Unknown Album'}</td>
                        
                        {/* Date Added */}
                        <td className="py-4 px-4 hidden md:table-cell">
                          {new Date(song.createdAt || activePlaylist.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                        
                        {/* Duration */}
                        <td className="py-4 px-4 text-center">{formatDuration(song.duration)}</td>
                        
                        {/* Actions */}
                        <td className="py-4 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleRemoveTrack(song._id)}
                            className="text-on-surface-variant hover:text-error transition-colors p-1"
                            title="Remove from playlist"
                          >
                            <span className="material-symbols-outlined text-lg">close</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default PlaylistDetail;
