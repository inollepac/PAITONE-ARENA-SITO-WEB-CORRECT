
import React, { useState } from 'react';
import { Page, SiteConfig, SectionContent } from '../types';

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

  const navItems: { label: string; page: Page }[] = [
    { label: 'Home', page: 'home' as Page },
    // Fix: cast Object.entries to correct type to avoid "unknown" property access errors
    ...(Object.entries(config.sections) as [keyof SiteConfig['sections'], SectionContent][])
      .filter(([id, section]) => section.enabled && section.navLabel && id !== 'booking')
      .map(([id, section]) => ({
        label: section.navLabel,
        page: id as Page
      }))
  ];

  const showBookingBtn = config.sections.booking.enabled;

  return (
    <nav className="fixed w-full z-50 glass border-b border-brand-green/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center cursor-pointer gap-4 group" onClick={() => onNavigate('home')}>
            <div className="relative w-12 h-12 flex items-center justify-center">
               <div className="absolute inset-0 border-2 border-brand-green rounded-full opacity-40 group-hover:scale-110 transition duration-500"></div>
               <i className="fas fa-baseball-ball text-brand-green text-2xl"></i>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-brand-blue tracking-tight leading-none uppercase">
                {config.centerName.split(' ')[0]} <span className="text-brand-green">{config.centerName.split(' ')[1]}</span>
              </span>
              <span className="text-[10px] text-brand-green font-medium tracking-[0.2em] uppercase mt-1">Tennis & Padel Club</span>
            </div>
          </div>

          {/* Desktop Menu */}
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
            {showBookingBtn && (
              <button
                onClick={() => onNavigate('booking')}
                className="bg-brand-blue text-white px-7 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-brand-green hover:text-brand-blue transition-all shadow-lg active:scale-95"
              >
                {config.sections.booking.navLabel || 'Prenota'}
              </button>
            )}
            
            <div className="flex items-center gap-2 border-l pl-6 border-brand-blue/10 ml-2">
              {isAuthenticated && (
                <button
                  onClick={onLogout}
                  className="text-brand-blue/40 hover:text-red-500 transition p-2"
                  title="Logout"
                >
                  <i className="fas fa-sign-out-alt"></i>
                </button>
              )}
              <button 
                  onClick={onAdminToggle}
                  className={`p-2.5 rounded-full transition ${isAdminActive ? 'bg-brand-green text-brand-blue shadow-inner' : 'text-brand-blue/30 hover:text-brand-blue'}`}
              >
                  <i className="fas fa-cog text-sm"></i>
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-brand-blue p-2">
              <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
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
            {showBookingBtn && (
              <button
                onClick={() => { onNavigate('booking'); setIsOpen(false); }}
                className="block w-full text-center mt-6 bg-brand-blue text-white py-4 rounded-full font-bold uppercase tracking-widest shadow-lg"
              >
                {config.sections.booking.navLabel || 'Prenota'}
              </button>
            )}
            <div className="pt-8 flex flex-col gap-4 border-t border-brand-blue/5 mt-8">
              <button
                onClick={() => { onAdminToggle(); setIsOpen(false); }}
                className={`flex items-center justify-center gap-3 py-4 rounded-2xl font-bold ${isAdminActive ? 'bg-brand-green text-brand-blue' : 'text-brand-blue/40 bg-gray-50'}`}
              >
                <i className="fas fa-cog"></i> Area Amministratore
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => { onLogout(); setIsOpen(false); }}
                  className="py-3 text-red-500 text-sm font-bold uppercase"
                >
                  Esci dalla sessione
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
