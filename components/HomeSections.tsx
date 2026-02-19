
import React, { useRef, useState, useMemo } from 'react';
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

  const addElement = (sId: string, type: 'text' | 'image') => {
    const newEl: SectionElement = {
      id: `el_${Date.now()}`,
      type,
      content: type === 'text' ? 'Modifica questo testo...' : 'https://images.unsplash.com/photo-1595435063785-547bb7c2c537?auto=format&fit=crop&q=80&w=800',
      style: { 
        width: '100%', 
        scale: 1, 
        zIndex: 5, 
        x: 0, 
        y: 0,
        brightness: 1,
        contrast: 1,
        grayscale: 0,
        sepia: 0,
        blur: 0,
        aspectRatio: '1/1',
        objectFit: 'cover'
      }
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

      {/* Advanced Image/Element Editor Sidebar */}
      {isEditMode && activeEditor && activeElement && (
        <div className="fixed right-8 top-32 w-80 bg-white shadow-2xl rounded-[3rem] p-8 z-[100] border border-brand-green/20 max-h-[75vh] overflow-y-auto animate-in slide-in-from-right-10 duration-300">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-blue opacity-50">Element Editor</h3>
            <button onClick={() => setActiveEditor(null)} className="text-brand-blue hover:text-red-500 transition-colors">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h4 className="text-[9px] font-black uppercase text-brand-blue opacity-30 text-left">Trasformazione</h4>
              <div>
                <label className="text-[8px] font-bold uppercase block mb-2 text-left">Scala ({activeElement.style?.scale || 1})</label>
                <input type="range" min="0.1" max="2" step="0.1" value={activeElement.style?.scale || 1} onChange={e => updateElementStyle(activeEditor.sId, activeEditor.elId, { scale: +e.target.value })} className="w-full accent-brand-green" />
              </div>
            </div>

            {activeElement.type === 'image' && (
              <>
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h4 className="text-[9px] font-black uppercase text-brand-blue opacity-30 text-left">Filtri Immagine</h4>
                  
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
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h4 className="text-[9px] font-black uppercase text-brand-blue opacity-30 text-left">Formato e Ritaglio</h4>
                  
                  <div>
                    <label className="text-[8px] font-bold uppercase block mb-2 text-left">Rapporto Aspetto</label>
                    <select 
                      value={activeElement.style?.aspectRatio || '1/1'} 
                      onChange={e => updateElementStyle(activeEditor.sId, activeEditor.elId, { aspectRatio: e.target.value })}
                      className="w-full bg-gray-50 p-2 rounded-xl text-[10px] font-black border-none outline-none"
                    >
                      <option value="1/1">1:1 Quadrato</option>
                      <option value="4/3">4:3 Standard</option>
                      <option value="16/9">16:9 Wide</option>
                      <option value="9/16">9:16 Portrait</option>
                      <option value="auto">Libero</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[8px] font-bold uppercase block mb-2 text-left">Adattamento (Object Fit)</label>
                    <select 
                      value={activeElement.style?.objectFit || 'cover'} 
                      onChange={e => updateElementStyle(activeEditor.sId, activeEditor.elId, { objectFit: e.target.value as any })}
                      className="w-full bg-gray-50 p-2 rounded-xl text-[10px] font-black border-none outline-none"
                    >
                      <option value="cover">Copri (Ritaglia)</option>
                      <option value="contain">Contieni</option>
                      <option value="fill">Riempi</option>
                    </select>
                  </div>

                  <button 
                    onClick={() => { setUploadTarget({sId: activeEditor.sId, elId: activeEditor.elId}); fileInputRef.current?.click(); }}
                    className="w-full py-3 bg-brand-light text-brand-blue rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-brand-green transition-all"
                  >
                    Sostituisci Immagine
                  </button>
                </div>
              </>
            )}

            <button 
              onClick={() => {
                const nextEls = config.sections.find(s => s.id === activeEditor.sId)?.elements?.filter(item => item.id !== activeEditor.elId);
                updateSection(activeEditor.sId, { elements: nextEls });
                setActiveEditor(null);
              }}
              className="w-full py-3 text-red-500 text-[9px] font-black uppercase border-2 border-red-50 rounded-xl hover:bg-red-50 transition-all mt-4"
            >
              Elimina Elemento
            </button>
          </div>
        </div>
      )}

      {/* Section Editor Panel */}
      {isEditMode && activeSectionEditor && activeSection && (
        <div className="fixed left-8 top-32 w-80 bg-white shadow-2xl rounded-[3rem] p-8 z-[100] border border-brand-green/20 max-h-[75vh] overflow-y-auto animate-in slide-in-from-left-10 duration-300">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-blue opacity-50">Section Style</h3>
            <button onClick={() => setActiveSectionEditor(null)} className="text-brand-blue hover:text-red-500 transition-colors">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h4 className="text-[9px] font-black uppercase text-brand-blue opacity-30 text-left">Bordi Sezione</h4>
              
              <div>
                <label className="text-[8px] font-bold uppercase block mb-2 text-left">Spessore Bordo ({activeSection.style?.borderWidth || 0}px)</label>
                <input 
                  type="range" 
                  min="0" 
                  max="20" 
                  step="1" 
                  value={activeSection.style?.borderWidth || 0} 
                  onChange={e => updateSectionStyle(activeSection.id, { borderWidth: +e.target.value })} 
                  className="w-full accent-brand-blue" 
                />
              </div>

              <div>
                <label className="text-[8px] font-bold uppercase block mb-2 text-left">Colore Bordo</label>
                <div className="flex gap-4 items-center">
                  <input 
                    type="color" 
                    value={activeSection.style?.borderColor || '#A8D38E'} 
                    onChange={e => updateSectionStyle(activeSection.id, { borderColor: e.target.value })}
                    className="w-12 h-12 rounded-full border-none p-0 cursor-pointer shadow-md overflow-hidden"
                  />
                  <input 
                    type="text" 
                    value={activeSection.style?.borderColor || '#A8D38E'} 
                    onChange={e => updateSectionStyle(activeSection.id, { borderColor: e.target.value })}
                    className="flex-grow bg-gray-50 p-2 rounded-xl text-[10px] font-black uppercase border-none outline-none"
                    placeholder="#HEX"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h4 className="text-[9px] font-black uppercase text-brand-blue opacity-30 text-left">Sfondo</h4>
              <div>
                <label className="text-[8px] font-bold uppercase block mb-2 text-left">Colore Sfondo</label>
                <input 
                  type="color" 
                  value={activeSection.style?.bgColor || '#FFFFFF'} 
                  onChange={e => updateSectionStyle(activeSection.id, { bgColor: e.target.value })}
                  className="w-full h-10 rounded-xl border-none p-0 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {config.sections.filter(s => s.enabled || isEditMode).map((section) => {
        const sStyle = { ...DEFAULT_STYLE, ...section.style };
        
        return (
          <section 
            key={section.id} 
            className={`relative mx-auto transition-all ${isEditMode ? 'm-10 p-12 rounded-[4rem]' : ''}`}
            style={{ 
              backgroundColor: sStyle.variant === 'solid' ? sStyle.bgColor : 'transparent',
              backgroundImage: sStyle.variant === 'image-bg' ? `url(${sStyle.bgImageUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderWidth: `${sStyle.borderWidth}px`,
              borderColor: sStyle.borderColor,
              borderStyle: sStyle.borderWidth > 0 ? 'solid' : 'none'
            }}
          >
            {isEditMode && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-brand-blue text-white px-8 py-3 rounded-full flex gap-6 shadow-2xl z-50 animate-bounce">
                <span className="text-[10px] font-black uppercase tracking-widest border-r pr-6">EDITING: {section.title}</span>
                <button onClick={() => addElement(section.id, 'text')} className="hover:text-brand-green" title="Aggiungi Testo"><i className="fas fa-font"></i></button>
                <button onClick={() => addElement(section.id, 'image')} className="hover:text-brand-green" title="Aggiungi Immagine"><i className="fas fa-image"></i></button>
                <button onClick={() => setActiveSectionEditor(section.id)} className="hover:text-brand-green" title="Stile Sezione"><i className="fas fa-palette"></i></button>
                <button onClick={() => updateSection(section.id, { enabled: false })} className="hover:text-red-400" title="Elimina Sezione"><i className="fas fa-trash"></i></button>
              </div>
            )}

            <div className={`max-w-7xl mx-auto px-6 text-center space-y-8 relative z-10`}>
              {isEditMode ? (
                <div className="max-w-4xl mx-auto space-y-4">
                  <input 
                    value={section.title || ''} 
                    onChange={e => updateSection(section.id, { title: e.target.value })} 
                    className="w-full text-5xl font-black uppercase italic text-center bg-white border-2 border-brand-green rounded-2xl p-4 text-brand-blue outline-none"
                  />
                  <textarea 
                    value={section.description || ''} 
                    onChange={e => updateSection(section.id, { description: e.target.value })} 
                    className="w-full text-xl opacity-60 italic text-center bg-white border-2 border-brand-green rounded-2xl p-4 text-brand-blue outline-none h-32"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">{section.title}</h2>
                  <p className="text-xl opacity-60 italic max-w-3xl mx-auto">{section.description}</p>
                </>
              )}

              <div className="flex flex-wrap justify-center gap-10 mt-16">
                {section.elements?.map(el => {
                  const st = el.style || {};
                  const isSelected = activeEditor?.elId === el.id;
                  
                  const filterStr = `brightness(${st.brightness ?? 1}) contrast(${st.contrast ?? 1}) grayscale(${st.grayscale ?? 0}) sepia(${st.sepia ?? 0}) blur(${st.blur ?? 0}px)`;
                  
                  return (
                    <div 
                      key={el.id} 
                      onClick={(e) => {
                        if (isEditMode) {
                          e.stopPropagation();
                          setActiveEditor({ sId: section.id, elId: el.id });
                        }
                      }}
                      className={`relative transition-all duration-300 ${isEditMode ? 'cursor-pointer hover:ring-2 hover:ring-brand-green/50 p-4 rounded-[3.5rem] bg-white shadow-xl' : ''} ${isSelected ? 'ring-4 ring-brand-green z-50' : ''}`}
                      style={{ 
                        width: el.type === 'text' ? '100%' : '320px',
                        transform: `scale(${st.scale || 1})`
                      }}
                    >
                      {el.type === 'text' ? (
                        <div className="p-8">
                          {isEditMode ? (
                            <textarea 
                              value={el.content || ''} 
                              onChange={e => updateElement(section.id, el.id, { content: e.target.value })} 
                              className="w-full bg-gray-50 border-2 border-brand-green rounded-2xl p-4 text-brand-blue outline-none h-40 text-center font-bold"
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
                            alt="Arena" 
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default HomeSections;
