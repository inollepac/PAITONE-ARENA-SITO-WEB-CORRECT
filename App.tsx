
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
import FloatingToolbar from './components/FloatingToolbar';
import ChatBot from './components/ChatBot';
import LoginPage from './components/LoginPage';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('home');
  const [config, setConfig] = useState<SiteConfig>(INITIAL_SITE_CONFIG);
  const [courts, setCourts] = useState<Court[]>(INITIAL_COURTS);
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [adminTab, setAdminTab] = useState('general');
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
    
    // Design System variables
    const fontMap: Record<string, string> = {
      'Inter': '"Inter", sans-serif',
      'Space Grotesk': '"Space Grotesk", sans-serif',
      'Playfair Display': '"Playfair Display", serif',
      'JetBrains Mono': '"JetBrains Mono", monospace'
    };
    document.documentElement.style.setProperty('--font-main', fontMap[config.design.fontFamily] || fontMap['Inter']);
    
    const radiusMap: Record<string, string> = {
      'none': '0px',
      'small': '8px',
      'medium': '16px',
      'large': '32px',
      'full': '9999px'
    };
    document.documentElement.style.setProperty('--radius-main', radiusMap[config.design.borderRadius] || radiusMap['large']);
  }, [config]);

  const updateConfig = (newConfig: SiteConfig, saveToHistory = true) => {
    if (saveToHistory) {
      setHistory(prev => [...prev.slice(-19), config]); // Keep last 20 states
    }
    setConfig(newConfig);
    localStorage.setItem('arena_v2_config', JSON.stringify(newConfig));
  };

  const undo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setConfig(previous);
    localStorage.setItem('arena_v2_config', JSON.stringify(previous));
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

  const openAdminWithTab = (tab?: string) => {
    if (tab) setAdminTab(tab);
    navigateTo('admin');
  };

  const renderPage = () => {
    if (activePage === 'admin') {
      if (!isAuthenticated) return <LoginPage onLogin={handleLogin} />;
      return (
        <AdminPanel 
          config={config} 
          courts={courts} 
          events={events} 
          initialTab={adminTab}
          onUpdateConfig={updateConfig} 
          onUpdateCourts={(c) => { setCourts(c); localStorage.setItem('arena_v2_courts', JSON.stringify(c)); }}
          onUpdateEvents={(e) => { setEvents(e); localStorage.setItem('arena_v2_events', JSON.stringify(e)); }}
        />
      );
    }

    switch (activePage) {
      case 'home': return <HomeSections config={config} isEditMode={isEditMode} onUpdateConfig={updateConfig} onNavigate={navigateTo} events={events} courts={courts} />;
      case 'space': return <OurSpace config={config} isEditMode={isEditMode} onUpdateConfig={updateConfig} />;
      case 'sports': return <SportsPage config={config} courts={courts} isEditMode={isEditMode} onUpdateConfig={updateConfig} />;
      case 'courses': return <CoursesPage config={config} isEditMode={isEditMode} onUpdateConfig={updateConfig} />;
      case 'community': return <CommunityPage events={events} config={config} isEditMode={isEditMode} onUpdateConfig={updateConfig} />;
      case 'booking': return <BookingSystem config={config} courts={courts} />;
      case 'contacts': return <ContactsPage config={config} />;
      default: return <HomeSections config={config} isEditMode={isEditMode} onUpdateConfig={updateConfig} onNavigate={navigateTo} events={events} courts={courts} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-brand-green selection:text-brand-blue" style={{ fontFamily: 'var(--font-main)' }}>
      {isAuthenticated && (
        <FloatingToolbar 
          config={config}
          activePage={activePage}
          isEditMode={isEditMode}
          onToggleEdit={() => setIsEditMode(!isEditMode)}
          onNavigate={navigateTo}
          onOpenAdmin={openAdminWithTab}
          onUndo={undo}
          canUndo={history.length > 0}
          onSave={() => updateConfig(config, false)}
          onLogout={handleLogout}
        />
      )}

      <Navbar 
        activePage={activePage} 
        onNavigate={navigateTo} 
        config={config} 
        onAdminToggle={(tab) => {
          if (tab) setAdminTab(tab);
          navigateTo('admin');
        }}
        isAdminActive={activePage === 'admin'}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        isEditMode={isEditMode}
        onUpdateConfig={updateConfig}
      />
      
      <main className={`flex-grow ${isAuthenticated ? 'pt-12' : 'pt-24'}`}>
        <AnimatePresence mode="wait">
          <motion.div key={activePage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {activePage === 'home' && <Hero config={config} isEditMode={isEditMode} onUpdateConfig={updateConfig} onBookingClick={() => navigateTo('booking')} />}
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer config={config} />

      <ChatBot config={config} onBookingClick={() => navigateTo('booking')} onNavigate={navigateTo} />
    </div>
  );
};

export default App;
