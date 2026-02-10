
import React, { useState } from 'react';
import { SiteConfig, Court, Slot } from '../types';

interface BookingSystemProps {
  config: SiteConfig;
  courts: Court[];
}

const BookingSystem: React.FC<BookingSystemProps> = ({ config, courts }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState<'Padel' | 'Tennis'>('Padel');

  const filteredCourts = courts.filter(c => c.type === activeTab);
  const times = ['08:00', '09:30', '11:00', '12:30', '14:00', '15:30', '17:00', '18:30', '20:00', '21:30'];
  
  return (
    <section className="max-w-7xl mx-auto px-4 py-24">
      <div className="text-center mb-20">
        <span className="text-brand-green font-black uppercase tracking-[0.4em] text-xs mb-4 block">Quick Reserve</span>
        <h2 className="text-6xl font-black uppercase tracking-tighter text-brand-blue italic">Prenota la tua partita</h2>
        <p className="text-brand-blue/50 max-w-2xl mx-auto mt-4 font-medium">
          L'Arena ti aspetta. Seleziona il tuo orario preferito e scendi in campo oggi stesso.
        </p>
      </div>

      <div className="bg-white rounded-[4rem] shadow-2xl border border-brand-green/10 overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-500">
        {/* Date & Sport Filter */}
        <div className="p-8 bg-brand-light border-b border-brand-green/10 flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="flex bg-white p-2 rounded-full shadow-inner border border-brand-blue/5">
            {(['Padel', 'Tennis'] as const).map(sport => (
              <button
                key={sport}
                onClick={() => setActiveTab(sport)}
                className={`px-12 py-3 rounded-full font-black uppercase tracking-widest text-xs transition-all ${activeTab === sport ? 'bg-brand-blue text-white shadow-lg' : 'text-brand-blue/40 hover:bg-brand-green/5'}`}
              >
                {sport}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <span className="font-black text-brand-blue uppercase tracking-widest text-xs">Seleziona Data:</span>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-white border border-brand-blue/10 rounded-full px-8 py-3 text-brand-blue font-bold focus:outline-none focus:ring-4 focus:ring-brand-green/20"
            />
          </div>
        </div>

        {/* Availability Grid */}
        <div className="p-10 overflow-x-auto no-scrollbar">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="text-left">
                <th className="pb-10 text-brand-blue font-black uppercase tracking-[0.2em] text-[10px] w-64">Configurazione Campo</th>
                {times.map(t => (
                  <th key={t} className="pb-10 text-brand-blue font-black uppercase tracking-[0.2em] text-[10px] text-center">{t}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredCourts.map((court, idx) => (
                <tr key={court.id} className="border-t border-brand-blue/5 group">
                  <td className="py-10 pr-10">
                    <div className="font-black text-xl uppercase tracking-tight text-brand-blue group-hover:text-brand-green transition-colors">{court.name}</div>
                    <div className="text-[10px] text-brand-blue/40 font-black uppercase tracking-widest mt-1 italic">{court.surface}</div>
                    <div className="inline-block px-3 py-1 bg-brand-green/10 text-brand-green text-[10px] font-black rounded-full mt-4 uppercase">€{court.pricePerHour} / sessione</div>
                  </td>
                  {times.map(t => {
                    const isAvailable = Math.random() > 0.3; 
                    return (
                      <td key={t} className="py-10 text-center px-2">
                        <button 
                          disabled={!isAvailable}
                          onClick={() => window.open(config.externalBookingUrl, '_blank')}
                          className={`w-full py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all ${
                            isAvailable 
                            ? 'bg-brand-light text-brand-blue border border-brand-green/30 hover:bg-brand-green hover:text-brand-blue hover:shadow-xl hover:-translate-y-1' 
                            : 'bg-gray-50 text-gray-300 cursor-not-allowed opacity-50 italic'
                          }`}
                        >
                          {isAvailable ? 'Prenota' : 'Pieno'}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-10 bg-brand-blue flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-brand-green rounded-full shadow-[0_0_10px_#A8D38E]"></div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Disponibile</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-white/20 rounded-full"></div>
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Occupato</span>
                </div>
            </div>
            <button 
                onClick={() => window.open(config.externalBookingUrl, '_blank')}
                className="bg-brand-green text-brand-blue px-12 py-4 rounded-full font-black uppercase tracking-widest text-sm shadow-2xl hover:scale-105 transition-all flex items-center gap-3"
            >
                Accedi al Portale Completo <i className="fas fa-external-link-alt text-xs"></i>
            </button>
        </div>
      </div>
    </section>
  );
};

export default BookingSystem;
