import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authSlice';
import { setCurrentSong, setQueue } from '../features/playerSlice';
import axiosInstance from '../api/axiosInstance';

const Landing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [trendingTracks, setTrendingTracks] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await axiosInstance.get('/songs');
        const tracks = response.data.slice(0, 4);
        setTrendingTracks(tracks);
      } catch (err) {
        console.error('Failed to fetch trending tracks', err);
      } finally {
        setLoadingTrending(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div className="font-body text-body-md min-h-screen bg-[#0B0F14] text-[#e0e2ea] relative select-none">
      {/* Top App Bar Header */}
      <header className="fixed top-0 left-0 w-full h-20 glass-panel z-50 flex items-center justify-between px-container-padding-mobile md:px-container-padding-desktop">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)]">
            <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>graphic_eq</span>
          </div>
          <span className="font-headline-md text-headline-md text-on-surface font-bold">Melodia</span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-label-md text-label-md text-on-surface-variant">
          <a className="hover:text-primary transition-colors duration-200" href="#features">Features</a>
          <a className="hover:text-primary transition-colors duration-200" href="#trending">Trending</a>
          <a className="hover:text-primary transition-colors duration-200" href="#community">Community</a>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(prev => !prev)}
                className="flex items-center gap-3 px-4 py-2 rounded-full glass-panel hover:bg-white/10 transition-all duration-200 border border-white/10"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#a855f7] flex items-center justify-center text-white font-bold text-sm">
                  {(user.username || user.name || user.email || 'U')[0].toUpperCase()}
                </div>
                <span className="hidden md:block font-label-md text-sm text-on-surface">{user.username || user.name || 'You'}</span>
                <span className="material-symbols-outlined text-on-surface-variant text-base">expand_more</span>
              </button>
              {showUserMenu && (
                <div className="absolute right-0 top-14 w-48 glass-panel border border-white/10 rounded-2xl overflow-hidden shadow-xl z-50">
                  <Link
                    to="/explore"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-on-surface text-sm transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">headphones</span>
                    Go to App
                  </Link>
                  <button
                    onClick={() => { dispatch(logout()); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-error text-sm transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">logout</span>
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="hidden md:block font-label-md text-label-md text-on-surface hover:text-primary transition-colors">Log In</Link>
              <Link to="/signup" className="bg-primary-container text-on-primary-container font-label-md text-label-md px-6 py-2.5 rounded-full hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] transition-all duration-200 active:scale-95">Sign Up</Link>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-container-padding-mobile md:px-container-padding-desktop overflow-hidden py-20">
          {/* Background Ambient Gradients */}
          <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-container/20 rounded-full blur-[120px] mix-blend-screen"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#a855f7]/10 rounded-full blur-[150px] mix-blend-screen"></div>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0B0F14]"></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center z-10 flex flex-col items-center gap-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="font-label-sm text-label-sm text-primary">v2.0 Now Available</span>
            </div>
            
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface tracking-tight leading-tight">
              Your Music.<br />
              Your Mood.<br />
              <span className="text-gradient">Your Melodia.</span>
            </h1>
            
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Experience the next generation of streaming. High-fidelity audio meets AI-powered discovery in a beautifully designed, immersive soundscape.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full justify-center">
              <Link
                to="/explore"
                className="w-full sm:w-auto bg-gradient-primary text-white font-label-md text-label-md px-8 py-4 rounded-full hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                Start Listening Free
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto border border-white/20 bg-white/5 text-on-surface text-center font-label-md text-label-md px-8 py-4 rounded-full hover:bg-white/10 transition-all duration-300 active:scale-95"
              >
                Explore Features
              </a>
            </div>
          </div>
        </section>

        {/* Trending Section */}
        <section id="trending" className="py-24 px-container-padding-mobile md:px-container-padding-desktop">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Trending Now</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">The tracks shaping the global soundscape today.</p>
              </div>
              <div className="hidden sm:flex gap-2">
                <button className="w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 text-on-surface transition-colors">
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <button className="w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 text-on-surface transition-colors">
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {trendingTracks.map((track, i) => (
                <div key={i} className="group relative">
                  <div className="aspect-square rounded-xl overflow-hidden mb-4 relative shadow-lg bg-surface-container-high">
                    <img
                      alt={track.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      src={track.coverImage}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Link
                        to="/explore"
                        className="w-14 h-14 rounded-full bg-primary-container text-white flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.6)] transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                        onClick={() => {
                          dispatch(setQueue([track]));
                          dispatch(setCurrentSong(track));
                        }}
                      >
                        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                      </Link>
                    </div>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface truncate">{track.title}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate">{track.artist}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section (Bento Grid Style) */}
        <section id="features" className="py-24 bg-surface-container-lowest border-y border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="max-w-[1400px] mx-auto px-container-padding-mobile md:px-container-padding-desktop relative z-10">
            
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-display-lg-mobile md:font-headline-md text-display-lg-mobile md:text-headline-md text-on-surface mb-4">Engineered for Audiophiles</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">We built Melodia from the ground up to deliver uncompromising quality and intuitive discovery.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
              {/* Feature 1: Large Span */}
              <div className="glass-panel p-8 rounded-2xl md:col-span-2 relative overflow-hidden group glow-hover transition-all duration-300 flex flex-col justify-between">
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center mb-6 text-primary">
                    <span className="material-symbols-outlined text-2xl">graphic_eq</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-2">High Fidelity Streaming</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-md">Experience your favorite tracks exactly as the artist intended. Lossless audio up to 24-bit/192kHz.</p>
                </div>
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-[40px] group-hover:bg-primary/20 transition-all duration-500"></div>
              </div>
              
              {/* Feature 2 */}
              <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group glow-hover transition-all duration-300 flex flex-col justify-between">
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-secondary-container/20 flex items-center justify-center mb-6 text-secondary">
                    <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">AI Recommendations</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Our neural engine understands your taste, finding hidden gems you're guaranteed to love.</p>
                </div>
              </div>
              
              {/* Feature 3 */}
              <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group glow-hover transition-all duration-300 flex flex-col justify-between">
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-tertiary-container/20 flex items-center justify-center mb-6 text-tertiary">
                    <span className="material-symbols-outlined text-2xl">queue_music</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Smart Playlists</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Playlists that evolve with your day. From morning focus to late-night unwinding.</p>
                </div>
              </div>
              
              {/* Feature 4: Large Span */}
              <div className="glass-panel p-8 rounded-2xl md:col-span-2 relative overflow-hidden group glow-hover transition-all duration-300 flex flex-col justify-between">
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center mb-6 text-primary">
                    <span className="material-symbols-outlined text-2xl">share</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Social Listening</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-md">Connect with friends, share your current mood, and listen to the same tracks together, in real-time.</p>
                </div>
                {/* Avatar icons */}
                <div className="absolute bottom-8 right-8 flex -space-x-4 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full border-2 border-surface bg-surface-variant"></div>
                  <div className="w-12 h-12 rounded-full border-2 border-surface bg-surface-container-high"></div>
                  <div className="w-12 h-12 rounded-full border-2 border-surface bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold">+3</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="community" className="bg-[#0B0F14] border-t border-white/5 pt-20 pb-10 px-container-padding-mobile md:px-container-padding-desktop">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>graphic_eq</span>
              </div>
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Melodia</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs mb-6">
              Premium audio streaming for the modern audiophile. Designed with passion, powered by intelligence.
            </p>
            <div className="flex gap-4">
              <a className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors" href="#">
                <span className="material-symbols-outlined text-lg">public</span>
              </a>
              <a className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors" href="#">
                <span className="material-symbols-outlined text-lg">forum</span>
              </a>
              <a className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors" href="#">
                <span className="material-symbols-outlined text-lg">alternate_email</span>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-label-md text-label-md text-on-surface mb-6 uppercase tracking-wider font-semibold">Product</h4>
            <ul className="space-y-4 font-body-sm text-body-sm text-on-surface-variant">
              <li><Link className="hover:text-primary transition-colors" to="/explore">Explore Player</Link></li>
              <li><a className="hover:text-primary transition-colors" href="#">Premium Plans</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Web Player</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Desktop App</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-md text-label-md text-on-surface mb-6 uppercase tracking-wider font-semibold">Company</h4>
            <ul className="space-y-4 font-body-sm text-body-sm text-on-surface-variant">
              <li><a className="hover:text-primary transition-colors" href="#">About Us</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Careers</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Press</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-label-md text-label-md text-on-surface mb-6 uppercase tracking-wider font-semibold">Legal</h4>
            <ul className="space-y-4 font-body-sm text-body-sm text-on-surface-variant">
              <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Terms of Service</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
          <p>© 2026 Melodia Audio Inc. All rights reserved.</p>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span>All systems operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
