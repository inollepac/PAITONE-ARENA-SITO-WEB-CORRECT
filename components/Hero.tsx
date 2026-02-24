
import React, { useRef, useState } from 'react';
import { SiteConfig } from '../types';

interface HeroProps {
  config: SiteConfig;
  isEditMode: boolean;
  onUpdateConfig: (config: SiteConfig) => void;
  onBookingClick: () => void;
  onDiscoverClick: () => void;
}

const HERO_GRADIENTS = [
  { name: 'Default', value: 'linear-gradient(to right, rgba(78,91,131,0.9), rgba(78,91,131,0.6), transparent)' },
  { name: 'Sunset Clay', value: 'linear-gradient(to top, #D35400, transparent)' },
  { name: 'Midnight Padel', value: 'linear-gradient(to right, #1A2238, #4E5B83, transparent)' },
  { name: 'Neon Match', value: 'linear-gradient(135deg, #4E5B83, #A8D38E)' }
];

const Hero: React.FC<HeroProps> = ({ config, isEditMode, onUpdateConfig, onBookingClick, onDiscoverClick }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showDesignPanel, setShowDesignPanel] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      onUpdateConfig({ ...config, heroImageUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const updateHeroConfig = (updates: Partial<SiteConfig>) => {
    onUpdateConfig({ ...config, ...updates });
  };

  return (
    <section className="relative h-[90vh] flex items-center overflow-hidden bg-brand-blue">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <img 
          src={config.heroImageUrl} 
          className="w-full h-full object-cover transition-all duration-1000"
          style={{ filter: `brightness(${config.heroBgOpacity || 0.6})` }}
        />
        <div 
          className="absolute inset-0 transition-all duration-500" 
          style={{ 
            background: config.heroVideoUrl || 'linear-gradient(to right, var(--brand-blue), rgba(78,91,131,0.6), transparent)',
            opacity: 0.8
          }}
        ></div>
      </div>

      {/* Design Overlay Buttons (Edit Mode Only) */}
      {isEditMode && (
        <div className="absolute top-32 right-8 z-50 flex flex-col gap-4">
          <button 
            onClick={() => setShowDesignPanel(!showDesignPanel)}
            className="w-16 h-16 bg-white text-brand-blue rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all border-4 border-brand-green"
          >
            <i className={`fas ${showDesignPanel ? 'fa-times' : 'fa-palette'} text-xl`}></i>
          </button>
          
          {showDesignPanel && (
            <div className="bg-white p-8 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-brand-green/20 w-80 animate-in fade-in zoom-in duration-200">
              <h3 className="text-xs font-black uppercase tracking-widest text-brand-blue mb-6 border-b pb-4 text-left">Hero Design Lab</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[9px] font-black uppercase opacity-40 mb-3 block text-left">Immagine Sfondo</label>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3 bg-brand-light rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-green transition"
                  >
                    Sostituisci Foto
                  </button>
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageChange} accept="image/*" />
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase opacity-40 mb-3 block text-left">Luminosità Foto ({Math.round((config.heroBgOpacity || 0.6) * 100)}%)</label>
                  <input 
                    type="range" 
                    min="0" max="1" step="0.05" 
                    value={config.heroBgOpacity || 0.6}
                    onChange={(e) => updateHeroConfig({ heroBgOpacity: parseFloat(e.target.value) })}
                    className="w-full accent-brand-blue"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase opacity-40 mb-3 block text-left">Preset Atmosfera</label>
                  <div className="grid grid-cols-2 gap-2">
                    {HERO_GRADIENTS.map(g => (
                      <button 
                        key={g.name}
                        onClick={() => updateHeroConfig({ heroVideoUrl: g.value })}
                        className={`p-2 border rounded-lg text-[8px] font-bold hover:bg-gray-50 uppercase ${config.heroVideoUrl === g.value ? 'border-brand-green bg-brand-light' : 'border-gray-100'}`}
                      >
                        {g.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content Layer */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            {isEditMode ? (
              <div className="space-y-6">
                <textarea 
                  value={config.heroTitle}
                  onChange={(e) => updateHeroConfig({ heroTitle: e.target.value })}
                  className="w-full bg-white/10 border-none rounded-3xl p-6 text-6xl md:text-8xl font-black uppercase italic tracking-tighter text-white focus:outline-none focus:ring-4 focus:ring-brand-green/30 min-h-[180px] resize-none overflow-hidden"
                />
                <textarea 
                  value={config.heroSubtitle}
                  onChange={(e) => updateHeroConfig({ heroSubtitle: e.target.value })}
                  className="w-full bg-white/5 border-none rounded-3xl p-6 text-xl md:text-2xl font-medium italic text-white/80 focus:outline-none focus:ring-4 focus:ring-brand-green/30 min-h-[120px] resize-none"
                />
              </div>
            ) : (
              <>
                <h1 className="text-6xl md:text-9xl font-black mb-8 tracking-tighter leading-[0.85] uppercase italic animate-in fade-in slide-in-from-left duration-700">
                  {config.heroTitle}
                </h1>
                <p className="text-xl md:text-3xl font-medium mb-12 text-brand-light opacity-80 max-w-2xl border-l-8 border-brand-green pl-8 italic animate-in fade-in slide-in-from-left delay-200 duration-700">
                  {config.heroSubtitle}
                </p>
              </>
            )}
            
            <div className="flex flex-col sm:flex-row gap-6 mt-16">
              <button onClick={onBookingClick} className="px-12 py-6 bg-brand-green text-brand-blue rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all hover:scale-105 shadow-[0_20px_40px_rgba(168,211,142,0.4)]">
                Prenota l'Arena
              </button>
              <button onClick={onDiscoverClick} className="px-12 py-6 bg-white/10 backdrop-blur-xl text-white border-2 border-white/40 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-white hover:text-brand-blue shadow-xl">
                Esplora lo Spazio
              </button>
            </div>
          </div>

          {/* Availability Widget */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[3rem] p-10 shadow-2xl animate-in fade-in slide-in-from-right duration-1000">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter">Live Arena</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-brand-green">Disponibilità Oggi</p>
                </div>
                <div className="w-12 h-12 bg-brand-green rounded-2xl flex items-center justify-center text-brand-blue shadow-lg animate-pulse">
                  <i className="fas fa-bolt"></i>
                </div>
              </div>

              <div className="space-y-4 mb-10">
                {[
                  { name: 'Campo Centrale', type: 'Padel', slots: 4, status: 'available' },
                  { name: 'Arena 2', type: 'Padel', slots: 2, status: 'limited' },
                  { name: 'Court 1', type: 'Tennis', slots: 0, status: 'full' },
                ].map((court, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group" onClick={() => window.open(config.externalBookingUrl, '_blank')}>
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${court.status === 'available' ? 'bg-brand-green shadow-[0_0_10px_#A8D38E]' : court.status === 'limited' ? 'bg-yellow-400' : 'bg-red-500'}`}></div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-tight">{court.name}</p>
                        <p className="text-[8px] font-black uppercase opacity-40 tracking-widest">{court.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-black ${court.status === 'full' ? 'text-white/20' : 'text-brand-green'}`}>
                        {court.status === 'full' ? 'PIENO' : `${court.slots} SLOT`}
                      </p>
                      <p className="text-[8px] font-black uppercase opacity-40 tracking-widest group-hover:text-brand-green transition-colors">Prenota ora</p>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => window.open(config.externalBookingUrl, '_blank')}
                className="w-full py-5 bg-white text-brand-blue rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-brand-green transition-all flex items-center justify-center gap-3"
              >
                Vedi Tutti gli Orari <i className="fas fa-arrow-right text-[8px]"></i>
              </button>
              
              <p className="text-[8px] font-black uppercase opacity-30 text-center mt-6 tracking-widest">Sincronizzato con il gestionale in tempo reale</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
