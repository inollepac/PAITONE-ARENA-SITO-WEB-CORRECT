
import React from 'react';
import { Event } from '../types';

const CommunityPage: React.FC<{ events: Event[] }> = ({ events }) => {
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div className="max-w-2xl">
                <h1 className="text-5xl font-extrabold mb-6">Più di un circolo sportivo.</h1>
                <p className="text-xl text-gray-500">
                    Organizziamo eventi, tornei e serate a tema perché lo sport è la scusa migliore per stare insieme.
                </p>
            </div>
            <button className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold shadow-lg mt-8 md:mt-0">
                Unisciti alla Community
            </button>
        </div>

        <div className="space-y-20">
            {/* Events List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {events.map((ev) => (
                    <div key={ev.id} className="flex flex-col sm:flex-row bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm group">
                        <div className="sm:w-2/5 h-64 sm:h-auto">
                            <img src={`https://picsum.photos/seed/${ev.id}/600/600`} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={ev.title} />
                        </div>
                        <div className="sm:w-3/5 p-8 flex flex-col justify-between">
                            <div>
                                <span className="text-xs font-bold text-emerald-600 tracking-widest uppercase mb-2 block">{ev.type}</span>
                                <h3 className="text-2xl font-bold mb-4">{ev.title}</h3>
                                <p className="text-gray-500 text-sm mb-6">{ev.description}</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-bold text-gray-400">
                                    <i className="far fa-calendar-alt mr-2"></i> {ev.date}
                                </div>
                                <button className="text-emerald-600 font-bold text-sm">Partecipa <i className="fas fa-chevron-right ml-1"></i></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Social Experience Section */}
            <div className="relative rounded-[50px] overflow-hidden h-[500px]">
                <img src="https://images.unsplash.com/photo-1574067765502-3f8826a9175b?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" alt="Aperitivo" />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 via-emerald-900/40 to-transparent flex items-center p-12">
                    <div className="max-w-md text-white">
                        <h2 className="text-4xl font-bold mb-6">Il Terzo Tempo</h2>
                        <p className="text-lg opacity-90 mb-8 leading-relaxed">
                            Ogni giovedì organizziamo match-making seguito da un aperitivo offerto nel nostro lounge. È il modo perfetto per conoscere nuovi compagni di gioco.
                        </p>
                        <button className="bg-white text-emerald-900 px-8 py-3 rounded-full font-bold">Vieni a conoscerci</button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
