
import React from 'react';
import { SiteConfig } from '../types';

const OurSpace: React.FC<{ config: SiteConfig }> = ({ config }) => {
  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
            <h1 className="text-5xl font-extrabold leading-tight">Uno spazio per ritrovarsi.</h1>
            <p className="text-xl text-gray-500 leading-relaxed">
              Il nostro centro non è solo un insieme di campi, ma un ecosistema pensato per il tuo benessere. Dalla filosofia della socialità post-partita alla cura maniacale dei dettagli, vogliamo che ogni minuto passato qui sia rigenerante.
            </p>
            <div className="space-y-6">
                <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex gap-6">
                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0 text-2xl">
                        <i className="fas fa-sun"></i>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg mb-1">Luce & Natura</h4>
                        <p className="text-gray-500">Campi immersi nel verde con illuminazione LED di ultima generazione.</p>
                    </div>
                </div>
                <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex gap-6">
                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0 text-2xl">
                        <i className="fas fa-coffee"></i>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg mb-1">Social Club</h4>
                        <p className="text-gray-500">Un'area bar accogliente dove commentare la partita davanti a un buon caffè o un aperitivo.</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
                <img src="https://images.unsplash.com/photo-1595435063785-547bb7c2c537?auto=format&fit=crop&q=80&w=800" className="rounded-3xl h-80 w-full object-cover shadow-lg" alt="Lounge" />
                <img src="https://images.unsplash.com/photo-1592709823125-a191f07a2a5e?auto=format&fit=crop&q=80&w=800" className="rounded-3xl h-60 w-full object-cover shadow-lg" alt="Padel" />
            </div>
            <div className="pt-12 space-y-4">
                <img src="https://images.unsplash.com/photo-1574067765502-3f8826a9175b?auto=format&fit=crop&q=80&w=800" className="rounded-3xl h-60 w-full object-cover shadow-lg" alt="Bar" />
                <img src="https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?auto=format&fit=crop&q=80&w=800" className="rounded-3xl h-80 w-full object-cover shadow-lg" alt="Tennis" />
            </div>
        </div>
      </div>
    </div>
  );
};

export default OurSpace;
