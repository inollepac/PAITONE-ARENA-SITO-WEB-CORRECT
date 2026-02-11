
import React from 'react';
import { Event, SiteConfig } from '../types';

const CommunityPage: React.FC<{ events: Event[], config: SiteConfig }> = ({ events, config }) => {
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
                <h1 className="text-5xl font-black mb-6 uppercase italic text-brand-blue tracking-tighter">Più di un circolo sportivo.</h1>
                <p className="text-xl text-brand-blue/60 font-medium italic border-l-4 border-brand-green pl-6">
                    Organizziamo eventi, tornei e serate a tema perché lo sport è la scusa migliore per stare insieme.
                </p>
            </div>
            <button className="bg-brand-blue text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-sm shadow-xl hover:bg-brand-green hover:text-brand-blue transition-all shrink-0">
                Unisciti alla Community
            </button>
        </div>

        <div className="space-y-20">
            {/* Events List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {events.map((ev) => (
                    <div key={ev.id} className="flex flex-col sm:flex-row bg-white rounded-[40px] overflow-hidden border border-brand-green/5 shadow-xl group hover:-translate-y-2 transition-transform">
                        <div className="sm:w-2/5 h-64 sm:h-auto">
                            <img src={`https://picsum.photos/seed/${ev.id}/600/600`} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={ev.title} />
                        </div>
                        <div className="sm:w-3/5 p-10 flex flex-col justify-between">
                            <div>
                                <span className="text-[10px] font-black text-brand-green tracking-[0.3em] uppercase mb-2 block">{ev.type}</span>
                                <h3 className="text-2xl font-black mb-4 uppercase italic text-brand-blue">{ev.title}</h3>
                                <p className="text-brand-blue/50 text-sm mb-6 font-medium italic">{ev.description}</p>
                            </div>
                            <div className="flex items-center justify-between border-t border-brand-blue/5 pt-6">
                                <div className="text-xs font-black text-brand-blue/30 uppercase tracking-widest">
                                    <i className="far fa-calendar-alt mr-2 text-brand-green"></i> {ev.date}
                                </div>
                                <button className="text-brand-green font-black uppercase text-xs hover:tracking-widest transition-all">Partecipa <i className="fas fa-chevron-right ml-1"></i></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Social Experience Section */}
            <div className="relative rounded-[60px] overflow-hidden h-[500px] shadow-2xl border-4 border-brand-green/10">
                <img src={config.communityImageUrl} className="w-full h-full object-cover" alt="Aperitivo Arena" />
                <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/90 via-brand-blue/40 to-transparent flex items-center p-12">
                    <div className="max-w-md text-white">
                        <h2 className="text-5xl font-black mb-6 uppercase italic tracking-tighter">Il Terzo Tempo</h2>
                        <p className="text-xl opacity-90 mb-8 leading-relaxed italic border-l-2 border-brand-green pl-6">
                            Ogni giovedì organizziamo match-making seguito da un aperitivo offerto nel nostro lounge. È il modo perfetto per conoscere nuovi compagni di gioco.
                        </p>
                        <button className="bg-brand-green text-brand-blue px-12 py-5 rounded-full font-black uppercase tracking-widest text-sm shadow-2xl hover:bg-white transition-all">Vieni a conoscerci</button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
