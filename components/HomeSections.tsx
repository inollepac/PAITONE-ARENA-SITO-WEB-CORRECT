
import React, { useRef } from 'react';
import { SiteConfig, Event, Page, Court, SectionContent, SectionElement } from '../types';

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
  const currentUploadTarget = useRef<{sectionId: string, elementId?: string, type: 'bg' | 'element'} | null>(null);

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
      onUpdateConfig({ ...config, sections: config.sections.filter(s => s.id !== id) });
    }
  };

  const addElement = (sectionId: string, type: 'text' | 'image' | 'logo') => {
    const newElement: SectionElement = {
      id: `el_${Date.now()}`,
      type,
      content: type === 'text' ? 'Nuova Didascalia...' : 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?auto=format&fit=crop&q=80&w=400',
      label: type === 'image' ? 'Descrizione immagine' : undefined
    };
    const newSections = config.sections.map(s => {
      if (s.id === sectionId) {
        return { ...s, elements: [...(s.elements || []), newElement] };
      }
      return s;
    });
    onUpdateConfig({ ...config, sections: newSections });
  };

  const updateElement = (sectionId: string, elId: string, content: string) => {
    const newSections = config.sections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          elements: s.elements?.map(el => el.id === elId ? { ...el, content } : el)
        };
      }
      return s;
    });
    onUpdateConfig({ ...config, sections: newSections });
  };

  const deleteElement = (sectionId: string, elId: string) => {
    const newSections = config.sections.map(s => {
      if (s.id === sectionId) {
        return { ...s, elements: s.elements?.filter(el => el.id !== elId) };
      }
      return s;
    });
    onUpdateConfig({ ...config, sections: newSections });
  };

  const handleImageClick = (sectionId: string, elementId?: string) => {
    currentUploadTarget.current = { sectionId, elementId, type: elementId ? 'element' : 'bg' };
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentUploadTarget.current) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const b64 = reader.result as string;
        const target = currentUploadTarget.current!;
        if (target.type === 'bg') {
          // Gestione speciale per le immagini fisse esistenti nel layout
          const fieldMap: Record<string, keyof SiteConfig> = {
            'sports': 'sportsImageUrl',
            'community': 'communityImageUrl'
          };
          const field = fieldMap[target.sectionId];
          if (field) onUpdateConfig({ ...config, [field]: b64 });
        } else if (target.elementId) {
          updateElement(target.sectionId, target.elementId, b64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const SectionWrapper: React.FC<{ children: React.ReactNode, sectionId: string, idx: number }> = ({ children, sectionId, idx }) => (
    <div className={`relative group/section transition-all duration-300 ${isEditMode ? 'ring-2 ring-dashed ring-brand-blue/20 p-8 m-4 rounded-[4rem] bg-white/30 backdrop-blur-sm shadow-xl' : ''}`}>
      {isEditMode && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-full shadow-2xl z-50">
          <button onClick={() => moveSection(idx, 'up')} className="hover:text-brand-green p-1 transition-transform active:scale-90"><i className="fas fa-arrow-up"></i></button>
          <button onClick={() => moveSection(idx, 'down')} className="hover:text-brand-green p-1 transition-transform active:scale-90"><i className="fas fa-arrow-down"></i></button>
          <div className="w-px h-4 bg-white/20 mx-2"></div>
          <button onClick={() => deleteSection(sectionId)} className="hover:text-red-400 p-1"><i className="fas fa-trash"></i></button>
          <div className="w-px h-4 bg-white/20 mx-2"></div>
          <div className="flex gap-2">
             <button onClick={() => addElement(sectionId, 'text')} className="text-[8px] bg-white/10 px-2 py-1 rounded hover:bg-brand-green hover:text-brand-blue font-black uppercase">T+</button>
             <button onClick={() => addElement(sectionId, 'image')} className="text-[8px] bg-white/10 px-2 py-1 rounded hover:bg-brand-green hover:text-brand-blue font-black uppercase">I+</button>
          </div>
        </div>
      )}
      {children}
      {isEditMode && (config.sections.find(s => s.id === sectionId)?.elements?.length || 0) > 0 && (
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 px-4 border-t border-brand-blue/5 pt-12">
           {config.sections.find(s => s.id === sectionId)?.elements?.map(el => (
             <div key={el.id} className="relative group/el bg-white/50 p-6 rounded-3xl border border-dashed border-brand-blue/10 animate-in fade-in zoom-in duration-300">
               <button 
                 onClick={() => deleteElement(sectionId, el.id)}
                 className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/el:opacity-100 transition-all z-20"
               >
                 <i className="fas fa-times text-[10px]"></i>
               </button>
               
               {el.type === 'text' && (
                 <textarea 
                   value={el.content} 
                   onChange={(e) => updateElement(sectionId, el.id, e.target.value)}
                   className="w-full bg-transparent border-none focus:ring-0 text-sm italic text-brand-blue/60 resize-none min-h-[60px]"
                 />
               )}
               {el.type === 'image' && (
                 <div className="space-y-4">
                   <div className="relative h-40 rounded-2xl overflow-hidden cursor-pointer" onClick={() => handleImageClick(sectionId, el.id)}>
                      <img src={el.content} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-brand-blue/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-all">
                        <i className="fas fa-camera text-white"></i>
                      </div>
                   </div>
                 </div>
               )}
               {el.type === 'logo' && (
                 <div className="flex justify-center">
                    <img src={config.primaryLogoUrl || config.secondaryLogoUrl} className="w-12 h-12 object-contain grayscale opacity-30" />
                 </div>
               )}
             </div>
           ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-32 pb-48">
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
      
      {config.sections.map((section, idx) => {
        if (!section.enabled && !isEditMode) return null;

        // Perché Noi / Features
        if (section.id === 'whyUs') {
          return (
            <SectionWrapper key={section.id} sectionId={section.id} idx={idx}>
              <section className="max-w-7xl mx-auto px-4 text-center">
                {isEditMode ? (
                  <div className="space-y-4 mb-16">
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

        // Sport Area & Custom
        if (section.id === 'sports' || section.id === 'community' || section.isCustom) {
          const imgField = section.id === 'sports' ? 'sportsImageUrl' : 'communityImageUrl';
          const currentImg = (config as any)[imgField] || 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?auto=format&fit=crop&q=80&w=800';
          
          return (
            <SectionWrapper key={section.id} sectionId={section.id} idx={idx}>
              <section className="bg-brand-blue py-32 text-white overflow-hidden relative group-image rounded-[5rem]">
                <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-20 relative z-10">
                  <div className="lg:w-1/2 space-y-8">
                    {isEditMode ? (
                      <div className="space-y-6">
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
                      src={currentImg} 
                      className="rounded-[4rem] shadow-2xl border-4 border-brand-green/20 w-full h-auto object-cover max-h-[500px]" 
                    />
                    {isEditMode && (
                      <div className="absolute inset-0 bg-brand-blue/60 backdrop-blur-sm rounded-[4rem] flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all z-20">
                        <button onClick={() => handleImageClick(section.id)} className="bg-white text-brand-blue px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest shadow-xl hover:scale-110 active:scale-95">Sostituisci Foto</button>
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

      {isEditMode && (
        <div className="flex justify-center pt-20">
          <button 
            onClick={() => {
                const id = `custom_${Date.now()}`;
                onUpdateConfig({
                    ...config,
                    sections: [...config.sections, { id, title: 'Nuovo Blocco Arena', navLabel: 'Nuovo', enabled: true, isCustom: true, elements: [] }]
                });
            }}
            className="group flex items-center gap-6 bg-white border-4 border-dashed border-brand-blue/10 px-16 py-10 rounded-[5rem] text-brand-blue/30 hover:text-brand-green hover:border-brand-green transition-all shadow-2xl"
          >
            <div className="w-20 h-20 bg-brand-light rounded-full flex items-center justify-center text-4xl group-hover:bg-brand-green group-hover:text-brand-blue">
              <i className="fas fa-plus"></i>
            </div>
            <div className="text-left">
              <span className="block text-2xl font-black uppercase italic tracking-tighter">Crea Spazio Custom</span>
              <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">Inserisci una nuova sezione visuale</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default HomeSections;
