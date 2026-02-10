
import React, { useState, useEffect } from 'react';
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

  // Persistence simulation
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

  // Safe navigation that checks if page is enabled
  const navigateTo = (page: Page) => {
    if (page === 'home' || page === 'admin') {
      setActivePage(page);
      window.scrollTo(0, 0);
      return;
    }
    
    const sectionKey = page as keyof SiteConfig['sections'];
    if (config.sections[sectionKey] && !config.sections[sectionKey].enabled) {
      setActivePage('home');
    } else {
      setActivePage(page);
    }
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    if (activePage === 'admin') {
      if (!isAuthenticated) {
        return <LoginPage onLogin={handleLogin} />;
      }
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

    switch (activePage) {
      case 'home': return <HomeSections config={config} events={events} courts={courts} onNavigate={navigateTo} />;
      case 'space': return <OurSpace config={config} />;
      case 'sports': return <SportsPage config={config} courts={courts} />;
      case 'courses': return <CoursesPage />;
      case 'community': return <CommunityPage events={events} />;
      case 'booking': return <BookingSystem config={config} courts={courts} />;
      case 'contacts': return <ContactsPage config={config} />;
      default: return <HomeSections config={config} events={events} courts={courts} onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        activePage={activePage} 
        onNavigate={navigateTo} 
        config={config} 
        onAdminToggle={() => {
            if (activePage === 'admin') navigateTo('home');
            else navigateTo('admin');
        }}
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

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">{config.centerName}</h3>
            <p className="text-gray-400 italic">"Gioca. Incontra. Rilassati."</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-emerald-400">Link Rapidi</h4>
            <ul className="space-y-2 text-gray-400">
              <li><button onClick={() => navigateTo('home')} className="hover:text-white transition">Home</button></li>
              {config.sections.booking.enabled && <li><button onClick={() => navigateTo('booking')} className="hover:text-white transition">Prenota</button></li>}
              {config.sections.sports.enabled && <li><button onClick={() => navigateTo('sports')} className="hover:text-white transition">Campi</button></li>}
              {config.sections.courses.enabled && <li><button onClick={() => navigateTo('courses')} className="hover:text-white transition">Corsi</button></li>}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-emerald-400">Contatti</h4>
            <p className="text-gray-400 text-sm mb-2"><i className="fas fa-map-marker-alt mr-2"></i> {config.address}</p>
            <p className="text-gray-400 text-sm mb-2"><i className="fas fa-phone mr-2"></i> {config.phone}</p>
            <p className="text-gray-400 text-sm"><i className="fas fa-envelope mr-2"></i> {config.email}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-emerald-400">Social</h4>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-500 transition"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-500 transition"><i className="fab fa-instagram"></i></a>
              <a href={`https://wa.me/${config.whatsapp}`} className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-500 transition"><i className="fab fa-whatsapp"></i></a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} {config.centerName}. Tutti i diritti riservati.
        </div>
      </footer>

      <ChatBot config={config} onBookingClick={() => navigateTo('booking')} onNavigate={navigateTo} />
    </div>
  );
};

export default App;
