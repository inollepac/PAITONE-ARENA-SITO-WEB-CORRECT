
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentImageField = useRef<keyof SiteConfig | null>(null);

  const updateSection = (id: string, updates: Partial<SectionContent>) => {
    onUpdateConfig({
      ...config,
      sections: config.sections.map(s => s.id === id ? { ...s, ...updates } : s)
    });
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...config.sections];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newSections.length) return;
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
    onUpdateConfig({ ...config, sections: newSections });
  };

  const deleteSection = (id: string) => {
    if (confirm("Vuoi davvero eliminare questa sezione?")) {
      onUpdateConfig({
        ...config,
        sections: config.sections.filter(s => s.id !== id)
      });
    }
  };

  const duplicateSection = (section: SectionContent) => {
    const newId = `${section.id}_copy_${Date.now()}`;
    const newSection = { ...section, id: newId, title: `${section.title} (Copia)` };
    const index = config.sections.findIndex(s => s.id === section.id);
    const newSections = [...config.sections];
    newSections.splice(index + 1, 0, newSection);
    onUpdateConfig({ ...config, sections: newSections });
  };

  const addSection = () => {
    const newSection: SectionContent = {
      id: `custom_${Date.now()}`,
      title: 'Nuova Sezione Arena',
      description: 'Inserisci qui la descrizione del tuo nuovo spazio o servizio.',
      navLabel: 'Nuova Voce',
      enabled: true,
      isCustom: true
    };
    onUpdateConfig({
      ...config,
      sections: [...config.sections, newSection]
    });
  };

  const handleImageClick = (field: keyof SiteConfig) => {
    currentImageField.current = field;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentImageField.current) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateConfig({ ...config, [currentImageField.current!]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-32 pb-48">
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
      
      {config.sections.map((section, idx) => {
        if (!section.enabled && !isEditMode) return null;

        // Use React.FC to properly type the component and allow standard props like 'key'
        const SectionWrapper: React.FC<{ children: React.ReactNode, sectionId: string }> = ({ children, sectionId }) => (
          <div className={`relative group/section transition-all duration-300 ${isEditMode ? 'ring-2 ring-dashed ring-brand-blue/20 p-8 m-4 rounded-[4rem] bg-white/30 backdrop-blur-sm shadow-xl' : ''}`}>
            {isEditMode && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-full shadow-2xl z-50 animate-in slide-in-from-top-4">
                <button onClick={() => moveSection(idx, 'up')} className="hover:text-brand-green p-1 transition-transform active:scale-90"><i className="fas fa-arrow-up"></i></button>
                <button onClick={() => moveSection(idx, 'down')} className="hover:text-brand-green p-1 transition-transform active:scale-90"><i className="fas fa-arrow-down"></i></button>
                <div className="w-px h-4 bg-white/20 mx-2"></div>
                <button onClick={() => duplicateSection(section)} className="hover:text-brand-green p-1"><i className="fas fa-copy"></i></button>
                <button onClick={() => deleteSection(sectionId)} className="hover:text-red-400 p-1"><i className="fas fa-trash"></i></button>
                <div className="w-px h-4 bg-white/20 mx-2"></div>
                <span className="text-[9px] font-black uppercase tracking-widest opacity-40">{sectionId}</span>
              </div>
            )}
            {children}
          </div>
        );

        // Sezione: Perché Noi / Features
        if (section.id === 'whyUs') {
          return (
            <SectionWrapper key={section.id} sectionId={section.id}>
              <section className="max-w-7xl mx-auto px-4 text-center">
                {isEditMode ? (
                  <div className="space-y-4 mb-16 animate-in fade-in zoom-in duration-300">
                    <input 
                      value={section.title} 
                      onChange={(e) => updateSection(section.id, { title: e.target.value })}
                      className="text-5xl font-black uppercase text-brand-blue bg-white/50 text-center w-full focus:outline-none focus:ring-4 focus:ring-brand-green/30 rounded-2xl p-4 shadow-inner"
                    />
                    <textarea 
                      value={section.description} 
                      onChange={(e) => updateSection(section.id, { description: e.target.value })}
                      className="text-xl text-brand-blue/60 italic bg-white/30 text-center w-full focus:outline-none rounded-2xl p-4 resize-none min-h-[100px] shadow-inner"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-5xl font-black mb-6 uppercase tracking-tighter text-brand-blue">{section.title}</h2>
                    <p className="text-brand-blue/60 text-lg italic max-w-2xl mx-auto mb-16">{section.description}</p>
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
            </SectionWrapper>
          );
        }

        // Sezione: Sports Area (Layout Immagine + Testo)
        if (section.id === 'sports' || section.isCustom) {
          const imgField = section.id === 'sports' ? 'sportsImageUrl' : 'communityImageUrl';
          return (
            <SectionWrapper key={section.id} sectionId={section.id}>
              <section className="bg-brand-blue py-32 text-white overflow-hidden relative group-image rounded-[5rem]">
                <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-20 relative z-10">
                  <div className="lg:w-1/2 space-y-8">
                    {isEditMode ? (
                      <div className="space-y-6 animate-in fade-in slide-in-from-left duration-300">
                         <input 
                          value={section.title} 
                          onChange={(e) => updateSection(section.id, { title: e.target.value })}
                          className="text-5xl md:text-7xl font-black uppercase italic bg-white/10 w-full p-6 rounded-[2.5rem] focus:outline-none focus:ring-4 focus:ring-brand-green/30"
                        />
                        <textarea 
                          value={section.description} 
                          onChange={(e) => updateSection(section.id, { description: e.target.value })}
                          className="text-xl text-white/60 bg-white/5 border-l-4 border-brand-green p-6 italic w-full focus:outline-none rounded-r-[2rem] resize-none min-h-[140px]"
                        />
                      </div>
                    ) : (
                      <>
                        <h2 className="text-5xl md:text-7xl font-black uppercase italic leading-none">{section.title}</h2>
                        <p className="text-xl text-white/60 border-l-2 border-brand-green pl-8 italic">{section.description}</p>
                      </>
                    )}
                    <button onClick={() => onNavigate('booking')} className="bg-brand-green text-brand-blue px-12 py-5 rounded-full font-black uppercase tracking-widest hover:bg-white transition-all shadow-2xl active:scale-95">Prenota ora</button>
                  </div>
                  <div className="lg:w-1/2 relative group/img">
                    <img 
                      src={(config as any)[imgField]} 
                      className="rounded-[4rem] shadow-2xl border-4 border-brand-green/20 w-full h-auto object-cover max-h-[500px]" 
                    />
                    {isEditMode && (
                      <div className="absolute inset-0 bg-brand-blue/60 backdrop-blur-sm rounded-[4rem] flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all z-20">
                        <button onClick={() => handleImageClick(imgField as any)} className="bg-white text-brand-blue px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest shadow-xl hover:scale-110 active:scale-95">Sostituisci Foto</button>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </SectionWrapper>
          );
        }

        return null;
      })}

      {/* Pulsante Aggiungi Sezione (Solo Admin) */}
      {isEditMode && (
        <div className="flex justify-center pt-20 animate-in fade-in slide-in-from-bottom duration-500">
          <button 
            onClick={addSection}
            className="group relative flex items-center gap-6 bg-white border-4 border-dashed border-brand-blue/10 px-16 py-10 rounded-[5rem] text-brand-blue/30 hover:text-brand-green hover:border-brand-green transition-all shadow-2xl hover:bg-brand-light"
          >
            <div className="w-20 h-20 bg-brand-light rounded-full flex items-center justify-center text-4xl transition-transform group-hover:rotate-90 group-hover:bg-brand-green group-hover:text-brand-blue">
              <i className="fas fa-plus"></i>
            </div>
            <div className="text-left">
              <span className="block text-2xl font-black uppercase italic tracking-tighter">Aggiungi Spazio Arena</span>
              <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">Crea un nuovo blocco di contenuti live</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default HomeSections;
