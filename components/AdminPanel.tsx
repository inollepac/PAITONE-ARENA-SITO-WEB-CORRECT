
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveAll = () => {
    onUpdateConfig(tempConfig);
    alert('Tutte le modifiche sono state salvate con successo!');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempConfig({ ...tempConfig, logoUrl: reader.result as string });
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

  // Fix: Implemented addSection to create a new custom page
  const addSection = () => {
    const newId = `custom-${Date.now()}`;
    const newSection: SectionContent = {
      id: newId,
      navLabel: 'Nuova Pagina',
      title: 'Titolo Nuova Pagina',
      description: 'Descrizione del contenuto qui.',
      enabled: true,
      isCustom: true,
      showLogo: true
    };
    setTempConfig({
      ...tempConfig,
      sections: [...tempConfig.sections, newSection]
    });
  };

  // Fix: Implemented updateSection to modify existing sections in local state
  const updateSection = (id: string, updates: Partial<SectionContent>) => {
    setTempConfig({
      ...tempConfig,
      sections: tempConfig.sections.map(s => s.id === id ? { ...s, ...updates } : s)
    });
  };

  // Fix: Implemented removeSection to delete custom pages
  const removeSection = (id: string) => {
    setTempConfig({
      ...tempConfig,
      sections: tempConfig.sections.filter(s => s.id !== id)
    });
  };

  const currentPlacementKey = logoTab === 'navbar' ? 'navbarLogo' : logoTab === 'hero' ? 'heroLogo' : 'footerLogo';
  const currentLogoConfig = tempConfig[currentPlacementKey];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-bold text-gray-800 tracking-tighter uppercase italic">Control Arena</h2>
          <p className="text-gray-500 font-medium">Potere creativo assoluto per il tuo brand.</p>
        </div>
        <button onClick={handleSaveAll} className="bg-brand-blue text-white px-10 py-4 rounded-full font-black uppercase tracking-widest hover:bg-brand-green hover:text-brand-blue transition shadow-xl">
          <i className="fas fa-save mr-2"></i> Salva Tutto
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="space-y-2">
          {[
            { id: 'general', icon: 'fa-info-circle', label: 'Info & Contatti' },
            { id: 'brand', icon: 'fa-palette', label: 'Logo & Stile Libero' },
            { id: 'sections', icon: 'fa-layer-group', label: 'Menù & Pagine' },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full text-left px-8 py-5 rounded-[2rem] font-bold transition flex items-center gap-4 ${activeTab === tab.id ? 'bg-brand-blue text-white shadow-xl' : 'bg-white text-gray-400 hover:bg-brand-light border border-gray-100'}`}
            >
              <i className={`fas ${tab.icon} w-5`}></i> {tab.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 bg-white p-10 md:p-16 rounded-[4rem] shadow-sm border border-gray-100">
          
          {activeTab === 'general' && (
            <div className="space-y-10">
              <h3 className="text-3xl font-black uppercase italic text-brand-blue">Dati del Centro</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Nome Arena</label>
                  <input type="text" value={tempConfig.centerName} onChange={e => setTempConfig({...tempConfig, centerName: e.target.value})} className="w-full p-5 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-brand-green outline-none font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">WhatsApp</label>
                  <input type="text" value={tempConfig.whatsapp} onChange={e => setTempConfig({...tempConfig, whatsapp} as any)} className="w-full p-5 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-brand-green outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Orari</label>
                  <input type="text" value={tempConfig.workingHours} onChange={e => setTempConfig({...tempConfig, workingHours: e.target.value})} className="w-full p-5 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-brand-green outline-none" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'brand' && (
            <div className="space-y-12">
              <div>
                <h3 className="text-3xl font-black uppercase italic text-brand-blue mb-2">Laboratorio Branding</h3>
                <p className="text-gray-400 text-sm font-medium italic mb-10">Modifica la forma, la dimensione e il posizionamento del logo punto per punto.</p>
              </div>
              
              <div className="bg-brand-light/50 p-10 rounded-[3rem] border border-brand-green/10 space-y-10">
                <div className="flex flex-col md:flex-row items-center gap-10">
                   <div className="w-40 h-40 bg-white rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden shadow-inner group relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      {tempConfig.logoUrl ? (
                         <img src={tempConfig.logoUrl} className="w-full h-full object-contain" alt="Master Logo" />
                      ) : (
                         <i className="fas fa-cloud-upload-alt text-gray-300 text-4xl"></i>
                      )}
                      <div className="absolute inset-0 bg-brand-blue/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <span className="text-white text-xs font-bold uppercase tracking-widest">Carica</span>
                      </div>
                      <input type="file" ref={fileInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
                   </div>
                   <div className="flex-grow">
                      <h4 className="text-lg font-black uppercase text-brand-blue mb-4">Master Logo</h4>
                      <p className="text-sm text-gray-400 italic mb-6">Usa un file ad alta risoluzione. Puoi adattarlo separatamente per Navbar, Hero e Footer qui sotto.</p>
                      <div className="flex bg-white p-2 rounded-2xl gap-2 shadow-sm border border-gray-100">
                        {(['navbar', 'hero', 'footer'] as const).map(tab => (
                          <button
                            key={tab}
                            onClick={() => setLogoTab(tab)}
                            className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${logoTab === tab ? 'bg-brand-blue text-white shadow-md' : 'text-gray-400 hover:text-brand-blue'}`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10 border-t border-brand-blue/5">
                   {/* Anteprima Live del punto selezionato */}
                   <div className="flex flex-col items-center justify-center p-8 bg-white rounded-[2.5rem] shadow-sm border border-gray-50">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Anteprima {logoTab}</span>
                      <div className="flex items-center gap-4">
                        <div 
                          className="flex items-center justify-center overflow-hidden transition-all duration-300 border-2 border-brand-green/20"
                          style={{ 
                            width: `${currentLogoConfig.width}px`, 
                            height: `${currentLogoConfig.height}px`,
                            borderRadius: `${currentLogoConfig.borderRadius}%`
                          }}
                        >
                          {tempConfig.logoUrl ? (
                            <img 
                              src={tempConfig.logoUrl} 
                              className="w-full h-full transition-all" 
                              style={{ 
                                objectFit: currentLogoConfig.objectFit,
                                transform: `scale(${currentLogoConfig.scale}) translate(${currentLogoConfig.x}%, ${currentLogoConfig.y}%)` 
                              }} 
                              alt="Preview" 
                            />
                          ) : (
                            <i className="fas fa-image text-gray-100 text-3xl"></i>
                          )}
                        </div>
                        {currentLogoConfig.showName && (
                          <div className="flex flex-col">
                            <span className="font-bold uppercase text-[10px] text-brand-blue">{tempConfig.centerName}</span>
                            <span className="text-[7px] text-brand-green font-bold uppercase tracking-widest">Tennis & Padel</span>
                          </div>
                        )}
                      </div>
                   </div>

                   {/* Controlli specifici per il punto selezionato */}
                   <div className="space-y-6">
                      <div className="flex items-center justify-between mb-4">
                         <span className="text-xs font-black text-brand-blue uppercase tracking-widest">Attivo in questo punto</span>
                         <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={currentLogoConfig.enabled} onChange={e => updateLogoPlacement(currentPlacementKey, { enabled: e.target.checked })} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-brand-green after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Larghezza ({currentLogoConfig.width}px)</label>
                          <input type="range" min="20" max="400" step="2" value={currentLogoConfig.width} onChange={e => updateLogoPlacement(currentPlacementKey, { width: parseInt(e.target.value) })} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-blue" />
                        </div>
                        <div>
                          <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Altezza ({currentLogoConfig.height}px)</label>
                          <input type="range" min="20" max="400" step="2" value={currentLogoConfig.height} onChange={e => updateLogoPlacement(currentPlacementKey, { height: parseInt(e.target.value) })} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-blue" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Arrotondamento / Forma ({currentLogoConfig.borderRadius}%)</label>
                        <input type="range" min="0" max="50" step="1" value={currentLogoConfig.borderRadius} onChange={e => updateLogoPlacement(currentPlacementKey, { borderRadius: parseInt(e.target.value) })} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-blue" />
                        <div className="flex justify-between text-[7px] text-gray-400 mt-1 uppercase font-bold">
                            <span>Quadro / Rettangolo</span>
                            <span>Cerchio / Ovale</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] font-black text-gray-400 uppercase mb-3">Inquadratura (Object Fit)</label>
                          <div className="flex bg-gray-200 p-1 rounded-xl gap-1">
                            {(['contain', 'cover'] as const).map(fit => (
                              <button
                                key={fit}
                                onClick={() => updateLogoPlacement(currentPlacementKey, { objectFit: fit })}
                                className={`flex-1 py-1.5 rounded-lg font-black text-[8px] uppercase tracking-tighter transition-all ${currentLogoConfig.objectFit === fit ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-500 hover:text-brand-blue'}`}
                              >
                                {fit === 'contain' ? 'Intero (No tagli)' : 'Riempi'}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col">
                           <label className="block text-[9px] font-black text-gray-400 uppercase mb-3">Nome Centro</label>
                           <button 
                             onClick={() => updateLogoPlacement(currentPlacementKey, { showName: !currentLogoConfig.showName })}
                             className={`w-full py-1.5 rounded-xl font-black text-[8px] uppercase border transition-all ${currentLogoConfig.showName ? 'bg-brand-green/20 border-brand-green text-brand-blue' : 'bg-white border-gray-100 text-gray-300'}`}
                           >
                              {currentLogoConfig.showName ? 'Visibile' : 'Nascosto'}
                           </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div>
                          <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Zoom Int. ({currentLogoConfig.scale}x)</label>
                          <input type="range" min="0.1" max="4" step="0.05" value={currentLogoConfig.scale} onChange={e => updateLogoPlacement(currentPlacementKey, { scale: parseFloat(e.target.value) })} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-blue" />
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1">
                             <label className="block text-[8px] font-black text-gray-400 uppercase mb-2 text-center">X</label>
                             <input type="range" min="-150" max="150" value={currentLogoConfig.x} onChange={e => updateLogoPlacement(currentPlacementKey, { x: parseInt(e.target.value) })} className="w-full h-1 bg-gray-200 appearance-none accent-brand-blue" />
                          </div>
                          <div className="flex-1">
                             <label className="block text-[8px] font-black text-gray-400 uppercase mb-2 text-center">Y</label>
                             <input type="range" min="-150" max="150" value={currentLogoConfig.y} onChange={e => updateLogoPlacement(currentPlacementKey, { y: parseInt(e.target.value) })} className="w-full h-1 bg-gray-200 appearance-none accent-brand-blue" />
                          </div>
                        </div>
                      </div>
                   </div>
                </div>
              </div>

              {/* Brand Colors */}
              <div className="p-10 border border-brand-blue/10 rounded-[3rem] space-y-10">
                <h4 className="text-xl font-black uppercase text-brand-blue tracking-tight">Colori della tua Arena</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="flex items-center gap-6">
                      <input type="color" value={tempConfig.primaryColor} onChange={e => setTempConfig({...tempConfig, primaryColor: e.target.value})} className="w-20 h-20 rounded-2xl border-none cursor-pointer p-0 overflow-hidden shadow-lg" />
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase mb-1">Primario (Testi/Bottoni)</label>
                        <span className="font-mono text-sm text-brand-blue/60">{tempConfig.primaryColor}</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-6">
                      <input type="color" value={tempConfig.accentColor} onChange={e => setTempConfig({...tempConfig, accentColor: e.target.value})} className="w-20 h-20 rounded-2xl border-none cursor-pointer p-0 overflow-hidden shadow-lg" />
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase mb-1">Accento (Highlight)</label>
                        <span className="font-mono text-sm text-brand-blue/60">{tempConfig.accentColor}</span>
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
                  <div key={section.id} className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 relative group">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${section.enabled ? 'bg-brand-green shadow-[0_0_8px_var(--brand-green)]' : 'bg-gray-300'}`}></div>
                        <h4 className="font-black uppercase tracking-tight text-brand-blue">{section.id}</h4>
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
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Nome nel Menù</label>
                        <input type="text" value={section.navLabel} onChange={e => updateSection(section.id, { navLabel: e.target.value })} className="w-full p-4 bg-white rounded-xl border border-gray-100" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Titolo Pagina</label>
                        <input type="text" value={section.title} onChange={e => updateSection(section.id, { title: e.target.value })} className="w-full p-4 bg-white rounded-xl border border-gray-100" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Descrizione/Contenuto</label>
                        <textarea value={section.description} onChange={e => updateSection(section.id, { description: e.target.value })} className="w-full p-4 bg-white rounded-xl border border-gray-100 h-24" />
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
