
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

const SectionEditorPanel = ({ section, onUpdate, onDelete, onMove, onAddElement, onImageUpload }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const s = section.style || { variant: 'solid', shape: 'rounded', padding: 'medium', width: 'contained' };

  return (
    <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-full shadow-2xl z-[999]" onClick={e => e.stopPropagation()}>
      <button onClick={() => onMove('up')} className="p-2 hover:text-brand-green"><i className="fas fa-arrow-up"></i></button>
      <button onClick={() => onMove('down')} className="p-2 hover:text-brand-green"><i className="fas fa-arrow-down"></i></button>
      <div className="w-px h-4 bg-white/20 mx-2"></div>
      <button onClick={() => setIsOpen(!isOpen)} className={`p-2 ${isOpen ? 'text-brand-green' : ''}`}><i className="fas fa-paint-brush"></i></button>
      <button onClick={() => onAddElement('text')} className="p-2 hover:text-brand-green"><i className="fas fa-font"></i></button>
      <button onClick={() => onAddElement('image')} className="p-2 hover:text-brand-green"><i className="fas fa-image"></i></button>
      <div className="w-px h-4 bg-white/20 mx-2"></div>
      <button onClick={onDelete} className="p-2 hover:text-red-400"><i className="fas fa-trash"></i></button>

      {isOpen && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-white text-brand-blue p-8 rounded-3xl shadow-2xl w-80 z-[1000] text-left">
          <h4 className="text-[10px] font-black uppercase mb-4 opacity-40">Opzioni Sezione</h4>
          <div className="space-y-4">
            <select value={s.variant} onChange={e => onUpdate({ style: { ...s, variant: e.target.value } })} className="w-full bg-gray-50 p-2 rounded-lg text-xs font-bold">
              <option value="solid">Solido</option>
              <option value="glass">Vetro</option>
              <option value="dark">Dark</option>
              <option value="image-bg">Immagine Sfondo</option>
            </select>
            {s.variant === 'image-bg' && (
              <button onClick={onImageUpload} className="w-full py-2 bg-brand-light text-[9px] font-black uppercase rounded-lg">Cambia Immagine</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ElementEditor = ({ el, onUpdate, onDuplicate, onReplace }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const color = el.type === 'text' ? 'bg-brand-green text-brand-blue' : 'bg-brand-blue text-white';

  return (
    <div className={`absolute -top-10 left-1/2 -translate-x-1/2 flex gap-2 ${color} px-4 py-1.5 rounded-full shadow-lg z-[999]`} onClick={e => e.stopPropagation()}>
      <button onClick={() => setIsOpen(!isOpen)} className="text-[9px] font-black uppercase"><i className="fas fa-edit mr-1"></i> Modifica</button>
      <button onClick={onDuplicate} className="text-[9px] font-black border-l border-current/20 pl-2"><i className="fas fa-clone"></i></button>
      {isOpen && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-white p-6 rounded-3xl shadow-2xl w-64 text-left text-brand-blue z-[1000]">
          {el.type === 'image' && (
            <button onClick={onReplace} className="w-full py-2 bg-brand-light text-[9px] font-black uppercase rounded-lg mb-4">Sostituisci Foto</button>
          )}
          <div className="space-y-4">
            <label className="text-[8px] font-black opacity-30 uppercase block">Scala ({el.style?.scale || 1})</label>
            <input type="range" min="0.1" max="3" step="0.1" value={el.style?.scale || 1} onChange={e => onUpdate({ scale: +e.target.value })} className="w-full accent-brand-blue" />
          </div>
        </div>
      )}
    </div>
  );
};

const HomeSections: React.FC<HomeSectionsProps> = ({ config, isEditMode, onUpdateConfig, onNavigate, events, courts }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTarget = useRef<{ sId: string, elId?: string, isBg?: boolean } | null>(null);

  const updateSection = (id: string, updates: Partial<SectionContent>) => {
    const next = config.sections.map(s => s.id === id ? { ...s, ...updates } : s);
    onUpdateConfig({ ...config, sections: next });
  };

  const moveSection = (idx: number, dir: 'up' | 'down') => {
    const nextIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (nextIdx < 0 || nextIdx >= config.sections.length) return;
    const next = [...config.sections];
    [next[idx], next[nextIdx]] = [next[nextIdx], next[idx]];
    onUpdateConfig({ ...config, sections: next });
  };

  const addElement = (sId: string, type: 'text' | 'image' | 'logo') => {
    const el: SectionElement = {
      id: `el_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type,
      content: type === 'text' ? 'Nuovo Messaggio...' : type === 'image' ? 'https://images.unsplash.com/photo-1595435063785-547bb7c2c537?auto=format&fit=crop&q=80&w=800' : 'primary',
      style: { width: '100%', scale: 1, zIndex: 5, x: 0, y: 0 }
    };
    const next = config.sections.map(s => s.id === sId ? { ...s, elements: [...(s.elements || []), el] } : s);
    onUpdateConfig({ ...config, sections: next });
  };

  const updateElement = (sId: string, elId: string, upd: any) => {
    const next = config.sections.map(s => s.id === sId ? {
      ...s,
      elements: s.elements?.map(el => el.id === elId ? { ...el, ...upd } : el)
    } : s);
    onUpdateConfig({ ...config, sections: next });
  };

  const updateElementStyle = (sId: string, elId: string, st: any) => {
    const next = config.sections.map(s => s.id === sId ? {
      ...s,
      elements: s.elements?.map(el => el.id === elId ? { ...el, style: { ...(el.style || {}), ...st } } : el)
    } : s);
    onUpdateConfig({ ...config, sections: next });
  };

  const triggerUpload = (sId: string, elId?: string, isBg?: boolean) => {
    uploadTarget.current = { sId, elId, isBg };
    fileInputRef.current?.click();
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadTarget.current) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const b64 = reader.result as string;
        const { sId, elId, isBg } = uploadTarget.current!;
        if (isBg) {
          const section = config.sections.find(s => s.id === sId);
          if (section) updateSection(sId, { style: { ...(section.style || {}), bgImageUrl: b64 } as any });
        } else if (elId) {
          updateElement(sId, elId, { content: b64 });
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
        const s = section.style || { variant: 'solid', shape: 'rounded', padding: 'medium', width: 'contained' };
        
        return (
          <div 
            key={section.id} 
            className={`relative transition-all mx-auto ${STYLE_MAPS.variant[s.variant || 'solid']} ${STYLE_MAPS.shape[s.shape || 'rounded']} ${STYLE_MAPS.padding[s.padding || 'medium']} ${isEditMode ? 'ring-2 ring-dashed ring-brand-blue/10 m-6' : ''}`}
            style={{ 
              backgroundColor: s.variant === 'solid' ? s.bgColor : undefined,
              backgroundImage: s.variant === 'image-bg' ? `url(${s.bgImageUrl})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {isEditMode && (
              <SectionEditorPanel 
                section={section} 
                onUpdate={(upd: any) => updateSection(section.id, upd)}
                onDelete={() => onUpdateConfig({ ...config, sections: config.sections.filter(sec => sec.id !== section.id) })}
                onMove={(dir: any) => moveSection(idx, dir)}
                onAddElement={(type: any) => addElement(section.id, type)}
                onImageUpload={() => triggerUpload(section.id, undefined, true)}
              />
            )}

            <div className={`mx-auto px-6 relative z-10 ${s.width === 'full' ? 'w-full' : 'max-w-7xl'}`}>
              <div className="text-center space-y-6">
                {isEditMode ? (
                  <>
                    <input value={section.title} onChange={e => updateSection(section.id, { title: e.target.value })} className="text-4xl md:text-6xl font-black uppercase text-center w-full bg-transparent outline-none italic" />
                    <textarea value={section.description} onChange={e => updateSection(section.id, { description: e.target.value })} className="text-lg opacity-60 italic text-center w-full bg-transparent outline-none resize-none" />
                  </>
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
                    
                    if (el.type === 'text') return (
                      <div key={el.id} className="relative group min-w-[300px]" style={{ transform, zIndex: st.zIndex || 5, width: st.width || '100%' }}>
                        {isEditMode && <ElementEditor el={el} onUpdate={(upd: any) => updateElementStyle(section.id, el.id, upd)} onDuplicate={() => addElement(section.id, 'text')} />}
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-inner">
                          {isEditMode ? (
                            <textarea value={el.content} onChange={e => updateElement(section.id, el.id, { content: e.target.value })} className="w-full bg-transparent outline-none italic resize-none text-center" />
                          ) : (
                            <p className="italic opacity-80 whitespace-pre-wrap text-center">{el.content}</p>
                          )}
                        </div>
                      </div>
                    );

                    if (el.type === 'image') return (
                      <div key={el.id} className="relative group" style={{ transform, zIndex: st.zIndex || 5, width: st.width || '300px' }}>
                        {isEditMode && <ElementEditor el={el} onUpdate={(upd: any) => updateElementStyle(section.id, el.id, upd)} onReplace={() => triggerUpload(section.id, el.id)} onDuplicate={() => addElement(section.id, 'image')} />}
                        <img src={el.content} className="rounded-3xl shadow-xl w-full h-full object-cover cursor-pointer" alt="Arena" onClick={() => isEditMode && triggerUpload(section.id, el.id)} />
                      </div>
                    );
                    
                    return null;
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
