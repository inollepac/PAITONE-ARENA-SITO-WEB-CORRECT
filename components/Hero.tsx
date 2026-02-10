
import React from 'react';
import { SiteConfig } from '../types';

interface HeroProps {
  config: SiteConfig;
  onBookingClick: () => void;
  onDiscoverClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ config, onBookingClick, onDiscoverClick }) => {
  return (
    <section className="relative h-[90vh] flex items-center overflow-hidden bg-brand-blue">
      {/* Visual Background with Mask */}
      <div className="absolute inset-0 z-0">
        <img 
          src={config.heroImageUrl} 
          alt="Tennis & Padel Arena" 
          className="w-full h-full object-cover opacity-60 mix-blend-overlay scale-110"
        />
        {/* Animated Circle Accents mimicking the logo */}
        <div className="circle-accent w-[800px] h-[800px] -top-96 -left-96 animate-[spin_60s_linear_infinite]"></div>
        <div className="circle-accent w-[400px] h-[400px] bottom-10 -right-20 animate-[spin_40s_linear_infinite_reverse]"></div>
        
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue via-brand-blue/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/80 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white w-full">
        <div className="max-w-3xl">
          <div className="flex items-center gap-6 mb-8">
            {config.showLogoInHero && config.logoUrl && (
              <div 
                className="overflow-hidden border-2 border-brand-green shadow-2xl flex-shrink-0"
                style={{ 
                  width: '120px', 
                  height: '120px',
                  borderRadius: `${config.logoBorderRadius}%`
                }}
              >
                <img 
                  src={config.logoUrl} 
                  className="w-full h-full object-cover" 
                  style={{ transform: `scale(${config.logoScale}) translate(${config.logoX}%, ${config.logoY}%)` }} 
                  alt="Hero Logo" 
                />
              </div>
            )}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-green/20 border border-brand-green/30 rounded-full">
              <div className="w-2 h-2 bg-brand-green rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-green">Welcome to the Arena</span>
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] uppercase italic">
            {config.heroTitle}
          </h1>
          <p className="text-xl md:text-2xl font-medium mb-12 text-brand-light opacity-80 max-w-xl border-l-4 border-brand-green pl-6 italic">
            {config.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <button 
              onClick={onBookingClick}
              className="group relative px-10 py-5 bg-brand-green text-brand-blue rounded-full font-black text-sm uppercase tracking-widest transition-all hover:scale-105 shadow-2xl overflow-hidden"
            >
              <span className="relative z-10">Prenota la tua partita</span>
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
            <button 
              onClick={onDiscoverClick}
              className="px-10 py-5 bg-white/10 backdrop-blur-lg text-white border-2 border-white/60 rounded-full font-black text-sm uppercase tracking-widest transition-all hover:bg-white hover:text-brand-blue hover:border-white shadow-xl"
            >
              Esplora l'Arena
            </button>
          </div>
        </div>
      </div>
      
      {/* Brand Curve Bottom Accent */}
      <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0] transform rotate-180">
        <svg className="relative block w-[calc(130%+1.3px)] h-[80px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113,14.29,1200,52.47V0Z" fill="#F4F7F2"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
