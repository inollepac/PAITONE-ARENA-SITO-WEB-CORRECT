
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

  return (
    <div className="space-y-32 pb-48">
      <input type="file" ref={fileInputRef} className="hidden" onChange={() => {}} />

      {config.sections.filter(s => s.enabled || isEditMode).map((section) => {
        const sStyle = { ...DEFAULT_STYLE, ...section.style };
        
        return (
          <section 
            key={section.id} 
            className={`relative mx-auto transition-all ${isEditMode ? 'ring-4 ring-brand-green/40 ring-dashed m-10 p-12 rounded-[4rem] bg-brand-green/5' : ''}`}
            style={{ 
              backgroundColor: sStyle.variant === 'solid' ? sStyle.bgColor : 'transparent',
              backgroundImage: sStyle.variant === 'image-bg' ? `url(${sStyle.bgImageUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {isEditMode && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-brand-blue text-white px-8 py-3 rounded-full flex gap-6 shadow-2xl z-50 animate-bounce">
                <span className="text-[10px] font-black uppercase tracking-widest border-r pr-6">EDITING: {section.title}</span>
                <button onClick={() => addElement(section.id, 'text')} className="hover:text-brand-green"><i className="fas fa-font"></i></button>
                <button onClick={() => addElement(section.id, 'image')} className="hover:text-brand-green"><i className="fas fa-image"></i></button>
                <button onClick={() => updateSection(section.id, { enabled: false })} className="hover:text-red-400"><i className="fas fa-trash"></i></button>
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
                {section.elements?.map(el => (
                  <div 
                    key={el.id} 
                    className={`relative transition-all ${isEditMode ? 'ring-2 ring-brand-green p-4 rounded-3xl bg-white shadow-xl' : ''}`}
                    style={{ width: el.type === 'text' ? '100%' : '320px' }}
                  >
                    {isEditMode && (
                      <button 
                        onClick={() => {
                          const nextEls = section.elements?.filter(item => item.id !== el.id);
                          updateSection(section.id, { elements: nextEls });
                        }} 
                        className="absolute -top-4 -right-4 w-10 h-10 bg-red-500 rounded-full text-white shadow-lg z-50 flex items-center justify-center"
                      ><i className="fas fa-times"></i></button>
                    )}

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
                      <div className="rounded-[3rem] overflow-hidden shadow-2xl aspect-square">
                        <img src={el.content} className="w-full h-full object-cover" alt="Arena" />
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
