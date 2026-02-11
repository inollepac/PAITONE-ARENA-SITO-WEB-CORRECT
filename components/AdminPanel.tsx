
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
  const [activeTab, setActiveTab] = useState<'general' | 'brand' | 'media' | 'sections' | 'courts' | 'events'>('general');
  const [logoTab, setLogoTab] = useState<'navbar' | 'hero' | 'footer'>('navbar');
  const [tempConfig, setTempConfig] = useState(config);
  const primaryInputRef = useRef<HTMLInputElement>(null);
  const secondaryInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const [currentMediaField, setCurrentMediaField] = useState<string | null>(null);

  const handleSaveAll = () => {
    onUpdateConfig(tempConfig);
    alert('Modifiche salvate con successo nel Control Arena!');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, key: 'primaryLogoUrl' | 'secondaryLogoUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempConfig({ ...tempConfig, [key]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentMediaField) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (currentMediaField.startsWith('spaceImage-')) {
          const index = parseInt(currentMediaField.split('-')[1]);
          const newUrls = [...tempConfig.spaceImageUrls];
          newUrls[index] = result;
          setTempConfig({ ...tempConfig, spaceImageUrls: newUrls });
        } else {
          setTempConfig({ ...tempConfig, [currentMediaField]: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerMediaUpload = (field: string) => {
    setCurrentMediaField(field);
    mediaInputRef.current?.click();
  };

  const updateLogoPlacement = (key: 'navbarLogo' | 'heroLogo' | 'footerLogo', updates: Partial<LogoPlacementConfig>) => {
    setTempConfig({
      ...tempConfig,
      [key]: { ...tempConfig[key], ...updates }
    });
  };

  const addSection = () => {
    const newId = `custom-${Date.now()}`;
    const newSection: SectionContent = {
      id: newId, navLabel: 'Nuova Pagina', title: 'Nuova Pagina', description: 'Contenuto...', enabled: true, isCustom: true, showLogo: true
    };
    setTempConfig({ ...tempConfig, sections: [...tempConfig.sections, newSection] });
  };

  const updateSection = (id: string, updates: Partial<SectionContent>) => {
    setTempConfig({ ...tempConfig, sections: tempConfig.sections.map(s => s.id === id ? { ...s, ...updates } : s) });
  };

  const removeSection = (id: string) => {
    setTempConfig({ ...tempConfig, sections: tempConfig.sections.filter(s => s.id !== id) });
  };

  const currentPlacementKey = logoTab === 'navbar' ? 'navbarLogo' : logoTab === 'hero' ? 'heroLogo' : 'footerLogo';
  const currentLogoConfig = tempConfig[currentPlacementKey];
  const activeLogoUrl = currentLogoConfig.logoSource === 'primary' ? tempConfig.primaryLogoUrl : tempConfig.secondaryLogoUrl;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 text-center md:text-left">
        <div>
          <h2 className="text-4xl font-bold text-gray-800 tracking-tighter uppercase italic">Control Arena</h2>
          <p className="text-gray-500 font-medium italic">Libertà creativa totale: loghi, immagini e stili senza limiti.</p>
        </div>
        <button onClick={handleSaveAll} className="bg-brand-blue text-white px-10 py-4 rounded-full font-black uppercase tracking-widest hover:bg-brand-green hover:text-brand-blue transition shadow-xl active:scale-95">
          <i className="fas fa-save mr-2"></i> Salva Tutto
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="space-y-2">
          {[
            { id: 'general', icon: 'fa-info-circle', label: 'Info & Contatti' },
            { id: 'brand', icon: 'fa-magic', label: 'Loghi & Brand' },
            { id: 'media', icon: 'fa-images', label: 'Media & Immagini' },
            { id: 'sections', icon: 'fa-layer-group', label: 'Menù & Pagine' },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full text-left px-8 py-5 rounded-[2rem] font-bold transition flex items-center gap-4 ${activeTab === tab.id ? 'bg-brand-blue text-white shadow-xl translate-x-2' : 'bg-white text-gray-400 hover:bg-brand-light border border-gray-100'}`}
            >
              <i className={`fas ${tab.icon} w-5`}></i> {tab.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 bg-white p-8 md:p-16 rounded-[4rem] shadow-sm border border-gray-100">
          
          {activeTab === 'general' && (
            <div className="space-y-10">
              <h3 className="text-3xl font-black uppercase italic text-brand-blue">Dati del Centro</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Nome Arena</label>
                  <input type="text" value={tempConfig.centerName} onChange={e => setTempConfig({...tempConfig, centerName: e.target.value})} className="w-full p-5 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-brand-green outline-none font-bold text-brand-blue" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">WhatsApp</label>
                  <input type="text" value={tempConfig.whatsapp} onChange={e => setTempConfig({...tempConfig, whatsapp: e.target.value})} className="w-full p-5 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-brand-green outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Orari</label>
                  <input type="text" value={tempConfig.workingHours} onChange={e => setTempConfig({...tempConfig, workingHours: e.target.value})} className="w-full p-5 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-brand-green outline-none" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'brand' && (
            <div className="space-y-12">
              <div>
                <h3 className="text-3xl font-black uppercase italic text-brand-blue mb-2">Logo Lab</h3>
                <p className="text-gray-400 text-sm font-medium italic mb-10">Gestione avanzata dei loghi e della loro presenza nel sito.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="p-8 bg-brand-light/30 rounded-[3rem] border border-brand-blue/5 flex flex-col items-center">
                   <div className="w-32 h-32 bg-white rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden mb-6 cursor-pointer hover:border-brand-green transition" onClick={() => primaryInputRef.current?.click()}>
                      {tempConfig.primaryLogoUrl ? <img src={tempConfig.primaryLogoUrl} className="w-full h-full object-contain" /> : <i className="fas fa-upload text-gray-300"></i>}
                   </div>
                   <span className="text-[10px] font-black uppercase text-brand-blue mb-4">Logo Principale</span>
                   <input type="file" ref={primaryInputRef} onChange={e => handleLogoUpload(e, 'primaryLogoUrl')} className="hidden" />
                   <button onClick={() => primaryInputRef.current?.click()} className="text-[10px] font-bold text-brand-blue/60 hover:text-brand-green uppercase tracking-widest">Sostituisci</button>
                </div>
                <div className="p-8 bg-brand-light/30 rounded-[3rem] border border-brand-blue/5 flex flex-col items-center">
                   <div className="w-32 h-32 bg-white rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden mb-6 cursor-pointer hover:border-brand-green transition" onClick={() => secondaryInputRef.current?.click()}>
                      {tempConfig.secondaryLogoUrl ? <img src={tempConfig.secondaryLogoUrl} className="w-full h-full object-contain" /> : <i className="fas fa-upload text-gray-300"></i>}
                   </div>
                   <span className="text-[10px] font-black uppercase text-brand-blue mb-4">Logo Secondario</span>
                   <input type="file" ref={secondaryInputRef} onChange={e => handleLogoUpload(e, 'secondaryLogoUrl')} className="hidden" />
                   <button onClick={() => secondaryInputRef.current?.click()} className="text-[10px] font-bold text-brand-blue/60 hover:text-brand-green uppercase tracking-widest">Sostituisci</button>
                </div>
              </div>

              <div className="bg-white border-t border-brand-blue/5 pt-10">
                <div className="flex bg-gray-100 p-2 rounded-2xl mb-10 gap-2">
                   {(['navbar', 'hero', 'footer'] as const).map(tab => (
                     <button
                       key={tab}
                       onClick={() => setLogoTab(tab)}
                       className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${logoTab === tab ? 'bg-brand-blue text-white shadow-lg' : 'text-gray-400 hover:text-brand-blue'}`}
                     >
                       {tab}
                     </button>
                   ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-[4rem] border border-gray-100 min-h-[300px]">
                      <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-10 italic">Anteprima in {logoTab}</span>
                      <div className="flex items-center gap-6">
                         {currentLogoConfig.enabled && activeLogoUrl ? (
                            <div 
                              className="overflow-hidden transition-all bg-white"
                              style={{ 
                                width: `${currentLogoConfig.width}px`, 
                                height: `${currentLogoConfig.height}px`,
                                borderRadius: `${currentLogoConfig.borderRadius}%`,
                                border: currentLogoConfig.borderWidth > 0 ? `${currentLogoConfig.borderWidth}px solid var(--brand-green)` : 'none'
                              }}
                            >
                               <img src={activeLogoUrl} className="w-full h-full" style={{ objectFit: currentLogoConfig.objectFit, transform: `scale(${currentLogoConfig.scale}) translate(${currentLogoConfig.x}%, ${currentLogoConfig.y}%)` }} />
                            </div>
                         ) : (
                           <div className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-300 font-bold uppercase text-[8px]">Nascosto</div>
                         )}
                         {currentLogoConfig.showName && (
                           <div className="flex flex-col border-l pl-4 border-gray-200">
                              <span className="font-black uppercase text-xs text-brand-blue">{tempConfig.centerName}</span>
                              <span className="text-[8px] font-bold uppercase text-brand-green tracking-widest">Tennis & Padel</span>
                           </div>
                         )}
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                         <div className="bg-brand-light/40 p-4 rounded-2xl border border-brand-blue/5">
                            <label className="block text-[8px] font-black text-gray-400 uppercase mb-3">Logo da usare</label>
                            <select value={currentLogoConfig.logoSource} onChange={e => updateLogoPlacement(currentPlacementKey, { logoSource: e.target.value as any })} className="w-full bg-transparent font-bold text-[10px] text-brand-blue focus:outline-none">
                               <option value="primary">Principale</option>
                               <option value="secondary">Secondario</option>
                            </select>
                         </div>
                         <div className="bg-brand-light/40 p-4 rounded-2xl border border-brand-blue/5 flex items-center justify-between">
                            <span className="text-[8px] font-black text-gray-400 uppercase">Mostra Nome</span>
                            <input type="checkbox" checked={currentLogoConfig.showName} onChange={e => updateLogoPlacement(currentPlacementKey, { showName: e.target.checked })} className="accent-brand-green w-4 h-4" />
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-[8px] font-black text-gray-400 uppercase mb-2">Larghezza ({currentLogoConfig.width}px)</label>
                            <input type="range" min="10" max="400" value={currentLogoConfig.width} onChange={e => updateLogoPlacement(currentPlacementKey, { width: parseInt(e.target.value) })} className="w-full h-2 bg-gray-200 rounded-lg appearance-none accent-brand-blue" />
                         </div>
                         <div>
                            <label className="block text-[8px] font-black text-gray-400 uppercase mb-2">Altezza ({currentLogoConfig.height}px)</label>
                            <input type="range" min="10" max="400" value={currentLogoConfig.height} onChange={e => updateLogoPlacement(currentPlacementKey, { height: parseInt(e.target.value) })} className="w-full h-2 bg-gray-200 rounded-lg appearance-none accent-brand-blue" />
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-[8px] font-black text-gray-400 uppercase mb-2">Border Radius ({currentLogoConfig.borderRadius}%)</label>
                            <input type="range" min="0" max="50" value={currentLogoConfig.borderRadius} onChange={e => updateLogoPlacement(currentPlacementKey, { borderRadius: parseInt(e.target.value) })} className="w-full h-2 bg-gray-200 rounded-lg appearance-none accent-brand-blue" />
                         </div>
                         <div>
                            <label className="block text-[8px] font-black text-gray-400 uppercase mb-2">Contorno / Bordo ({currentLogoConfig.borderWidth}px)</label>
                            <input type="range" min="0" max="10" value={currentLogoConfig.borderWidth} onChange={e => updateLogoPlacement(currentPlacementKey, { borderWidth: parseInt(e.target.value) })} className="w-full h-2 bg-gray-200 rounded-lg appearance-none accent-brand-blue" />
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-12">
              <h3 className="text-3xl font-black uppercase italic text-brand-blue">Media & Immagini</h3>
              <p className="text-gray-400 text-sm font-medium italic mb-10">Personalizza ogni immagine del sito caricandone di nuove.</p>
              
              <input type="file" ref={mediaInputRef} className="hidden" onChange={handleMediaUpload} accept="image/*" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Hero Image */}
                <div className="p-6 bg-brand-light/30 rounded-3xl border border-brand-blue/5">
                  <h4 className="text-xs font-black uppercase text-brand-blue mb-4">Sfondo Hero Principale</h4>
                  <div className="h-40 bg-white rounded-2xl overflow-hidden mb-4 relative group">
                    <img src={tempConfig.heroImageUrl} className="w-full h-full object-cover" alt="Hero" />
                    <button onClick={() => triggerMediaUpload('heroImageUrl')} className="absolute inset-0 bg-brand-blue/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-bold uppercase tracking-widest text-xs">Cambia</button>
                  </div>
                </div>

                {/* Sports Section */}
                <div className="p-6 bg-brand-light/30 rounded-3xl border border-brand-blue/5">
                  <h4 className="text-xs font-black uppercase text-brand-blue mb-4">Vetrina Sport (Home)</h4>
                  <div className="h-40 bg-white rounded-2xl overflow-hidden mb-4 relative group">
                    <img src={tempConfig.sportsImageUrl} className="w-full h-full object-cover" alt="Sports" />
                    <button onClick={() => triggerMediaUpload('sportsImageUrl')} className="absolute inset-0 bg-brand-blue/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-bold uppercase tracking-widest text-xs">Cambia</button>
                  </div>
                </div>

                {/* Tennis & Padel Pages */}
                <div className="p-6 bg-brand-light/30 rounded-3xl border border-brand-blue/5">
                  <h4 className="text-xs font-black uppercase text-brand-blue mb-4">Immagine Tennis</h4>
                  <div className="h-40 bg-white rounded-2xl overflow-hidden mb-4 relative group">
                    <img src={tempConfig.tennisImageUrl} className="w-full h-full object-cover" alt="Tennis" />
                    <button onClick={() => triggerMediaUpload('tennisImageUrl')} className="absolute inset-0 bg-brand-blue/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-bold uppercase tracking-widest text-xs">Cambia</button>
                  </div>
                </div>

                <div className="p-6 bg-brand-light/30 rounded-3xl border border-brand-blue/5">
                  <h4 className="text-xs font-black uppercase text-brand-blue mb-4">Immagine Padel</h4>
                  <div className="h-40 bg-white rounded-2xl overflow-hidden mb-4 relative group">
                    <img src={tempConfig.padelImageUrl} className="w-full h-full object-cover" alt="Padel" />
                    <button onClick={() => triggerMediaUpload('padelImageUrl')} className="absolute inset-0 bg-brand-blue/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-bold uppercase tracking-widest text-xs">Cambia</button>
                  </div>
                </div>

                {/* Community */}
                <div className="p-6 bg-brand-light/30 rounded-3xl border border-brand-blue/5 md:col-span-2">
                  <h4 className="text-xs font-black uppercase text-brand-blue mb-4">Immagine Community / Aperitivo</h4>
                  <div className="h-40 bg-white rounded-2xl overflow-hidden mb-4 relative group">
                    <img src={tempConfig.communityImageUrl} className="w-full h-full object-cover" alt="Community" />
                    <button onClick={() => triggerMediaUpload('communityImageUrl')} className="absolute inset-0 bg-brand-blue/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-bold uppercase tracking-widest text-xs">Cambia</button>
                  </div>
                </div>

                {/* Gallery "Il nostro spazio" */}
                <div className="md:col-span-2">
                   <h4 className="text-xs font-black uppercase text-brand-blue mb-6">Gallery "Il nostro spazio"</h4>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {tempConfig.spaceImageUrls.map((url, i) => (
                        <div key={i} className="h-32 bg-white rounded-2xl overflow-hidden relative group border border-brand-blue/5">
                          <img src={url} className="w-full h-full object-cover" alt={`Space ${i}`} />
                          <button onClick={() => triggerMediaUpload(`spaceImage-${i}`)} className="absolute inset-0 bg-brand-blue/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-bold uppercase tracking-tighter text-[10px]">Cambia</button>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sections' && (
            <div className="space-y-10">
              <div className="flex justify-between items-center">
                <h3 className="text-3xl font-black uppercase italic text-brand-blue">Menù & Sezioni</h3>
                <button onClick={addSection} className="bg-brand-green text-brand-blue px-6 py-3 rounded-full font-black uppercase tracking-widest text-[10px] hover:scale-105 transition shadow-lg">
                  <i className="fas fa-plus mr-2"></i> Nuova Sezione
                </button>
              </div>
              <div className="space-y-6">
                {tempConfig.sections.map((section) => (
                  <div key={section.id} className="p-8 bg-gray-50 rounded-[3rem] border border-gray-100 relative group transition hover:bg-white hover:shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${section.enabled ? 'bg-brand-green shadow-[0_0_8px_var(--brand-green)]' : 'bg-gray-300'}`}></div>
                        <h4 className="font-black uppercase tracking-tight text-brand-blue">{section.navLabel || section.id}</h4>
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={section.enabled} onChange={e => updateSection(section.id, { enabled: e.target.checked })} className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-brand-green after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                        {section.isCustom && (
                          <button onClick={() => removeSection(section.id)} className="text-red-400 hover:text-red-600 transition p-2 ml-2">
                             <i className="fas fa-trash-alt"></i>
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Voce Menù</label>
                        <input type="text" value={section.navLabel} onChange={e => updateSection(section.id, { navLabel: e.target.value })} className="w-full p-4 bg-white rounded-xl border border-gray-100 font-bold" />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Titolo Pagina</label>
                        <input type="text" value={section.title} onChange={e => updateSection(section.id, { title: e.target.value })} className="w-full p-4 bg-white rounded-xl border border-gray-100 font-bold" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Descrizione</label>
                        <textarea value={section.description} onChange={e => updateSection(section.id, { description: e.target.value })} className="w-full p-4 bg-white rounded-xl border border-gray-100 h-24 text-sm" />
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
