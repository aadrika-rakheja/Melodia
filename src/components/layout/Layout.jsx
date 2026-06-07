import React, { useState } from 'react';
import Sidebar from './Sidebar';
import GlobalPlayer from '../player/GlobalPlayer';
import CreatePlaylistModal from '../playlists/CreatePlaylistModal';

const Layout = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#e0e2ea] flex relative">
      {/* Navigation Sidebar */}
      <Sidebar onCreatePlaylistClick={() => setIsModalOpen(true)} />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen pb-28">
        <main className="flex-1 w-full flex flex-col">
          {children}
        </main>
      </div>

      {/* Persistent Global Player */}
      <GlobalPlayer />

      {/* Modal overlays */}
      <CreatePlaylistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Layout;
