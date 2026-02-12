
import React, { useRef } from 'react';
import { SiteConfig } from '../types';

interface HeroProps {
  config: SiteConfig;
  isEditMode: boolean;
  onUpdateConfig: (config: SiteConfig) => void;
  onBookingClick: () => void;
  onDiscoverClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ config, isEditMode, onUpdateConfig, onBookingClick, onDiscoverClick }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      onUpdateConfig({ ...config, heroImageUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const updateText = (field: keyof SiteConfig, value: string) => {
    onUpdateConfig({ ...config, [field]: value });
  };

  return (
    <section className="relative h-[90vh] flex items-center overflow-hidden bg-brand-blue group">
      <div className="absolute inset-0 z-0">
        <img 
          src={config.heroImageUrl} 
          className="w-full h-full object-cover opacity-60 mix-blend-overlay transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue via-brand-blue/60 to-transparent"></div>
        
        {isEditMode && (
          <div className="absolute inset-0 bg-brand-blue/20 backdrop-blur-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
             <button 
               onClick={() => fileInputRef.current?.click()}
               className="bg-white text-brand-blue px-10 py-5 rounded-full font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all"
             >
               <i className="fas fa-camera mr-3"></i> Cambia Sfondo Hero
             </button>
             <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageChange} />
          </div>
        )}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white w-full">
        <div className="max-w-3xl">
          {isEditMode ? (
            <div className="space-y-8 animate-in fade-in zoom-in duration-300">
               <textarea 
                value={config.heroTitle}
                onChange={(e) => updateText('heroTitle', e.target.value)}
                className="w-full bg-white/10 border-2 border-dashed border-white/30 rounded-[2rem] p-6 text-6xl font-black uppercase italic tracking-tighter text-white focus:outline-none focus:border-brand-green leading-none min-h-[180px]"
               />
               <textarea 
                value={config.heroSubtitle}
                onChange={(e) => updateText('heroSubtitle', e.target.value)}
                className="w-full bg-white/5 border-2 border-dashed border-white/20 rounded-[2rem] p-6 text-xl font-medium italic text-white/80 focus:outline-none focus:border-brand-green min-h-[120px]"
               />
            </div>
          ) : (
            <>
              <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] uppercase italic animate-in slide-in-from-left duration-700">
                {config.heroTitle}
              </h1>
              <p className="text-xl md:text-2xl font-medium mb-12 text-brand-light opacity-80 max-w-xl border-l-4 border-brand-green pl-6 italic animate-in slide-in-from-left delay-200 duration-700">
                {config.heroSubtitle}
              </p>
            </>
          )}
          
          <div className="flex flex-col sm:flex-row gap-6 mt-12">
            <button onClick={onBookingClick} className="px-10 py-5 bg-brand-green text-brand-blue rounded-full font-black text-sm uppercase tracking-widest transition-all hover:scale-105 shadow-2xl">Prenota la tua partita</button>
            <button onClick={onDiscoverClick} className="px-10 py-5 bg-white/10 backdrop-blur-lg text-white border-2 border-white/60 rounded-full font-black text-sm uppercase tracking-widest transition-all hover:bg-white hover:text-brand-blue shadow-xl">Esplora l'Arena</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
