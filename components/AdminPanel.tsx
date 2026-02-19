
import React, { useState, useRef, useEffect } from 'react';
import { SiteConfig, LogoPlacementConfig, Court, Event } from '../types';

export interface AdminPanelProps {
  config: SiteConfig;
  courts: Court[];
  events: Event[];
  onUpdateConfig: (config: SiteConfig) => void;
  onUpdateCourts: (courts: Court[]) => void;
  onUpdateEvents: (events: Event[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  config, 
  courts, 
  events, 
  onUpdateConfig, 
  onUpdateCourts, 
  onUpdateEvents 
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'brand' | 'media' | 'sync'>('general');
  const [logoTab, setLogoTab] = useState<'navbar' | 'hero' | 'footer'>('navbar');
  const [tempConfig, setTempConfig] = useState<SiteConfig>({ ...config });
  const [syncCode, setSyncCode] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadField, setUploadField] = useState<{type: string, index?: number} | null>(null);

  // Sincronizza lo stato locale se la config esterna cambia (es. restore)
  useEffect(() => {
    setTempConfig({ ...config });
  }, [config]);

  const handleSave = () => {
    onUpdateConfig(tempConfig);
    alert('Configurazione Arena salvata con successo!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadField) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const b64 = reader.result as string;
        setTempConfig(prev => {
          const next = { ...prev };
          if (uploadField.type === 'logo1') next.primaryLogoUrl = b64;
          else if (uploadField.type === 'logo2') next.secondaryLogoUrl = b64;
          else if (uploadField.type === 'hero') next.heroImageUrl = b64;
          else if (uploadField.type === 'space' && uploadField.index !== undefined) {
            const nextSpace = [...prev.spaceImageUrls];
            nextSpace[uploadField.index] = b64;
            next.spaceImageUrls = nextSpace;
          }
          return next;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const updateLogo = (key: 'navbarLogo' | 'heroLogo' | 'footerLogo', updates: Partial<LogoPlacementConfig>) => {
    setTempConfig(p => ({ ...p, [key]: { ...p[key], ...updates } }));
  };

  const generateSyncCode = () => {
    const json = JSON.stringify(tempConfig);
    setSyncCode(btoa(unescape(encodeURIComponent(json))));
  };

  const importSyncCode = () => {
    try {
      const json = decodeURIComponent(escape(atob(syncCode)));
      onUpdateConfig(JSON.parse(json));
      alert("Configurazione importata correttamente!");
    } catch (e) { 
      alert("Errore: il codice inserito non è valido."); 
    }
  };

  const curLogoKey = logoTab === 'navbar' ? 'navbarLogo' : logoTab === 'hero' ? 'heroLogo' : 'footerLogo';
  const curLogoConfig = tempConfig[curLogoKey];
  const activeLogoUrl = curLogoConfig.logoSource === 'primary' ? tempConfig.primaryLogoUrl : tempConfig.secondaryLogoUrl;

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
      
      {/* Header Admin */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8 bg-white p-10 rounded-[3rem] shadow-xl border border-brand-blue/5">
        <div className="text-left">
          <h2 className="text-5xl font-black text-brand-blue uppercase italic tracking-tighter">Control Center</h2>
          <p className="text-gray-500 font-medium italic mt-2">Gestione totale del Paitone Arena Tennis & Padel.</p>
        </div>
        <button onClick={handleSave} className="bg-brand-blue text-white px-12 py-5 rounded-full font-black uppercase tracking-widest hover:bg-brand-green hover:text-brand-blue transition-all shadow-2xl active:scale-95">
          Salva Tutto
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="flex flex-col gap-3">
          {[
            { id: 'general', icon: 'fa-cog', label: 'Impostazioni' },
            { id: 'brand', icon: 'fa-fingerprint', label: 'Logo Designer' },
            { id: 'media', icon: 'fa-images', label: 'Libreria Media' },
            { id: 'sync', icon: 'fa-sync-alt', label: 'Cloud Sync' },
          ].map((t) => (
            <button 
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`w-full text-left px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-4 ${activeTab === t.id ? 'bg-brand-blue text-white shadow-lg' : 'bg-white text-gray-400 hover:bg-brand-light'}`}
            >
              <i className={`fas ${t.icon} text-lg w-6 text-center`}></i> {t.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-50 min-h-[600px]">
          {activeTab === 'general' && (
            <div className="space-y-10 animate-in fade-in duration-300 text-left">
              <h3 className="text-3xl font-black text-brand-blue uppercase italic tracking-tighter border-b pb-4">Impostazioni Base</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Nome Centro', key: 'centerName' },
                  { label: 'Indirizzo', key: 'address' },
                  { label: 'Telefono', key: 'phone' },
                  { label: 'Email', key: 'email' },
                  { label: 'WhatsApp', key: 'whatsapp' },
                  { label: 'Orari', key: 'workingHours' },
                  { label: 'Titolo Hero', key: 'heroTitle' },
                  { label: 'Sottotitolo Hero', key: 'heroSubtitle' },
                ].map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="text-[10px] font-black uppercase opacity-40">{field.label}</label>
                    <input 
                      value={(tempConfig as any)[field.key] || ''} 
                      onChange={e => setTempConfig({...tempConfig, [field.key]: e.target.value})} 
                      className="w-full bg-gray-50 p-4 rounded-xl font-bold border border-gray-100 focus:ring-2 focus:ring-brand-green/30 outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'brand' && (
            <div className="space-y-12 animate-in fade-in duration-300 text-left">
              <div className="flex justify-between items-center border-b pb-4">
                <h3 className="text-3xl font-black text-brand-blue uppercase italic tracking-tighter">Branding Tool</h3>
                <div className="flex gap-2">
                  <button onClick={() => { setUploadField({type:'logo1'}); fileInputRef.current?.click(); }} className="text-[9px] font-black uppercase px-4 py-2 bg-brand-light rounded-lg hover:bg-brand-green">Logo 1</button>
                  <button onClick={() => { setUploadField({type:'logo2'}); fileInputRef.current?.click(); }} className="text-[9px] font-black uppercase px-4 py-2 bg-brand-light rounded-lg hover:bg-brand-green">Logo 2</button>
                </div>
              </div>

              <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                {(['navbar', 'hero', 'footer'] as const).map(tab => (
                  <button key={tab} onClick={() => setLogoTab(tab)} className={`flex-1 py-3 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all ${logoTab === tab ? 'bg-white text-brand-blue shadow' : 'text-gray-400'}`}>{tab}</button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-gray-100 rounded-3xl h-80 flex items-center justify-center relative overflow-hidden shadow-inner">
                  {activeLogoUrl && curLogoConfig.enabled && (
                    <div style={{
                      width: `${curLogoConfig.width}px`,
                      height: `${curLogoConfig.height}px`,
                      borderRadius: `${curLogoConfig.borderRadius}%`,
                      transform: `translate(${curLogoConfig.x}px, ${curLogoConfig.y}px) scale(${curLogoConfig.scale})`,
                      transition: 'all 0.1s ease-out'
                    }}>
                      <img src={activeLogoUrl} className="w-full h-full object-contain" />
                    </div>
                  )}
                  {curLogoConfig.showName && <span className="ml-4 font-black text-xl uppercase italic text-brand-blue">{tempConfig.centerName}</span>}
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="text-[9px] font-black opacity-30 uppercase mb-2 block">Scala ({curLogoConfig.scale})</label>
                    <input type="range" min="0.1" max="3" step="0.1" value={curLogoConfig.scale} onChange={e => updateLogo(curLogoKey, { scale: +e.target.value })} className="w-full accent-brand-blue" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-black opacity-30 uppercase mb-2 block">X ({curLogoConfig.x})</label>
                      <input type="range" min="-100" max="100" value={curLogoConfig.x} onChange={e => updateLogo(curLogoKey, { x: +e.target.value })} className="w-full accent-brand-blue" />
                    </div>
                    <div>
                      <label className="text-[9px] font-black opacity-30 uppercase mb-2 block">Y ({curLogoConfig.y})</label>
                      <input type="range" min="-100" max="100" value={curLogoConfig.y} onChange={e => updateLogo(curLogoKey, { y: +e.target.value })} className="w-full accent-brand-blue" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-10 animate-in fade-in duration-300 text-left">
              <h3 className="text-3xl font-black text-brand-blue uppercase italic tracking-tighter border-b pb-4">Gestione Immagini</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase opacity-40">Immagine Hero</h4>
                  <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg group">
                    <img src={tempConfig.heroImageUrl} className="w-full h-full object-cover" />
                    <button onClick={() => { setUploadField({type:'hero'}); fileInputRef.current?.click(); }} className="absolute inset-0 bg-brand-blue/80 text-white font-black uppercase text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">Sostituisci</button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase opacity-40">Libreria Spazi (4 Foto)</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {tempConfig.spaceImageUrls.map((url, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden shadow group">
                        <img src={url} className="w-full h-full object-cover" />
                        <button onClick={() => { setUploadField({type:'space', index: i}); fileInputRef.current?.click(); }} className="absolute inset-0 bg-brand-blue/80 text-white font-black uppercase text-[8px] opacity-0 group-hover:opacity-100 transition-opacity">Update</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sync' && (
            <div className="space-y-10 animate-in fade-in duration-300">
              <h3 className="text-3xl font-black text-brand-blue uppercase italic tracking-tighter border-b pb-4 text-left">Sincronizzazione Cloud</h3>
              <div className="max-w-xl mx-auto space-y-8 py-8">
                <button onClick={generateSyncCode} className="w-full bg-brand-blue text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:bg-brand-green hover:text-brand-blue transition-all">Genera Chiave d'Esportazione</button>
                {syncCode && (
                  <div className="space-y-4 text-left">
                    <label className="text-[9px] font-black uppercase opacity-40">Tua Chiave Arena:</label>
                    <textarea readOnly value={syncCode} className="w-full h-32 p-4 bg-gray-50 border rounded-xl text-[10px] font-mono break-all outline-none" />
                  </div>
                )}
                <div className="pt-8 border-t border-gray-100 space-y-6">
                  <textarea placeholder="Incolla qui la chiave Arena per importarla..." onChange={e => setSyncCode(e.target.value)} className="w-full h-24 p-4 bg-gray-50 border rounded-xl text-[10px] font-mono outline-none" />
                  <button onClick={importSyncCode} className="w-full bg-brand-green text-brand-blue py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg active:scale-95">Importa Configurazione</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
