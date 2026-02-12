
import React, { useState, useEffect } from 'react';
import { Page, SiteConfig, Court, Event, SectionContent } from './types';
import { INITIAL_SITE_CONFIG, INITIAL_COURTS, INITIAL_EVENTS } from './constants';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HomeSections from './components/HomeSections';
import OurSpace from './components/OurSpace';
import SportsPage from './components/SportsPage';
import CoursesPage from './components/CoursesPage';
import CommunityPage from './components/CommunityPage';
import BookingSystem from './components/BookingSystem';
import ContactsPage from './components/ContactsPage';
import AdminPanel from './components/AdminPanel';
import ChatBot from './components/ChatBot';
import LoginPage from './components/LoginPage';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('home');
  const [config, setConfig] = useState<SiteConfig>(INITIAL_SITE_CONFIG);
  const [courts, setCourts] = useState<Court[]>(INITIAL_COURTS);
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const savedConfig = localStorage.getItem('arena_visual_config');
    const savedCourts = localStorage.getItem('arena_visual_courts');
    const savedEvents = localStorage.getItem('arena_visual_events');
    const savedAuth = sessionStorage.getItem('arena_visual_auth');

    if (savedConfig) setConfig(JSON.parse(savedConfig));
    if (savedCourts) setCourts(JSON.parse(savedCourts));
    if (savedEvents) setEvents(JSON.parse(savedEvents));
    if (savedAuth === 'true') setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--brand-blue', config.primaryColor);
    document.documentElement.style.setProperty('--brand-green', config.accentColor);
  }, [config.primaryColor, config.accentColor]);

  const updateConfig = (newConfig: SiteConfig) => {
    setConfig(newConfig);
    localStorage.setItem('arena_visual_config', JSON.stringify(newConfig));
  };

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
      sessionStorage.setItem('arena_visual_auth', 'true');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsEditMode(false);
    sessionStorage.removeItem('arena_visual_auth');
    setActivePage('home');
  };

  const navigateTo = (page: Page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    if (activePage === 'admin') {
      if (!isAuthenticated) return <LoginPage onLogin={handleLogin} />;
      return (
        <AdminPanel 
          config={config} 
          courts={courts} 
          events={events} 
          onUpdateConfig={updateConfig} 
          onUpdateCourts={setCourts}
          onUpdateEvents={setEvents}
        />
      );
    }

    const commonProps = { config, isEditMode, onUpdateConfig: updateConfig };

    switch (activePage) {
      case 'home': return <HomeSections {...commonProps} events={events} courts={courts} onNavigate={navigateTo} />;
      case 'space': return <OurSpace {...commonProps} />;
      case 'sports': return <SportsPage {...commonProps} courts={courts} />;
      case 'courses': return <CoursesPage />;
      case 'community': return <CommunityPage {...commonProps} events={events} />;
      case 'booking': return <BookingSystem config={config} courts={courts} />;
      case 'contacts': return <ContactsPage config={config} />;
      default: return <HomeSections {...commonProps} events={events} courts={courts} onNavigate={navigateTo} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isEditMode ? 'debug-screens' : ''}`}>
      {/* Floating Admin Toolbar */}
      {isAuthenticated && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 bg-brand-blue text-white px-8 py-4 rounded-full shadow-2xl border border-white/10 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3 pr-6 border-r border-white/10">
            <div className={`w-2 h-2 rounded-full ${isEditMode ? 'bg-brand-green animate-pulse shadow-[0_0_10px_#A8D38E]' : 'bg-white/20'}`}></div>
            <span className="text-[10px] font-black uppercase tracking-widest">Editor Mode</span>
          </div>
          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-tighter transition-all ${isEditMode ? 'bg-brand-green text-brand-blue' : 'bg-white/10 hover:bg-white/20'}`}
          >
            {isEditMode ? 'Disattiva' : 'Attiva Editing'}
          </button>
          <button onClick={() => navigateTo('admin')} className="text-white/60 hover:text-white p-2 transition"><i className="fas fa-cog"></i></button>
          <button onClick={handleLogout} className="text-white/40 hover:text-red-400 p-2 transition"><i className="fas fa-power-off"></i></button>
        </div>
      )}

      <Navbar 
        activePage={activePage} 
        onNavigate={navigateTo} 
        config={config} 
        onAdminToggle={() => navigateTo('admin')}
        isAdminActive={activePage === 'admin'}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        isEditMode={isEditMode}
        onUpdateConfig={updateConfig}
      />
      
      <main className="flex-grow">
        {activePage === 'home' && (
            <Hero 
                config={config} 
                isEditMode={isEditMode}
                onUpdateConfig={updateConfig}
                onBookingClick={() => navigateTo('booking')} 
                onDiscoverClick={() => navigateTo('space')} 
            />
        )}
        <div className={isEditMode ? 'relative' : ''}>
          {renderPage()}
        </div>
      </main>

      <footer className="bg-brand-blue text-white py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="space-y-6">
               <h3 className="text-2xl font-black uppercase italic">{config.centerName}</h3>
               <p className="text-white/40 italic text-sm">Design & Performance Arena.</p>
            </div>
            <div>
              <h4 className="font-black mb-6 text-brand-green uppercase text-[10px] tracking-widest">Navigazione</h4>
              <ul className="space-y-3 text-white/60 text-sm font-bold uppercase italic">
                {config.sections.filter(s => s.enabled && s.navLabel).map(s => (
                  <li key={s.id}><button onClick={() => navigateTo(s.id)} className="hover:text-brand-green transition-all">{s.navLabel}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-6 text-brand-green uppercase text-[10px] tracking-widest">Contatti</h4>
              <div className="space-y-3 text-white/60 text-sm font-medium">
                <p>{config.address}</p>
                <p>{config.whatsapp}</p>
              </div>
            </div>
            <div className="text-right">
               <span className="text-[10px] opacity-20 uppercase font-black tracking-widest italic">Visual Experience System</span>
            </div>
          </div>
        </div>
      </footer>

      <ChatBot config={config} onBookingClick={() => navigateTo('booking')} onNavigate={navigateTo} />
    </div>
  );
};

export default App;
