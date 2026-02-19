
import React, { useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const HomeSections: React.FC<HomeSectionsProps> = ({ config, isEditMode, onUpdateConfig }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeEditor, setActiveEditor] = useState<{ sId: string, elId: string } | null>(null);
  const [activeSectionEditor, setActiveSectionEditor] = useState<string | null>(null);
  const [uploadTarget, setUploadTarget] = useState<{ sId: string, elId?: string, isBg?: boolean } | null>(null);

  const updateSection = (id: string, updates: Partial<SectionContent>) => {
    const nextSections = config.sections.map(s => s.id === id ? { ...s, ...updates } : s);
    onUpdateConfig({ ...config, sections: nextSections });
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= config.sections.length) return;
    const nextSections = [...config.sections];
    [nextSections[index], nextSections[newIndex]] = [nextSections[newIndex], nextSections[index]];
    onUpdateConfig({ ...config, sections: nextSections });
  };

  const duplicateSection = (section: SectionContent) => {
    const newSection = {
      ...JSON.parse(JSON.stringify(section)),
      id: `section_${Date.now()}`,
      title: `${section.title} (Copia)`
    };
    const index = config.sections.findIndex(s => s.id === section.id);
    const nextSections = [...config.sections];
    nextSections.splice(index + 1, 0, newSection);
    onUpdateConfig({ ...config, sections: nextSections });
  };

  const updateSectionStyle = (id: string, styleUpdates: Partial<SectionStyle>) => {
    const nextSections = config.sections.map(s => s.id === id ? {
      ...s,
      style: { ...(s.style || DEFAULT_STYLE), ...styleUpdates }
    } : s);
    onUpdateConfig({ ...config, sections: nextSections });
  };

  const updateElement = (sId: string, elId: string, updates: Partial<SectionElement>) => {
    const nextSections = config.sections.map(s => s.id === sId ? {
      ...s,
      elements: s.elements?.map(el => el.id === elId ? { ...el, ...updates } : el)
    } : s);
    onUpdateConfig({ ...config, sections: nextSections });
  };

  const updateElementStyle = (sId: string, elId: string, styleUpdates: any) => {
    const nextSections = config.sections.map(s => s.id === sId ? {
      ...s,
      elements: s.elements?.map(el => el.id === elId ? { 
        ...el, 
        style: { ...(el.style || {}), ...styleUpdates } 
      } : el)
    } : s);
    onUpdateConfig({ ...config, sections: nextSections });
  };

  const addElement = (sId: string, type: 'text' | 'image' | 'logo') => {
    const content = type === 'text' 
      ? 'Modifica questo testo...' 
      : type === 'logo' 
        ? config.primaryLogoUrl || 'https://via.placeholder.com/150?text=LOGO'
        : 'https://images.unsplash.com/photo-1595435063785-547bb7c2c537?auto=format&fit=crop&q=80&w=800';
    
    const newEl: SectionElement = {
      id: `el_${Date.now()}`,
      type,
      content,
      style: { 
        width: type === 'text' ? '100%' : '320px', 
        scale: 1, 
        zIndex: 5, 
        x: 0, 
        y: 0,
        brightness: 1,
        contrast: 1,
        grayscale: 0,
        sepia: 0,
        blur: 0,
        aspectRatio: type === 'text' ? 'auto' : '1/1',
        objectFit: 'cover'
      }
    };
    const s = config.sections.find(sec => sec.id === sId);
    updateSection(sId, { elements: [...(s?.elements || []), newEl] });
  };

  const duplicateElement = (sId: string, element: SectionElement) => {
    const newEl = {
      ...JSON.parse(JSON.stringify(element)),
      id: `el_${Date.now()}`
    };
    const s = config.sections.find(sec => sec.id === sId);
    updateSection(sId, { elements: [...(s?.elements || []), newEl] });
  };

  const activeElement = useMemo(() => {
    if (!activeEditor) return null;
    return config.sections.find(s => s.id === activeEditor.sId)?.elements?.find(el => el.id === activeEditor.elId);
  }, [activeEditor, config.sections]);

  const activeSection = useMemo(() => {
    if (!activeSectionEditor) return null;
    return config.sections.find(s => s.id === activeSectionEditor);
  }, [activeSectionEditor, config.sections]);

  return (
    <div className="space-y-32 pb-48">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && uploadTarget?.elId) {
            const reader = new FileReader();
            reader.onloadend = () => {
              updateElement(uploadTarget.sId, uploadTarget.elId!, { content: reader.result as string });
            };
            reader.readAsDataURL(file);
          }
        }} 
      />

      {/* Advanced Element Editor Sidebar */}
      <AnimatePresence>
        {isEditMode && activeEditor && activeElement && (
          <motion.div 
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="fixed right-8 top-32 w-80 bg-white shadow-2xl rounded-[3rem] p-8 z-[100] border border-brand-green/20 max-h-[75vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-blue opacity-50">Editor Elemento</h3>
              <button onClick={() => setActiveEditor(null)} className="text-brand-blue hover:text-red-500 transition-colors">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="space-y-8">
              {/* Duplication & Deletion */}
              <div className="flex gap-2">
                <button 
                  onClick={() => duplicateElement(activeEditor.sId, activeElement)}
                  className="flex-1 py-3 bg-brand-light text-brand-blue rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-brand-green transition-all"
                >
                  <i className="fas fa-copy mr-2"></i> Duplica
                </button>
                <button 
                  onClick={() => {
                    const nextEls = config.sections.find(s => s.id === activeEditor.sId)?.elements?.filter(item => item.id !== activeEditor.elId);
                    updateSection(activeEditor.sId, { elements: nextEls });
                    setActiveEditor(null);
                  }}
                  className="flex-1 py-3 bg-red-50 text-red-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                >
                  <i className="fas fa-trash mr-2"></i> Elimina
                </button>
              </div>

              {/* Positioning */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h4 className="text-[9px] font-black uppercase text-brand-blue opacity-30 text-left">Posizionamento Relativo</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[8px] font-bold uppercase block mb-2 text-left">Offset X ({activeElement.style?.x || 0}px)</label>
                    <input type="range" min="-200" max="200" step="1" value={activeElement.style?.x || 0} onChange={e => updateElementStyle(activeEditor.sId, activeEditor.elId, { x: +e.target.value })} className="w-full accent-brand-blue" />
                  </div>
                  <div>
                    <label className="text-[8px] font-bold uppercase block mb-2 text-left">Offset Y ({activeElement.style?.y || 0}px)</label>
                    <input type="range" min="-200" max="200" step="1" value={activeElement.style?.y || 0} onChange={e => updateElementStyle(activeEditor.sId, activeEditor.elId, { y: +e.target.value })} className="w-full accent-brand-blue" />
                  </div>
                </div>
                <div>
                  <label className="text-[8px] font-bold uppercase block mb-2 text-left">Scala ({activeElement.style?.scale || 1})</label>
                  <input type="range" min="0.1" max="2" step="0.1" value={activeElement.style?.scale || 1} onChange={e => updateElementStyle(activeEditor.sId, activeEditor.elId, { scale: +e.target.value })} className="w-full accent-brand-green" />
                </div>
              </div>

              {/* Visual Filters */}
              {(activeElement.type === 'image' || activeElement.type === 'logo') && (
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h4 className="text-[9px] font-black uppercase text-brand-blue opacity-30 text-left">Effetti Visivi</h4>
                  {[
                    { label: 'Luminosità', key: 'brightness', min: 0, max: 2, step: 0.1 },
                    { label: 'Contrasto', key: 'contrast', min: 0, max: 2, step: 0.1 },
                    { label: 'Grigio', key: 'grayscale', min: 0, max: 1, step: 0.1 },
                    { label: 'Seppia', key: 'sepia', min: 0, max: 1, step: 0.1 },
                    { label: 'Sfocatura', key: 'blur', min: 0, max: 10, step: 1 },
                  ].map(filter => (
                    <div key={filter.key}>
                      <label className="text-[8px] font-bold uppercase block mb-2 text-left">{filter.label}</label>
                      <input 
                        type="range" 
                        min={filter.min} 
                        max={filter.max} 
                        step={filter.step} 
                        value={activeElement.style?.[filter.key as keyof typeof activeElement.style] ?? (filter.key === 'blur' || filter.key === 'grayscale' || filter.key === 'sepia' ? 0 : 1)} 
                        onChange={e => updateElementStyle(activeEditor.sId, activeEditor.elId, { [filter.key]: +e.target.value })} 
                        className="w-full accent-brand-green" 
                      />
                    </div>
                  ))}

                  <div className="pt-4">
                    <label className="text-[8px] font-bold uppercase block mb-2 text-left">Adattamento</label>
                    <select 
                      value={activeElement.style?.objectFit || 'cover'} 
                      onChange={e => updateElementStyle(activeEditor.sId, activeEditor.elId, { objectFit: e.target.value as any })}
                      className="w-full bg-gray-50 p-2 rounded-xl text-[10px] font-black border-none outline-none"
                    >
                      <option value="cover">Copri</option>
                      <option value="contain">Contieni</option>
                      <option value="fill">Riempi</option>
                    </select>
                  </div>
                  
                  <button 
                    onClick={() => { setUploadTarget({sId: activeEditor.sId, elId: activeEditor.elId}); fileInputRef.current?.click(); }}
                    className="w-full py-3 bg-brand-light text-brand-blue rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-brand-green transition-all"
                  >
                    Sostituisci File
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section Editor Sidebar */}
      <AnimatePresence>
        {isEditMode && activeSectionEditor && activeSection && (
          <motion.div 
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="fixed left-8 top-32 w-80 bg-white shadow-2xl rounded-[3rem] p-8 z-[100] border border-brand-green/20 max-h-[75vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-blue opacity-50">Stile Sezione</h3>
              <button onClick={() => setActiveSectionEditor(null)} className="text-brand-blue hover:text-red-500 transition-colors">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <h4 className="text-[9px] font-black uppercase text-brand-blue opacity-30 text-left">Bordi</h4>
                <div>
                  <label className="text-[8px] font-bold uppercase block mb-2 text-left">Spessore ({activeSection.style?.borderWidth || 0}px)</label>
                  <input type="range" min="0" max="40" step="1" value={activeSection.style?.borderWidth || 0} onChange={e => updateSectionStyle(activeSection.id, { borderWidth: +e.target.value })} className="w-full accent-brand-blue" />
                </div>
                <div>
                  <label className="text-[8px] font-bold uppercase block mb-2 text-left">Colore Bordo</label>
                  <input type="color" value={activeSection.style?.borderColor || '#A8D38E'} onChange={e => updateSectionStyle(activeSection.id, { borderColor: e.target.value })} className="w-full h-10 rounded-xl cursor-pointer" />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h4 className="text-[9px] font-black uppercase text-brand-blue opacity-30 text-left">Sfondo</h4>
                <div>
                  <label className="text-[8px] font-bold uppercase block mb-2 text-left">Colore Sfondo</label>
                  <input type="color" value={activeSection.style?.bgColor || '#FFFFFF'} onChange={e => updateSectionStyle(activeSection.id, { bgColor: e.target.value })} className="w-full h-10 rounded-xl cursor-pointer" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Sections List */}
      {config.sections.filter(s => s.enabled || isEditMode).map((section, idx) => {
        const sStyle = { ...DEFAULT_STYLE, ...section.style };
        
        return (
          <section 
            key={section.id} 
            className={`relative mx-auto transition-all ${isEditMode ? 'm-10 p-12 rounded-[4rem] group/section' : ''}`}
            style={{ 
              backgroundColor: sStyle.variant === 'solid' ? sStyle.bgColor : 'transparent',
              backgroundImage: sStyle.variant === 'image-bg' ? `url(${sStyle.bgImageUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderWidth: `${sStyle.borderWidth}px`,
              borderColor: sStyle.borderColor,
              borderStyle: sStyle.borderWidth > 0 ? 'solid' : 'none',
              boxShadow: sStyle.shadow !== 'none' ? '0 20px 50px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            {/* Section Control Toolbar */}
            {isEditMode && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-brand-blue text-white px-8 py-3 rounded-full flex gap-6 shadow-2xl z-[60] opacity-0 group-hover/section:opacity-100 transition-opacity">
                <div className="flex items-center gap-2 border-r pr-6 border-white/20">
                  <button onClick={() => moveSection(idx, 'up')} className="hover:text-brand-green" title="Sposta Su"><i className="fas fa-arrow-up"></i></button>
                  <button onClick={() => moveSection(idx, 'down')} className="hover:text-brand-green" title="Sposta Giù"><i className="fas fa-arrow-down"></i></button>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => addElement(section.id, 'text')} className="hover:text-brand-green" title="Aggiungi Testo"><i className="fas fa-font"></i></button>
                  <button onClick={() => addElement(section.id, 'image')} className="hover:text-brand-green" title="Aggiungi Immagine"><i className="fas fa-image"></i></button>
                  <button onClick={() => addElement(section.id, 'logo')} className="hover:text-brand-green" title="Aggiungi Logo"><i className="fas fa-copyright"></i></button>
                  <button onClick={() => setActiveSectionEditor(section.id)} className="hover:text-brand-green" title="Stile Sezione"><i className="fas fa-palette"></i></button>
                  <button onClick={() => duplicateSection(section)} className="hover:text-brand-green" title="Duplica Sezione"><i className="fas fa-copy"></i></button>
                  <button onClick={() => updateSection(section.id, { enabled: false })} className="hover:text-red-400" title="Elimina Sezione"><i className="fas fa-trash"></i></button>
                </div>
              </div>
            )}

            <div className={`max-w-7xl mx-auto px-6 text-center space-y-8 relative z-10`}>
              {isEditMode ? (
                <div className="max-w-4xl mx-auto space-y-4">
                  <input 
                    value={section.title || ''} 
                    onChange={e => updateSection(section.id, { title: e.target.value })} 
                    className="w-full text-5xl font-black uppercase italic text-center bg-white/20 backdrop-blur-md border-2 border-brand-green rounded-2xl p-4 text-brand-blue outline-none"
                    placeholder="Titolo Sezione"
                  />
                  <textarea 
                    value={section.description || ''} 
                    onChange={e => updateSection(section.id, { description: e.target.value })} 
                    className="w-full text-xl opacity-60 italic text-center bg-white/20 backdrop-blur-md border-2 border-brand-green rounded-2xl p-4 text-brand-blue outline-none h-32"
                    placeholder="Descrizione della sezione..."
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">{section.title}</h2>
                  <p className="text-xl opacity-60 italic max-w-3xl mx-auto">{section.description}</p>
                </>
              )}

              {/* Elements Container */}
              <div className="flex flex-wrap justify-center gap-10 mt-16 min-h-[100px]">
                <AnimatePresence>
                  {section.elements?.map(el => {
                    const st = el.style || {};
                    const isSelected = activeEditor?.elId === el.id;
                    const filterStr = `brightness(${st.brightness ?? 1}) contrast(${st.contrast ?? 1}) grayscale(${st.grayscale ?? 0}) sepia(${st.sepia ?? 0}) blur(${st.blur ?? 0}px)`;
                    
                    return (
                      <motion.div 
                        layout
                        key={el.id} 
                        onClick={(e) => {
                          if (isEditMode) {
                            e.stopPropagation();
                            setActiveEditor({ sId: section.id, elId: el.id });
                          }
                        }}
                        className={`relative transition-all duration-300 ${isEditMode ? 'cursor-pointer hover:ring-2 hover:ring-brand-green/50 p-6 rounded-[3.5rem] bg-white shadow-xl' : ''} ${isSelected ? 'ring-4 ring-brand-green z-[50] shadow-[0_0_30px_#A8D38E]' : ''}`}
                        style={{ 
                          width: el.type === 'text' ? '100%' : st.width || '320px',
                          transform: `scale(${st.scale || 1}) translate(${st.x || 0}px, ${st.y || 0}px)`,
                          zIndex: isSelected ? 100 : st.zIndex || 5
                        }}
                      >
                        {el.type === 'text' ? (
                          <div className="p-8">
                            {isEditMode ? (
                              <textarea 
                                value={el.content || ''} 
                                onChange={e => updateElement(section.id, el.id, { content: e.target.value })} 
                                className="w-full bg-transparent border-none text-brand-blue outline-none h-auto text-center font-bold text-lg resize-none overflow-hidden"
                                style={{ height: 'auto' }}
                              />
                            ) : (
                              <p className="italic opacity-80 whitespace-pre-wrap text-lg">{el.content}</p>
                            )}
                          </div>
                        ) : (
                          <div 
                            className="rounded-[3rem] overflow-hidden shadow-2xl transition-all duration-500"
                            style={{ 
                              aspectRatio: st.aspectRatio || '1/1',
                            }}
                          >
                            <img 
                              src={el.content} 
                              className="w-full h-full" 
                              style={{ 
                                objectFit: st.objectFit || 'cover',
                                filter: filterStr
                              }}
                              alt="Arena Element" 
                            />
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default HomeSections;
