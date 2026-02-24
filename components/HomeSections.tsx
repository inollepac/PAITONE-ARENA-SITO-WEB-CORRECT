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
        objectFit: 'cover',
        imageZoom: 1,
        objectX: 50,
        objectY: 50,
        color: '#4E5B83',
        fontSize: '18px',
        fontWeight: '700',
        textAlign: 'center'
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

              {/* Text Specific Controls */}
              {activeElement.type === 'text' && (
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h4 className="text-[9px] font-black uppercase text-brand-blue opacity-30 text-left">Stile Testo</h4>
                  
                  <div>
                    <label className="text-[8px] font-bold uppercase block mb-2 text-left">Allineamento</label>
                    <div className="flex bg-gray-50 rounded-xl p-1">
                      {(['left', 'center', 'right'] as const).map((align) => (
                        <button
                          key={align}
                          onClick={() => updateElementStyle(activeEditor.sId, activeEditor.elId, { textAlign: align })}
                          className={`flex-1 py-2 rounded-lg text-xs transition-all ${activeElement.style?.textAlign === align ? 'bg-brand-blue text-white shadow-md' : 'text-brand-blue/40 hover:bg-white'}`}
                        >
                          <i className={`fas fa-align-${align}`}></i>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-[8px] font-bold uppercase text-brand-blue opacity-60">Grassetto</label>
                    <button
                      onClick={() => updateElementStyle(activeEditor.sId, activeEditor.elId, { fontWeight: activeElement.style?.fontWeight === '700' ? '400' : '700' })}
                      className={`w-12 h-6 rounded-full transition-all relative ${activeElement.style?.fontWeight === '700' ? 'bg-brand-green' : 'bg-gray-200'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${activeElement.style?.fontWeight === '700' ? 'left-7' : 'left-1'}`}></div>
                    </button>
                  </div>

                  <div>
                    <label className="text-[8px] font-bold uppercase block mb-2 text-left">Dimensione Font ({activeElement.style?.fontSize || '18px'})</label>
                    <input 
                      type="range" 
                      min="12" max="120" step="1" 
                      value={parseInt(activeElement.style?.fontSize || '18')} 
                      onChange={e => updateElementStyle(activeEditor.sId, activeEditor.elId, { fontSize: `${e.target.value}px` })} 
                      className="w-full accent-brand-blue" 
                    />
                  </div>

                  <div>
                    <label className="text-[8px] font-bold uppercase block mb-2 text-left">Colore Testo</label>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="color" 
                        value={activeElement.style?.color || '#4E5B83'} 
                        onChange={e => updateElementStyle(activeEditor.sId, activeEditor.elId, { color: e.target.value })} 
                        className="w-10 h-10 rounded-lg cursor-pointer border-none p-0"
                      />
                      <span className="text-[10px] font-mono opacity-50">{activeElement.style?.color || '#4E5B83'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Basic Cropping & Zooming for Images */}
              {(activeElement.type === 'image' || activeElement.type === 'logo') && (
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h4 className="text-[9px] font-black uppercase text-brand-blue opacity-30 text-left">Ritaglio e Zoom Immagine</h4>
                  
                  <div>
                    <label className="text-[8px] font-bold uppercase block mb-2 text-left">Zoom Ritaglio ({Math.round((activeElement.style?.imageZoom || 1) * 100)}%)</label>
                    <input 
                      type="range" 
                      min="1" max="3" step="0.05" 
                      value={activeElement.style?.imageZoom || 1} 
                      onChange={e => updateElementStyle(activeEditor.sId, activeEditor.elId, { imageZoom: +e.target.value })} 
                      className="w-full accent-brand-green" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[8px] font-bold uppercase block mb-2 text-left">Spostamento X ({activeElement.style?.objectX ?? 50}%)</label>
                      <input 
                        type="range" 
                        min="0" max="100" step="1" 
                        value={activeElement.style?.objectX ?? 50} 
                        onChange={e => updateElementStyle(activeEditor.sId, activeEditor.elId, { objectX: +e.target.value })} 
                        className="w-full accent-brand-blue" 
                    />
                    </div>
                    <div>
                      <label className="text-[8px] font-bold uppercase block mb-2 text-left">Spostamento Y ({activeElement.style?.objectY ?? 50}%)</label>
                      <input 
                        type="range" 
                        min="0" max="100" step="1" 
                        value={activeElement.style?.objectY ?? 50} 
                        onChange={e => updateElementStyle(activeEditor.sId, activeEditor.elId, { objectY: +e.target.value })} 
                        className="w-full accent-brand-blue" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[8px] font-bold uppercase block mb-2 text-left">Rapporto Aspetto</label>
                    <select 
                      value={activeElement.style?.aspectRatio || '1/1'} 
                      onChange={e => updateElementStyle(activeEditor.sId, activeEditor.elId, { aspectRatio: e.target.value })}
                      className="w-full bg-gray-50 p-2 rounded-xl text-[10px] font-black border-none outline-none"
                    >
                      <option value="1/1">1:1 Quadrato</option>
                      <option value="4/3">4:3 Fotografia</option>
                      <option value="16/9">16:9 Panoramico</option>
                      <option value="3/2">3:2 Classico</option>
                      <option value="auto">Libero</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Positioning */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h4 className="text-[9px] font-black uppercase text-brand-blue opacity-30 text-left">Posizionamento Elemento</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[8px] font-bold uppercase block mb-2 text-left">Offset X ({activeElement.style?.x || 0}px)</label>
                    {/* Fixed: Added missing activeEditor.sId argument */}
                    <input type="range" min="-200" max="200" step="1" value={activeElement.style?.x || 0} onChange={e => updateElementStyle(activeEditor.sId, activeEditor.elId, { x: +e.target.value })} className="w-full accent-brand-blue" />
                  </div>
                  <div>
                    <label className="text-[8px] font-bold uppercase block mb-2 text-left">Offset Y ({activeElement.style?.y || 0}px)</label>
                    {/* Fixed: Added missing activeEditor.sId argument */}
                    <input type="range" min="-200" max="200" step="1" value={activeElement.style?.y || 0} onChange={e => updateElementStyle(activeEditor.sId, activeEditor.elId, { y: +e.target.value })} className="w-full accent-brand-blue" />
                  </div>
                </div>
                <div>
                  <label className="text-[8px] font-bold uppercase block mb-2 text-left">Dimensione Totale ({activeElement.style?.scale || 1})</label>
                  {/* Fixed: Added missing activeEditor.sId argument */}
                  <input type="range" min="0.1" max="2" step="0.1" value={activeElement.style?.scale || 1} onChange={e => updateElementStyle(activeEditor.sId, activeEditor.elId, { scale: +e.target.value })} className="w-full accent-brand-green" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section Editor Sidebar (UPDATED with background controls) */}
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
              {/* Layout & Variant */}
              <div className="space-y-4">
                <h4 className="text-[9px] font-black uppercase text-brand-blue opacity-30 text-left">Sfondo Sezione</h4>
                <div>
                  <label className="text-[8px] font-bold uppercase block mb-2 text-left">Tipo Sfondo</label>
                  <select 
                    value={activeSection.style?.variant || 'solid'} 
                    onChange={e => updateSectionStyle(activeSection.id, { variant: e.target.value as any })}
                    className="w-full bg-gray-50 p-3 rounded-xl text-[10px] font-black border-none outline-none"
                  >
                    <option value="solid">Colore Solido</option>
                    <option value="custom">Gradiente Custom</option>
                    <option value="image-bg">Immagine Sfondo</option>
                    <option value="glass">Effetto Vetro (Glass)</option>
                    <option value="transparent">Trasparente</option>
                  </select>
                </div>

                {/* Conditional Background Controls */}
                {activeSection.style?.variant === 'solid' && (
                  <div>
                    <label className="text-[8px] font-bold uppercase block mb-2 text-left">Colore Sfondo</label>
                    <div className="flex gap-2 items-center">
                      <input type="color" value={activeSection.style?.bgColor || '#FFFFFF'} onChange={e => updateSectionStyle(activeSection.id, { bgColor: e.target.value })} className="w-10 h-10 rounded-lg cursor-pointer border-none p-0 shadow-sm" />
                      <span className="text-[10px] font-mono opacity-50">{activeSection.style?.bgColor || '#FFFFFF'}</span>
                    </div>
                  </div>
                )}

                {activeSection.style?.variant === 'custom' && (
                  <div className="space-y-2">
                    <label className="text-[8px] font-bold uppercase block mb-2 text-left">Codice Gradiente CSS</label>
                    <textarea 
                      value={activeSection.style?.bgGradient || ''} 
                      onChange={e => updateSectionStyle(activeSection.id, { bgGradient: e.target.value })}
                      placeholder="linear-gradient(135deg, #4E5B83, #A8D38E)"
                      className="w-full bg-gray-50 p-3 rounded-xl text-[10px] font-mono border-none outline-none h-20 resize-none"
                    />
                    <p className="text-[8px] opacity-40 italic">Esempio: linear-gradient(to right, #4E5B83, #A8D38E)</p>
                  </div>
                )}

                {activeSection.style?.variant === 'image-bg' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[8px] font-bold uppercase block mb-2 text-left">URL Immagine</label>
                      <input 
                        type="text"
                        value={activeSection.style?.bgImageUrl || ''} 
                        onChange={e => updateSectionStyle(activeSection.id, { bgImageUrl: e.target.value })}
                        className="w-full bg-gray-50 p-3 rounded-xl text-[10px] font-black border-none outline-none"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-[8px] font-bold uppercase text-brand-blue opacity-60">Effetto Parallasse</label>
                      <button
                        onClick={() => updateSectionStyle(activeSection.id, { parallax: !activeSection.style?.parallax })}
                        className={`w-12 h-6 rounded-full transition-all relative ${activeSection.style?.parallax ? 'bg-brand-green' : 'bg-gray-200'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${activeSection.style?.parallax ? 'left-7' : 'left-1'}`}></div>
                      </button>
                    </div>
                    <div>
                      <label className="text-[8px] font-bold uppercase block mb-2 text-left">Opacità Sfondo ({Math.round((activeSection.style?.bgOpacity ?? 1) * 100)}%)</label>
                      <input type="range" min="0" max="1" step="0.05" value={activeSection.style?.bgOpacity ?? 1} onChange={e => updateSectionStyle(activeSection.id, { bgOpacity: +e.target.value })} className="w-full accent-brand-blue" />
                    </div>
                  </div>
                )}
              </div>

              {/* Borders & Decoration */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h4 className="text-[9px] font-black uppercase text-brand-blue opacity-30 text-left">Bordi e Ombre</h4>
                <div>
                  <label className="text-[8px] font-bold uppercase block mb-2 text-left">Spessore Bordo ({activeSection.style?.borderWidth || 0}px)</label>
                  <input type="range" min="0" max="40" step="1" value={activeSection.style?.borderWidth || 0} onChange={e => updateSectionStyle(activeSection.id, { borderWidth: +e.target.value })} className="w-full accent-brand-blue" />
                </div>
                <div>
                  <label className="text-[8px] font-bold uppercase block mb-2 text-left">Colore Bordo</label>
                  <input type="color" value={activeSection.style?.borderColor || '#A8D38E'} onChange={e => updateSectionStyle(activeSection.id, { borderColor: e.target.value })} className="w-full h-10 rounded-xl cursor-pointer shadow-sm border-none p-0" />
                </div>
                <div>
                  <label className="text-[8px] font-bold uppercase block mb-2 text-left">Arrotondamento</label>
                  <select 
                    value={activeSection.style?.shape || 'rounded'} 
                    onChange={e => updateSectionStyle(activeSection.id, { shape: e.target.value as any })}
                    className="w-full bg-gray-50 p-3 rounded-xl text-[10px] font-black border-none outline-none"
                  >
                    <option value="sharp">Nessuno (Sharp)</option>
                    <option value="rounded">Morbido (Rounded)</option>
                    <option value="pill">Pillola</option>
                    <option value="oval">Ovale</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Sections List */}
      {config.sections.filter(s => s.enabled || isEditMode).map((section, idx) => {
        const sStyle = { ...DEFAULT_STYLE, ...section.style };
        
        // Define dynamic background styles
        const bgStyles: React.CSSProperties = {};
        
        if (sStyle.variant === 'solid') {
          bgStyles.backgroundColor = sStyle.bgColor;
        } else if (sStyle.variant === 'custom') {
          bgStyles.background = sStyle.bgGradient;
        } else if (sStyle.variant === 'image-bg') {
          bgStyles.backgroundImage = `linear-gradient(rgba(255,255,255,${1 - (sStyle.bgOpacity ?? 1)}), rgba(255,255,255,${1 - (sStyle.bgOpacity ?? 1)})), url(${sStyle.bgImageUrl})`;
          bgStyles.backgroundSize = 'cover';
          bgStyles.backgroundPosition = 'center';
          if (sStyle.parallax) {
            bgStyles.backgroundAttachment = 'fixed';
          }
        } else if (sStyle.variant === 'glass') {
          bgStyles.backgroundColor = 'rgba(255, 255, 255, 0.4)';
          bgStyles.backdropFilter = 'blur(16px)';
        } else if (sStyle.variant === 'transparent') {
          bgStyles.backgroundColor = 'transparent';
        }

        // Apply shapes
        const borderRadiusMap = {
          sharp: '0',
          rounded: '4rem',
          pill: '8rem',
          oval: '100%',
          'arc-top': '4rem 4rem 0 0',
          'arc-bottom': '0 0 4rem 4rem'
        };

        return (
          <motion.section 
            key={section.id} 
            initial={isEditMode ? {} : { opacity: 0, y: 30 }}
            whileInView={isEditMode ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`relative mx-auto transition-all ${isEditMode ? 'm-10 p-12 group/section' : ''}`}
            style={{ 
              ...bgStyles,
              borderRadius: borderRadiusMap[sStyle.shape as keyof typeof borderRadiusMap] || '0',
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
                    
                    // Construct Visual Filters
                    const filterStr = `brightness(${st.brightness ?? 1}) contrast(${st.contrast ?? 1}) grayscale(${st.grayscale ?? 0}) sepia(${st.sepia ?? 0}) blur(${st.blur ?? 0}px)`;
                    
                    // Construct Object Position for Cropping
                    const objectPosStr = `${st.objectX ?? 50}% ${st.objectY ?? 50}%`;
                    
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
                                className="w-full bg-transparent border-none outline-none h-auto resize-none overflow-hidden transition-all duration-200"
                                style={{ 
                                  height: 'auto',
                                  color: st.color || '#4E5B83',
                                  fontSize: st.fontSize || '18px',
                                  fontWeight: st.fontWeight || '700',
                                  textAlign: st.textAlign || 'center'
                                }}
                              />
                            ) : (
                              <p 
                                className="italic opacity-80 whitespace-pre-wrap transition-all duration-200"
                                style={{ 
                                  color: st.color || '#4E5B83',
                                  fontSize: st.fontSize || '18px',
                                  fontWeight: st.fontWeight || '700',
                                  textAlign: st.textAlign || 'center'
                                }}
                              >
                                {el.content}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div 
                            className="rounded-[3rem] overflow-hidden shadow-2xl transition-all duration-500 bg-gray-100"
                            style={{ 
                              aspectRatio: st.aspectRatio || '1/1',
                            }}
                          >
                            <img 
                              src={el.content} 
                              loading="lazy"
                              className="w-full h-full" 
                              style={{ 
                                objectFit: st.objectFit || 'cover',
                                objectPosition: objectPosStr,
                                transform: `scale(${st.imageZoom || 1})`,
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
          </motion.section>
        );
      })}
    </div>
  );
};

export default HomeSections;