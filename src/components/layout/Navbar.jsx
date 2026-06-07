import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Navbar = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  return (
    <header className="h-20 flex items-center justify-between px-container-padding-mobile md:px-container-padding-desktop w-full relative z-30 select-none">
      {/* Left side: slot for page-specific context (e.g., search bars, titles) */}
      <div className="flex-1 max-w-xl">
        {children}
      </div>

      {/* Right side: standard icons and avatar */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 text-on-surface-variant hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined text-2xl">notifications</span>
        </button>

        {/* Settings Button */}
        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 text-on-surface-variant hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined text-2xl">settings</span>
        </button>

        {/* User Profile Avatar */}
        {isAuthenticated && user ? (
          <Link to="/library" className="w-10 h-10 rounded-full bg-[#7c3aed] border border-white/10 hover:border-primary transition-colors flex items-center justify-center font-bold text-sm uppercase text-white cursor-pointer overflow-hidden">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
            ) : (
              user.username.slice(0, 2)
            )}
          </Link>
        ) : (
          <Link to="/login" className="w-10 h-10 rounded-full bg-surface-container-high border border-white/5 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:border-white/10 transition-colors">
            <span className="material-symbols-outlined text-xl">person</span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
