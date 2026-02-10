
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
}

const Navbar: React.FC<NavbarProps> = ({ 
  activePage, 
  onNavigate, 
  config, 
  onAdminToggle, 
  isAdminActive, 
  isAuthenticated, 
  onLogout 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Home', page: 'home' },
    ...config.sections
      .filter(s => s.enabled && s.navLabel && s.id !== 'booking')
      .map(s => ({ label: s.navLabel, page: s.id }))
  ];

  const bookingSection = config.sections.find(s => s.id === 'booking');

  const getLogoShapeClass = () => {
    switch(config.logoShape) {
      case 'square': return 'rounded-none';
      case 'rounded': return 'rounded-xl';
      case 'circle': return 'rounded-full';
      default: return 'rounded-none'; // 'none' non ha arrotondamento né bordi visibili
    }
  };

  const showTextBranding = !config.hideCenterName || !config.logoUrl;

  return (
    <nav className="fixed w-full z-50 glass border-b border-brand-green/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24 items-center">
          <div className="flex items-center cursor-pointer gap-4 group" onClick={() => onNavigate('home')}>
            <div 
              className={`relative flex items-center justify-center overflow-hidden transition-all duration-300 ${getLogoShapeClass()} ${config.logoShape !== 'none' ? 'border-2 border-brand-green' : ''}`}
              style={{ 
                width: `${config.logoWidth}px`, 
                height: `${config.logoWidth}px` 
              }}
            >
               {config.logoUrl ? (
                 <img 
                   src={config.logoUrl} 
                   className="w-full h-full object-cover z-10" 
                   style={{ 
                     transform: `scale(${config.logoScale}) translate(${config.logoX}%, ${config.logoY}%)` 
                   }} 
                   alt="Logo" 
                 />
               ) : (
                 <i className="fas fa-baseball-ball text-brand-green text-2xl z-10"></i>
               )}
            </div>
            {showTextBranding && (
              <div className="flex flex-col">
                <span className="text-xl font-bold text-brand-blue tracking-tight leading-none uppercase">
                  {config.centerName}
                </span>
                <span className="text-[10px] text-brand-green font-medium tracking-[0.2em] uppercase mt-1">Tennis & Padel Club</span>
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`text-sm font-semibold tracking-wide uppercase transition-all hover:text-brand-green ${
                  activePage === item.page ? 'text-brand-green border-b-2 border-brand-green' : 'text-brand-blue/70'
                }`}
              >
                {item.label}
              </button>
            ))}
            {bookingSection?.enabled && (
              <button
                onClick={() => onNavigate('booking')}
                className="bg-brand-blue text-white px-7 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-brand-green hover:text-brand-blue transition-all shadow-lg active:scale-95"
              >
                {bookingSection.navLabel || 'Prenota'}
              </button>
            )}
            
            <div className="flex items-center gap-2 border-l pl-6 border-brand-blue/10 ml-2">
              {isAuthenticated && (
                <button onClick={onLogout} className="text-brand-blue/40 hover:text-red-500 transition p-2"><i className="fas fa-sign-out-alt"></i></button>
              )}
              <button 
                  onClick={onAdminToggle}
                  className={`p-2.5 rounded-full transition ${isAdminActive ? 'bg-brand-green text-brand-blue shadow-inner' : 'text-brand-blue/30 hover:text-brand-blue'}`}
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

      {isOpen && (
        <div className="md:hidden glass border-b border-brand-green/20 shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="px-4 pt-4 pb-8 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => { onNavigate(item.page); setIsOpen(false); }}
                className={`block w-full text-center py-4 rounded-2xl text-base font-bold uppercase tracking-wider ${
                  activePage === item.page ? 'bg-brand-green/10 text-brand-green' : 'text-brand-blue/70'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
