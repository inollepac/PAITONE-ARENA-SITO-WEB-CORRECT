
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

// Componente per le pagine create dinamicamente o gestite come sottopagine
const CustomPage: React.FC<{ section: SectionContent, config: SiteConfig }> = ({ section, config }) => {
  const { navbarLogo } = config;
  const logoUrl = navbarLogo.logoSource === 'primary' ? config.primaryLogoUrl : config.secondaryLogoUrl;

  return (
    <div className="py-32 max-w-7xl mx-auto px-4 animate-in fade-in duration-700">
      <div className="max-w-4xl">
        <div className="flex items-center gap-8 mb-12">
          {section.showLogo && logoUrl && (
            <div 
              className="overflow-hidden shadow-2xl flex-shrink-0"
              style={{ 
                width: '120px', 
                height: '120px',
                borderRadius: `${navbarLogo.borderRadius}%`,
                border: navbarLogo.borderWidth > 0 ? `${navbarLogo.borderWidth}px solid var(--brand-green)` : 'none'
              }}
            >
              <img 
                src={logoUrl} 
                className="w-full h-full" 
                style={{ 
                  objectFit: navbarLogo.objectFit,
                  transform: `scale(${navbarLogo.scale})` 
                }} 
                alt="Logo" 
              />
            </div>
          )}
          <h1 className="text-6xl md:text-8xl font-black text-brand-blue uppercase italic tracking-tighter leading-none">
            {section.title}
          </h1>
        </div>
        <div className="relative">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-green rounded-full"></div>
          <p className="text-2xl text-brand-blue/70 leading-relaxed italic pl-10 font-medium">
            {section.description}
          </p>
        </div>
        <div className="mt-20 h-96 rounded-[4rem] bg-brand-light flex items-center justify-center text-brand-blue/5 border-2 border-dashed border-brand-blue/10">
          <i className="fas fa-image text-9xl"></i>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('home');
  const [config, setConfig] = useState<SiteConfig>(INITIAL_SITE_CONFIG);
  const [courts, setCourts] = useState<Court[]>(INITIAL_COURTS);
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
  };

  const updateCourts = (newCourts: Court[]) => {
    setCourts(newCourts);
    localStorage.setItem('arena_v2_courts', JSON.stringify(newCourts));
  };

  const updateEvents = (newEvents: Event[]) => {
    setEvents(newEvents);
    localStorage.setItem('arena_v2_events', JSON.stringify(newEvents));
  };

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
      sessionStorage.setItem('arena_v2_auth', 'true');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
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
          onUpdateCourts={updateCourts}
          onUpdateEvents={updateEvents}
        />
      );
    }

    const currentSection = config.sections.find(s => s.id === activePage);

    switch (activePage) {
      case 'home': return <HomeSections config={config} events={events} courts={courts} onNavigate={navigateTo} />;
      case 'space': return <OurSpace config={config} />;
      case 'sports': return <SportsPage config={config} courts={courts} />;
      case 'courses': return <CoursesPage />;
      case 'community': return <CommunityPage events={events} config={config} />;
      case 'booking': return <BookingSystem config={config} courts={courts} />;
      case 'contacts': return <ContactsPage config={config} />;
      default: 
        if (currentSection) return <CustomPage section={currentSection} config={config} />;
        return <HomeSections config={config} events={events} courts={courts} onNavigate={navigateTo} />;
    }
  };

  const { footerLogo } = config;
  const footerLogoUrl = footerLogo.logoSource === 'primary' ? config.primaryLogoUrl : config.secondaryLogoUrl;

  return (
    <div className="min-h-screen flex flex-col selection:bg-brand-green selection:text-brand-blue">
      <Navbar 
        activePage={activePage} 
        onNavigate={navigateTo} 
        config={config} 
        onAdminToggle={() => navigateTo(activePage === 'admin' ? 'home' : 'admin')}
        isAdminActive={activePage === 'admin'}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
      
      <main className="flex-grow pt-24">
        {activePage === 'home' && (
            <Hero 
                config={config} 
                onBookingClick={() => navigateTo('booking')} 
                onDiscoverClick={() => navigateTo('space')} 
            />
        )}
        {renderPage()}
      </main>

      <footer className="bg-brand-blue text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
            <div>
              <div className="flex items-center gap-6 mb-8">
                {footerLogo.enabled && footerLogoUrl && (
                  <div 
                    className="overflow-hidden shadow-xl" 
                    style={{ 
                      width: `${footerLogo.width}px`, 
                      height: `${footerLogo.height}px`,
                      borderRadius: `${footerLogo.borderRadius}%`,
                      border: footerLogo.borderWidth > 0 ? `${footerLogo.borderWidth}px solid var(--brand-green)` : 'none'
                    }}
                  >
                    <img src={footerLogoUrl} className="w-full h-full" style={{ objectFit: footerLogo.objectFit }} alt="Footer Logo" />
                  </div>
                )}
                {footerLogo.showName && (
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none">{config.centerName}</h3>
                )}
              </div>
              <p className="text-white/40 italic font-medium leading-relaxed">
                "La vera competenza incontra il massimo relax. La tua arena quotidiana per staccare la spina."
              </p>
            </div>
            <div>
              <h4 className="font-black mb-8 text-brand-green uppercase tracking-widest text-[10px]">Navigazione</h4>
              <ul className="space-y-4 text-white/60 text-sm font-bold uppercase italic">
                <li><button onClick={() => navigateTo('home')} className="hover:text-brand-green transition-all">Home</button></li>
                <li><button onClick={() => navigateTo('booking')} className="hover:text-brand-green transition-all text-white border-b border-brand-green">Prenota Campi</button></li>
                <li><button onClick={() => navigateTo('sports')} className="hover:text-brand-green transition-all">Tennis & Padel</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-8 text-brand-green uppercase tracking-widest text-[10px]">Contatti</h4>
              <div className="space-y-4 text-white/60 text-sm font-medium">
                <p><i className="fas fa-map-marker-alt mr-3 text-brand-green"></i> {config.address}</p>
                <p><i className="fab fa-whatsapp mr-3 text-brand-green"></i> {config.whatsapp}</p>
                <p><i className="fas fa-envelope mr-3 text-brand-green"></i> {config.email}</p>
              </div>
            </div>
            <div>
              <h4 className="font-black mb-8 text-brand-green uppercase tracking-widest text-[10px]">Social Arena</h4>
              <div className="flex gap-4">
                <a href="#" className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-brand-green hover:text-brand-blue transition-all border border-white/10 shadow-lg">
                  <i className="fab fa-instagram text-xl"></i>
                </a>
                <a href={`https://wa.me/${config.whatsapp}`} className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-brand-green hover:text-brand-blue transition-all border border-white/10 shadow-lg">
                  <i className="fab fa-whatsapp text-xl"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-24 pt-10 border-t border-white/5 text-center text-white/20 text-[10px] font-black uppercase tracking-[0.5em]">
            © {new Date().getFullYear()} {config.centerName} • Powered by Next Control
          </div>
        </div>
      </footer>

      <ChatBot config={config} onBookingClick={() => navigateTo('booking')} onNavigate={navigateTo} />
    </div>
  );
};

export default App;
