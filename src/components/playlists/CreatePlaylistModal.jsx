import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createPlaylist } from '../../features/playlistSlice';

const CreatePlaylistModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await dispatch(createPlaylist({ name: name.trim(), description: description.trim() })).unwrap();
      setName('');
      setDescription('');
      onClose();
    } catch (error) {
      alert(error || 'Failed to create playlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Modal Card */}
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        <h2 className="font-headline-md text-[20px] text-on-surface mb-6 font-bold">Create Playlist</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label htmlFor="modal-pl-name" className="block font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Playlist Name
            </label>
            <input
              type="text"
              id="modal-pl-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Late Night Drives"
              required
              maxLength={40}
              className="glow-input w-full bg-surface-container-low border border-surface-variant text-on-surface font-body-md rounded-lg px-4 py-3 focus:ring-0 focus:outline-none transition-colors"
            />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label htmlFor="modal-pl-desc" className="block font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Description (Optional)
            </label>
            <textarea
              id="modal-pl-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add an optional description..."
              rows={3}
              maxLength={200}
              className="glow-input w-full bg-surface-container-low border border-surface-variant text-on-surface font-body-md rounded-lg px-4 py-3 focus:ring-0 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-full font-label-md text-label-md text-on-surface hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="bg-[#7c3aed] text-white hover:bg-[#8b5cf6] font-label-md text-label-md px-6 py-2.5 rounded-full transition-colors hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlaylistModal;
