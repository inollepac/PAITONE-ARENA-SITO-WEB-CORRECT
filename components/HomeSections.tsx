
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

const HomeSections: React.FC<HomeSectionsProps> = ({ config, isEditMode, onUpdateConfig }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<{ sId: string, elId?: string, isBg?: boolean } | null>(null);

  const updateSection = (id: string, updates: Partial<SectionContent>) => {
    const nextSections = config.sections.map(s => s.id === id ? { ...s, ...updates } : s);
    onUpdateConfig({ ...config, sections: nextSections });
  };

  const updateElement = (sId: string, elId: string, updates: Partial<SectionElement>) => {
    const nextSections = config.sections.map(s => s.id === sId ? {
      ...s,
      elements: s.elements?.map(el => el.id === elId ? { ...el, ...updates } : el)
    } : s);
    onUpdateConfig({ ...config, sections: nextSections });
  };

  const addElement = (sId: string, type: 'text' | 'image') => {
    const newEl: SectionElement = {
      id: `el_${Date.now()}`,
      type,
      content: type === 'text' ? 'Modifica questo testo...' : 'https://images.unsplash.com/photo-1595435063785-547bb7c2c537?auto=format&fit=crop&q=80&w=800',
      style: { width: '100%', scale: 1, zIndex: 5, x: 0, y: 0 }
    };
    const s = config.sections.find(sec => sec.id === sId);
    updateSection(sId, { elements: [...(s?.elements || []), newEl] });
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
    <div className="space-y-32 pb-48">
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFile} accept="image/*" />

      {config.sections.filter(s => s.enabled || isEditMode).map((section) => {
        const sStyle = { ...DEFAULT_STYLE, ...section.style };
        
        return (
          <section 
            key={section.id} 
            className={`relative mx-auto transition-all ${isEditMode ? 'ring-2 ring-brand-green/20 ring-dashed m-10 p-10 rounded-[4rem]' : ''}`}
            style={{ 
              backgroundColor: sStyle.variant === 'solid' ? sStyle.bgColor : 'transparent',
              backgroundImage: sStyle.variant === 'image-bg' ? `url(${sStyle.bgImageUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Toolbar Sezione (Edit Mode) */}
            {isEditMode && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-brand-blue text-white px-6 py-2 rounded-full flex gap-4 shadow-2xl z-50">
                <span className="text-[10px] font-black uppercase tracking-widest border-r pr-4">Sezione: {section.id}</span>
                <button onClick={() => addElement(section.id, 'text')} className="hover:text-brand-green"><i className="fas fa-font"></i></button>
                <button onClick={() => addElement(section.id, 'image')} className="hover:text-brand-green"><i className="fas fa-image"></i></button>
                <button onClick={() => { setUploadTarget({sId: section.id, isBg: true}); fileInputRef.current?.click(); }} className="hover:text-brand-green"><i className="fas fa-paint-roller"></i></button>
                <button onClick={() => updateSection(section.id, { enabled: false })} className="hover:text-red-400"><i className="fas fa-trash"></i></button>
              </div>
            )}

            <div className={`max-w-7xl mx-auto px-6 text-center space-y-8 relative z-10`}>
              {isEditMode ? (
                <div className="max-w-4xl mx-auto space-y-4">
                  <input 
                    value={section.title} 
                    onChange={e => updateSection(section.id, { title: e.target.value })} 
                    className="w-full text-5xl font-black uppercase italic text-center bg-white/10 border-b-2 border-brand-green/30 outline-none p-2 focus:bg-white/20"
                  />
                  <textarea 
                    value={section.description} 
                    onChange={e => updateSection(section.id, { description: e.target.value })} 
                    className="w-full text-xl opacity-60 italic text-center bg-white/10 border-b-2 border-brand-green/30 outline-none p-2 resize-none h-24"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">{section.title}</h2>
                  <p className="text-xl opacity-60 italic max-w-3xl mx-auto">{section.description}</p>
                </>
              )}

              {/* Elementi dinamici della sezione */}
              <div className="flex flex-wrap justify-center gap-10 mt-16 min-h-[100px]">
                {section.elements?.map(el => (
                  <div 
                    key={el.id} 
                    className={`relative group transition-all ${isEditMode ? 'ring-2 ring-brand-green p-4 rounded-3xl bg-white/5' : ''}`}
                    style={{ width: el.type === 'text' ? '100%' : '320px' }}
                  >
                    {isEditMode && (
                      <div className="absolute -top-4 -right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-50">
                        <button onClick={() => updateElement(section.id, el.id, { style: { ...(el.style || {}), scale: (el.style?.scale || 1) + 0.1 } })} className="w-8 h-8 bg-brand-green rounded-full text-brand-blue shadow-lg"><i className="fas fa-plus text-xs"></i></button>
                        <button 
                          onClick={() => {
                            const nextEls = section.elements?.filter(item => item.id !== el.id);
                            updateSection(section.id, { elements: nextEls });
                          }} 
                          className="w-8 h-8 bg-red-500 rounded-full text-white shadow-lg"
                        ><i className="fas fa-times text-xs"></i></button>
                      </div>
                    )}

                    {el.type === 'text' ? (
                      <div className="p-10 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-lg">
                        {isEditMode ? (
                          <textarea 
                            value={el.content} 
                            onChange={e => updateElement(section.id, el.id, { content: e.target.value })} 
                            className="w-full bg-transparent outline-none italic text-center resize-none h-32 focus:ring-0"
                          />
                        ) : (
                          <p className="italic opacity-80 whitespace-pre-wrap text-lg leading-relaxed">{el.content}</p>
                        )}
                      </div>
                    ) : (
                      <div 
                        className="relative rounded-[3rem] overflow-hidden shadow-2xl aspect-square cursor-pointer"
                        onClick={() => { if(isEditMode) { setUploadTarget({sId: section.id, elId: el.id}); fileInputRef.current?.click(); } }}
                      >
                        <img src={el.content} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Arena Element" />
                        {isEditMode && (
                          <div className="absolute inset-0 bg-brand-blue/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-black uppercase text-white tracking-widest">Cambia Foto</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default HomeSections;
