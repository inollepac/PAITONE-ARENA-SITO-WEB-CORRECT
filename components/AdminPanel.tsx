
import React, { useState, useRef } from 'react';
import { SiteConfig, Court, Event, SectionContent, LogoPlacementConfig } from '../types';

interface AdminPanelProps {
  config: SiteConfig;
  courts: Court[];
  events: Event[];
  onUpdateConfig: (config: SiteConfig) => void;
  onUpdateCourts: (courts: Court[]) => void;
  onUpdateEvents: (events: Event[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ config, courts, events, onUpdateConfig, onUpdateCourts, onUpdateEvents }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'brand' | 'media' | 'sections'>('general');
  const [logoTab, setLogoTab] = useState<'navbar' | 'hero' | 'footer'>('navbar');
  const [tempConfig, setTempConfig] = useState<SiteConfig>(config);
  
  const primaryLogoRef = useRef<HTMLInputElement>(null);
  const secondaryLogoRef = useRef<HTMLInputElement>(null);
  const generalMediaRef = useRef<HTMLInputElement>(null);
  const [pendingMediaField, setPendingMediaField] = useState<string | null>(null);

  const handleSaveAll = () => {
    onUpdateConfig(tempConfig);
    alert('Tutte le modifiche sono state salvate con successo!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (field === 'primaryLogoUrl' || field === 'secondaryLogoUrl') {
        setTempConfig(prev => ({ ...prev, [field]: base64 }));
      } else if (field.startsWith('spaceImage-')) {
        const index = parseInt(field.split('-')[1]);
        const newSpaceImages = [...tempConfig.spaceImageUrls];
        newSpaceImages[index] = base64;
        setTempConfig(prev => ({ ...prev, spaceImageUrls: newSpaceImages }));
      } else {
        setTempConfig(prev => ({ ...prev, [field as keyof SiteConfig]: base64 } as SiteConfig));
      }
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  const updateLogoPlacement = (key: 'navbarLogo' | 'heroLogo' | 'footerLogo', updates: Partial<LogoPlacementConfig>) => {
    setTempConfig(prev => ({
      ...prev,
      [key]: { ...prev[key], ...updates }
    }));
  };

  const updateSection = (id: string, updates: Partial<SectionContent>) => {
    setTempConfig(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === id ? { ...s, ...updates } : s)
    }));
  };

  const addSection = () => {
    const newId = `custom-${Date.now()}`;
    const newSection: SectionContent = {
      id: newId, navLabel: 'Nuova Pagina', title: 'Titolo Pagina', description: 'Inserisci qui il contenuto...', enabled: true, isCustom: true, showLogo: true
    };
    setTempConfig(prev => ({ ...prev, sections: [...prev.sections, newSection] }));
  };

  const currentPlacementKey = logoTab === 'navbar' ? 'navbarLogo' : logoTab === 'hero' ? 'heroLogo' : 'footerLogo';
  const currentLogoConfig = tempConfig[currentPlacementKey];
  const activeLogoUrl = currentLogoConfig.logoSource === 'primary' ? tempConfig.primaryLogoUrl : tempConfig.secondaryLogoUrl;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header Statica */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
        <div>
          <h2 className="text-4xl font-black text-brand-blue uppercase italic tracking-tighter">Control Arena</h2>
          <p className="text-gray-500 font-medium">Gestisci testi, loghi e immagini del tuo centro.</p>
        </div>
        <button onClick={handleSaveAll} className="bg-brand-blue text-white px-12 py-5 rounded-full font-black uppercase tracking-widest hover:bg-brand-green hover:text-brand-blue transition-all shadow-2xl active:scale-95">
          <i className="fas fa-save mr-2"></i> Salva Tutto
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Menu Tab */}
        <div className="space-y-3">
          {[
            { id: 'general', icon: 'fa-cog', label: 'Info & Hero' },
            { id: 'brand', icon: 'fa-palette', label: 'Logo Lab' },
            { id: 'media', icon: 'fa-images', label: 'Media & Immagini' },
            { id: 'sections', icon: 'fa-edit', label: 'Pagine & Testi' },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full text-left px-8 py-5 rounded-[2.5rem] font-bold transition-all flex items-center gap-4 ${activeTab === tab.id ? 'bg-brand-blue text-white shadow-xl translate-x-2' : 'bg-white text-gray-400 hover:bg-brand-light border border-gray-100'}`}
            >
              <i className={`fas ${tab.icon} w-5`}></i> {tab.label}
            </button>
          ))}
        </div>

        {/* Contenuto Tab */}
        <div className="lg:col-span-3 bg-white p-8 md:p-12 rounded-[4rem] shadow-sm border border-gray-100">
          
          {/* TAB: GENERAL & HERO */}
          {activeTab === 'general' && (
            <div className="space-y-12 animate-in fade-in duration-300">
              <section>
                <h3 className="text-2xl font-black uppercase italic text-brand-blue mb-8">Informazioni Centro</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Nome Centro</label>
                    <input type="text" value={tempConfig.centerName} onChange={e => setTempConfig({...tempConfig, centerName: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-green outline-none font-bold text-brand-blue" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">WhatsApp</label>
                    <input type="text" value={tempConfig.whatsapp} onChange={e => setTempConfig({...tempConfig, whatsapp: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-green outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Orari Lavoro</label>
                    <input type="text" value={tempConfig.workingHours} onChange={e => setTempConfig({...tempConfig, workingHours: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-green outline-none" />
                  </div>
                </div>
              </section>

              <section className="pt-10 border-t border-gray-100">
                <h3 className="text-2xl font-black uppercase italic text-brand-blue mb-8">Contenuti Hero (Home)</h3>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Titolo Principale Hero</label>
                    <input type="text" value={tempConfig.heroTitle} onChange={e => setTempConfig({...tempConfig, heroTitle: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-green outline-none font-black text-xl text-brand-blue italic" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Sottotitolo Hero</label>
                    <textarea value={tempConfig.heroSubtitle} onChange={e => setTempConfig({...tempConfig, heroSubtitle: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-green outline-none h-24 text-brand-blue/70 font-medium" />
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* TAB: BRAND (LOGHI) */}
          {activeTab === 'brand' && (
            <div className="space-y-12 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-brand-light/50 rounded-[3rem] border border-brand-blue/5 flex flex-col items-center">
                  <div className="w-24 h-24 bg-white rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden mb-4">
                    {tempConfig.primaryLogoUrl ? <img src={tempConfig.primaryLogoUrl} className="w-full h-full object-contain" /> : <i className="fas fa-image text-gray-200"></i>}
                  </div>
                  <button onClick={() => primaryLogoRef.current?.click()} className="text-[10px] font-black uppercase tracking-widest text-brand-blue bg-white px-4 py-2 rounded-full shadow-sm">Carica Logo 1</button>
                  <input type="file" ref={primaryLogoRef} className="hidden" onChange={e => handleFileUpload(e, 'primaryLogoUrl')} />
                </div>
                <div className="p-8 bg-brand-light/50 rounded-[3rem] border border-brand-blue/5 flex flex-col items-center">
                  <div className="w-24 h-24 bg-white rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden mb-4">
                    {tempConfig.secondaryLogoUrl ? <img src={tempConfig.secondaryLogoUrl} className="w-full h-full object-contain" /> : <i className="fas fa-image text-gray-200"></i>}
                  </div>
                  <button onClick={() => secondaryLogoRef.current?.click()} className="text-[10px] font-black uppercase tracking-widest text-brand-blue bg-white px-4 py-2 rounded-full shadow-sm">Carica Logo 2</button>
                  <input type="file" ref={secondaryLogoRef} className="hidden" onChange={e => handleFileUpload(e, 'secondaryLogoUrl')} />
                </div>
              </div>

              <div className="bg-gray-100 p-2 rounded-[2rem] flex gap-2">
                {(['navbar', 'hero', 'footer'] as const).map(tab => (
                  <button key={tab} onClick={() => setLogoTab(tab)} className={`flex-1 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${logoTab === tab ? 'bg-brand-blue text-white shadow-lg' : 'text-gray-400'}`}>{tab}</button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="p-10 bg-gray-50 rounded-[4rem] border border-gray-100 flex items-center justify-center min-h-[250px] shadow-inner">
                   <div className="flex items-center gap-6">
                      {currentLogoConfig.enabled && activeLogoUrl && (
                        <div style={{ width: `${currentLogoConfig.width}px`, height: `${currentLogoConfig.height}px`, borderRadius: `${currentLogoConfig.borderRadius}%`, border: currentLogoConfig.borderWidth > 0 ? `${currentLogoConfig.borderWidth}px solid var(--brand-green)` : 'none', overflow: 'hidden' }}>
                          <img src={activeLogoUrl} className="w-full h-full" style={{ objectFit: currentLogoConfig.objectFit, transform: `scale(${currentLogoConfig.scale}) translate(${currentLogoConfig.x}%, ${currentLogoConfig.y}%)` }} />
                        </div>
                      )}
                      {currentLogoConfig.showName && <span className="font-black uppercase text-brand-blue italic">{tempConfig.centerName}</span>}
                   </div>
                </div>
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-brand-light rounded-2xl">
                    <span className="text-[10px] font-black uppercase text-brand-blue">Sorgente</span>
                    <select value={currentLogoConfig.logoSource} onChange={e => updateLogoPlacement(currentPlacementKey, { logoSource: e.target.value as any })} className="bg-transparent font-bold text-xs outline-none">
                      <option value="primary">Logo 1</option>
                      <option value="secondary">Logo 2</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[8px] font-black text-gray-400 uppercase mb-2 block">L ({currentLogoConfig.width}px)</label>
                      <input type="range" min="20" max="400" value={currentLogoConfig.width} onChange={e => updateLogoPlacement(currentPlacementKey, { width: parseInt(e.target.value) })} className="w-full accent-brand-blue" />
                    </div>
                    <div>
                      <label className="text-[8px] font-black text-gray-400 uppercase mb-2 block">H ({currentLogoConfig.height}px)</label>
                      <input type="range" min="20" max="400" value={currentLogoConfig.height} onChange={e => updateLogoPlacement(currentPlacementKey, { height: parseInt(e.target.value) })} className="w-full accent-brand-blue" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[8px] font-black text-gray-400 uppercase mb-2 block">Forma (R %)</label>
                      <input type="range" min="0" max="50" value={currentLogoConfig.borderRadius} onChange={e => updateLogoPlacement(currentPlacementKey, { borderRadius: parseInt(e.target.value) })} className="w-full accent-brand-blue" />
                    </div>
                    <div>
                      <label className="text-[8px] font-black text-gray-400 uppercase mb-2 block">Bordo ({currentLogoConfig.borderWidth}px)</label>
                      <input type="range" min="0" max="10" value={currentLogoConfig.borderWidth} onChange={e => updateLogoPlacement(currentPlacementKey, { borderWidth: parseInt(e.target.value) })} className="w-full accent-brand-blue" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-brand-light rounded-2xl">
                    <span className="text-[10px] font-black uppercase text-brand-blue">Mostra Testo</span>
                    <input type="checkbox" checked={currentLogoConfig.showName} onChange={e => updateLogoPlacement(currentPlacementKey, { showName: e.target.checked })} className="accent-brand-green w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: MEDIA & IMMAGINI */}
          {activeTab === 'media' && (
            <div className="space-y-12 animate-in fade-in duration-300">
              <h3 className="text-3xl font-black uppercase italic text-brand-blue mb-8">Media Arena</h3>
              <input type="file" ref={generalMediaRef} className="hidden" onChange={e => pendingMediaField && handleFileUpload(e, pendingMediaField)} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { field: 'heroImageUrl', label: 'Immagine Hero' },
                  { field: 'sportsImageUrl', label: 'Immagine Sport Home' },
                  { field: 'tennisImageUrl', label: 'Pagina Tennis' },
                  { field: 'padelImageUrl', label: 'Pagina Padel' },
                  { field: 'communityImageUrl', label: 'Community & Aperitivi' },
                ].map((item) => (
                  <div key={item.field} className="group relative h-48 bg-gray-100 rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-lg">
                    <img src={(tempConfig as any)[item.field]} className="w-full h-full object-cover" alt={item.label} />
                    <div className="absolute inset-0 bg-brand-blue/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white gap-3">
                      <span className="font-black uppercase text-xs tracking-widest">{item.label}</span>
                      <button onClick={() => { setPendingMediaField(item.field); generalMediaRef.current?.click(); }} className="bg-brand-green text-brand-blue px-8 py-2 rounded-full font-black text-[10px] uppercase shadow-xl">Cambia Immagine</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-10 border-t border-gray-100">
                <h4 className="text-[10px] font-black uppercase text-brand-blue mb-6 tracking-widest">Gallery Sezione "Il Nostro Spazio"</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(tempConfig.spaceImageUrls || []).map((url, i) => (
                    <div key={i} className="group relative h-32 bg-gray-100 rounded-2xl overflow-hidden shadow-sm">
                      <img src={url} className="w-full h-full object-cover" />
                      <button onClick={() => { setPendingMediaField(`spaceImage-${i}`); generalMediaRef.current?.click(); }} className="absolute inset-0 bg-brand-blue/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[9px] font-black uppercase">Cambia</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: SEZIONI & TESTI PAGINE */}
          {activeTab === 'sections' && (
            <div className="space-y-10 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                <h3 className="text-3xl font-black uppercase italic text-brand-blue">Pagine & Testi</h3>
                <button onClick={addSection} className="bg-brand-green text-brand-blue px-6 py-3 rounded-full font-black uppercase text-[10px] tracking-widest shadow-lg hover:scale-105 transition-all">Aggiungi Pagina Custom</button>
              </div>
              
              <div className="space-y-8">
                {tempConfig.sections.map((section) => (
                  <div key={section.id} className="p-8 bg-gray-50 rounded-[3rem] border border-gray-200 relative group hover:bg-white hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${section.enabled ? 'bg-brand-green shadow-[0_0_8px_var(--brand-green)]' : 'bg-gray-300'}`}></div>
                        <h4 className="font-black uppercase tracking-tight text-brand-blue">ID Sezione: {section.id}</h4>
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="text-[10px] font-black uppercase text-gray-400">Visibile</label>
                        <input type="checkbox" checked={section.enabled} onChange={e => updateSection(section.id, { enabled: e.target.checked })} className="accent-brand-green w-5 h-5" />
                        {section.isCustom && (
                          <button onClick={() => setTempConfig(prev => ({ ...prev, sections: prev.sections.filter(s => s.id !== section.id) }))} className="text-red-400 hover:text-red-600 p-2"><i className="fas fa-trash-alt"></i></button>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Testo Menù</label>
                        <input type="text" value={section.navLabel} onChange={e => updateSection(section.id, { navLabel: e.target.value })} className="w-full p-4 bg-white rounded-xl border border-gray-200 font-bold text-brand-blue" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Titolo Pagina / Sezione</label>
                        <input type="text" value={section.title} onChange={e => updateSection(section.id, { title: e.target.value })} className="w-full p-4 bg-white rounded-xl border border-gray-200 font-black italic text-brand-blue" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Descrizione Contenuto</label>
                        <textarea value={section.description} onChange={e => updateSection(section.id, { description: e.target.value })} className="w-full p-4 bg-white rounded-xl border border-gray-200 h-32 text-sm font-medium text-brand-blue/70" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
