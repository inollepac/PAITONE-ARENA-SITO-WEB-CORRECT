
import React, { useState, useEffect, useRef } from 'react';
import { SiteConfig, Court, Event, LogoPlacementConfig } from '../types';

export interface AdminPanelProps {
  config: SiteConfig;
  courts: Court[];
  events: Event[];
  onUpdateConfig: (config: SiteConfig) => void;
  onUpdateCourts: (courts: Court[]) => void;
  onUpdateEvents: (events: Event[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ config, onUpdateConfig }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [localConfig, setLocalConfig] = useState<SiteConfig>({ ...config });
  
  const primaryLogoInputRef = useRef<HTMLInputElement>(null);
  const secondaryLogoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalConfig({ ...config });
  }, [config]);

  const handleChange = (key: keyof SiteConfig, value: any) => {
    const updated = { ...localConfig, [key]: value };
    setLocalConfig(updated);
    onUpdateConfig(updated);
  };

  const handleFileUpload = (key: 'primaryLogoUrl' | 'secondaryLogoUrl', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange(key, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: 'general', label: 'Impostazioni Base', icon: 'fa-cog' },
    { id: 'logos', label: 'Loghi e Visual', icon: 'fa-copyright' },
    { id: 'colors', label: 'Colori e Brand', icon: 'fa-palette' },
    { id: 'contacts', label: 'Contatti e Orari', icon: 'fa-phone' }
  ];

  const renderLogoConfig = (key: 'navbarLogo' | 'heroLogo' | 'footerLogo', title: string) => {
    const logoConfig = localConfig[key];
    
    const updateLogoPlacement = (updates: Partial<LogoPlacementConfig>) => {
      handleChange(key, { ...logoConfig, ...updates });
    };

    return (
      <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-brand-blue">{title}</h4>
          <button 
            onClick={() => updateLogoPlacement({ enabled: !logoConfig.enabled })}
            className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${logoConfig.enabled ? 'bg-brand-green text-brand-blue' : 'bg-gray-200 text-gray-400'}`}
          >
            {logoConfig.enabled ? 'Abilitato' : 'Disabilitato'}
          </button>
        </div>

        {logoConfig.enabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase opacity-40">Sorgente Logo</label>
              <select 
                value={logoConfig.logoSource} 
                onChange={e => updateLogoPlacement({ logoSource: e.target.value as any })}
                className="w-full p-3 bg-white border border-gray-100 rounded-xl text-[10px] font-black outline-none"
              >
                <option value="primary">Logo Principale</option>
                <option value="secondary">Logo Secondario</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase opacity-40">Mostra Nome Centro</label>
              <button 
                onClick={() => updateLogoPlacement({ showName: !logoConfig.showName })}
                className={`w-full p-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${logoConfig.showName ? 'bg-brand-blue text-white' : 'bg-white border border-gray-100 text-gray-400'}`}
              >
                {logoConfig.showName ? 'Sì' : 'No'}
              </button>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase opacity-40">Larghezza ({logoConfig.width}px)</label>
              <input type="range" min="20" max="400" value={logoConfig.width} onChange={e => updateLogoPlacement({ width: +e.target.value })} className="w-full accent-brand-blue" />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase opacity-40">Altezza ({logoConfig.height}px)</label>
              <input type="range" min="20" max="400" value={logoConfig.height} onChange={e => updateLogoPlacement({ height: +e.target.value })} className="w-full accent-brand-blue" />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase opacity-40">Arrotondamento ({logoConfig.borderRadius}%)</label>
              <input type="range" min="0" max="100" value={logoConfig.borderRadius} onChange={e => updateLogoPlacement({ borderRadius: +e.target.value })} className="w-full accent-brand-blue" />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase opacity-40">Bordo ({logoConfig.borderWidth}px)</label>
              <input type="range" min="0" max="20" value={logoConfig.borderWidth} onChange={e => updateLogoPlacement({ borderWidth: +e.target.value })} className="w-full accent-brand-blue" />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 text-left">
      <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar */}
        <div className="w-full md:w-80 bg-gray-50 border-r border-gray-100 p-8 flex flex-col gap-2">
          <h2 className="text-2xl font-black text-brand-blue uppercase italic mb-8">Pannello Pro</h2>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === tab.id ? 'bg-brand-blue text-white shadow-lg' : 'text-gray-400 hover:bg-white'}`}
            >
              <i className={`fas ${tab.icon} text-sm`}></i> {tab.label}
            </button>
          ))}
          <div className="mt-auto pt-8">
            <p className="text-[9px] font-black uppercase opacity-30 text-center">v2.8 - Stato: Online</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow p-12 bg-white">
          {activeTab === 'general' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <h3 className="text-3xl font-black text-brand-blue uppercase italic tracking-tighter">Generale</h3>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase opacity-40">Nome del Centro</label>
                  <input 
                    value={localConfig.centerName || ''} 
                    onChange={e => handleChange('centerName', e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase opacity-40">Titolo Hero Principale</label>
                  <input 
                    value={localConfig.heroTitle || ''} 
                    onChange={e => handleChange('heroTitle', e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase opacity-40">URL Immagine Hero</label>
                  <input 
                    value={localConfig.heroImageUrl || ''} 
                    onChange={e => handleChange('heroImageUrl', e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logos' && (
            <div className="space-y-12 animate-in fade-in duration-300">
              <h3 className="text-3xl font-black text-brand-blue uppercase italic tracking-tighter">Gestione Loghi</h3>
              
              <div className="grid grid-cols-1 gap-12">
                {/* Global Logo Assets */}
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase opacity-30 tracking-widest">Asset Sorgente</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Primary Logo */}
                    <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 text-center space-y-4">
                      <label className="text-[10px] font-black uppercase opacity-40 block">Logo Principale (URL)</label>
                      <input 
                        type="text"
                        value={localConfig.primaryLogoUrl || ''} 
                        onChange={e => handleChange('primaryLogoUrl', e.target.value)}
                        className="w-full p-3 bg-white border border-gray-100 rounded-xl text-[10px] font-black outline-none"
                        placeholder="https://..."
                      />
                      <div 
                        onClick={() => primaryLogoInputRef.current?.click()}
                        className="w-24 h-24 mx-auto bg-white rounded-full shadow-inner border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-brand-green transition-all overflow-hidden"
                      >
                        {localConfig.primaryLogoUrl ? (
                          <img src={localConfig.primaryLogoUrl} alt="Primary" className="w-full h-full object-contain p-2" />
                        ) : (
                          <i className="fas fa-cloud-upload-alt text-xl text-gray-300"></i>
                        )}
                      </div>
                      <input type="file" ref={primaryLogoInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload('primaryLogoUrl', e)} />
                    </div>

                    {/* Secondary Logo */}
                    <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 text-center space-y-4">
                      <label className="text-[10px] font-black uppercase opacity-40 block">Logo Secondario (URL)</label>
                      <input 
                        type="text"
                        value={localConfig.secondaryLogoUrl || ''} 
                        onChange={e => handleChange('secondaryLogoUrl', e.target.value)}
                        className="w-full p-3 bg-white border border-gray-100 rounded-xl text-[10px] font-black outline-none"
                        placeholder="https://..."
                      />
                      <div 
                        onClick={() => secondaryLogoInputRef.current?.click()}
                        className="w-24 h-24 mx-auto bg-white rounded-full shadow-inner border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-brand-green transition-all overflow-hidden"
                      >
                        {localConfig.secondaryLogoUrl ? (
                          <img src={localConfig.secondaryLogoUrl} alt="Secondary" className="w-full h-full object-contain p-2" />
                        ) : (
                          <i className="fas fa-image text-xl text-gray-300"></i>
                        )}
                      </div>
                      <input type="file" ref={secondaryLogoInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload('secondaryLogoUrl', e)} />
                    </div>
                  </div>
                </div>

                {/* Placements */}
                <div className="space-y-8">
                  <h4 className="text-[10px] font-black uppercase opacity-30 tracking-widest">Posizionamenti</h4>
                  {renderLogoConfig('navbarLogo', 'Logo Navbar')}
                  {renderLogoConfig('footerLogo', 'Logo Footer')}
                  {renderLogoConfig('heroLogo', 'Logo Hero (Opzionale)')}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'colors' && (
            <div className="space-y-12 animate-in fade-in duration-300">
              <h3 className="text-3xl font-black text-brand-blue uppercase italic tracking-tighter">Branding</h3>
              
              {/* Logo Management */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase opacity-30 tracking-widest">Asset Loghi</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Primary Logo */}
                  <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 text-center space-y-4">
                    <label className="text-[10px] font-black uppercase opacity-40 block">Logo Principale</label>
                    <div 
                      onClick={() => primaryLogoInputRef.current?.click()}
                      className="w-32 h-32 mx-auto bg-white rounded-full shadow-inner border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-brand-green transition-all overflow-hidden"
                    >
                      {localConfig.primaryLogoUrl ? (
                        <img src={localConfig.primaryLogoUrl} alt="Primary" className="w-full h-full object-contain p-4" />
                      ) : (
                        <i className="fas fa-cloud-upload-alt text-2xl text-gray-300"></i>
                      )}
                    </div>
                    <input 
                      type="file" 
                      ref={primaryLogoInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => handleFileUpload('primaryLogoUrl', e)} 
                    />
                    <button 
                      onClick={() => primaryLogoInputRef.current?.click()}
                      className="text-[10px] font-black uppercase tracking-widest text-brand-blue hover:text-brand-green transition"
                    >
                      Carica Nuovo Logo
                    </button>
                  </div>

                  {/* Secondary Logo */}
                  <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 text-center space-y-4">
                    <label className="text-[10px] font-black uppercase opacity-40 block">Logo Secondario</label>
                    <div 
                      onClick={() => secondaryLogoInputRef.current?.click()}
                      className="w-32 h-32 mx-auto bg-white rounded-full shadow-inner border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-brand-green transition-all overflow-hidden"
                    >
                      {localConfig.secondaryLogoUrl ? (
                        <img src={localConfig.secondaryLogoUrl} alt="Secondary" className="w-full h-full object-contain p-4" />
                      ) : (
                        <i className="fas fa-image text-2xl text-gray-300"></i>
                      )}
                    </div>
                    <input 
                      type="file" 
                      ref={secondaryLogoInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => handleFileUpload('secondaryLogoUrl', e)} 
                    />
                    <button 
                      onClick={() => secondaryLogoInputRef.current?.click()}
                      className="text-[10px] font-black uppercase tracking-widest text-brand-blue hover:text-brand-green transition"
                    >
                      Carica Versione Alternativa
                    </button>
                  </div>
                </div>
              </div>

              {/* Color Management */}
              <div className="space-y-6 pt-8 border-t border-gray-100">
                <h4 className="text-[10px] font-black uppercase opacity-30 tracking-widest">Tavolozza Colori</h4>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2 text-center">
                    <label className="text-[10px] font-black uppercase opacity-40 block mb-4">Colore Primario</label>
                    <input 
                      type="color" 
                      value={localConfig.primaryColor || '#4E5B83'} 
                      onChange={e => handleChange('primaryColor', e.target.value)}
                      className="w-24 h-24 rounded-full border-0 p-0 cursor-pointer mx-auto block overflow-hidden shadow-xl"
                    />
                  </div>
                  <div className="space-y-2 text-center">
                    <label className="text-[10px] font-black uppercase opacity-40 block mb-4">Colore Accento</label>
                    <input 
                      type="color" 
                      value={localConfig.accentColor || '#A8D38E'} 
                      onChange={e => handleChange('accentColor', e.target.value)}
                      className="w-24 h-24 rounded-full border-0 p-0 cursor-pointer mx-auto block overflow-hidden shadow-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <h3 className="text-3xl font-black text-brand-blue uppercase italic tracking-tighter">Contatti</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Indirizzo', key: 'address' },
                  { label: 'Telefono', key: 'phone' },
                  { label: 'WhatsApp', key: 'whatsapp' },
                  { label: 'Email', key: 'email' },
                  { label: 'Orari', key: 'workingHours' },
                  { label: 'Instagram URL', key: 'instagram' },
                  { label: 'Facebook URL', key: 'facebook' },
                  { label: 'Twitter URL', key: 'twitter' },
                  { label: 'Link Prenotazione Esterno', key: 'externalBookingUrl' },
                ].map(field => (
                  <div key={field.key} className="space-y-2">
                    <label className="text-[10px] font-black uppercase opacity-40">{field.label}</label>
                    <input 
                      value={(localConfig as any)[field.key] || ''} 
                      onChange={e => handleChange(field.key as any, e.target.value)}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none focus:ring-2 focus:ring-brand-green"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 flex justify-center">
        <button 
          onClick={() => { onUpdateConfig(localConfig); alert('Tutte le modifiche salvate nel cloud locale!'); }}
          className="bg-brand-green text-brand-blue px-16 py-6 rounded-full font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all"
        >
          Applica e Salva Tutto
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
