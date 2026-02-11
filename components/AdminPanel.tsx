
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
  const [tempConfig, setTempConfig] = useState<SiteConfig>({ ...config });
  
  const logo1InputRef = useRef<HTMLInputElement>(null);
  const logo2InputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const [mediaTarget, setMediaTarget] = useState<string | null>(null);

  const handleSave = () => {
    onUpdateConfig(tempConfig);
    alert('Configurazione salvata correttamente!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const b64 = reader.result as string;
      if (field === 'primaryLogoUrl') setTempConfig(p => ({ ...p, primaryLogoUrl: b64 }));
      else if (field === 'secondaryLogoUrl') setTempConfig(p => ({ ...p, secondaryLogoUrl: b64 }));
      else if (field.startsWith('space-')) {
        const idx = parseInt(field.split('-')[1]);
        const imgs = [...tempConfig.spaceImageUrls];
        imgs[idx] = b64;
        setTempConfig(p => ({ ...p, spaceImageUrls: imgs }));
      } else {
        setTempConfig(p => ({ ...p, [field as keyof SiteConfig]: b64 } as any));
      }
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  const updateLogo = (key: 'navbarLogo' | 'heroLogo' | 'footerLogo', updates: Partial<LogoPlacementConfig>) => {
    setTempConfig(p => ({ ...p, [key]: { ...p[key], ...updates } }));
  };

  const updateSection = (id: string, updates: Partial<SectionContent>) => {
    setTempConfig(p => ({ ...p, sections: p.sections.map(s => s.id === id ? { ...s, ...updates } : s) }));
  };

  const curLogoKey = logoTab === 'navbar' ? 'navbarLogo' : logoTab === 'hero' ? 'heroLogo' : 'footerLogo';
  const curLogoConfig = tempConfig[curLogoKey];
  const activeLogoUrl = curLogoConfig.logoSource === 'primary' ? tempConfig.primaryLogoUrl : tempConfig.secondaryLogoUrl;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 bg-white p-8 rounded-[3rem] shadow-sm border border-brand-blue/5">
        <div>
          <h2 className="text-4xl font-black text-brand-blue uppercase italic tracking-tighter">Arena Management</h2>
          <p className="text-gray-500 font-medium italic">Personalizzazione totale di testi, immagini e branding.</p>
        </div>
        <button onClick={handleSave} className="bg-brand-blue text-white px-12 py-5 rounded-full font-black uppercase tracking-widest hover:bg-brand-green hover:text-brand-blue transition-all shadow-xl active:scale-95">
          <i className="fas fa-save mr-2"></i> Applica Tutto
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar */}
        <div className="space-y-3">
          {[
            { id: 'general', icon: 'fa-cog', label: 'Info & Hero' },
            { id: 'brand', icon: 'fa-fingerprint', label: 'Logo Lab' },
            { id: 'media', icon: 'fa-images', label: 'Media & Foto' },
            { id: 'sections', icon: 'fa-edit', label: 'Pagine & Testi' },
          ].map((t) => (
            <button 
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`w-full text-left px-8 py-5 rounded-[2.5rem] font-bold transition-all flex items-center gap-4 ${activeTab === t.id ? 'bg-brand-blue text-white shadow-xl translate-x-2' : 'bg-white text-gray-400 hover:bg-brand-light border border-gray-100'}`}
            >
              <i className={`fas ${t.icon} w-5`}></i> {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-3 bg-white p-8 md:p-12 rounded-[4rem] shadow-sm border border-gray-100 min-h-[600px]">
          
          {activeTab === 'general' && (
            <div className="space-y-12 animate-in fade-in duration-300">
              <h3 className="text-3xl font-black text-brand-blue uppercase italic">Configurazione Generale</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Nome dell'Arena</label>
                  <input type="text" value={tempConfig.centerName} onChange={e => setTempConfig({...tempConfig, centerName: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-green outline-none font-bold" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">WhatsApp</label>
                  <input type="text" value={tempConfig.whatsapp} onChange={e => setTempConfig({...tempConfig, whatsapp: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-green outline-none font-bold" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Email</label>
                  <input type="text" value={tempConfig.email} onChange={e => setTempConfig({...tempConfig, email: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-green outline-none font-bold" />
                </div>
                <div className="md:col-span-2 pt-6 border-t border-gray-100">
                  <h4 className="text-xl font-black text-brand-blue mb-6 uppercase italic">Hero Principale</h4>
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Titolo Hero</label>
                      <input type="text" value={tempConfig.heroTitle} onChange={e => setTempConfig({...tempConfig, heroTitle: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-green font-black text-xl italic" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Sottotitolo Hero</label>
                      <textarea value={tempConfig.heroSubtitle} onChange={e => setTempConfig({...tempConfig, heroSubtitle: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-green h-24 font-medium" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'brand' && (
            <div className="space-y-12 animate-in fade-in duration-300">
              <h3 className="text-3xl font-black text-brand-blue uppercase italic">Logo Lab</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-brand-light/50 rounded-[3rem] border border-brand-blue/5 flex flex-col items-center">
                  <div className="w-24 h-24 bg-white rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden mb-4 shadow-inner">
                    {tempConfig.primaryLogoUrl ? <img src={tempConfig.primaryLogoUrl} className="w-full h-full object-contain" /> : <i className="fas fa-image text-gray-200"></i>}
                  </div>
                  <button onClick={() => logo1InputRef.current?.click()} className="text-[10px] font-black uppercase tracking-widest text-brand-blue bg-white px-6 py-2 rounded-full shadow-sm hover:scale-105 transition-all">Sostituisci Logo 1</button>
                  <input type="file" ref={logo1InputRef} className="hidden" onChange={e => handleFileUpload(e, 'primaryLogoUrl')} />
                </div>
                <div className="p-8 bg-brand-light/50 rounded-[3rem] border border-brand-blue/5 flex flex-col items-center">
                  <div className="w-24 h-24 bg-white rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden mb-4 shadow-inner">
                    {tempConfig.secondaryLogoUrl ? <img src={tempConfig.secondaryLogoUrl} className="w-full h-full object-contain" /> : <i className="fas fa-image text-gray-200"></i>}
                  </div>
                  <button onClick={() => logo2InputRef.current?.click()} className="text-[10px] font-black uppercase tracking-widest text-brand-blue bg-white px-6 py-2 rounded-full shadow-sm hover:scale-105 transition-all">Sostituisci Logo 2</button>
                  <input type="file" ref={logo2InputRef} className="hidden" onChange={e => handleFileUpload(e, 'secondaryLogoUrl')} />
                </div>
              </div>

              <div className="bg-gray-100 p-2 rounded-[2.5rem] flex gap-2">
                {(['navbar', 'hero', 'footer'] as const).map(tab => (
                  <button key={tab} onClick={() => setLogoTab(tab)} className={`flex-1 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${logoTab === tab ? 'bg-brand-blue text-white shadow-lg' : 'text-gray-400'}`}>{tab.toUpperCase()}</button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="p-12 bg-gray-50 rounded-[4rem] border border-gray-100 flex items-center justify-center min-h-[300px] shadow-inner">
                  <div className="flex items-center gap-6">
                    {curLogoConfig.enabled && activeLogoUrl && (
                      <div style={{ width: `${curLogoConfig.width}px`, height: `${curLogoConfig.height}px`, borderRadius: `${curLogoConfig.borderRadius}%`, border: curLogoConfig.borderWidth > 0 ? `${curLogoConfig.borderWidth}px solid var(--brand-green)` : 'none', overflow: 'hidden' }}>
                        <img src={activeLogoUrl} className="w-full h-full" style={{ objectFit: curLogoConfig.objectFit, transform: `scale(${curLogoConfig.scale}) translate(${curLogoConfig.x}%, ${curLogoConfig.y}%)` }} />
                      </div>
                    )}
                    {curLogoConfig.showName && <span className="font-black uppercase text-brand-blue italic tracking-tighter text-xl">{tempConfig.centerName}</span>}
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-brand-light/50 rounded-2xl">
                    <span className="text-[9px] font-black uppercase text-brand-blue">Usa Logo</span>
                    <select value={curLogoConfig.logoSource} onChange={e => updateLogo(curLogoKey, { logoSource: e.target.value as any })} className="bg-transparent font-bold text-xs outline-none">
                      <option value="primary">Logo 1</option>
                      <option value="secondary">Logo 2</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[8px] font-black text-gray-400 mb-2 block">LARGHEZZA ({curLogoConfig.width}px)</label>
                      <input type="range" min="20" max="400" value={curLogoConfig.width} onChange={e => updateLogo(curLogoKey, { width: parseInt(e.target.value) })} className="w-full accent-brand-blue" />
                    </div>
                    <div>
                      <label className="text-[8px] font-black text-gray-400 mb-2 block">ALTEZZA ({curLogoConfig.height}px)</label>
                      <input type="range" min="20" max="400" value={curLogoConfig.height} onChange={e => updateLogo(curLogoKey, { height: parseInt(e.target.value) })} className="w-full accent-brand-blue" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[8px] font-black text-gray-400 mb-2 block">ARROTONDAMENTO ({curLogoConfig.borderRadius}%)</label>
                      <input type="range" min="0" max="50" value={curLogoConfig.borderRadius} onChange={e => updateLogo(curLogoKey, { borderRadius: parseInt(e.target.value) })} className="w-full accent-brand-blue" />
                    </div>
                    <div>
                      <label className="text-[8px] font-black text-gray-400 mb-2 block">SPESSORE BORDO ({curLogoConfig.borderWidth}px)</label>
                      <input type="range" min="0" max="10" value={curLogoConfig.borderWidth} onChange={e => updateLogo(curLogoKey, { borderWidth: parseInt(e.target.value) })} className="w-full accent-brand-blue" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-brand-light rounded-2xl">
                    <span className="text-[10px] font-black uppercase text-brand-blue">Mostra Nome Brand</span>
                    <input type="checkbox" checked={curLogoConfig.showName} onChange={e => updateLogo(curLogoKey, { showName: e.target.checked })} className="accent-brand-green w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-12 animate-in fade-in duration-300">
              <h3 className="text-3xl font-black text-brand-blue uppercase italic">Media & Fotografie</h3>
              <input type="file" ref={mediaInputRef} className="hidden" onChange={e => mediaTarget && handleFileUpload(e, mediaTarget)} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { id: 'heroImageUrl', label: 'Immagine Sfondo Hero' },
                  { id: 'sportsImageUrl', label: 'Vetrina Sport (Home)' },
                  { id: 'tennisImageUrl', label: 'Pagina Tennis' },
                  { id: 'padelImageUrl', label: 'Pagina Padel' },
                  { id: 'communityImageUrl', label: 'Community / Aperitivi' },
                ].map((m) => (
                  <div key={m.id} className="group relative h-48 bg-gray-100 rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-lg">
                    <img src={(tempConfig as any)[m.id]} className="w-full h-full object-cover" alt={m.label} />
                    <div className="absolute inset-0 bg-brand-blue/70 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center text-white gap-3">
                      <span className="font-black uppercase text-[10px] tracking-widest">{m.label}</span>
                      <button onClick={() => { setMediaTarget(m.id); mediaInputRef.current?.click(); }} className="bg-brand-green text-brand-blue px-8 py-2 rounded-full font-black text-[10px] uppercase shadow-xl hover:scale-105 transition-all">Cambia Foto</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-10 border-t border-gray-100">
                <h4 className="text-[10px] font-black uppercase text-brand-blue mb-6 tracking-widest italic">Gallery "Il Nostro Spazio" (4 Foto)</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(tempConfig.spaceImageUrls || []).map((url, i) => (
                    <div key={i} className="group relative h-32 bg-gray-100 rounded-2xl overflow-hidden shadow-sm">
                      <img src={url} className="w-full h-full object-cover" />
                      <button onClick={() => { setMediaTarget(`space-${i}`); mediaInputRef.current?.click(); }} className="absolute inset-0 bg-brand-blue/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[9px] font-black uppercase">Cambia</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sections' && (
            <div className="space-y-10 animate-in fade-in duration-300">
              <h3 className="text-3xl font-black text-brand-blue uppercase italic">Pagine & Testi</h3>
              <div className="space-y-8">
                {tempConfig.sections.map((section) => (
                  <div key={section.id} className="p-8 bg-gray-50 rounded-[3rem] border border-gray-200 group transition-all hover:bg-white hover:shadow-xl">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${section.enabled ? 'bg-brand-green shadow-[0_0_8px_#A8D38E]' : 'bg-gray-300'}`}></div>
                        <h4 className="font-black uppercase text-brand-blue text-xs italic">Sezione: {section.id}</h4>
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="text-[10px] font-black uppercase text-gray-400">Visibile nel sito</label>
                        <input type="checkbox" checked={section.enabled} onChange={e => updateSection(section.id, { enabled: e.target.checked })} className="accent-brand-green w-5 h-5" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Etichetta Menù</label>
                        <input type="text" value={section.navLabel} onChange={e => updateSection(section.id, { navLabel: e.target.value })} className="w-full p-4 bg-white rounded-xl border border-gray-200 font-bold" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Titolo Pagina</label>
                        <input type="text" value={section.title} onChange={e => updateSection(section.id, { title: e.target.value })} className="w-full p-4 bg-white rounded-xl border border-gray-200 font-black italic" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Descrizione / Paragrafo</label>
                        <textarea value={section.description} onChange={e => updateSection(section.id, { description: e.target.value })} className="w-full p-4 bg-white rounded-xl border border-gray-200 h-32 text-sm font-medium leading-relaxed" />
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
