import React, { useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlaylists } from '../../features/playlistSlice';
import { logout } from '../../features/authSlice';

const Sidebar = ({ onCreatePlaylistClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { playlists } = useSelector((state) => state.playlist);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchPlaylists());
    }
  }, [isAuthenticated, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <aside className="w-64 h-screen bg-[#0B0F14] border-r border-white/5 flex flex-col justify-between p-6 fixed top-0 left-0 z-40 select-none">
      {/* Brand Header */}
      <div className="flex flex-col gap-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)]">
            <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>graphic_eq</span>
          </div>
          <div>
            <span className="font-headline-md text-[20px] text-on-surface block tracking-tight leading-none font-bold">Melodia</span>
            <span className="text-[10px] text-on-surface-variant tracking-wider uppercase font-semibold">Premium Audio</span>
          </div>
        </Link>

        {/* Main Navigation Links */}
        <nav className="flex flex-col gap-2 font-label-md text-label-md">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 hover:text-primary ${
                isActive ? 'bg-surface-container-high text-primary' : 'text-on-surface-variant'
              }`
            }
          >
            <span className="material-symbols-outlined">home</span>
            <span>Home</span>
          </NavLink>
          
          <NavLink
            to="/explore"
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 hover:text-primary ${
                isActive ? 'bg-surface-container-high text-primary' : 'text-on-surface-variant'
              }`
            }
          >
            <span className="material-symbols-outlined">explore</span>
            <span>Explore</span>
          </NavLink>

          <NavLink
            to="/search"
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 hover:text-primary ${
                isActive ? 'bg-surface-container-high text-primary' : 'text-on-surface-variant'
              }`
            }
          >
            <span className="material-symbols-outlined">search</span>
            <span>Search</span>
          </NavLink>

          <NavLink
            to="/library"
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 hover:text-primary ${
                isActive ? 'bg-surface-container-high text-primary' : 'text-on-surface-variant'
              }`
            }
          >
            <span className="material-symbols-outlined">library_music</span>
            <span>Library</span>
          </NavLink>
        </nav>

        {/* Playlist Section Controls */}
        <div className="mt-4 flex flex-col gap-4 border-t border-white/5 pt-6">
          <button
            onClick={onCreatePlaylistClick}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container-low border border-white/5 text-on-surface hover:border-[#7c3aed]/50 hover:bg-surface-container hover:text-primary transition-all duration-200 font-label-md text-label-md"
          >
            <span className="material-symbols-outlined text-xl">add</span>
            <span>Create Playlist</span>
          </button>

          {/* Quick Playlist List Scroll */}
          <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto hide-scrollbar">
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest px-4 mb-1">Playlists</span>
            
            {playlists.length === 0 ? (
              <span className="text-xs text-on-surface-variant/60 px-4 italic">No playlists yet</span>
            ) : (
              playlists.map((pl) => (
                <NavLink
                  key={pl._id}
                  to={`/playlists/${pl._id}`}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-xs truncate hover:text-primary transition-colors block ${
                      isActive ? 'text-primary font-semibold' : 'text-on-surface-variant'
                    }`
                  }
                >
                  {pl.name}
                </NavLink>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Profile Details / Sign In */}
      <div className="border-t border-white/5 pt-6">
        {isAuthenticated && user ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-[#7c3aed] text-white flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.username} className="w-full h-full rounded-full object-cover" />
                ) : (
                  user.username.slice(0, 2)
                )}
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-semibold text-on-surface truncate block leading-tight">{user.username}</span>
                {user.role === 'admin' ? (
                  <Link to="/admin" className="text-[10px] text-primary hover:underline font-bold block leading-none mt-1">Admin Panel</Link>
                ) : (
                  <span className="text-[10px] text-on-surface-variant block leading-none mt-1">User</span>
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-on-surface-variant hover:text-error transition-colors p-1"
              title="Logout"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Link
              to="/login"
              className="w-full py-2.5 text-center text-xs font-bold text-on-surface hover:text-primary transition-colors border border-white/10 hover:border-[#7c3aed]/50 rounded-xl"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="w-full py-2.5 text-center text-xs font-bold bg-[#7c3aed] hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] text-on-primary-container rounded-xl transition-all duration-200"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
