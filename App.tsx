
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

// Componente per le pagine create dinamicamente
const CustomPage: React.FC<{ section: SectionContent, config: SiteConfig }> = ({ section, config }) => {
  const { navbarLogo } = config;
  const logoUrl = navbarLogo.logoSource === 'primary' ? config.primaryLogoUrl : config.secondaryLogoUrl;

  return (
    <div className="py-24 max-w-7xl mx-auto px-4">
      <div className="max-w-4xl">
        <div className="flex items-center gap-6 mb-8">
          {section.showLogo && logoUrl && (
            <div 
              className="overflow-hidden shadow-md"
              style={{ 
                width: '80px', 
                height: '80px',
                borderRadius: `${navbarLogo.borderRadius}%`,
                border: navbarLogo.borderWidth > 0 ? `${navbarLogo.borderWidth}px solid var(--brand-green)` : 'none'
              }}
            >
              <img 
                src={logoUrl} 
                className="w-full h-full" 
                style={{ 
                  objectFit: navbarLogo.objectFit,
                  transform: `scale(${navbarLogo.scale}) translate(${navbarLogo.x}%, ${navbarLogo.y}%)` 
                }} 
                alt="Logo" 
              />
            </div>
          )}
          <h1 className="text-6xl font-black text-brand-blue uppercase italic">{section.title}</h1>
        </div>
        <p className="text-2xl text-brand-blue/60 leading-relaxed italic border-l-4 border-brand-green pl-8">
          {section.description}
        </p>
        <div className="mt-16 h-96 rounded-[4rem] bg-brand-light flex items-center justify-center text-brand-blue/20">
          <i className="fas fa-image text-8xl"></i>
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
    const savedConfig = localStorage.getItem('ace_site_config');
    const savedCourts = localStorage.getItem('ace_site_courts');
    const savedEvents = localStorage.getItem('ace_site_events');
    const savedAuth = sessionStorage.getItem('ace_is_authenticated');

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
    localStorage.setItem('ace_site_config', JSON.stringify(newConfig));
  };

  const updateCourts = (newCourts: Court[]) => {
    setCourts(newCourts);
    localStorage.setItem('ace_site_courts', JSON.stringify(newCourts));
  };

  const updateEvents = (newEvents: Event[]) => {
    setEvents(newEvents);
    localStorage.setItem('ace_site_events', JSON.stringify(newEvents));
  };

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
      sessionStorage.setItem('ace_is_authenticated', 'true');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('ace_is_authenticated');
    setActivePage('home');
  };

  const navigateTo = (page: Page) => {
    setActivePage(page);
    window.scrollTo(0, 0);
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
      case 'community': return <CommunityPage events={events} />;
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
    <div className="min-h-screen flex flex-col">
      <Navbar 
        activePage={activePage} 
        onNavigate={navigateTo} 
        config={config} 
        onAdminToggle={() => navigateTo(activePage === 'admin' ? 'home' : 'admin')}
        isAdminActive={activePage === 'admin'}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
      
      <main className="flex-grow pt-16">
        {activePage === 'home' && (
            <Hero 
                config={config} 
                onBookingClick={() => navigateTo('booking')} 
                onDiscoverClick={() => navigateTo('space')} 
            />
        )}
        {renderPage()}
      </main>

      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-4 mb-6">
              {footerLogo.enabled && footerLogoUrl && (
                <div 
                  className="overflow-hidden" 
                  style={{ 
                    width: `${footerLogo.width}px`, 
                    height: `${footerLogo.height}px`,
                    borderRadius: `${footerLogo.borderRadius}%`,
                    border: footerLogo.borderWidth > 0 ? `${footerLogo.borderWidth}px solid var(--brand-green)` : 'none'
                  }}
                >
                  <img src={footerLogoUrl} className="w-full h-full" style={{ objectFit: footerLogo.objectFit, transform: `scale(${footerLogo.scale}) translate(${footerLogo.x}%, ${footerLogo.y}%)` }} alt="Footer Logo" />
                </div>
              )}
              {footerLogo.showName && (
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">{config.centerName}</h3>
              )}
            </div>
            <p className="text-gray-400 italic">"Gioca. Incontra. Rilassati. Il potere dello sport nel Control Arena."</p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-brand-green uppercase tracking-widest text-xs">Esplora</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><button onClick={() => navigateTo('home')} className="hover:text-white transition">Home</button></li>
              <li><button onClick={() => navigateTo('booking')} className="hover:text-white transition font-bold text-brand-green">Prenota Campi</button></li>
              <li><button onClick={() => navigateTo('sports')} className="hover:text-white transition">Sport & Arena</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-brand-green uppercase tracking-widest text-xs">Contatti Diretti</h4>
            <p className="text-gray-400 text-sm mb-3"><i className="fas fa-map-marker-alt mr-2 text-brand-green"></i> {config.address}</p>
            <p className="text-gray-400 text-sm mb-3"><i className="fas fa-phone mr-2 text-brand-green"></i> {config.phone}</p>
            <p className="text-gray-400 text-sm"><i className="fas fa-envelope mr-2 text-brand-green"></i> {config.email}</p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-brand-green uppercase tracking-widest text-xs">Seguici</h4>
            <div className="flex space-x-4">
              <a href="#" className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center hover:bg-brand-green hover:text-brand-blue transition-all"><i className="fab fa-instagram text-xl"></i></a>
              <a href={`https://wa.me/${config.whatsapp}`} className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center hover:bg-brand-green hover:text-brand-blue transition-all"><i className="fab fa-whatsapp text-xl"></i></a>
            </div>
          </div>
        </div>
      </footer>

      <ChatBot config={config} onBookingClick={() => navigateTo('booking')} onNavigate={navigateTo} />
    </div>
  );
};

export default App;
