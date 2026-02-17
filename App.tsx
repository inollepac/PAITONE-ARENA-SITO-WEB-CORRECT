
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [history, setHistory] = useState<SiteConfig[]>([]);

  // Caricamento iniziale e persistenza
  useEffect(() => {
    const savedConfig = localStorage.getItem('arena_v2_config');
    const savedCourts = localStorage.getItem('arena_v2_courts');
    const savedEvents = localStorage.getItem('arena_v2_events');
    const savedAuth = sessionStorage.getItem('arena_v2_auth');
    const savedHistory = localStorage.getItem('arena_v2_history');

    if (savedConfig) setConfig(JSON.parse(savedConfig));
    if (savedCourts) setCourts(JSON.parse(savedCourts));
    if (savedEvents) setEvents(JSON.parse(savedEvents));
    if (savedAuth === 'true') setIsAuthenticated(true);
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--brand-blue', config.primaryColor);
    document.documentElement.style.setProperty('--brand-green', config.accentColor);
    document.documentElement.style.setProperty('--brand-green-opaque', `${config.accentColor}33`);
  }, [config.primaryColor, config.accentColor]);

  const updateConfig = (newConfig: SiteConfig, saveToHistory = true) => {
    if (saveToHistory) {
      const newHistory = [config, ...history].slice(0, 10); // Mantieni ultime 10 versioni
      setHistory(newHistory);
      localStorage.setItem('arena_v2_history', JSON.stringify(newHistory));
    }
    setConfig(newConfig);
    localStorage.setItem('arena_v2_config', JSON.stringify(newConfig));
  };

  const restoreVersion = () => {
    if (history.length === 0) {
      alert("Nessuna versione precedente disponibile.");
      return;
    }
    const previous = history[0];
    const newHistory = history.slice(1);
    setHistory(newHistory);
    setConfig(previous);
    localStorage.setItem('arena_v2_config', JSON.stringify(previous));
    localStorage.setItem('arena_v2_history', JSON.stringify(newHistory));
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
          onUpdateConfig={(c: SiteConfig) => updateConfig(c)} 
          onUpdateCourts={(c: Court[]) => { setCourts(c); localStorage.setItem('arena_v2_courts', JSON.stringify(c)); }}
          onUpdateEvents={(e: Event[]) => { setEvents(e); localStorage.setItem('arena_v2_events', JSON.stringify(e)); }}
        />
      );
    }

    const commonProps = { config, isEditMode, onUpdateConfig: updateConfig };

    switch (activePage) {
      case 'home': return <HomeSections {...commonProps} events={events} courts={courts} onNavigate={navigateTo} />;
      case 'space': return <OurSpace config={config} />;
      case 'sports': return <SportsPage config={config} courts={courts} />;
      case 'courses': return <CoursesPage />;
      case 'community': return <CommunityPage events={events} config={config} />;
      case 'booking': return <BookingSystem config={config} courts={courts} />;
      case 'contacts': return <ContactsPage config={config} />;
      default: return <HomeSections {...commonProps} events={events} courts={courts} onNavigate={navigateTo} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col selection:bg-brand-green selection:text-brand-blue ${isEditMode ? 'debug-screens' : ''}`}>
      
      {/* Visual CMS Toolbar (Solo Admin) */}
      {isAuthenticated && (
        <div className="fixed top-0 left-0 w-full z-[100] bg-brand-blue text-white px-6 py-3 flex items-center justify-between shadow-2xl border-b border-white/10 backdrop-blur-md animate-in slide-in-from-top duration-500">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isEditMode ? 'bg-brand-green animate-pulse shadow-[0_0_10px_#A8D38E]' : 'bg-white/20'}`}></div>
              <span className="text-[10px] font-black uppercase tracking-widest italic">Visual Control Arena</span>
            </div>
            <div className="h-6 w-px bg-white/10"></div>
            <button 
              onClick={() => setIsEditMode(!isEditMode)}
              className={`px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isEditMode ? 'bg-brand-green text-brand-blue' : 'bg-white/10 hover:bg-white/20'}`}
            >
              {isEditMode ? 'Esci dall\'Editing' : 'Attiva Modifiche Live'}
            </button>
          </div>
          <div className="flex items-center gap-4">
            {isEditMode && (
              <button 
                onClick={restoreVersion}
                disabled={history.length === 0}
                className="text-[10px] font-black uppercase text-white/40 hover:text-white transition-all disabled:opacity-20"
              >
                <i className="fas fa-undo mr-2"></i> Ripristina Precedente ({history.length})
              </button>
            )}
            <button onClick={() => navigateTo('admin')} className="text-white/60 hover:text-white p-2 transition"><i className="fas fa-cog"></i></button>
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
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
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
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="bg-brand-blue text-white py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
            <div>
               <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none mb-4">{config.centerName}</h3>
               <p className="text-white/40 italic font-medium">Design & Performance Arena.</p>
            </div>
            <div>
              <h4 className="font-black mb-8 text-brand-green uppercase tracking-widest text-[10px]">Navigazione</h4>
              <ul className="space-y-4 text-white/60 text-sm font-bold uppercase italic">
                {config.sections.filter(s => s.enabled && s.navLabel).map(s => (
                  <li key={s.id}><button onClick={() => navigateTo(s.id)} className="hover:text-brand-green transition-all">{s.navLabel}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-8 text-brand-green uppercase tracking-widest text-[10px]">Contatti</h4>
              <div className="space-y-4 text-white/60 text-sm font-medium">
                <p>{config.address}</p>
                <p>{config.whatsapp}</p>
              </div>
            </div>
            <div className="text-right">
               <span className="text-[10px] opacity-20 uppercase font-black tracking-widest italic">Visual Experience System v2.0</span>
            </div>
          </div>
        </div>
      </footer>

      <ChatBot config={config} onBookingClick={() => navigateTo('booking')} onNavigate={navigateTo} />
    </div>
  );
};

export default App;
