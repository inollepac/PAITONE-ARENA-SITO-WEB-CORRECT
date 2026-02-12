
import React, { useState } from 'react';
import { Page, SiteConfig } from '../types';

interface NavbarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  config: SiteConfig;
  onAdminToggle: () => void;
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

  const moveItem = (index: number, direction: 'left' | 'right') => {
    const newSections = [...config.sections];
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newSections.length) return;
    
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
    onUpdateConfig({ ...config, sections: newSections });
  };

  const navItems = config.sections
    .map((s, idx) => ({ ...s, originalIndex: idx }))
    .filter(s => s.enabled && s.navLabel && s.id !== 'booking');

  const logoUrl = navbarLogo.logoSource === 'primary' ? config.primaryLogoUrl : config.secondaryLogoUrl;

  return (
    <nav className={`fixed w-full z-50 transition-all ${isEditMode ? 'top-12' : 'top-0'}`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 glass ${isEditMode ? 'rounded-b-[2rem] border-x border-b border-brand-green/30 shadow-2xl' : 'border-b border-brand-green/20'}`}>
        <div className="flex justify-between h-24 items-center">
          <div className="flex items-center cursor-pointer gap-4 group" onClick={() => onNavigate('home')}>
            {navbarLogo.enabled && logoUrl && (
              <div 
                className="relative overflow-hidden"
                style={{ 
                  width: `${navbarLogo.width}px`, 
                  height: `${navbarLogo.height}px`,
                  borderRadius: `${navbarLogo.borderRadius}%`,
                  border: navbarLogo.borderWidth > 0 ? `${navbarLogo.borderWidth}px solid var(--brand-green)` : 'none'
                }}
              >
                <img src={logoUrl} className="w-full h-full object-contain" />
              </div>
            )}
            {navbarLogo.showName && (
              <span className="text-xl font-bold text-brand-blue uppercase tracking-tighter">
                {config.centerName}
              </span>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item, i) => (
              <div key={item.id} className="group/nav relative flex items-center">
                {isEditMode && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover/nav:opacity-100 transition-all bg-brand-blue rounded-full px-2 py-1 shadow-xl z-[60]">
                    <button onClick={() => moveItem(item.originalIndex, 'left')} className="text-white text-[8px] p-1 hover:text-brand-green"><i className="fas fa-arrow-left"></i></button>
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
            
            <button
              onClick={() => onNavigate('booking')}
              className="bg-brand-blue text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-brand-green hover:text-brand-blue transition-all shadow-lg"
            >
              Prenota
            </button>
            
            <div className="flex items-center gap-2 border-l pl-6 border-brand-blue/10">
              <button 
                  onClick={onAdminToggle}
                  className={`p-2.5 rounded-full transition ${isAdminActive ? 'bg-brand-green text-brand-blue' : 'text-brand-blue/30 hover:text-brand-blue'}`}
              >
                  <i className="fas fa-cog text-sm"></i>
              </button>
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-brand-blue p-2">
              <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
