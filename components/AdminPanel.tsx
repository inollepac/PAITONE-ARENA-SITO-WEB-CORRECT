
import React, { useState, useEffect } from 'react';
import { SiteConfig, Court, Event } from '../types';

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

  useEffect(() => {
    setLocalConfig({ ...config });
  }, [config]);

  const handleChange = (key: keyof SiteConfig, value: any) => {
    const updated = { ...localConfig, [key]: value };
    setLocalConfig(updated);
    onUpdateConfig(updated);
  };

  const tabs = [
    { id: 'general', label: 'Impostazioni Base', icon: 'fa-cog' },
    { id: 'colors', label: 'Colori e Brand', icon: 'fa-palette' },
    { id: 'contacts', label: 'Contatti e Orari', icon: 'fa-phone' }
  ];

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

          {activeTab === 'colors' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <h3 className="text-3xl font-black text-brand-blue uppercase italic tracking-tighter">Branding</h3>
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
