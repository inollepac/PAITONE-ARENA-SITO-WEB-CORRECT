
import React, { useState, useRef } from 'react';
import { SiteConfig, Court, Event, SectionContent, LogoShape } from '../types';

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
      isCustom: true,
      showLogo: true
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
      case 'rounded': return 'rounded-3xl';
      default: return 'rounded-full';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-bold text-gray-800 tracking-tighter uppercase italic">Control Arena</h2>
          <p className="text-gray-500 font-medium">Libertà totale di creazione e branding.</p>
        </div>
        <button onClick={handleSaveAll} className="bg-brand-blue text-white px-10 py-4 rounded-full font-black uppercase tracking-widest hover:bg-brand-green hover:text-brand-blue transition shadow-xl">
          <i className="fas fa-save mr-2"></i> Salva Tutto
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="space-y-2">
          {[
            { id: 'general', icon: 'fa-info-circle', label: 'Info & Contatti' },
            { id: 'brand', icon: 'fa-palette', label: 'Logo & Colori' },
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
              <div>
                <h3 className="text-3xl font-black uppercase italic text-brand-blue mb-2">Identità Visiva</h3>
                <p className="text-gray-400 text-sm font-medium mb-10 italic">Personalizza il logo e i colori del tuo brand in tempo reale.</p>
              </div>
              
              {/* Logo Framing & Styling */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 p-10 bg-gray-50 rounded-[3rem] border border-gray-100">
                <div className="flex flex-col items-center justify-center">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-6 text-center">Anteprima Logo (Live)</label>
                  <div 
                    className={`bg-white border-2 border-brand-green shadow-2xl flex items-center justify-center overflow-hidden transition-all duration-300 ${getLogoPreviewShape()}`}
                    style={{ 
                      width: `${tempConfig.logoWidth}px`, 
                      height: `${tempConfig.logoWidth}px` 
                    }}
                  >
                    {tempConfig.logoUrl ? (
                      <img 
                        src={tempConfig.logoUrl} 
                        className="w-full h-full object-cover" 
                        style={{ 
                          transform: `scale(${tempConfig.logoScale}) translate(${tempConfig.logoX}%, ${tempConfig.logoY}%)` 
                        }} 
                        alt="Preview" 
                      />
                    ) : (
                      <i className="fas fa-image text-gray-200 text-5xl"></i>
                    )}
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-10 bg-brand-blue text-white px-8 py-3 rounded-full font-bold hover:bg-brand-green hover:text-brand-blue transition shadow-lg"
                  >
                    Carica Nuovo Logo
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="flex justify-between text-[10px] font-black text-gray-400 uppercase mb-2">
                      <span>Dimensione Frame ({tempConfig.logoWidth}px)</span>
                    </label>
                    <input type="range" min="40" max="300" step="2" value={tempConfig.logoWidth} onChange={e => setTempConfig({...tempConfig, logoWidth: parseInt(e.target.value)})} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-blue" />
                  </div>
                  <div>
                    <label className="flex justify-between text-[10px] font-black text-gray-400 uppercase mb-2">
                      <span>Zoom Immagine ({tempConfig.logoScale}x)</span>
                    </label>
                    <input type="range" min="0.5" max="4" step="0.1" value={tempConfig.logoScale} onChange={e => setTempConfig({...tempConfig, logoScale: parseFloat(e.target.value)})} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-blue" />
                  </div>
                  <div>
                    <label className="flex justify-between text-[10px] font-black text-gray-400 uppercase mb-2">
                      <span>Spostamento X ({tempConfig.logoX}%)</span>
                    </label>
                    <input type="range" min="-100" max="100" step="1" value={tempConfig.logoX} onChange={e => setTempConfig({...tempConfig, logoX: parseInt(e.target.value)})} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-blue" />
                  </div>
                  <div>
                    <label className="flex justify-between text-[10px] font-black text-gray-400 uppercase mb-2">
                      <span>Spostamento Y ({tempConfig.logoY}%)</span>
                    </label>
                    <input type="range" min="-100" max="100" step="1" value={tempConfig.logoY} onChange={e => setTempConfig({...tempConfig, logoY: parseInt(e.target.value)})} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-blue" />
                  </div>
                  
                  <div className="pt-4">
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-3">Forma del Frame</label>
                    <div className="flex bg-gray-200 p-1.5 rounded-2xl gap-2">
                      {(['circle', 'rounded', 'square'] as LogoShape[]).map(shape => (
                        <button
                          key={shape}
                          onClick={() => setTempConfig({...tempConfig, logoShape: shape})}
                          className={`flex-1 py-2 rounded-xl font-bold text-[10px] uppercase transition-all ${tempConfig.logoShape === shape ? 'bg-white text-brand-blue shadow-md' : 'text-gray-500 hover:text-brand-blue'}`}
                        >
                          {shape === 'circle' ? 'Cerchio' : shape === 'square' ? 'Quadro' : 'Rounded'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Brand Colors */}
              <div className="p-10 border border-brand-blue/10 rounded-[3rem] space-y-10">
                <h4 className="text-xl font-black uppercase text-brand-blue tracking-tight">Colori del Brand</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="flex items-center gap-6">
                      <input type="color" value={tempConfig.primaryColor} onChange={e => setTempConfig({...tempConfig, primaryColor: e.target.value})} className="w-20 h-20 rounded-2xl border-none cursor-pointer p-0 overflow-hidden" />
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase mb-1">Colore Primario</label>
                        <span className="font-mono text-sm text-brand-blue/60">{tempConfig.primaryColor}</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-6">
                      <input type="color" value={tempConfig.accentColor} onChange={e => setTempConfig({...tempConfig, accentColor: e.target.value})} className="w-20 h-20 rounded-2xl border-none cursor-pointer p-0 overflow-hidden" />
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase mb-1">Colore Accento</label>
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
                        <div className="flex items-center gap-2 mr-4 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                           <span className="text-[10px] font-black text-gray-400 uppercase">Logo?</span>
                           <input type="checkbox" checked={section.showLogo} onChange={e => updateSection(section.id, { showLogo: e.target.checked })} className="accent-brand-green w-4 h-4" />
                        </div>
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
