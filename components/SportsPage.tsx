
import React from 'react';
import { SiteConfig, Court } from '../types';

const SportsPage: React.FC<{ config: SiteConfig; courts: Court[] }> = ({ config, courts }) => {
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-20">
            <h1 className="text-5xl font-black mb-6 uppercase tracking-tighter text-brand-blue italic">Tanto sport, zero stress.</h1>
            <p className="text-xl text-brand-blue/60 max-w-3xl mx-auto italic font-medium">
              Abbiamo campi nuovi e un ambiente accogliente. Non siamo il circolo più lussuoso del mondo, ma siamo il posto giusto se cerchi una partita tra amici e un'atmosfera dove stare bene e divertirsi senza pensieri.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Tennis Section */}
            <div className="space-y-8">
                <div className="relative h-96 rounded-[40px] overflow-hidden group shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1595435063785-547bb7c2c537?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt="Tennis" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/90 via-transparent to-transparent flex items-end p-10">
                        <h2 className="text-4xl font-black text-white uppercase italic">Tennis</h2>
                    </div>
                </div>
                <div className="space-y-4">
                    <h3 className="text-2xl font-black uppercase tracking-tight text-brand-blue">Il fascino della racchetta</h3>
                    <p className="text-brand-blue/60">I nostri campi in terra rossa e resina sono nuovi e curati, ideali per chi vuole giocare una partita in relax o sfidare i propri limiti senza la pressione dei grandi club esclusivi.</p>
                    <ul className="grid grid-cols-2 gap-4">
                        {courts.filter(c => c.type === 'Tennis').map(c => (
                            <li key={c.id} className="p-4 bg-white rounded-2xl border border-brand-green/10 shadow-sm">
                                <span className="font-bold block text-brand-blue">{c.name}</span>
                                <span className="text-[10px] text-brand-green font-black uppercase tracking-widest">{c.surface}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Padel Section */}
            <div className="space-y-8">
                <div className="relative h-96 rounded-[40px] overflow-hidden group shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt="Padel" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-green/80 via-transparent to-transparent flex items-end p-10">
                        <h2 className="text-4xl font-black text-brand-blue uppercase italic">Padel</h2>
                    </div>
                </div>
                <div className="space-y-4">
                    <h3 className="text-2xl font-black uppercase tracking-tight text-brand-blue">Puro divertimento</h3>
                    <p className="text-brand-blue/60">Campi panoramici nuovi fiammanti. Il padel da noi è sinonimo di risate, scambi veloci e un bel terzo tempo al bar con i compagni di gioco.</p>
                    <ul className="grid grid-cols-2 gap-4">
                        {courts.filter(c => c.type === 'Padel').map(c => (
                            <li key={c.id} className="p-4 bg-white rounded-2xl border border-brand-green/10 shadow-sm">
                                <span className="font-bold block text-brand-blue">{c.name}</span>
                                <span className="text-[10px] text-brand-green font-black uppercase tracking-widest">{c.surface}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>

        <div className="mt-24 bg-brand-green/10 rounded-[50px] p-12 text-center border border-brand-green/20">
            <h3 className="text-3xl font-black uppercase tracking-tighter text-brand-blue mb-4">Livelli per tutti</h3>
            <p className="text-brand-blue/60 max-w-2xl mx-auto mb-8 font-medium">
              Non importa se hai appena iniziato o se giochi da anni. Qui l'unica cosa che conta è che ti trovi bene in campo con persone del tuo stesso livello.
            </p>
            <button className="bg-brand-blue text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-sm shadow-xl hover:bg-brand-green hover:text-brand-blue transition-all">
                Vieni a trovarci
            </button>
        </div>
      </div>
    </div>
  );
};

export default SportsPage;
