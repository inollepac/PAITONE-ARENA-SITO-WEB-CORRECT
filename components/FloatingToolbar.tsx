
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SiteConfig, Page } from '../types';

interface FloatingToolbarProps {
  config: SiteConfig;
  activePage: Page;
  isEditMode: boolean;
  onToggleEdit: () => void;
  onNavigate: (page: Page) => void;
  onOpenAdmin: (tab?: string) => void;
  onUndo: () => void;
  canUndo: boolean;
  onSave: () => void;
  onLogout: () => void;
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ 
  config, 
  activePage, 
  isEditMode, 
  onToggleEdit, 
  onNavigate,
  onOpenAdmin,
  onUndo,
  canUndo,
  onSave,
  onLogout
}) => {
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = () => {
    setIsSaving(true);
    onSave();
    setTimeout(() => setIsSaving(false), 2000);
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999]">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-brand-blue/90 backdrop-blur-xl border border-white/20 p-2 rounded-full shadow-2xl flex items-center gap-2"
      >
        {/* Undo Button */}
        <div className="pl-2 border-r border-white/10 pr-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${canUndo ? 'text-white hover:bg-white/10' : 'text-white/20 cursor-not-allowed'}`}
            title="Annulla ultima modifica"
          >
            <i className="fas fa-undo text-xs"></i>
          </button>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-3 px-4 py-2 border-r border-white/10">
          <div className={`w-2 h-2 rounded-full animate-pulse ${isEditMode ? 'bg-brand-green' : 'bg-white/30'}`} />
          <span className="text-[10px] font-black uppercase tracking-widest text-white">
            {isEditMode ? 'Editing Live' : 'Preview Mode'}
          </span>
        </div>

        {/* Quick Navigation */}
        <div className="flex items-center gap-1 px-2">
          {[
            { id: 'home', icon: 'fa-home' },
            { id: 'sports', icon: 'fa-table-tennis' },
            { id: 'courses', icon: 'fa-graduation-cap' },
            { id: 'community', icon: 'fa-users' },
            { id: 'space', icon: 'fa-building' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => onNavigate(p.id)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${activePage === p.id ? 'bg-brand-green text-brand-blue' : 'text-white hover:bg-white/10'}`}
              title={p.id}
            >
              <i className={`fas ${p.icon} text-xs`}></i>
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/10">
          <button
            onClick={() => onOpenAdmin('design')}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all"
            title="Design System"
          >
            <i className="fas fa-palette text-xs"></i>
          </button>
          
          <button
            onClick={handleSave}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isSaving ? 'bg-brand-green text-brand-blue' : 'text-white hover:bg-white/10'}`}
            title="Salva Modifiche"
          >
            <i className={`fas ${isSaving ? 'fa-check' : 'fa-save'} text-xs`}></i>
          </button>

          <button
            onClick={onToggleEdit}
            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isEditMode ? 'bg-white text-brand-blue' : 'bg-brand-green text-brand-blue'}`}
          >
            {isEditMode ? 'Esci' : 'Modifica'}
          </button>

          <button
            onClick={onLogout}
            className="w-10 h-10 rounded-full flex items-center justify-center text-red-400 hover:bg-red-500/20 hover:text-red-500 transition-all"
            title="Logout"
          >
            <i className="fas fa-sign-out-alt text-xs"></i>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default FloatingToolbar;
