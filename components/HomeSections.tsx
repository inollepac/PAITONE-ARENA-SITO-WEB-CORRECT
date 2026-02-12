
import React, { useRef } from 'react';
import { SiteConfig, Event, Page, Court, SectionContent } from '../types';

interface HomeSectionsProps {
  config: SiteConfig;
  isEditMode: boolean;
  onUpdateConfig: (config: SiteConfig) => void;
  events: Event[];
  courts: Court[];
  onNavigate: (page: Page) => void;
}

const HomeSections: React.FC<HomeSectionsProps> = ({ config, isEditMode, onUpdateConfig, events, courts, onNavigate }) => {
  const sportsFileRef = useRef<HTMLInputElement>(null);

  const updateSection = (id: string, updates: Partial<SectionContent>) => {
    onUpdateConfig({
      ...config,
      sections: config.sections.map(s => s.id === id ? { ...s, ...updates } : s)
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof SiteConfig) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      onUpdateConfig({ ...config, [field]: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const whyUs = config.sections.find(s => s.id === 'whyUs');
  const sports = config.sections.find(s => s.id === 'sports');

  return (
    <div className="space-y-32 pb-32">
      {/* Perché Paitone Arena */}
      {whyUs?.enabled && (
        <section className={`max-w-7xl mx-auto px-4 text-center mt-32 transition-all ${isEditMode ? 'ring-2 ring-dashed ring-brand-blue/20 p-12 rounded-[4rem]' : ''}`}>
          {isEditMode ? (
            <div className="space-y-4 mb-16">
              <input 
                type="text" 
                value={whyUs.title} 
                onChange={(e) => updateSection('whyUs', { title: e.target.value })}
                className="text-5xl font-black uppercase text-center text-brand-blue w-full bg-transparent border-b border-brand-blue/10 focus:outline-none"
              />
              <textarea 
                value={whyUs.description} 
                onChange={(e) => updateSection('whyUs', { description: e.target.value })}
                className="text-xl text-brand-blue/60 italic w-full text-center bg-transparent focus:outline-none min-h-[80px]"
              />
            </div>
          ) : (
            <>
              <h2 className="text-5xl font-black mb-6 uppercase tracking-tighter text-brand-blue">{whyUs.title}</h2>
              <p className="text-brand-blue/60 text-lg italic max-w-2xl mx-auto mb-16">{whyUs.description}</p>
            </>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
             {[
              { icon: 'fa-user-graduate', title: 'Metodo Scientifico' },
              { icon: 'fa-certificate', title: 'Certificazione' },
              { icon: 'fa-brain', title: 'Stacca e Impara' },
              { icon: 'fa-shield-alt', title: 'Sicurezza' }
            ].map((card, i) => (
              <div key={i} className="bg-white p-10 rounded-[3rem] shadow-xl border border-brand-green/5 group hover:-translate-y-2 transition-all">
                <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center text-brand-green mx-auto mb-8 group-hover:bg-brand-green group-hover:text-white transition-all"><i className={`fas ${card.icon} text-2xl`}></i></div>
                <h3 className="text-xl font-black mb-4 uppercase text-brand-blue">{card.title}</h3>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Sports Area */}
      {sports?.enabled && (
        <section className={`bg-brand-blue py-32 text-white overflow-hidden relative group ${isEditMode ? 'ring-4 ring-brand-green/50' : ''}`}>
          <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-20 relative z-10">
            <div className="lg:w-1/2 space-y-8">
              {isEditMode ? (
                <div className="space-y-6">
                   <input 
                    type="text" 
                    value={sports.title} 
                    onChange={(e) => updateSection('sports', { title: e.target.value })}
                    className="text-5xl md:text-7xl font-black uppercase italic bg-transparent border-b border-white/20 w-full focus:outline-none"
                  />
                  <textarea 
                    value={sports.description} 
                    onChange={(e) => updateSection('sports', { description: e.target.value })}
                    className="text-xl text-white/60 bg-transparent border-l-2 border-brand-green pl-8 italic w-full focus:outline-none min-h-[100px]"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-5xl md:text-7xl font-black uppercase italic leading-none">{sports.title}</h2>
                  <p className="text-xl text-white/60 border-l-2 border-brand-green pl-8 italic">{sports.description}</p>
                </>
              )}
              <button onClick={() => onNavigate('booking')} className="bg-brand-green text-brand-blue px-12 py-5 rounded-full font-black uppercase tracking-widest hover:bg-white transition-all shadow-2xl">Prenota ora</button>
            </div>
            <div className="lg:w-1/2 relative">
              <img src={config.sportsImageUrl} className="rounded-[4rem] shadow-2xl border-4 border-brand-green/20 w-full h-auto object-cover max-h-[500px]" />
              {isEditMode && (
                <div className="absolute inset-0 bg-brand-blue/40 rounded-[4rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => sportsFileRef.current?.click()} className="bg-white text-brand-blue px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest shadow-xl">Cambia Immagine</button>
                  <input type="file" ref={sportsFileRef} className="hidden" onChange={(e) => handleImageChange(e, 'sportsImageUrl')} />
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomeSections;
