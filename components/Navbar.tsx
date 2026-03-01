
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Page, SiteConfig } from '../types';

interface NavbarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  config: SiteConfig;
  onAdminToggle: (tab?: string) => void;
  isAdminActive: boolean;
  isAuthenticated: boolean;
  onLogout: () => void;
  isEditMode: boolean;
  onUpdateConfig: (config: SiteConfig) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  activePage, 
  onNavigate, 
  config, 
  onAdminToggle, 
  isAdminActive, 
  isAuthenticated, 
  onLogout,
  isEditMode,
  onUpdateConfig
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { navbarLogo } = config;

  const logoUrl = navbarLogo.logoSource === 'primary' ? config.primaryLogoUrl : config.secondaryLogoUrl;

  const moveItem = (index: number, direction: 'left' | 'right') => {
    const newSections = [...config.sections];
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newSections.length) return;
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
    onUpdateConfig({ ...config, sections: newSections });
  };

  const deleteItem = (id: string) => {
    if (confirm("Vuoi eliminare questa voce dal menù? La sezione verrà disabilitata.")) {
      const newSections = config.sections.map(s => s.id === id ? { ...s, enabled: false, navLabel: '' } : s);
      onUpdateConfig({ ...config, sections: newSections });
    }
  };

  const addItem = () => {
    const id = `new_section_${Date.now()}`;
    const newSection = {
      id,
      navLabel: 'Nuova Voce',
      title: 'Nuova Sezione',
      description: 'Descrizione della sezione...',
      enabled: true,
      isCustom: true,
      elements: []
    };
    onUpdateConfig({ ...config, sections: [...config.sections, newSection] });
  };

  const navItems = config.sections
    .map((s, idx) => ({ ...s, originalIndex: idx }))
    .filter(s => s.enabled && s.navLabel && s.id !== 'booking');

  return (
    <nav className={`fixed w-full z-50 transition-all ${isEditMode ? 'top-12' : 'top-0'}`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 glass ${isEditMode ? 'rounded-b-[2rem] border-x border-b border-brand-green/30 shadow-2xl' : 'border-b border-brand-green/20'}`}>
        <div className="flex justify-between h-24 items-center">
          <div className="flex items-center cursor-pointer gap-4 group" onClick={() => onNavigate('home')}>
            {navbarLogo.enabled && (
              <div className="relative group/logo">
                <LogoContainer 
                  url={logoUrl} 
                  width={navbarLogo.width} 
                  height={navbarLogo.height} 
                  borderRadius={navbarLogo.borderRadius}
                  borderWidth={navbarLogo.borderWidth}
                />
                {isEditMode && (
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      onAdminToggle('logos');
                    }}
                    className="absolute inset-0 bg-brand-green/80 opacity-0 group-hover/logo:opacity-100 transition-opacity flex items-center justify-center rounded-inherit cursor-pointer z-30"
                    style={{ borderRadius: `${navbarLogo.borderRadius}%` }}
                  >
                    <i className="fas fa-edit text-brand-blue text-xs"></i>
                  </div>
                )}
              </div>
            )}
            
            {navbarLogo.showName && (
              <span className="text-xl font-black text-brand-blue uppercase tracking-tighter transition-colors group-hover:text-brand-green">
                {config.centerName}
              </span>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <div key={item.id} className="group/nav relative flex items-center">
                {isEditMode && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover/nav:opacity-100 transition-all bg-brand-blue rounded-full px-2 py-1 shadow-xl z-[60]">
                    <button onClick={() => moveItem(item.originalIndex, 'left')} className="text-white text-[8px] p-1 hover:text-brand-green"><i className="fas fa-arrow-left"></i></button>
                    <button onClick={() => deleteItem(item.id)} className="text-red-400 text-[8px] p-1 hover:text-red-500"><i className="fas fa-trash"></i></button>
                    <button onClick={() => moveItem(item.originalIndex, 'right')} className="text-white text-[8px] p-1 hover:text-brand-green"><i className="fas fa-arrow-right"></i></button>
                  </div>
                )}
                
                {isEditMode ? (
                  <input 
                    value={item.navLabel} 
                    onChange={(e) => {
                      const nextSections = [...config.sections];
                      nextSections[item.originalIndex].navLabel = e.target.value;
                      onUpdateConfig({ ...config, sections: nextSections });
                    }}
                    className="bg-brand-green/10 text-[10px] font-black uppercase tracking-widest text-brand-blue px-3 py-1 rounded-md w-24 focus:outline-none border border-brand-green/30 focus:ring-2 focus:ring-brand-green"
                  />
                ) : (
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={`text-xs font-black tracking-widest uppercase transition-all hover:text-brand-green ${
                      activePage === item.id ? 'text-brand-green border-b-2 border-brand-green' : 'text-brand-blue/70'
                    }`}
                  >
                    {item.navLabel}
                  </button>
                )}
              </div>
            ))}

            {isEditMode && (
              <button onClick={addItem} className="w-8 h-8 rounded-full bg-brand-green/20 text-brand-green flex items-center justify-center hover:bg-brand-green hover:text-brand-blue transition-all">
                <i className="fas fa-plus text-xs"></i>
              </button>
            )}
            
            <button
              onClick={() => onNavigate('booking')}
              className="bg-brand-blue text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-brand-green hover:text-brand-blue transition-all shadow-lg"
            >
              Prenota
            </button>
            
            <div className="flex items-center gap-2 border-l pl-4 border-brand-blue/10">
              <button 
                  onClick={() => onAdminToggle()}
                  className={`p-2.5 rounded-full transition ${isAdminActive ? 'bg-brand-green text-brand-blue' : 'text-brand-blue/30 hover:text-brand-blue'}`}
                  title="Impostazioni"
              >
                  <i className="fas fa-cog text-sm"></i>
              </button>
              {isAuthenticated && (
                <button 
                  onClick={onLogout}
                  className="p-2.5 rounded-full text-red-500 hover:bg-red-50 transition"
                  title="Logout"
                >
                  <i className="fas fa-sign-out-alt text-sm"></i>
                </button>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-brand-blue p-2">
              <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;

interface LogoContainerProps {
  url: string;
  width: number;
  height: number;
  borderRadius: number;
  borderWidth: number;
}

const LogoContainer: React.FC<LogoContainerProps> = ({ url, width, height, borderRadius, borderWidth }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (url && url.trim() !== '') {
      setLoading(true);
      setError(false);
      
      // Preload image to handle loading state correctly
      const img = new Image();
      img.src = url;
      img.onload = () => setLoading(false);
      img.onerror = () => {
        setLoading(false);
        setError(true);
      };
    } else {
      setLoading(false);
      setError(true);
    }
  }, [url]);

  return (
    <motion.div 
      className="relative overflow-hidden bg-white/5 flex items-center justify-center shadow-sm"
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        borderRadius: `${borderRadius}%`,
        border: borderWidth > 0 ? `${borderWidth}px solid var(--brand-green)` : 'none'
      }}
    >
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="shimmer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20"
          >
            <div className="w-full h-full bg-gradient-to-r from-gray-100 via-white/80 to-gray-100 animate-[shimmer_2s_infinite] bg-[length:200%_100%]"></div>
          </motion.div>
        ) : error ? (
          <motion.div 
            key="error"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-brand-green/30 bg-gray-50"
          >
            <i className="fas fa-image text-lg mb-1"></i>
            <span className="text-[5px] font-black uppercase tracking-widest opacity-50">No Logo</span>
          </motion.div>
        ) : (
          <motion.img 
            key="logo"
            src={url} 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-contain relative z-10 p-1" 
            alt="Logo" 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
