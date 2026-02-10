
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
  const [activeTab, setActiveTab] = useState<'general' | 'brand' | 'sections' | 'courts' | 'events'>('general');
  const [logoTab, setLogoTab] = useState<'navbar' | 'hero' | 'footer'>('navbar');
  const [tempConfig, setTempConfig] = useState(config);
  const primaryInputRef = useRef<HTMLInputElement>(null);
  const secondaryInputRef = useRef<HTMLInputElement>(null);

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
          <p className="text-gray-500 font-medium italic">Libertà creativa totale: loghi, forme e stili senza limiti.</p>
        </div>
        <button onClick={handleSaveAll} className="bg-brand-blue text-white px-10 py-4 rounded-full font-black uppercase tracking-widest hover:bg-brand-green hover:text-brand-blue transition shadow-xl active:scale-95">
          <i className="fas fa-save mr-2"></i> Salva Tutto
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="space-y-2">
          {[
            { id: 'general', icon: 'fa-info-circle', label: 'Info & Contatti' },
            { id: 'brand', icon: 'fa-magic', label: 'Brand & Lab Logo' },
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
                <p className="text-gray-400 text-sm font-medium italic mb-10">Qui puoi gestire fino a 2 loghi e decidere come appaiono punto per punto.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Caricamento Logo Principale */}
                <div className="p-8 bg-brand-light/30 rounded-[3rem] border border-brand-blue/5 flex flex-col items-center">
                   <div className="w-32 h-32 bg-white rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden mb-6 cursor-pointer hover:border-brand-green transition" onClick={() => primaryInputRef.current?.click()}>
                      {tempConfig.primaryLogoUrl ? <img src={tempConfig.primaryLogoUrl} className="w-full h-full object-contain" /> : <i className="fas fa-upload text-gray-300"></i>}
                   </div>
                   <span className="text-[10px] font-black uppercase text-brand-blue mb-4">Logo Principale</span>
                   <input type="file" ref={primaryInputRef} onChange={e => handleLogoUpload(e, 'primaryLogoUrl')} className="hidden" />
                   <button onClick={() => primaryInputRef.current?.click()} className="text-[10px] font-bold text-brand-blue/60 hover:text-brand-green uppercase tracking-widest">Sostituisci</button>
                </div>
                {/* Caricamento Logo Secondario */}
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
                   {/* Anteprima Real-Time */}
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
                               <img 
                                 src={activeLogoUrl} 
                                 className="w-full h-full" 
                                 style={{ 
                                   objectFit: currentLogoConfig.objectFit,
                                   transform: `scale(${currentLogoConfig.scale}) translate(${currentLogoConfig.x}%, ${currentLogoConfig.y}%)` 
                                 }} 
                               />
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

                   {/* Controlli Granulari */}
                   <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                         <div className="bg-brand-light/40 p-4 rounded-2xl border border-brand-blue/5">
                            <label className="block text-[8px] font-black text-gray-400 uppercase mb-3">Logo da usare</label>
                            <select 
                              value={currentLogoConfig.logoSource}
                              onChange={e => updateLogoPlacement(currentPlacementKey, { logoSource: e.target.value as any })}
                              className="w-full bg-transparent font-bold text-[10px] text-brand-blue focus:outline-none"
                            >
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
                            <div className="flex justify-between text-[7px] text-gray-400 mt-1 uppercase font-bold"><span>Rettangolo</span><span>Ovale</span></div>
                         </div>
                         <div>
                            <label className="block text-[8px] font-black text-gray-400 uppercase mb-2">Contorno / Bordo ({currentLogoConfig.borderWidth}px)</label>
                            <input type="range" min="0" max="10" value={currentLogoConfig.borderWidth} onChange={e => updateLogoPlacement(currentPlacementKey, { borderWidth: parseInt(e.target.value) })} className="w-full h-2 bg-gray-200 rounded-lg appearance-none accent-brand-blue" />
                            <div className="flex justify-between text-[7px] text-gray-400 mt-1 uppercase font-bold"><span>Nessuno</span><span>Spesso</span></div>
                         </div>
                      </div>

                      <div className="bg-gray-50 p-6 rounded-3xl space-y-4">
                         <div className="flex justify-between items-center">
                            <span className="text-[9px] font-black text-brand-blue uppercase">Zoom Interno</span>
                            <input type="range" min="0.1" max="5" step="0.1" value={currentLogoConfig.scale} onChange={e => updateLogoPlacement(currentPlacementKey, { scale: parseFloat(e.target.value) })} className="w-32 h-1 bg-gray-200 appearance-none accent-brand-green" />
                         </div>
                         <div className="flex justify-between items-center">
                            <span className="text-[9px] font-black text-brand-blue uppercase">Taglio Logo (Fit)</span>
                            <div className="flex bg-white p-1 rounded-xl shadow-inner">
                               {(['contain', 'cover'] as const).map(f => (
                                 <button key={f} onClick={() => updateLogoPlacement(currentPlacementKey, { objectFit: f })} className={`px-4 py-1.5 rounded-lg text-[7px] uppercase font-black ${currentLogoConfig.objectFit === f ? 'bg-brand-blue text-white shadow-md' : 'text-gray-400'}`}>{f === 'contain' ? 'Intero' : 'Riempi'}</button>
                               ))}
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>

              {/* Colori */}
              <div className="p-10 border border-brand-blue/10 rounded-[4rem] mt-20">
                 <h4 className="text-xl font-black uppercase text-brand-blue mb-10 italic">Colori del Brand</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="flex items-center gap-6 p-6 bg-brand-light/30 rounded-3xl">
                      <input type="color" value={tempConfig.primaryColor} onChange={e => setTempConfig({...tempConfig, primaryColor: e.target.value})} className="w-16 h-16 rounded-xl border-none cursor-pointer p-0" />
                      <div>
                        <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Primario</label>
                        <span className="font-mono text-xs font-bold text-brand-blue">{tempConfig.primaryColor}</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-6 p-6 bg-brand-light/30 rounded-3xl">
                      <input type="color" value={tempConfig.accentColor} onChange={e => setTempConfig({...tempConfig, accentColor: e.target.value})} className="w-16 h-16 rounded-xl border-none cursor-pointer p-0" />
                      <div>
                        <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Accento</label>
                        <span className="font-mono text-xs font-bold text-brand-blue">{tempConfig.accentColor}</span>
                      </div>
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
