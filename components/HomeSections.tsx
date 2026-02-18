
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
  const [activeEditor, setActiveEditor] = useState<{ type: 'section' | 'element', sId: string, elId?: string } | null>(null);
  const [uploadTarget, setUploadTarget] = useState<{ sId: string, elId?: string, isBg?: boolean } | null>(null);

  const updateSection = (id: string, updates: Partial<SectionContent>) => {
    onUpdateConfig({
      ...config,
      sections: config.sections.map(s => s.id === id ? { ...s, ...updates } : s)
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
      content: type === 'text' ? 'Nuovo contenuto...' : 'https://images.unsplash.com/photo-1595435063785-547bb7c2c537?auto=format&fit=crop&q=80&w=800',
      style: { width: '100%', scale: 1, zIndex: 5, x: 0, y: 0 }
    };
    updateSection(sId, { elements: [...(config.sections.find(s => s.id === sId)?.elements || []), newEl] });
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
          const s = config.sections.find(sec => sec.id === uploadTarget.sId);
          updateSection(uploadTarget.sId, {
            elements: s?.elements?.map(el => el.id === uploadTarget.elId ? { ...el, content: b64 } : el)
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const activeSection = useMemo(() => activeEditor?.type === 'section' ? config.sections.find(s => s.id === activeEditor.sId) : null, [activeEditor, config.sections]);
  const activeElement = useMemo(() => activeEditor?.type === 'element' ? config.sections.find(s => s.id === activeEditor.sId)?.elements?.find(el => el.id === activeEditor.elId) : null, [activeEditor, config.sections]);

  return (
    <div className="space-y-24 pb-48">
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFile} accept="image/*" />

      {/* Editor Sidebar Fixed */}
      {isEditMode && activeEditor && (
        <div className="fixed right-8 top-32 w-80 bg-white shadow-2xl rounded-[3rem] p-8 z-[9999] border border-brand-blue/10 max-h-[70vh] overflow-y-auto animate-in slide-in-from-right-10 duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-brand-blue opacity-40">Proprietà {activeEditor.type === 'section' ? 'Sezione' : 'Elemento'}</h3>
            <button onClick={() => setActiveEditor(null)} className="text-brand-blue hover:text-red-500"><i className="fas fa-times"></i></button>
          </div>

          <div className="space-y-6">
            {activeSection && (
              <>
                <div>
                  <label className="text-[10px] font-black uppercase block mb-2">Variante Sfondo</label>
                  <select 
                    value={activeSection.style?.variant || 'solid'} 
                    onChange={e => updateSection(activeSection.id, { style: { ...(activeSection.style || DEFAULT_STYLE), variant: e.target.value as any } })}
                    className="w-full bg-gray-50 p-2 rounded-xl text-xs font-bold"
                  >
                    <option value="solid">Solido</option>
                    <option value="glass">Vetro</option>
                    <option value="dark">Dark</option>
                    <option value="image-bg">Immagine Sfondo</option>
                  </select>
                </div>
                {(activeSection.style?.variant === 'solid' || !activeSection.style?.variant) && (
                  <div>
                    <label className="text-[10px] font-black uppercase block mb-2">Colore Sfondo</label>
                    <input type="color" value={activeSection.style?.bgColor || '#FFFFFF'} onChange={e => updateSection(activeSection.id, { style: { ...(activeSection.style || DEFAULT_STYLE), bgColor: e.target.value } })} className="w-full h-8 cursor-pointer rounded-lg overflow-hidden border-0" />
                  </div>
                )}
                {activeSection.style?.variant === 'image-bg' && (
                  <button onClick={() => { setUploadTarget({ sId: activeSection.id, isBg: true }); fileInputRef.current?.click(); }} className="w-full py-2 bg-brand-light text-brand-blue rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-green transition">Carica Sfondo</button>
                )}
                <div className="pt-4 border-t border-gray-50">
                  <button onClick={() => updateSection(activeSection.id, { enabled: false })} className="w-full py-2 text-red-500 text-[10px] font-black uppercase border border-red-100 rounded-xl hover:bg-red-50 transition">Elimina Sezione</button>
                </div>
              </>
            )}

            {activeElement && (
              <>
                <div>
                  <label className="text-[10px] font-black uppercase block mb-2">Scala ({activeElement.style?.scale || 1})</label>
                  <input type="range" min="0.1" max="3" step="0.1" value={activeElement.style?.scale || 1} onChange={e => updateElementStyle(activeEditor.sId, activeEditor.elId!, { scale: +e.target.value })} className="w-full accent-brand-blue" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase block mb-2">Rotazione ({activeElement.style?.rotation || 0}°)</label>
                  <input type="range" min="0" max="360" value={activeElement.style?.rotation || 0} onChange={e => updateElementStyle(activeEditor.sId, activeEditor.elId!, { rotation: +e.target.value })} className="w-full accent-brand-blue" />
                </div>
                {activeElement.type === 'image' && (
                  <button onClick={() => { setUploadTarget({ sId: activeEditor.sId, elId: activeEditor.elId }); fileInputRef.current?.click(); }} className="w-full py-2 bg-brand-light text-brand-blue rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-green transition">Cambia Immagine</button>
                )}
                <div className="pt-4 border-t border-gray-50">
                  <button 
                    onClick={() => updateSection(activeEditor.sId, { elements: activeSection?.elements?.filter(el => el.id !== activeEditor.elId) })}
                    className="w-full py-2 text-red-500 text-[10px] font-black uppercase border border-red-100 rounded-xl hover:bg-red-50 transition"
                  >Elimina Elemento</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {config.sections.map((section) => {
        if (!section.enabled && !isEditMode) return null;
        const s = { ...DEFAULT_STYLE, ...section.style };
        const isActive = activeEditor?.type === 'section' && activeEditor.sId === section.id;

        return (
          <div 
            key={section.id} 
            onClick={(e) => { e.stopPropagation(); isEditMode && setActiveEditor({ type: 'section', sId: section.id }); }}
            className={`relative transition-all mx-auto ${STYLE_MAPS.variant[s.variant || 'solid']} ${STYLE_MAPS.shape[s.shape || 'rounded']} ${STYLE_MAPS.padding[s.padding || 'medium']} ${isEditMode ? 'cursor-pointer hover:ring-4 hover:ring-brand-blue/20 m-6' : ''} ${isActive ? 'ring-4 ring-brand-green shadow-2xl scale-[1.01]' : ''}`}
            style={{ 
              backgroundColor: (s.variant === 'solid' || !s.variant) ? s.bgColor : undefined,
              backgroundImage: s.variant === 'image-bg' ? `url(${s.bgImageUrl})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {isEditMode && (
               <div className="absolute top-4 right-4 flex gap-2 z-[50]">
                  <button onClick={(e) => { e.stopPropagation(); addElement(section.id, 'text'); }} className="w-8 h-8 bg-brand-blue text-white rounded-full flex items-center justify-center shadow-lg hover:bg-brand-green hover:text-brand-blue transition"><i className="fas fa-font text-xs"></i></button>
                  <button onClick={(e) => { e.stopPropagation(); addElement(section.id, 'image'); }} className="w-8 h-8 bg-brand-blue text-white rounded-full flex items-center justify-center shadow-lg hover:bg-brand-green hover:text-brand-blue transition"><i className="fas fa-image text-xs"></i></button>
               </div>
            )}

            <div className={`mx-auto px-6 relative z-10 ${s.width === 'full' ? 'w-full' : 'max-w-7xl'}`}>
              <div className="text-center space-y-6">
                {isEditMode ? (
                  <div className="space-y-4">
                    <input 
                      value={section.title} 
                      onClick={e => e.stopPropagation()} 
                      onChange={e => updateSection(section.id, { title: e.target.value })} 
                      className="text-4xl md:text-6xl font-black uppercase text-center w-full bg-transparent outline-none italic border-b border-brand-blue/5" 
                    />
                    <textarea 
                      value={section.description} 
                      onClick={e => e.stopPropagation()} 
                      onChange={e => updateSection(section.id, { description: e.target.value })} 
                      className="text-lg opacity-60 italic text-center w-full bg-transparent outline-none resize-none border-b border-brand-blue/5" 
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
                    const isElActive = activeEditor?.type === 'element' && activeEditor.elId === el.id;
                    const transform = `translate(${st.x || 0}px, ${st.y || 0}px) rotate(${st.rotation || 0}deg) scale(${st.scale || 1})`;
                    
                    return (
                      <div 
                        key={el.id} 
                        onClick={(e) => { e.stopPropagation(); isEditMode && setActiveEditor({ type: 'element', sId: section.id, elId: el.id }); }}
                        className={`relative group transition-all duration-300 ${isEditMode ? 'cursor-move' : ''} ${isElActive ? 'ring-4 ring-brand-green rounded-3xl p-1 z-50' : ''}`}
                        style={{ transform, zIndex: st.zIndex || 5, width: st.width || (el.type === 'text' ? '100%' : '300px') }}
                      >
                        {el.type === 'text' ? (
                          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-inner text-center">
                            {isEditMode ? (
                              <textarea 
                                value={el.content} 
                                onClick={e => e.stopPropagation()} 
                                onChange={e => {
                                  const nextEls = section.elements?.map(item => item.id === el.id ? { ...item, content: e.target.value } : item);
                                  updateSection(section.id, { elements: nextEls });
                                }} 
                                className="w-full bg-transparent outline-none italic resize-none text-center border-none focus:ring-0" 
                              />
                            ) : (
                              <p className="italic opacity-80 whitespace-pre-wrap">{el.content}</p>
                            )}
                          </div>
                        ) : (
                          <img 
                            src={el.content} 
                            className={`rounded-3xl shadow-xl w-full h-full object-cover ${isEditMode ? 'group-hover:opacity-80' : ''}`} 
                            alt="Arena Content" 
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
