
import React, { useMemo } from 'react';
import { SiteConfig, Event, Page, Court } from '../types';

interface HomeSectionsProps {
  config: SiteConfig;
  events: Event[];
  courts: Court[];
  onNavigate: (page: Page) => void;
}

const HomeSections: React.FC<HomeSectionsProps> = ({ config, events, courts, onNavigate }) => {
  const { sections } = config;

  const freeSlots = useMemo(() => {
    const times = ['08:00', '09:30', '11:00', '12:30', '14:00', '15:30', '17:00', '18:30', '20:00', '21:30'];
    const slots: { time: string; courtName: string; type: 'Tennis' | 'Padel' }[] = [];
    
    courts.forEach(court => {
      times.forEach(time => {
        if (Math.random() > 0.6) {
          slots.push({
            time,
            courtName: court.name,
            type: court.type
          });
        }
      });
    });

    return slots.sort((a, b) => a.time.localeCompare(b.time)).slice(0, 8);
  }, [courts]);

  return (
    <div className="space-y-32 pb-32">
      {/* Vetrina Slot Liberi Oggi */}
      <section className="max-w-7xl mx-auto px-4 mt-20">
        <div className="bg-white rounded-[3rem] shadow-xl p-8 md:p-12 border border-brand-green/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-green"></span>
                </span>
                <span className="text-brand-green font-black uppercase tracking-widest text-[10px]">Disponibilità Real-Time</span>
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tighter text-brand-blue italic">In campo oggi</h2>
              <p className="text-brand-blue/50 text-sm font-medium">Gli ultimi slot disponibili per la tua partita dell'ultimo minuto.</p>
            </div>
            <button 
              onClick={() => onNavigate('booking')}
              className="group flex items-center gap-2 text-brand-blue font-black uppercase tracking-widest text-xs border-b-2 border-brand-green pb-1 hover:text-brand-green transition-all"
            >
              Vedi tabellone completo <i className="fas fa-chevron-right ml-1 group-hover:translate-x-1 transition-transform"></i>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {freeSlots.map((slot, i) => (
              <button
                key={i}
                onClick={() => window.open(config.externalBookingUrl, '_blank')}
                className="group bg-brand-light hover:bg-brand-blue p-5 rounded-[2.5rem] transition-all duration-300 border border-brand-green/5 hover:border-brand-blue shadow-sm hover:shadow-xl text-center flex flex-col items-center justify-center"
              >
                <div className="text-brand-blue group-hover:text-brand-green font-black text-2xl mb-1">{slot.time}</div>
                <div className="text-[10px] text-brand-blue/40 group-hover:text-white/60 font-black uppercase tracking-widest truncate w-full">{slot.courtName}</div>
                <div className="mt-3 text-brand-green text-[10px] flex items-center gap-1">
                  <i className={`fas ${slot.type === 'Padel' ? 'fa-table-tennis' : 'fa-baseball-ball'}`}></i>
                  <span className="font-bold uppercase">{slot.type}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Perché Paitone Arena */}
      {sections.whyUs.enabled && (
        <section className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-brand-green/10 rounded-full"></div>
            <h2 className="text-5xl font-black mb-6 uppercase tracking-tighter text-brand-blue">{sections.whyUs.title}</h2>
            <p className="text-brand-blue/60 text-lg italic max-w-2xl mx-auto">{sections.whyUs.description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { icon: 'fa-user-graduate', title: 'Metodo Scientifico', desc: 'Ogni lezione è guidata da laureati in Scienze Motorie per il massimo dell\'efficacia.' },
              { icon: 'fa-certificate', title: 'Certificazione', desc: 'Staff qualificato dalle federazioni nazionali: impari la tecnica corretta da subito.' },
              { icon: 'fa-brain', title: 'Stacca e Impara', desc: 'Rilasciamo lo stress della giornata trasformandolo in nuove abilità tecniche.' },
              { icon: 'fa-shield-alt', title: 'Sicurezza Motoria', desc: 'Curiamo il gesto atletico per prevenire infortuni e massimizzare la performance.' }
            ].map((card, i) => (
              <div key={i} className="bg-white p-10 rounded-[3rem] shadow-xl hover:shadow-2xl transition-all border border-brand-green/5 group hover:-translate-y-2 text-center">
                <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center text-brand-green mx-auto mb-8 group-hover:bg-brand-green group-hover:text-white transition-all duration-500 shadow-inner">
                  <i className={`fas ${card.icon} text-2xl`}></i>
                </div>
                <h3 className="text-xl font-black mb-4 uppercase text-brand-blue tracking-tight">{card.title}</h3>
                <p className="text-brand-blue/50 leading-relaxed text-sm font-medium">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Tennis & Padel - Dual Arena Layout */}
      {sections.sports.enabled && (
        <section className="bg-brand-blue py-32 text-white relative overflow-hidden">
          <div className="circle-accent w-[600px] h-[600px] -top-80 -right-40"></div>
          <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2 space-y-8">
              <span className="text-brand-green font-black uppercase tracking-[0.4em] text-xs">The Excellence</span>
              <h2 className="text-5xl md:text-7xl font-black leading-[0.95] uppercase italic">{sections.sports.title}</h2>
              <p className="text-xl text-white/60 leading-relaxed border-l-2 border-brand-green pl-8 italic">
                {sections.sports.description}
              </p>
              <div className="flex gap-4 pt-6">
                <button 
                  onClick={() => onNavigate('booking')}
                  className="bg-brand-green text-brand-blue px-10 py-4 rounded-full font-black uppercase tracking-widest hover:bg-white transition-all shadow-2xl active:scale-95"
                >
                  Prenota ora
                </button>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
               <div className="absolute inset-0 bg-brand-green/10 rounded-full blur-[100px]"></div>
               <div className="grid grid-cols-2 gap-6 relative">
                  <div className="space-y-6">
                    <img src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800" className="rounded-[4rem] h-80 w-full object-cover shadow-2xl border-4 border-brand-green/20" alt="Arena Padel" />
                    <div className="bg-brand-green p-8 rounded-[3rem] text-brand-blue text-center">
                        <span className="text-4xl font-black block">Qualità</span>
                        <span className="text-xs font-bold uppercase tracking-widest">Federale</span>
                    </div>
                  </div>
                  <div className="space-y-6 pt-12">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[3rem] text-center">
                        <span className="text-4xl font-black block text-brand-green">Top</span>
                        <span className="text-xs font-bold uppercase tracking-widest">Training</span>
                    </div>
                    <img src="https://images.unsplash.com/photo-1595435063785-547bb7c2c537?auto=format&fit=crop&q=80&w=800" className="rounded-[4rem] h-80 w-full object-cover shadow-2xl border-4 border-white/10" alt="Arena Tennis" />
                  </div>
               </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. Community & Eventi */}
      {sections.community.enabled && (
        <section className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20">
            <div>
              <span className="text-brand-green font-black uppercase tracking-[0.4em] text-xs mb-4 block">Social Life</span>
              <h2 className="text-6xl font-black uppercase tracking-tighter text-brand-blue italic">{sections.community.title}</h2>
              <p className="text-brand-blue/50 text-xl font-medium mt-4">{sections.community.description}</p>
            </div>
            <button 
              onClick={() => onNavigate('community')}
              className="group flex items-center gap-4 text-brand-blue font-black uppercase tracking-widest mt-10 md:mt-0 transition-all hover:text-brand-green"
            >
              Vedi tutto <div className="w-12 h-12 rounded-full border-2 border-brand-blue flex items-center justify-center group-hover:border-brand-green transition-colors"><i className="fas fa-arrow-right"></i></div>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {events.slice(0, 3).map((event) => (
              <div key={event.id} className="group relative bg-white rounded-[4rem] overflow-hidden border border-brand-green/5 shadow-xl hover:shadow-2xl transition-all">
                 <div className="h-64 overflow-hidden relative">
                    <img src={`https://picsum.photos/seed/${event.id}/800/600`} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={event.title} />
                    <div className="absolute top-6 left-6 bg-brand-green text-brand-blue px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                       {event.type}
                    </div>
                 </div>
                 <div className="p-10">
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-tight text-brand-blue">{event.title}</h3>
                    <p className="text-brand-blue/60 mb-8 text-sm leading-relaxed">{event.description}</p>
                    <div className="flex items-center gap-4 text-xs font-bold text-brand-green uppercase tracking-wider">
                      <div className="w-8 h-[1px] bg-brand-green/30"></div>
                      <i className="far fa-calendar-alt"></i> {event.date}
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Staff - Meet the Experts */}
      {sections.staff.enabled && (
        <section className="bg-brand-light py-24 relative overflow-hidden">
          <div className="circle-accent w-full h-full top-0 left-0 opacity-10"></div>
          <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
              <span className="text-brand-green font-black uppercase tracking-[0.4em] text-xs mb-4 block">Professionisti Laureati & Federali</span>
              <h2 className="text-5xl font-black mb-20 uppercase tracking-tighter text-brand-blue">{sections.staff.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
                  {[
                      { name: 'Dr. Marco Arena', role: 'Dott. Scienze Motorie | Tecnico Padel', quote: 'La biomeccanica è alla base di ogni colpo vincente. Impariamo la qualità.' },
                      { name: 'Elena Green', role: 'Maestra Federale Tennis', quote: 'L’insegnamento è una scienza. Uniamo lo studio al divertimento in campo.' },
                      { name: 'Dr. Luca Next', role: 'Dott. Scienze Motorie | Preparatore Atletico', quote: 'Il benessere fisico è il primo passo per una mente rilassata e un gioco efficace.' }
                  ].map((member, i) => (
                      <div key={i} className="group flex flex-col items-center">
                          <div className="relative w-56 h-56 mb-10">
                              <div className="absolute inset-0 border-2 border-brand-green rounded-full group-hover:scale-110 transition duration-500"></div>
                              <div className="absolute inset-2 overflow-hidden rounded-full shadow-2xl group-hover:shadow-brand-green/40 transition duration-500">
                                  <img src={`https://picsum.photos/seed/paitone-staff-${i}/400/400`} className="w-full h-full object-cover" alt={member.name} />
                              </div>
                          </div>
                          <h3 className="text-2xl font-black uppercase tracking-tight text-brand-blue mb-2">{member.name}</h3>
                          <p className="text-brand-green font-black uppercase tracking-widest text-[10px] mb-6">{member.role}</p>
                          <p className="italic text-brand-blue/50 text-sm max-w-[250px]">"{member.quote}"</p>
                      </div>
                  ))}
              </div>
          </div>
        </section>
      )}

      {/* 7. Footer Contact Accent */}
      <section className="max-w-7xl mx-auto px-4">
          <div className="bg-brand-blue rounded-[5rem] p-16 md:p-24 flex flex-col md:flex-row items-center justify-between gap-12 text-white shadow-3xl relative overflow-hidden">
             <div className="circle-accent w-[400px] h-[400px] -bottom-40 -left-40"></div>
             <div className="relative z-10 max-w-lg">
                <h2 className="text-5xl font-black uppercase tracking-tighter italic mb-6">Ti aspettiamo in Arena.</h2>
                <div className="space-y-4 text-white/70">
                   <p className="flex items-center gap-4 font-bold tracking-wide"><i className="fas fa-map-marker-alt text-brand-green"></i> {config.address}</p>
                   <p className="flex items-center gap-4 font-bold tracking-wide"><i className="fas fa-clock text-brand-green"></i> {config.workingHours}</p>
                </div>
             </div>
             <div className="relative z-10 flex flex-col gap-4 w-full md:w-auto">
                <a 
                    href={`https://wa.me/${config.whatsapp}`}
                    className="bg-brand-green text-brand-blue px-12 py-5 rounded-full font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl"
                >
                    <i className="fab fa-whatsapp text-xl"></i> Scrivici subito
                </a>
                <button 
                    onClick={() => onNavigate('booking')}
                    className="bg-white/10 backdrop-blur-md border-2 border-white/20 text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-sm hover:bg-white hover:text-brand-blue transition-all"
                >
                    Prenota online
                </button>
             </div>
          </div>
      </section>
    </div>
  );
};

export default HomeSections;
