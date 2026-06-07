import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [genre, setGenre] = useState('');
  const [mood, setMood] = useState('calm');
  const [duration, setDuration] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [coverImage, setCoverImage] = useState('');
  
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState(null);

  // Fetch all songs for catalog management
  const fetchCatalog = async () => {
    try {
      const response = await axiosInstance.get('/songs');
      setSongs(response.data);
    } catch (err) {
      console.error('Failed to load songs:', err);
    }
  };

  useEffect(() => {
    // Redirect if not admin
    if (!user || user.role !== 'admin') {
      navigate('/explore');
      return;
    }
    fetchCatalog();
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(false);

    if (!title || !artist || !genre || !duration || !audioUrl) {
      setFormError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post('/songs', {
        title: title.trim(),
        artist: artist.trim(),
        album: album.trim(),
        genre: genre.trim(),
        mood,
        duration: Number(duration),
        audioUrl: audioUrl.trim(),
        coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564'
      });

      // Reset Form
      setTitle('');
      setArtist('');
      setAlbum('');
      setGenre('');
      setMood('calm');
      setDuration('');
      setAudioUrl('');
      setCoverImage('');
      
      setFormSuccess(true);
      fetchCatalog(); // Refresh list
      setTimeout(() => setFormSuccess(false), 3000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to upload song');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSong = async (songId) => {
    if (window.confirm('Are you sure you want to remove this song from the catalog?')) {
      try {
        await axiosInstance.delete(`/songs/${songId}`);
        fetchCatalog();
      } catch (err) {
        alert('Failed to delete song');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#e0e2ea] flex relative select-none">
      
      {/* Admin Sidebar Navigation */}
      <aside className="w-64 h-screen bg-[#0B0F14] border-r border-white/5 flex flex-col justify-between p-6 fixed top-0 left-0 z-40">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)]">
              <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>graphic_eq</span>
            </div>
            <div>
              <span className="font-headline-md text-[18px] text-on-surface block tracking-tight leading-none font-bold">Melodia Admin</span>
              <span className="text-[10px] text-on-surface-variant tracking-wider uppercase font-semibold">Dashboard</span>
            </div>
          </div>

          <nav className="flex flex-col gap-2 font-label-md text-label-md">
            <Link to="/admin" className="flex items-center gap-4 px-4 py-3 rounded-xl bg-surface-container-high text-primary font-semibold">
              <span className="material-symbols-outlined">dashboard</span>
              <span>Overview</span>
            </Link>
            <Link to="/explore" className="flex items-center gap-4 px-4 py-3 rounded-xl text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">music_video</span>
              <span>Manage Content</span>
            </Link>
            <Link to="/explore" className="flex items-center gap-4 px-4 py-3 rounded-xl text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">group</span>
              <span>Users</span>
            </Link>
            <Link to="/explore" className="flex items-center gap-4 px-4 py-3 rounded-xl text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">analytics</span>
              <span>Analytics</span>
            </Link>
            <Link to="/explore" className="flex items-center gap-4 px-4 py-3 rounded-xl text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">settings</span>
              <span>Settings</span>
            </Link>
          </nav>
        </div>

        {/* User Card at Sidebar Bottom */}
        <div className="border-t border-white/5 pt-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#7c3aed] text-white flex items-center justify-center font-bold text-sm uppercase">
            AD
          </div>
          <div>
            <span className="text-xs font-semibold text-on-surface block leading-tight">{user?.username || 'Admin'}</span>
            <Link to="/explore" className="text-[10px] text-[#ddb7ff] hover:underline block mt-1">To Web Player</Link>
          </div>
        </div>
      </aside>

      {/* Main Body */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Navbar Search */}
        <header className="h-20 flex items-center justify-between px-container-padding-desktop">
          <div className="relative w-full max-w-md">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-on-surface-variant text-xl">search</span>
            </span>
            <input
              type="text"
              placeholder="Search content, users..."
              className="w-full bg-surface-container-low border border-surface-variant text-on-surface text-xs rounded-full pl-11 pr-4 py-2.5 focus:ring-0 focus:outline-none focus:border-[#7c3aed]"
            />
          </div>
          
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 text-on-surface-variant">
            <span className="material-symbols-outlined text-xl">notifications</span>
          </button>
        </header>

        {/* Contents Grid */}
        <main className="flex-1 px-container-padding-desktop pb-12 space-y-8">
          
          {/* Overview Header */}
          <div>
            <h1 className="font-headline-md text-[28px] font-bold text-on-surface">Overview</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Platform performance metrics</p>
          </div>

          {/* Metrics Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl flex items-center justify-between h-28">
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Total Listeners</p>
                <h3 className="text-2xl font-bold text-on-surface mt-1">1.2M</h3>
                <p className="text-[10px] text-green-400 font-semibold mt-1">↗ +12% this week</p>
              </div>
              <span className="material-symbols-outlined text-2xl text-on-surface-variant bg-surface-container-high/40 p-3 rounded-full">headset</span>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex items-center justify-between h-28">
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Trending Streams</p>
                <h3 className="text-2xl font-bold text-on-surface mt-1">48.5K</h3>
                <p className="text-[10px] text-green-400 font-semibold mt-1">↗ +5.4% this week</p>
              </div>
              <span className="material-symbols-outlined text-2xl text-on-surface-variant bg-surface-container-high/40 p-3 rounded-full">bar_chart</span>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex items-center justify-between h-28">
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">New Signups</p>
                <h3 className="text-2xl font-bold text-on-surface mt-1">3,492</h3>
                <p className="text-[10px] text-on-surface-variant/60 mt-1">ー Stable this week</p>
              </div>
              <span className="material-symbols-outlined text-2xl text-on-surface-variant bg-surface-container-high/40 p-3 rounded-full">group_add</span>
            </div>
          </div>

          {/* Admin Bento Panels (Form vs List) */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Form card */}
            <div className="w-full lg:w-1/3 glass-panel p-6 rounded-2xl space-y-6">
              <div>
                <h3 className="font-headline-sm text-[18px] text-on-surface font-bold">Upload Content</h3>
                <p className="text-[11px] text-on-surface-variant mt-0.5">Add new audio track to the streaming library</p>
              </div>

              {formSuccess && (
                <div className="bg-green-500/20 border border-green-500/30 text-green-300 rounded-xl px-4 py-3 text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-md">check_circle</span>
                  <span>Song uploaded successfully!</span>
                </div>
              )}

              {formError && (
                <div className="bg-error-container/30 border border-error/20 text-[#ffdad6] rounded-xl px-4 py-3 text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-md">error</span>
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider" htmlFor="track-title">Title*</label>
                    <input
                      type="text"
                      id="track-title"
                      placeholder="Midnight Synth"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-surface-container-low border border-surface-variant text-xs text-on-surface rounded-lg px-3 py-2.5 focus:ring-0 focus:outline-none focus:border-[#7c3aed]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider" htmlFor="track-artist">Artist*</label>
                    <input
                      type="text"
                      id="track-artist"
                      placeholder="Neon Architect"
                      required
                      value={artist}
                      onChange={(e) => setArtist(e.target.value)}
                      className="w-full bg-surface-container-low border border-surface-variant text-xs text-on-surface rounded-lg px-3 py-2.5 focus:ring-0 focus:outline-none focus:border-[#7c3aed]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider" htmlFor="track-album">Album</label>
                    <input
                      type="text"
                      id="track-album"
                      placeholder="Outrun EP"
                      value={album}
                      onChange={(e) => setAlbum(e.target.value)}
                      className="w-full bg-surface-container-low border border-surface-variant text-xs text-on-surface rounded-lg px-3 py-2.5 focus:ring-0 focus:outline-none focus:border-[#7c3aed]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider" htmlFor="track-genre">Genre*</label>
                    <input
                      type="text"
                      id="track-genre"
                      placeholder="Electronic"
                      required
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="w-full bg-surface-container-low border border-surface-variant text-xs text-on-surface rounded-lg px-3 py-2.5 focus:ring-0 focus:outline-none focus:border-[#7c3aed]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider" htmlFor="track-mood">Mood</label>
                    <select
                      id="track-mood"
                      value={mood}
                      onChange={(e) => setMood(e.target.value)}
                      className="w-full bg-surface-container-low border border-surface-variant text-xs text-on-surface rounded-lg px-3 py-2.5 focus:ring-0 focus:outline-none focus:border-[#7c3aed]"
                    >
                      <option value="calm">Calm</option>
                      <option value="happy">Happy</option>
                      <option value="sad">Sad</option>
                      <option value="energetic">Energetic</option>
                      <option value="focus">Focus</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider" htmlFor="track-duration">Duration (secs)*</label>
                    <input
                      type="number"
                      id="track-duration"
                      placeholder="252"
                      required
                      min="1"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full bg-surface-container-low border border-surface-variant text-xs text-on-surface rounded-lg px-3 py-2.5 focus:ring-0 focus:outline-none focus:border-[#7c3aed]"
                    />
                  </div>
                </div>

                {/* Direct audio URL link for Firebase storage simulation */}
                <div className="space-y-1">
                  <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider" htmlFor="track-audio-url">Audio Link URL*</label>
                  <input
                    type="text"
                    id="track-audio-url"
                    placeholder="https://example.com/audio.mp3 (Firebase URL)"
                    required
                    value={audioUrl}
                    onChange={(e) => setAudioUrl(e.target.value)}
                    className="w-full bg-surface-container-low border border-surface-variant text-xs text-on-surface rounded-lg px-3 py-2.5 focus:ring-0 focus:outline-none focus:border-[#7c3aed]"
                  />
                </div>

                {/* Direct cover art image URL */}
                <div className="space-y-1">
                  <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider" htmlFor="track-cover-url">Cover Art Image URL</label>
                  <input
                    type="text"
                    id="track-cover-url"
                    placeholder="https://example.com/cover.jpg (Firebase URL)"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="w-full bg-surface-container-low border border-surface-variant text-xs text-on-surface rounded-lg px-3 py-2.5 focus:ring-0 focus:outline-none focus:border-[#7c3aed]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#7c3aed] text-white hover:bg-[#8b5cf6] font-label-md text-xs font-semibold py-3 rounded-lg transition-colors shadow-md hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] disabled:opacity-50 disabled:pointer-events-none mt-2"
                >
                  {loading ? 'Uploading track record...' : 'Publish Track'}
                </button>
              </form>
            </div>

            {/* List card */}
            <div className="w-full lg:w-2/3 glass-panel p-6 rounded-2xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-headline-sm text-[18px] text-on-surface font-bold">Recent Uploads</h3>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">Manage live song entries on the platform</p>
                </div>
                <button onClick={fetchCatalog} className="text-xs text-primary hover:underline font-bold">
                  Refresh Catalog
                </button>
              </div>

              {songs.length === 0 ? (
                <p className="text-sm text-on-surface-variant italic py-8 text-center">No songs uploaded yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-[10px] font-bold text-on-surface-variant/80 uppercase">
                        <th className="py-3 px-2">Track</th>
                        <th className="py-3 px-2">Artist</th>
                        <th className="py-3 px-2 text-center">Streams</th>
                        <th className="py-3 px-2 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {songs.slice(0, 10).map((song) => (
                        <tr key={song._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-3 px-2 flex items-center gap-3">
                            <img src={song.coverImage} className="w-8 h-8 rounded object-cover" alt="" />
                            <span className="font-semibold text-on-surface truncate max-w-[150px]">{song.title}</span>
                          </td>
                          <td className="py-3 px-2 text-on-surface-variant font-medium truncate max-w-[120px]">{song.artist}</td>
                          <td className="py-3 px-2 text-center text-on-surface-variant">{song.playCount.toLocaleString()}</td>
                          <td className="py-3 px-2 text-center">
                            <button
                              onClick={() => handleDeleteSong(song._id)}
                              className="text-on-surface-variant hover:text-error transition-colors p-1"
                              title="Delete song"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>

        </main>
      </div>

    </div>
  );
};

export default AdminDashboard;
