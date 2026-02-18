
import React, { useRef, useState } from 'react';
import { SiteConfig, Page, SectionContent, SectionElement, SectionStyle, Court, Event } from '../types';

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
    rounded: 'rounded-[4xl]',
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

const TEXT_SHADOWS = {
  none: 'none',
  soft: '2px 2px 4px rgba(0,0,0,0.2)',
  hard: '4px 4px 0px rgba(0,0,0,0.1)',
  glow: '0 0 15px rgba(168, 211, 142, 0.9)',
  neon: '0 0 5px #fff, 0 0 10px #fff, 0 0 20px var(--brand-green)',
  dark: '2px 2px 10px rgba(78, 91, 131, 0.6)',
  floating: '0 10px 20px rgba(0,0,0,0.2)'
};

const BOX_SHADOWS = {
  none: 'none',
  soft: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  medium: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  heavy: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  neon: '0 0 15px rgba(168, 211, 142, 0.5)',
};

// --- Sub-components outside to avoid closure issues ---

const PositionEditor: React.FC<{
  style: any;
  onUpdate: (upd: any) => void;
}> = ({ style, onUpdate }) => (
  <div className="space-y-4 pt-4 border-t border-gray-100" onClick={e => e.stopPropagation()}>
    <label className="text-[8px] font-black opacity-40 uppercase block mb-1">Posizionamento & Scala</label>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="text-[7px] font-bold opacity-30 block">Offset X ({style.x || 0}px)</label>
        <input type="range" min="-300" max="300" value={style.x || 0} onChange={e => onUpdate({ x: +e.target.value })} className="w-full accent-brand-blue" />
      </div>
      <div>
        <label className="text-[7px] font-bold opacity-30 block">Offset Y ({style.y || 0}px)</label>
        <input type="range" min="-300" max="300" value={style.y || 0} onChange={e => onUpdate({ y: +e.target.value })} className="w-full accent-brand-blue" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="text-[7px] font-bold opacity-30 block">Scala ({style.scale || 1})</label>
        <input type="range" min="0.1" max="4" step="0.1" value={style.scale || 1} onChange={e => onUpdate({ scale: +e.target.value })} className="w-full accent-brand-blue" />
      </div>
      <div>
        <label className="text-[7px] font-bold opacity-30 block">Z-Index ({style.zIndex || 5})</label>
        <input type="range" min="1" max="100" value={style.zIndex || 5} onChange={e => onUpdate({ zIndex: +e.target.value })} className="w-full accent-brand-blue" />
      </div>
    </div>
  </div>
);

const SectionEditorPanel: React.FC<{
  section: SectionContent;
  onUpdate: (upd: Partial<SectionContent>) => void;
  onDelete: () => void;
  onMove: (dir: 'up' | 'down') => void;
  onAddElement: (type: 'text' | 'image' | 'logo') => void;
  onImageUpload: () => void;
}> = ({ section, onUpdate, onDelete, onMove, onAddElement, onImageUpload }) => {
  const [isOpen, setIsOpen] = useState(false);
  const s = section.style || { variant: 'solid', shape: 'rounded', padding: 'medium', width: 'contained', shadow: 'soft', borderWidth: 0, borderColor: '#A8D38E' };
  
  return (
    <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-full shadow-2xl z-[200]" onClick={e => e.stopPropagation()}>
      <button onClick={() => onMove('up')} className="p-1 hover:text-brand-green"><i className="fas fa-arrow-up text-xs"></i></button>
      <button onClick={() => onMove('down')} className="p-1 hover:text-brand-green"><i className="fas fa-arrow-down text-xs"></i></button>
      <div className="w-px h-4 bg-white/20 mx-2"></div>
      <button onClick={() => setIsOpen(!isOpen)} className={`p-1 ${isOpen ? 'text-brand-green' : ''}`}><i className="fas fa-paint-brush text-xs"></i></button>
      <button onClick={() => onAddElement('text')} className="p-1 hover:text-brand-green"><i className="fas fa-font text-xs"></i></button>
      <button onClick={() => onAddElement('image')} className="p-1 hover:text-brand-green"><i className="fas fa-image text-xs"></i></button>
      <button onClick={() => onAddElement('logo')} className="p-1 hover:text-brand-green"><i className="fas fa-star text-xs"></i></button>
      <div className="w-px h-4 bg-white/20 mx-2"></div>
      <button onClick={onDelete} className="p-1 hover:text-red-400"><i className="fas fa-trash text-xs"></i></button>

      {isOpen && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-white text-brand-blue p-8 rounded-3xl shadow-2xl w-80 z-[210] text-left">
          <h4 className="text-[10px] font-black uppercase mb-4 opacity-40">Stile Sezione</h4>
          <div className="space-y-4">
            <select value={s.variant} onChange={e => onUpdate({ style: { ...s, variant: e.target.value as any } })} className="w-full bg-gray-50 p-2 rounded-lg text-xs font-bold">
              <option value="solid">Solido</option>
              <option value="glass">Vetro</option>
              <option value="dark">Dark</option>
              <option value="brand">Brand</option>
              <option value="image-bg">Immagine Sfondo</option>
            </select>
            <select value={s.shape} onChange={e => onUpdate({ style: { ...s, shape: e.target.value as any } })} className="w-full bg-gray-50 p-2 rounded-lg text-xs font-bold">
              <option value="rounded">Arrotondato</option>
              <option value="sharp">Squadrato</option>
              <option value="pill">Pillola</option>
            </select>
            {s.variant === 'image-bg' && (
              <button onClick={onImageUpload} className="w-full py-2 bg-brand-light text-[9px] font-black uppercase rounded-lg">Cambia Sfondo</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ElementEditors = {
  Text: ({ el, onUpdate, onDuplicate }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-2 bg-brand-green text-brand-blue px-3 py-1 rounded-full shadow-lg z-[200]" onClick={e => e.stopPropagation()}>
        <button onClick={() => setIsOpen(!isOpen)} className="text-[9px] font-black uppercase"><i className="fas fa-font mr-1"></i> Edit</button>
        <button onClick={onDuplicate} className="text-[9px] font-black border-l border-brand-blue/20 pl-2"><i className="fas fa-clone"></i></button>
        {isOpen && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white p-6 rounded-3xl shadow-2xl w-72 text-left z-[210]">
            <select value={el.style?.textAlign || 'center'} onChange={e => onUpdate({ textAlign: e.target.value })} className="w-full bg-gray-50 p-2 rounded-lg text-xs font-bold mb-4">
              <option value="left">Sinistra</option>
              <option value="center">Centro</option>
              <option value="right">Destra</option>
            </select>
            <PositionEditor style={el.style || {}} onUpdate={onUpdate} />
          </div>
        )}
      </div>
    );
  },
  Image: ({ el, onUpdate, onReplace, onDuplicate }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-2 bg-brand-blue text-white px-3 py-1 rounded-full shadow-lg z-[200]" onClick={e => e.stopPropagation()}>
        <button onClick={() => setIsOpen(!isOpen)} className="text-[9px] font-black uppercase"><i className="fas fa-image mr-1"></i> Design</button>
        <button onClick={onDuplicate} className="text-[9px] font-black border-l border-white/20 pl-2"><i className="fas fa-clone"></i></button>
        {isOpen && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white p-6 rounded-3xl shadow-2xl w-72 text-left text-brand-blue z-[210]">
            <button onClick={onReplace} className="w-full py-2 bg-brand-light text-[9px] font-black uppercase rounded-lg mb-4">Sostituisci</button>
            <PositionEditor style={el.style || {}} onUpdate={onUpdate} />
          </div>
        )}
      </div>
    );
  }
};

interface HomeSectionsProps {
  config: SiteConfig;
  isEditMode: boolean;
  onUpdateConfig: (config: SiteConfig, save?: boolean) => void;
  onNavigate: (page: Page) => void;
  events: Event[];
  courts: Court[];
}

const HomeSections: React.FC<HomeSectionsProps> = ({ config, isEditMode, onUpdateConfig }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTarget = useRef<{ sId: string, elId?: string, isBg?: boolean } | null>(null);

  const updateSection = (id: string, updates: Partial<SectionContent>) => {
    const next = config.sections.map(s => s.id === id ? { ...s, ...updates } : s);
    onUpdateConfig({ ...config, sections: next });
  };

  const moveSection = (idx: number, dir: 'up' | 'down') => {
    const newIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= config.sections.length) return;
    const next = [...config.sections];
    [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
    onUpdateConfig({ ...config, sections: next });
  };

  const addElement = (sId: string, type: 'text' | 'image' | 'logo') => {
    const el: SectionElement = {
      id: `el_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type,
      content: type === 'text' ? 'Nuovo Testo...' : type === 'image' ? 'https://images.unsplash.com/photo-1595435063785-547bb7c2c537?auto=format&fit=crop&q=80&w=800' : 'primary',
      style: { width: '100%', x: 0, y: 0, scale: 1, zIndex: 5, textAlign: 'center' }
    };
    const next = config.sections.map(s => s.id === sId ? { ...s, elements: [...(s.elements || []), el] } : s);
    onUpdateConfig({ ...config, sections: next });
  };

  const updateElement = (sId: string, elId: string, updates: any) => {
    const next = config.sections.map(s => s.id === sId ? {
      ...s,
      elements: s.elements?.map(el => el.id === elId ? { ...el, ...updates } : el)
    } : s);
    onUpdateConfig({ ...config, sections: next });
  };

  const updateElementStyle = (sId: string, elId: string, styleUpdates: any) => {
    const next = config.sections.map(s => s.id === sId ? {
      ...s,
      elements: s.elements?.map(el => el.id === elId ? { ...el, style: { ...(el.style || {}), ...styleUpdates } } : el)
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
        const s = section.style || { variant: 'solid', shape: 'rounded', padding: 'medium', width: 'contained', shadow: 'soft', borderWidth: 0, borderColor: config.accentColor };
        
        return (
          <div 
            key={section.id} 
            className={`relative transition-all mx-auto ${STYLE_MAPS.variant[s.variant || 'solid']} ${STYLE_MAPS.shape[s.shape || 'rounded']} ${STYLE_MAPS.padding[s.padding || 'medium']} ${STYLE_MAPS.shadow[s.shadow || 'none']} ${isEditMode ? 'ring-2 ring-dashed ring-brand-blue/10 m-6' : ''}`}
            style={{ 
              backgroundColor: s.variant === 'solid' ? s.bgColor : undefined,
              backgroundImage: s.variant === 'image-bg' ? `url(${s.bgImageUrl})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: s.borderWidth ? `${s.borderWidth}px solid ${s.borderColor}` : 'none'
            }}
          >
            {isEditMode && (
              <SectionEditorPanel 
                section={section} 
                onUpdate={(upd) => updateSection(section.id, upd)}
                onDelete={() => onUpdateConfig({ ...config, sections: config.sections.filter(sec => sec.id !== section.id) })}
                onMove={(dir) => moveSection(idx, dir)}
                onAddElement={(type) => addElement(section.id, type)}
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
                        {isEditMode && <ElementEditors.Text el={el} onUpdate={(upd: any) => updateElementStyle(section.id, el.id, upd)} onDuplicate={() => addElement(section.id, 'text')} />}
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-inner" style={{ textAlign: st.textAlign as any }}>
                          {isEditMode ? (
                            <textarea value={el.content} onChange={e => updateElement(section.id, el.id, { content: e.target.value })} className="w-full bg-transparent outline-none italic resize-none" />
                          ) : (
                            <p className="italic opacity-80 whitespace-pre-wrap">{el.content}</p>
                          )}
                        </div>
                      </div>
                    );

                    if (el.type === 'image') return (
                      <div key={el.id} className="relative group cursor-pointer" style={{ transform, zIndex: st.zIndex || 5, width: st.width || '300px' }} onClick={() => isEditMode && triggerUpload(section.id, el.id)}>
                        {isEditMode && <ElementEditors.Image el={el} onUpdate={(upd: any) => updateElementStyle(section.id, el.id, upd)} onReplace={() => triggerUpload(section.id, el.id)} onDuplicate={() => addElement(section.id, 'image')} />}
                        <img src={el.content} className="rounded-3xl shadow-xl w-full h-full object-cover" alt="Arena Element" />
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
