
import React, { useRef, useState } from 'react';
import { SiteConfig, Page, SectionContent, SectionElement, SectionStyle, Court, Event } from '../types';

interface HomeSectionsProps {
  config: SiteConfig;
  isEditMode: boolean;
  onUpdateConfig: (config: SiteConfig, saveToHistory?: boolean) => void;
  onNavigate: (page: Page) => void;
  events: Event[];
  courts: Court[];
}

const DEFAULT_STYLE: SectionStyle = {
  variant: 'solid',
  shape: 'rounded',
  padding: 'medium',
  width: 'contained',
  shadow: 'none',
  borderWidth: 0,
  borderColor: '#A8D38E',
  bgColor: '#FFFFFF',
  bgGradient: '',
  bgImageUrl: '',
  bgOpacity: 1,
  parallax: false
};

const STYLE_MAPS = {
  variant: {
    glass: 'glass border border-white/20',
    solid: '',
    transparent: 'bg-transparent',
    dark: 'bg-brand-blue text-white',
    brand: 'bg-brand-green text-brand-blue',
    'image-bg': 'bg-cover bg-center text-white',
    custom: ''
  },
  shape: {
    rounded: 'rounded-[4rem]',
    sharp: 'rounded-none',
    pill: 'rounded-full',
    oval: 'rounded-[50%]',
    'arc-top': 'rounded-t-[100px]',
    'arc-bottom': 'rounded-b-[100px]'
  },
  padding: {
    none: 'py-0',
    small: 'py-8',
    medium: 'py-16',
    large: 'py-32',
    huge: 'py-48'
  },
  shadow: {
    none: 'shadow-none',
    soft: 'shadow-lg',
    medium: 'shadow-xl',
    heavy: 'shadow-2xl',
    extra: 'shadow-inner'
  }
};

const HomeSections: React.FC<HomeSectionsProps> = ({ config, isEditMode, onUpdateConfig }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<{ sId: string, elId?: string, isBg?: boolean } | null>(null);

  const updateSection = (id: string, updates: Partial<SectionContent>) => {
    onUpdateConfig({
      ...config,
      sections: config.sections.map(s => s.id === id ? { ...s, ...updates } : s)
    });
  };

  const updateElement = (sId: string, elId: string, updates: Partial<SectionElement>) => {
    onUpdateConfig({
      ...config,
      sections: config.sections.map(s => s.id === sId ? {
        ...s,
        elements: s.elements?.map(el => el.id === elId ? { ...el, ...updates } : el)
      } : s)
    });
  };

  const updateElementStyle = (sId: string, elId: string, styleUpdates: any) => {
    onUpdateConfig({
      ...config,
      sections: config.sections.map(s => s.id === sId ? {
        ...s,
        elements: s.elements?.map(el => el.id === elId ? { ...el, style: { ...(el.style || {}), ...styleUpdates } } : el)
      } : s)
    });
  };

  const addElement = (sId: string, type: 'text' | 'image') => {
    const newEl: SectionElement = {
      id: `el_${Date.now()}`,
      type,
      content: type === 'text' ? 'Nuovo contenuto tecnico...' : 'https://images.unsplash.com/photo-1595435063785-547bb7c2c537?auto=format&fit=crop&q=80&w=800',
      style: { width: '100%', scale: 1, zIndex: 5, x: 0, y: 0 }
    };
    const s = config.sections.find(sec => sec.id === sId);
    updateSection(sId, { elements: [...(s?.elements || []), newEl] });
  };

  const deleteElement = (sId: string, elId: string) => {
    const s = config.sections.find(sec => sec.id === sId);
    updateSection(sId, { elements: s?.elements?.filter(el => el.id !== elId) });
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...config.sections];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newSections.length) return;
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
    onUpdateConfig({ ...config, sections: newSections });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadTarget) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const b64 = reader.result as string;
        if (uploadTarget.isBg) {
          const s = config.sections.find(sec => sec.id === uploadTarget.sId);
          updateSection(uploadTarget.sId, { style: { ...(s?.style || DEFAULT_STYLE), bgImageUrl: b64 } });
        } else if (uploadTarget.elId) {
          updateElement(uploadTarget.sId, uploadTarget.elId, { content: b64 });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-24 pb-48">
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFile} accept="image/*" />

      {config.sections.map((section, idx) => {
        if (!section.enabled && !isEditMode) return null;
        const s = { ...DEFAULT_STYLE, ...section.style };
        
        return (
          <div 
            key={section.id} 
            className={`relative transition-all mx-auto ${STYLE_MAPS.variant[s.variant || 'solid']} ${STYLE_MAPS.shape[s.shape || 'rounded']} ${STYLE_MAPS.padding[s.padding || 'medium']} ${isEditMode ? 'group/section ring-2 ring-dashed ring-brand-blue/10 m-6' : ''}`}
            style={{ 
              backgroundColor: s.variant === 'solid' ? s.bgColor : undefined,
              backgroundImage: s.variant === 'image-bg' ? `url(${s.bgImageUrl})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Sezione Toolbar */}
            {isEditMode && (
               <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-brand-blue text-white px-6 py-2 rounded-full flex items-center gap-4 shadow-2xl z-[1000] opacity-0 group-hover/section:opacity-100 transition-opacity">
                  <span className="text-[10px] font-black uppercase tracking-widest mr-2">Sezione</span>
                  <button onClick={() => moveSection(idx, 'up')} className="hover:text-brand-green p-1"><i className="fas fa-arrow-up"></i></button>
                  <button onClick={() => moveSection(idx, 'down')} className="hover:text-brand-green p-1"><i className="fas fa-arrow-down"></i></button>
                  <div className="w-px h-4 bg-white/20 mx-1"></div>
                  <button onClick={() => { setUploadTarget({ sId: section.id, isBg: true }); fileInputRef.current?.click(); }} title="Sfondo" className="hover:text-brand-green p-1"><i className="fas fa-image"></i></button>
                  <button onClick={() => addElement(section.id, 'text')} title="Aggiungi Testo" className="hover:text-brand-green p-1"><i className="fas fa-font"></i></button>
                  <button onClick={() => addElement(section.id, 'image')} title="Aggiungi Immagine" className="hover:text-brand-green p-1"><i className="fas fa-plus-circle"></i></button>
                  <div className="w-px h-4 bg-white/20 mx-1"></div>
                  <button onClick={() => updateSection(section.id, { enabled: false })} className="hover:text-red-400 p-1"><i className="fas fa-trash"></i></button>
               </div>
            )}

            <div className={`mx-auto px-6 relative z-10 ${s.width === 'full' ? 'w-full' : 'max-w-7xl'}`}>
              <div className="text-center space-y-6">
                {isEditMode ? (
                  <div className="space-y-4">
                    <input 
                      value={section.title} 
                      onChange={e => updateSection(section.id, { title: e.target.value })} 
                      className="text-4xl md:text-6xl font-black uppercase text-center w-full bg-white/5 border-b border-brand-green/30 outline-none italic py-2 focus:bg-white/10 transition-all" 
                      placeholder="Titolo Sezione"
                    />
                    <textarea 
                      value={section.description} 
                      onChange={e => updateSection(section.id, { description: e.target.value })} 
                      className="text-lg opacity-60 italic text-center w-full bg-white/5 border-b border-brand-green/30 outline-none resize-none py-2 focus:bg-white/10 transition-all" 
                      placeholder="Descrizione Sezione"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">{section.title}</h2>
                    <p className="text-lg opacity-60 italic max-w-3xl mx-auto">{section.description}</p>
                  </>
                )}

                <div className="flex flex-wrap items-center justify-center gap-12 mt-16 min-h-[100px]">
                  {section.elements?.map(el => {
                    const st = el.style || {};
                    const transform = `translate(${st.x || 0}px, ${st.y || 0}px) rotate(${st.rotation || 0}deg) scale(${st.scale || 1})`;
                    
                    return (
                      <div 
                        key={el.id} 
                        className={`relative group/element transition-all duration-300 ${isEditMode ? 'ring-1 ring-brand-green/20 rounded-3xl p-2' : ''}`}
                        style={{ transform, zIndex: st.zIndex || 5, width: st.width || (el.type === 'text' ? '100%' : '300px') }}
                      >
                        {/* Element Toolbar */}
                        {isEditMode && (
                           <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand-green text-brand-blue px-3 py-1 rounded-full flex items-center gap-3 shadow-xl z-[1001] opacity-0 group-hover/element:opacity-100 transition-opacity whitespace-nowrap">
                              <button onClick={() => updateElementStyle(section.id, el.id, { scale: (st.scale || 1) + 0.1 })} className="p-1"><i className="fas fa-plus text-[10px]"></i></button>
                              <button onClick={() => updateElementStyle(section.id, el.id, { scale: (st.scale || 1) - 0.1 })} className="p-1"><i className="fas fa-minus text-[10px]"></i></button>
                              {el.type === 'image' && <button onClick={() => { setUploadTarget({ sId: section.id, elId: el.id }); fileInputRef.current?.click(); }} className="p-1"><i className="fas fa-sync-alt text-[10px]"></i></button>}
                              <button onClick={() => deleteElement(section.id, el.id)} className="p-1 hover:text-red-600"><i className="fas fa-trash text-[10px]"></i></button>
                           </div>
                        )}

                        {el.type === 'text' ? (
                          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-inner text-center">
                            {isEditMode ? (
                              <textarea 
                                value={el.content} 
                                onChange={e => updateElement(section.id, el.id, { content: e.target.value })} 
                                className="w-full bg-transparent outline-none italic resize-none text-center border-none focus:ring-0 min-h-[100px]" 
                                placeholder="Scrivi qui il contenuto..."
                              />
                            ) : (
                              <p className="italic opacity-80 whitespace-pre-wrap">{el.content}</p>
                            )}
                          </div>
                        ) : (
                          <img 
                            src={el.content} 
                            className={`rounded-3xl shadow-xl w-full h-full object-cover ${isEditMode ? 'hover:brightness-75 cursor-pointer' : ''}`} 
                            alt="Arena Content" 
                            onClick={() => isEditMode && (setUploadTarget({ sId: section.id, elId: el.id }), fileInputRef.current?.click())}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HomeSections;
