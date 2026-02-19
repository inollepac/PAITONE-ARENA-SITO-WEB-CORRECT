
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Page, SiteConfig, Court, Event } from './types';
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
  const [history, setHistory] = useState<SiteConfig[]>([]);

  useEffect(() => {
    const savedConfig = localStorage.getItem('arena_v2_config');
    const savedCourts = localStorage.getItem('arena_v2_courts');
    const savedEvents = localStorage.getItem('arena_v2_events');
    const savedAuth = sessionStorage.getItem('arena_v2_auth');

    if (savedConfig) setConfig(JSON.parse(savedConfig));
    if (savedCourts) setCourts(JSON.parse(savedCourts));
    if (savedEvents) setEvents(JSON.parse(savedEvents));
    if (savedAuth === 'true') setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--brand-blue', config.primaryColor);
    document.documentElement.style.setProperty('--brand-green', config.accentColor);
    document.documentElement.style.setProperty('--brand-green-opaque', `${config.accentColor}33`);
  }, [config.primaryColor, config.accentColor]);

  const updateConfig = (newConfig: SiteConfig) => {
    setConfig(newConfig);
    localStorage.setItem('arena_v2_config', JSON.stringify(newConfig));
    console.log("Config updated and saved to localStorage");
  };

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
      sessionStorage.setItem('arena_v2_auth', 'true');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsEditMode(false);
    sessionStorage.removeItem('arena_v2_auth');
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
          onUpdateCourts={(c) => { setCourts(c); localStorage.setItem('arena_v2_courts', JSON.stringify(c)); }}
          onUpdateEvents={(e) => { setEvents(e); localStorage.setItem('arena_v2_events', JSON.stringify(e)); }}
        />
      );
    }

    switch (activePage) {
      case 'home': return <HomeSections config={config} isEditMode={isEditMode} onUpdateConfig={updateConfig} onNavigate={navigateTo} events={events} courts={courts} />;
      case 'space': return <OurSpace config={config} isEditMode={isEditMode} onUpdateConfig={updateConfig} />;
      case 'sports': return <SportsPage config={config} courts={courts} />;
      case 'courses': return <CoursesPage />;
      case 'community': return <CommunityPage events={events} config={config} />;
      case 'booking': return <BookingSystem config={config} courts={courts} />;
      case 'contacts': return <ContactsPage config={config} />;
      default: return <HomeSections config={config} isEditMode={isEditMode} onUpdateConfig={updateConfig} onNavigate={navigateTo} events={events} courts={courts} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-brand-green selection:text-brand-blue">
      {isAuthenticated && (
        <div className="fixed top-0 left-0 w-full z-[100] bg-brand-blue text-white px-6 py-3 flex items-center justify-between shadow-2xl border-b border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isEditMode ? 'bg-brand-green animate-pulse' : 'bg-white/20'}`}></div>
              <span className="text-[10px] font-black uppercase tracking-widest italic">Visual Control Arena</span>
            </div>
            <button 
              onClick={() => setIsEditMode(!isEditMode)}
              className={`px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isEditMode ? 'bg-brand-green text-brand-blue shadow-[0_0_15px_#A8D38E]' : 'bg-white/10'}`}
            >
              {isEditMode ? 'MODALITÀ EDITING ATTIVA' : 'Attiva Modifiche Live'}
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigateTo('admin')} className={`text-white/60 hover:text-white p-2 transition ${activePage === 'admin' ? 'text-brand-green' : ''}`}><i className="fas fa-cog"></i></button>
            <button onClick={handleLogout} className="bg-red-500/20 text-red-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition-all">Logout</button>
          </div>
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
      
      <main className={`flex-grow ${isAuthenticated ? 'pt-12' : 'pt-24'}`}>
        <AnimatePresence mode="wait">
          <motion.div key={activePage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {activePage === 'home' && <Hero config={config} isEditMode={isEditMode} onUpdateConfig={updateConfig} onBookingClick={() => navigateTo('booking')} onDiscoverClick={() => navigateTo('space')} />}
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="bg-brand-blue text-white py-12">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center opacity-40 italic font-black uppercase tracking-widest text-[9px]">
          <span>{config.centerName}</span>
          <span>Powered by Next v2.8</span>
        </div>
      </footer>

      <ChatBot config={config} onBookingClick={() => navigateTo('booking')} onNavigate={navigateTo} />
    </div>
  );
};

export default App;
