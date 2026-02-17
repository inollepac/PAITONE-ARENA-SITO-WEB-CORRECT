
import React, { useState, useRef } from 'react';
import { SiteConfig, LogoPlacementConfig } from '../types';

interface AdminPanelProps {
  config: SiteConfig;
  onUpdateConfig: (config: SiteConfig) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ config, onUpdateConfig }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'brand' | 'media' | 'sync'>('general');
  const [logoTab, setLogoTab] = useState<'navbar' | 'hero' | 'footer'>('navbar');
  const [tempConfig, setTempConfig] = useState<SiteConfig>({ ...config });
  const [syncCode, setSyncCode] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadField, setUploadField] = useState<string | null>(null);

  const handleSave = () => {
    onUpdateConfig(tempConfig);
    alert('Configurazione Arena salvata con successo!');
  };

  const generateSyncCode = () => {
    const json = JSON.stringify(tempConfig);
    const code = btoa(unescape(encodeURIComponent(json)));
    setSyncCode(code);
  };

  const importSyncCode = () => {
    try {
      const json = decodeURIComponent(escape(atob(syncCode)));
      const newConfig = JSON.parse(json);
      setTempConfig(newConfig);
      onUpdateConfig(newConfig);
      alert("Configurazione importata e sincronizzata!");
    } catch (e) {
      alert("Codice di sincronizzazione non valido.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadField) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const b64 = reader.result as string;
        setTempConfig(prev => {
          const next = { ...prev };
          if (uploadField === 'logo1') next.primaryLogoUrl = b64;
          else if (uploadField === 'logo2') next.secondaryLogoUrl = b64;
          return next;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const updateLogo = (key: 'navbarLogo' | 'heroLogo' | 'footerLogo', updates: Partial<LogoPlacementConfig>) => {
    setTempConfig(p => ({ ...p, [key]: { ...p[key], ...updates } }));
  };

  const curLogoKey = logoTab === 'navbar' ? 'navbarLogo' : logoTab === 'hero' ? 'heroLogo' : 'footerLogo';
  const curLogoConfig = tempConfig[curLogoKey];
  const activeLogoUrl = curLogoConfig.logoSource === 'primary' ? tempConfig.primaryLogoUrl : tempConfig.secondaryLogoUrl;

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8 bg-white p-10 rounded-[4rem] shadow-xl border border-brand-blue/5">
        <div>
          <h2 className="text-5xl font-black text-brand-blue uppercase italic tracking-tighter">Control Center</h2>
          <p className="text-gray-500 font-medium italic mt-2">Personalizza l'estetica della tua arena.</p>
        </div>
        <button onClick={handleSave} className="bg-brand-blue text-white px-16 py-6 rounded-full font-black uppercase tracking-widest hover:bg-brand-green hover:text-brand-blue transition-all shadow-2xl active:scale-95">
          Salva Modifiche Globali
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="space-y-4">
          {[
            { id: 'general', icon: 'fa-cog', label: 'Impostazioni' },
            { id: 'brand', icon: 'fa-fingerprint', label: 'Logo Designer' },
            { id: 'media', icon: 'fa-images', label: 'Libreria Media' },
            { id: 'sync', icon: 'fa-sync-alt', label: 'Cloud Sync' },
          ].map((t) => (
            <button 
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`w-full text-left px-10 py-6 rounded-[2.5rem] font-black uppercase text-xs tracking-widest transition-all flex items-center gap-6 ${activeTab === t.id ? 'bg-brand-blue text-white shadow-2xl translate-x-2' : 'bg-white text-gray-400 hover:bg-brand-light border border-gray-100'}`}
            >
              <i className={`fas ${t.icon} text-lg`}></i> {t.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 bg-white p-12 rounded-[5rem] shadow-2xl border border-gray-50 min-h-[700px]">
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />

          {activeTab === 'brand' && (
            <div className="space-y-16 animate-in fade-in duration-500">
              <div className="flex justify-between items-center border-b border-gray-100 pb-8">
                <h3 className="text-4xl font-black text-brand-blue uppercase italic tracking-tighter">Logo Lab</h3>
                <div className="flex gap-4">
                  <button onClick={() => { setUploadField('logo1'); fileInputRef.current?.click(); }} className="text-[9px] font-black uppercase px-6 py-3 bg-brand-light rounded-full hover:bg-brand-green">Carica Logo 1</button>
                  <button onClick={() => { setUploadField('logo2'); fileInputRef.current?.click(); }} className="text-[9px] font-black uppercase px-6 py-3 bg-brand-light rounded-full hover:bg-brand-green">Carica Logo 2</button>
                </div>
              </div>

              <div className="flex gap-4 p-3 bg-gray-50 rounded-[2.5rem]">
                {(['navbar', 'hero', 'footer'] as const).map(tab => (
                  <button key={tab} onClick={() => setLogoTab(tab)} className={`flex-1 py-4 rounded-[1.8rem] font-black text-[10px] uppercase tracking-widest transition-all ${logoTab === tab ? 'bg-brand-blue text-white shadow-xl' : 'text-gray-400 hover:text-brand-blue'}`}>{tab.toUpperCase()}</button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="bg-gray-100 rounded-[4rem] h-[500px] flex items-center justify-center relative overflow-hidden shadow-inner border border-gray-200">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4E5B83 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                  {activeLogoUrl && curLogoConfig.enabled && (
                    <div style={{
                      width: `${curLogoConfig.width}px`,
                      height: `${curLogoConfig.height}px`,
                      borderRadius: `${curLogoConfig.borderRadius}%`,
                      border: curLogoConfig.borderWidth > 0 ? `${curLogoConfig.borderWidth}px solid #A8D38E` : 'none',
                      overflow: 'hidden',
                      transform: `translate(${curLogoConfig.x}px, ${curLogoConfig.y}px) rotate(${curLogoConfig.rotation || 0}deg) scale(${curLogoConfig.scale})`,
                      filter: curLogoConfig.filter || 'none',
                      transition: 'all 0.1s ease-out'
                    }}>
                      <img src={activeLogoUrl} className="w-full h-full" style={{ objectFit: curLogoConfig.objectFit }} />
                    </div>
                  )}
                  {curLogoConfig.showName && <span className="ml-6 font-black text-2xl uppercase italic text-brand-blue relative z-10">{tempConfig.centerName}</span>}
                </div>

                <div className="space-y-10">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-[9px] font-black opacity-30 uppercase mb-3 block">Sorgente Immagine</label>
                      <select value={curLogoConfig.logoSource} onChange={e => updateLogo(curLogoKey, { logoSource: e.target.value as any })} className="w-full bg-gray-50 p-4 rounded-2xl font-bold text-xs outline-none">
                        <option value="primary">Logo Primario (1)</option>
                        <option value="secondary">Logo Secondario (2)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] font-black opacity-30 uppercase mb-3 block">Adattamento</label>
                      <select value={curLogoConfig.objectFit} onChange={e => updateLogo(curLogoKey, { objectFit: e.target.value as any })} className="w-full bg-gray-50 p-4 rounded-2xl font-bold text-xs outline-none">
                        <option value="contain">Contenuto (Proporzionale)</option>
                        <option value="cover">Riempimento (Tagliato)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-6 bg-gray-50 p-8 rounded-[3rem]">
                    <div className="grid grid-cols-2 gap-8">
                       <div>
                        <label className="text-[9px] font-black opacity-30 uppercase mb-3 block">Asse X ({curLogoConfig.x}px)</label>
                        <input type="range" min="-200" max="200" value={curLogoConfig.x} onChange={e => updateLogo(curLogoKey, { x: +e.target.value })} className="w-full accent-brand-blue" />
                      </div>
                      <div>
                        <label className="text-[9px] font-black opacity-30 uppercase mb-3 block">Asse Y ({curLogoConfig.y}px)</label>
                        <input type="range" min="-200" max="200" value={curLogoConfig.y} onChange={e => updateLogo(curLogoKey, { y: +e.target.value })} className="w-full accent-brand-blue" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-[9px] font-black opacity-30 uppercase mb-3 block">Rotazione ({curLogoConfig.rotation || 0}°)</label>
                      <input type="range" min="0" max="360" value={curLogoConfig.rotation || 0} onChange={e => updateLogo(curLogoKey, { rotation: +e.target.value })} className="w-full accent-brand-blue" />
                    </div>

                    <div>
                      <label className="text-[9px] font-black opacity-30 uppercase mb-3 block">Scala ({curLogoConfig.scale})</label>
                      <input type="range" min="0.1" max="3" step="0.1" value={curLogoConfig.scale} onChange={e => updateLogo(curLogoKey, { scale: +e.target.value })} className="w-full accent-brand-blue" />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => updateLogo(curLogoKey, { filter: 'none' })} className="flex-1 py-3 text-[9px] font-black uppercase border-2 rounded-2xl hover:bg-gray-50 transition">Originale</button>
                    <button onClick={() => updateLogo(curLogoKey, { filter: 'grayscale(1)' })} className="flex-1 py-3 text-[9px] font-black uppercase border-2 rounded-2xl hover:bg-gray-50 transition">B&W</button>
                    <button onClick={() => updateLogo(curLogoKey, { filter: 'invert(1)' })} className="flex-1 py-3 text-[9px] font-black uppercase border-2 rounded-2xl hover:bg-gray-50 transition">Inverti</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sync' && (
            <div className="space-y-12 animate-in fade-in duration-500 text-center py-10">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-5xl font-black text-brand-blue uppercase italic tracking-tighter mb-6">Cloud Sync</h3>
                <p className="text-gray-500 italic mb-16 text-lg">Trasferisci l'intera configurazione (loghi, colori, testi) su qualsiasi dispositivo.</p>
                
                <div className="bg-brand-light p-12 rounded-[4rem] mb-10 border border-brand-green/20 shadow-xl">
                  <h4 className="text-[10px] font-black uppercase mb-8 tracking-[0.4em] opacity-40">Esporta Configurazione</h4>
                  <button onClick={generateSyncCode} className="bg-brand-blue text-white px-12 py-5 rounded-full font-black uppercase text-xs tracking-widest shadow-2xl hover:scale-105 transition-all">Genera Chiave Arena</button>
                  {syncCode && (
                    <div className="mt-10 animate-in zoom-in duration-300">
                      <textarea readOnly value={syncCode} className="w-full h-48 p-6 bg-white border border-brand-blue/10 rounded-3xl text-[10px] font-mono break-all focus:outline-none shadow-inner" />
                      <button onClick={() => { navigator.clipboard.writeText(syncCode); alert("Codice copiato negli appunti!"); }} className="mt-6 text-brand-blue font-black text-xs uppercase underline tracking-widest">Copia Chiave</button>
                    </div>
                  )}
                </div>

                <div className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-2xl">
                  <h4 className="text-[10px] font-black uppercase mb-8 tracking-[0.4em] opacity-40">Importa da altro dispositivo</h4>
                  <textarea placeholder="Incolla la Chiave Arena qui..." onChange={e => setSyncCode(e.target.value)} className="w-full h-32 p-6 bg-gray-50 border border-gray-100 rounded-3xl text-[10px] font-mono mb-8 focus:ring-4 focus:ring-brand-green/20 outline-none" />
                  <button onClick={importSyncCode} className="w-full bg-brand-green text-brand-blue py-6 rounded-full font-black uppercase text-xs tracking-widest shadow-2xl hover:scale-[1.02] transition-all">Sincronizza Dispositivo</button>
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'general' || activeTab === 'media') && (
            <div className="flex flex-col items-center justify-center h-[600px] text-gray-300 gap-6">
               <i className="fas fa-tools text-6xl opacity-20"></i>
               <p className="font-black italic uppercase tracking-widest opacity-30">Pannello in fase di raffinamento.</p>
               <button onClick={() => setActiveTab('brand')} className="text-brand-blue font-bold underline">Torna al Logo Lab</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
