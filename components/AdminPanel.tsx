
import React, { useState, useRef } from 'react';
import { SiteConfig, Court, Event, SectionContent, LogoShape, LogoSize } from '../types';

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

  const addSection = () => {
    const id = 'custom-' + Math.random().toString(36).substr(2, 5);
    const newSection: SectionContent = {
      id,
      navLabel: 'Nuova Sezione',
      title: 'Nuova Pagina',
      description: 'Descrizione della nuova pagina...',
      enabled: true,
      isCustom: true
    };
    setTempConfig({ ...tempConfig, sections: [...tempConfig.sections, newSection] });
  };

  const removeSection = (id: string) => {
    if (window.confirm('Sei sicuro di voler eliminare questa sezione?')) {
      setTempConfig({ ...tempConfig, sections: tempConfig.sections.filter(s => s.id !== id) });
    }
  };

  const updateSection = (id: string, updates: Partial<SectionContent>) => {
    setTempConfig({
      ...tempConfig,
      sections: tempConfig.sections.map(s => s.id === id ? { ...s, ...updates } : s)
    });
  };

  const getLogoPreviewShape = () => {
    switch(tempConfig.logoShape) {
      case 'square': return 'rounded-none';
      case 'rounded': return 'rounded-2xl';
      default: return 'rounded-full';
    }
  };

  const getLogoPreviewSize = () => {
    switch(tempConfig.logoSize) {
      case 'sm': return 'w-16 h-16';
      case 'lg': return 'w-40 h-40';
      default: return 'w-24 h-24';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-bold text-gray-800 tracking-tighter uppercase italic">Control Arena</h2>
          <p className="text-gray-500 font-medium">Gestione integrale del tuo centro sportivo.</p>
        </div>
        <button onClick={handleSaveAll} className="bg-brand-blue text-white px-10 py-4 rounded-full font-black uppercase tracking-widest hover:bg-brand-green hover:text-brand-blue transition shadow-xl">
          <i className="fas fa-save mr-2"></i> Salva Tutto
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="space-y-2">
          {[
            { id: 'general', icon: 'fa-info-circle', label: 'Info & Contatti' },
            { id: 'brand', icon: 'fa-brush', label: 'Logo & Brand' },
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
                  <input type="text" value={tempConfig.centerName} onChange={e => setTempConfig({...tempConfig, centerName: e.target.value})} className="w-full p-5 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-brand-green outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">WhatsApp</label>
                  <input type="text" value={tempConfig.whatsapp} onChange={e => setTempConfig({...tempConfig, whatsapp: e.target.value})} className="w-full p-5 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-brand-green outline-none" />
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
              <h3 className="text-3xl font-black uppercase italic text-brand-blue">Identità Visiva</h3>
              
              {/* Logo Upload Section */}
              <div className="space-y-10">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Logo del Centro</label>
                  <div className="flex flex-col md:flex-row items-center gap-12 p-10 border-2 border-dashed border-gray-100 rounded-[3rem] bg-gray-50/50">
                    <div className={`${getLogoPreviewSize()} bg-white flex items-center justify-center overflow-hidden border-4 border-white shadow-xl transition-all duration-300 ${getLogoPreviewShape()}`}>
                      {tempConfig.logoUrl ? (
                        <img src={tempConfig.logoUrl} className="w-full h-full object-cover" alt="Anteprima" />
                      ) : (
                        <i className="fas fa-image text-gray-200 text-5xl"></i>
                      )}
                    </div>
                    <div className="flex-grow text-center md:text-left">
                      <p className="text-sm text-brand-blue/60 font-medium mb-4 italic">Il logo apparirà nel menù di navigazione e nei piè di pagina.</p>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-brand-blue text-white px-8 py-3 rounded-full font-bold hover:bg-brand-green hover:text-brand-blue transition shadow-lg"
                      >
                        Carica Immagine
                      </button>
                      <input type="file" ref={fileInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Shape Picker */}
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Forma del Logo</label>
                    <div className="flex bg-gray-100 p-2 rounded-2xl gap-2">
                      {(['circle', 'rounded', 'square'] as LogoShape[]).map(shape => (
                        <button
                          key={shape}
                          onClick={() => setTempConfig({...tempConfig, logoShape: shape})}
                          className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase transition-all ${tempConfig.logoShape === shape ? 'bg-white text-brand-blue shadow-md' : 'text-gray-400 hover:text-brand-blue'}`}
                        >
                          <i className={`fas ${shape === 'circle' ? 'fa-circle' : shape === 'square' ? 'fa-square' : 'fa-stop'} mr-2`}></i>
                          {shape === 'circle' ? 'Cerchio' : shape === 'square' ? 'Quadro' : 'Smussato'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size Picker */}
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Dimensione Logo (Menù)</label>
                    <div className="flex bg-gray-100 p-2 rounded-2xl gap-2">
                      {(['sm', 'md', 'lg'] as LogoSize[]).map(size => (
                        <button
                          key={size}
                          onClick={() => setTempConfig({...tempConfig, logoSize: size})}
                          className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase transition-all ${tempConfig.logoSize === size ? 'bg-white text-brand-blue shadow-md' : 'text-gray-400 hover:text-brand-blue'}`}
                        >
                          {size === 'sm' ? 'Piccolo' : size === 'md' ? 'Medio' : 'Grande'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Immagine Sfondo Principale (Hero URL)</label>
                  <input type="text" value={tempConfig.heroImageUrl} onChange={e => setTempConfig({...tempConfig, heroImageUrl: e.target.value})} className="w-full p-5 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-brand-green outline-none" placeholder="https://..." />
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
                        <div className={`w-3 h-3 rounded-full ${section.enabled ? 'bg-brand-green shadow-[0_0_8px_#A8D38E]' : 'bg-gray-300'}`}></div>
                        <h4 className="font-black uppercase tracking-tight text-brand-blue">{section.id}</h4>
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={section.enabled} onChange={e => updateSection(section.id, { enabled: e.target.checked })} className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-brand-green after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                        {section.isCustom && (
                          <button onClick={() => removeSection(section.id)} className="text-red-400 hover:text-red-600 transition p-2">
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
