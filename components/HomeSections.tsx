
import React, { useMemo } from 'react';
import { SiteConfig, Event, Page, Court } from '../types';

interface HomeSectionsProps {
  config: SiteConfig;
  events: Event[];
  courts: Court[];
  onNavigate: (page: Page) => void;
}

const HomeSections: React.FC<HomeSectionsProps> = ({ config, events, courts, onNavigate }) => {
  const getSection = (id: string) => config.sections.find(s => s.id === id);

  const freeSlots = useMemo(() => {
    const times = ['08:00', '09:30', '11:00', '12:30', '14:00', '15:30', '17:00', '18:30', '20:00', '21:30'];
    const slots: { time: string; courtName: string; type: 'Tennis' | 'Padel' }[] = [];
    courts.forEach(court => {
      times.forEach(time => {
        if (Math.random() > 0.6) slots.push({ time, courtName: court.name, type: court.type });
      });
    });
    return slots.sort((a, b) => a.time.localeCompare(b.time)).slice(0, 8);
  }, [courts]);

  const whyUs = getSection('whyUs');
  const sports = getSection('sports');
  const community = getSection('community');
  const staff = getSection('staff');

  return (
    <div className="space-y-32 pb-32">
      {/* Vetrina Slot Liberi Oggi */}
      <section className="max-w-7xl mx-auto px-4 mt-20">
        <div className="bg-white rounded-[3rem] shadow-xl p-8 md:p-12 border border-brand-green/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-brand-green"></span></span>
                <span className="text-brand-green font-black uppercase tracking-widest text-[10px]">Disponibilità Real-Time</span>
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tighter text-brand-blue italic">In campo oggi</h2>
            </div>
            <button onClick={() => onNavigate('booking')} className="text-brand-blue font-black uppercase tracking-widest text-xs border-b-2 border-brand-green pb-1 hover:text-brand-green transition-all">Vedi tabellone <i className="fas fa-chevron-right ml-1"></i></button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {freeSlots.map((slot, i) => (
              <button key={i} onClick={() => window.open(config.externalBookingUrl, '_blank')} className="group bg-brand-light hover:bg-brand-blue p-5 rounded-[2.5rem] transition-all duration-300 border border-brand-green/5 hover:border-brand-blue shadow-sm hover:shadow-xl text-center">
                <div className="text-brand-blue group-hover:text-brand-green font-black text-2xl mb-1">{slot.time}</div>
                <div className="text-[10px] text-brand-blue/40 group-hover:text-white/60 font-black uppercase tracking-widest truncate">{slot.courtName}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Perché Paitone Arena */}
      {whyUs?.enabled && (
        <section className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-black mb-6 uppercase tracking-tighter text-brand-blue">{whyUs.title}</h2>
          <p className="text-brand-blue/60 text-lg italic max-w-2xl mx-auto mb-16">{whyUs.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
             {[
              { icon: 'fa-user-graduate', title: 'Metodo Scientifico' },
              { icon: 'fa-certificate', title: 'Certificazione' },
              { icon: 'fa-brain', title: 'Stacca e Impara' },
              { icon: 'fa-shield-alt', title: 'Sicurezza' }
            ].map((card, i) => (
              <div key={i} className="bg-white p-10 rounded-[3rem] shadow-xl border border-brand-green/5 group hover:-translate-y-2">
                <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center text-brand-green mx-auto mb-8 group-hover:bg-brand-green group-hover:text-white transition-all"><i className={`fas ${card.icon} text-2xl`}></i></div>
                <h3 className="text-xl font-black mb-4 uppercase text-brand-blue">{card.title}</h3>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Sports Area */}
      {sports?.enabled && (
        <section className="bg-brand-blue py-32 text-white overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-20 relative z-10">
            <div className="lg:w-1/2 space-y-8">
              <h2 className="text-5xl md:text-7xl font-black uppercase italic leading-none">{sports.title}</h2>
              <p className="text-xl text-white/60 border-l-2 border-brand-green pl-8 italic">{sports.description}</p>
              <button onClick={() => onNavigate('booking')} className="bg-brand-green text-brand-blue px-12 py-5 rounded-full font-black uppercase tracking-widest hover:bg-white transition-all shadow-2xl">Prenota ora</button>
            </div>
            <div className="lg:w-1/2"><img src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800" className="rounded-[4rem] shadow-2xl border-4 border-brand-green/20" alt="Sports" /></div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomeSections;
