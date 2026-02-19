
import React from 'react';
import { SiteConfig } from '../types';

interface OurSpaceProps {
  config: SiteConfig;
  isEditMode?: boolean;
  onUpdateConfig?: (config: SiteConfig) => void;
}

const OurSpace: React.FC<OurSpaceProps> = ({ config, isEditMode, onUpdateConfig }) => {
  const images = config.spaceImageUrls;

  const updateConfig = (updates: Partial<SiteConfig>) => {
    if (onUpdateConfig) onUpdateConfig({ ...config, ...updates });
  };
  
  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8 text-left">
            {isEditMode ? (
              <textarea 
                value={config.heroSubtitle || "Uno spazio per ritrovarsi."}
                onChange={e => updateConfig({ heroSubtitle: e.target.value })}
                className="w-full text-5xl font-extrabold leading-tight uppercase italic text-brand-blue tracking-tighter bg-white/50 border-2 border-brand-green/30 rounded-3xl p-4 focus:ring-4 focus:ring-brand-green/20 outline-none"
              />
            ) : (
              <h1 className="text-5xl font-extrabold leading-tight uppercase italic text-brand-blue tracking-tighter">
                Uno spazio per ritrovarsi.
              </h1>
            )}

            <p className="text-xl text-brand-blue/60 leading-relaxed font-medium italic border-l-4 border-brand-green pl-6">
              Il nostro centro non è solo un insieme di campi, ma un ecosistema pensato per il tuo benessere. Dalla filosofia della socialità post-partita alla cura maniacale dei dettagli.
            </p>
            
            <div className="space-y-6">
                <div className="p-6 bg-white rounded-3xl border border-brand-green/10 shadow-sm flex gap-6">
                    <div className="w-14 h-14 bg-brand-light rounded-2xl flex items-center justify-center text-brand-green shrink-0 text-2xl">
                        <i className="fas fa-sun"></i>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg mb-1 uppercase text-brand-blue tracking-tight">Luce & Natura</h4>
                        <p className="text-brand-blue/50 text-sm italic">Campi immersi nel verde con illuminazione LED di ultima generazione.</p>
                    </div>
                </div>
                <div className="p-6 bg-white rounded-3xl border border-brand-green/10 shadow-sm flex gap-6">
                    <div className="w-14 h-14 bg-brand-light rounded-2xl flex items-center justify-center text-brand-green shrink-0 text-2xl">
                        <i className="fas fa-coffee"></i>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg mb-1 uppercase text-brand-blue tracking-tight">Social Club</h4>
                        <p className="text-brand-blue/50 text-sm italic">Un'area bar accogliente dove commentare la partita davanti a un buon caffè.</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
                <img src={images[0]} className="rounded-3xl h-80 w-full object-cover shadow-lg border-2 border-brand-green/10" alt="Lounge" />
                <img src={images[1]} className="rounded-3xl h-60 w-full object-cover shadow-lg border-2 border-brand-green/10" alt="Arena View" />
            </div>
            <div className="pt-12 space-y-4">
                <img src={images[2]} className="rounded-3xl h-60 w-full object-cover shadow-lg border-2 border-brand-green/10" alt="Bar Area" />
                <img src={images[3]} className="rounded-3xl h-80 w-full object-cover shadow-lg border-2 border-brand-green/10" alt="Tennis Courts" />
            </div>
        </div>
      </div>
    </div>
  );
};

export default OurSpace;
