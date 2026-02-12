
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

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...config.sections];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newSections.length) return;
    
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
    onUpdateConfig({ ...config, sections: newSections });
  };

  const navItems = config.sections
    .map((s, idx) => ({ ...s, index: idx }))
    .filter(s => s.enabled && s.navLabel && s.id !== 'booking');

  const logoUrl = navbarLogo.logoSource === 'primary' ? config.primaryLogoUrl : config.secondaryLogoUrl;

  return (
    <nav className={`fixed w-full z-50 transition-all ${isEditMode ? 'top-2' : 'top-0'}`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all ${isEditMode ? 'glass rounded-[2rem] border-2 border-brand-green/50 shadow-2xl' : 'glass border-b border-brand-green/20'}`}>
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
              <div key={item.id} className="group relative flex items-center">
                {isEditMode && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                     <button onClick={() => moveSection(item.index, 'up')} className="bg-brand-blue text-white w-6 h-6 rounded-full text-[10px]"><i className="fas fa-arrow-left"></i></button>
                     <button onClick={() => moveSection(item.index, 'down')} className="bg-brand-blue text-white w-6 h-6 rounded-full text-[10px]"><i className="fas fa-arrow-right"></i></button>
                  </div>
                )}
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`text-xs font-black tracking-widest uppercase transition-all hover:text-brand-green ${
                    activePage === item.id ? 'text-brand-green border-b-2 border-brand-green' : 'text-brand-blue/70'
                  } ${isEditMode ? 'border border-dashed border-brand-green/40 px-3 py-1 rounded-md' : ''}`}
                >
                  {item.navLabel}
                </button>
              </div>
            ))}
            
            <button
              onClick={() => onNavigate('booking')}
              className="bg-brand-blue text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-brand-green hover:text-brand-blue transition-all shadow-lg"
            >
              Prenota
            </button>
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
