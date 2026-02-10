
import React, { useState } from 'react';
import { SiteConfig, Court, Event, SectionContent } from '../types';

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
  const [tempCourts, setTempCourts] = useState(courts);
  const [tempEvents, setTempEvents] = useState(events);

  const handleSaveAll = () => {
    onUpdateConfig(tempConfig);
    onUpdateCourts(tempCourts);
    onUpdateEvents(tempEvents);
    alert('Tutte le modifiche sono state salvate con successo!');
  };

  const updateSection = (key: keyof SiteConfig['sections'], updates: Partial<SectionContent>) => {
    setTempConfig({
      ...tempConfig,
      sections: {
        ...tempConfig.sections,
        [key]: { ...tempConfig.sections[key], ...updates }
      }
    });
  };

  const addCourt = () => {
    const newCourt: Court = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Nuovo Campo',
      type: 'Padel',
      surface: 'Erba Sintetica',
      pricePerHour: 40
    };
    setTempCourts([...tempCourts, newCourt]);
  };

  const removeCourt = (id: string) => {
    setTempCourts(tempCourts.filter(c => c.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-bold text-gray-800">Pannello di Controllo</h2>
          <p className="text-gray-500">Gestisci ogni aspetto del tuo centro sportivo.</p>
        </div>
        <div className="flex gap-4">
            <button 
                onClick={handleSaveAll}
                className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-700 transition shadow-lg flex items-center gap-2"
            >
                <i className="fas fa-save"></i> Salva Tutto
            </button>
            <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-full font-bold text-sm flex items-center">
              <i className="fas fa-user-shield mr-2"></i> Admin
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar Nav */}
        <div className="space-y-2">
          {[
            { id: 'general', icon: 'fa-info-circle', label: 'Info & Contatti' },
            { id: 'brand', icon: 'fa-brush', label: 'Brand & Logo' },
            { id: 'sections', icon: 'fa-layer-group', label: 'Menù & Sezioni' },
            { id: 'courts', icon: 'fa-table-tennis', label: 'Gestione Campi' },
            { id: 'events', icon: 'fa-calendar-alt', label: 'Eventi & Community' },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full text-left px-6 py-4 rounded-2xl font-bold transition flex items-center gap-3 ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50 border border-transparent hover:border-emerald-100'}`}
            >
              <i className={`fas ${tab.icon} w-6`}></i> {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-gray-100 min-h-[600px]">
          
          {/* Info & Contatti */}
          {activeTab === 'general' && (
            <div className="space-y-8">
              <h3 className="text-2xl font-bold border-b pb-4">Informazioni Centro</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-500 mb-2">Nome Centro Sportivo</label>
                  <input 
                    type="text" 
                    value={tempConfig.centerName} 
                    onChange={e => setTempConfig({...tempConfig, centerName: e.target.value})}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-2">Indirizzo</label>
                  <input type="text" value={tempConfig.address} onChange={e => setTempConfig({...tempConfig, address: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-2">Orari di Apertura</label>
                  <input type="text" value={tempConfig.workingHours} onChange={e => setTempConfig({...tempConfig, workingHours: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-2">WhatsApp</label>
                  <input type="text" value={tempConfig.whatsapp} onChange={e => setTempConfig({...tempConfig, whatsapp: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-2">Email</label>
                  <input type="email" value={tempConfig.email} onChange={e => setTempConfig({...tempConfig, email: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>
            </div>
          )}

          {/* Brand & Logo */}
          {activeTab === 'brand' && (
            <div className="space-y-8">
              <h3 className="text-2xl font-bold border-b pb-4">Identità Visiva</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-2">URL Logo (Immagine tonda in alto)</label>
                  <div className="flex gap-4 items-center">
                    <img src={tempConfig.logoUrl} className="w-16 h-16 rounded-full object-cover border-2 border-emerald-100" />
                    <input 
                        type="text" 
                        value={tempConfig.logoUrl} 
                        onChange={e => setTempConfig({...tempConfig, logoUrl: e.target.value})}
                        className="flex-grow p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500" 
                        placeholder="https://percorso-immagine.jpg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-2">Immagine Hero (Sfondo principale)</label>
                  <input 
                    type="text" 
                    value={tempConfig.heroImageUrl} 
                    onChange={e => setTempConfig({...tempConfig, heroImageUrl: e.target.value})}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500" 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-500 mb-2">Titolo Principale (Hero)</label>
                        <input type="text" value={tempConfig.heroTitle} onChange={e => setTempConfig({...tempConfig, heroTitle: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-500 mb-2">Sottotitolo (Hero)</label>
                        <textarea value={tempConfig.heroSubtitle} onChange={e => setTempConfig({...tempConfig, heroSubtitle: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 h-24" />
                    </div>
                </div>
              </div>
            </div>
          )}

          {/* Menù & Sezioni */}
          {activeTab === 'sections' && (
            <div className="space-y-8">
              <h3 className="text-2xl font-bold border-b pb-4">Visibilità & Navigazione</h3>
              <p className="text-sm text-gray-400 italic">Abilita o disabilita le sezioni dal sito e dal menù. Cambia il nome dei link nel menù.</p>
              
              <div className="space-y-6">
                {Object.entries(tempConfig.sections).map(([id, section]) => (
                  <div key={id} className="p-6 bg-gray-50 rounded-[30px] border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${section.enabled ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                        <h4 className="font-bold text-lg capitalize">{id}</h4>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={section.enabled} 
                          onChange={e => updateSection(id as any, { enabled: e.target.checked })}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {section.navLabel !== undefined && (
                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Etichetta Menù</label>
                          <input 
                            type="text" 
                            value={section.navLabel} 
                            onChange={e => updateSection(id as any, { navLabel: e.target.value })}
                            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm"
                            disabled={!section.enabled}
                          />
                        </div>
                      )}
                      <div className={section.navLabel === undefined ? 'md:col-span-2' : ''}>
                        <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Titolo Sezione</label>
                        <input 
                          type="text" 
                          value={section.title} 
                          onChange={e => updateSection(id as any, { title: e.target.value })}
                          className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm"
                          disabled={!section.enabled}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Descrizione Sezione</label>
                        <textarea 
                          value={section.description} 
                          onChange={e => updateSection(id as any, { description: e.target.value })}
                          className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm h-20"
                          disabled={!section.enabled}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Courts */}
          {activeTab === 'courts' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center border-b pb-4">
                <h3 className="text-2xl font-bold">I tuoi campi</h3>
                <button 
                  onClick={addCourt}
                  className="bg-emerald-100 text-emerald-600 px-4 py-2 rounded-xl font-bold hover:bg-emerald-200 transition"
                >
                  <i className="fas fa-plus mr-2"></i> Aggiungi Campo
                </button>
              </div>
              <div className="space-y-4">
                {tempCourts.map((court, idx) => (
                  <div key={court.id} className="p-6 border rounded-[30px] flex flex-wrap md:flex-nowrap items-center gap-4 bg-gray-50 border-gray-100">
                    <div className="w-full md:w-1/4">
                      <label className="text-xs font-bold text-gray-400 block mb-1 uppercase">Nome</label>
                      <input 
                        type="text" 
                        value={court.name}
                        onChange={e => {
                          const newC = [...tempCourts];
                          newC[idx].name = e.target.value;
                          setTempCourts(newC);
                        }}
                        className="w-full p-3 bg-white border border-gray-100 rounded-xl text-sm"
                      />
                    </div>
                    <div className="w-1/2 md:w-1/6">
                      <label className="text-xs font-bold text-gray-400 block mb-1 uppercase">Tipo</label>
                      <select 
                        value={court.type}
                        onChange={e => {
                          const newC = [...tempCourts];
                          newC[idx].type = e.target.value as 'Padel' | 'Tennis';
                          setTempCourts(newC);
                        }}
                        className="w-full p-3 bg-white border border-gray-100 rounded-xl text-sm"
                      >
                        <option>Padel</option>
                        <option>Tennis</option>
                      </select>
                    </div>
                    <div className="w-1/2 md:w-1/4">
                      <label className="text-xs font-bold text-gray-400 block mb-1 uppercase">Prezzo (€/h)</label>
                      <input 
                        type="number" 
                        value={court.pricePerHour}
                        onChange={e => {
                          const newC = [...tempCourts];
                          newC[idx].pricePerHour = Number(e.target.value);
                          setTempCourts(newC);
                        }}
                        className="w-full p-3 bg-white border border-gray-100 rounded-xl text-sm"
                      />
                    </div>
                    <div className="flex-grow"></div>
                    <button 
                      onClick={() => removeCourt(court.id)}
                      className="w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Events */}
          {activeTab === 'events' && (
            <div className="space-y-8">
                <h3 className="text-2xl font-bold border-b pb-4">Gestione Community</h3>
                <div className="space-y-4">
                  {tempEvents.map((ev, idx) => (
                    <div key={ev.id} className="p-6 border border-gray-100 rounded-[30px] bg-gray-50 flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-grow">
                          <label className="text-xs font-bold text-gray-400 block mb-1 uppercase">Titolo Evento</label>
                          <input 
                            className="font-bold bg-white w-full p-3 rounded-xl border border-gray-100" 
                            value={ev.title} 
                            onChange={e => {
                              const newEv = [...tempEvents];
                              newEv[idx].title = e.target.value;
                              setTempEvents(newEv);
                            }}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-gray-400 block mb-1 uppercase">Data/Orario</label>
                          <input 
                            className="text-sm text-gray-600 bg-white w-full p-3 rounded-xl border border-gray-100" 
                            value={ev.date} 
                            onChange={e => {
                              const newEv = [...tempEvents];
                              newEv[idx].date = e.target.value;
                              setTempEvents(newEv);
                            }}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-400 block mb-1 uppercase">Tipo</label>
                          <select 
                            className="text-sm text-gray-600 bg-white w-full p-3 rounded-xl border border-gray-100"
                            value={ev.type}
                            onChange={e => {
                              const newEv = [...tempEvents];
                              newEv[idx].type = e.target.value as any;
                              setTempEvents(newEv);
                            }}
                          >
                             <option value="Tournament">Torneo</option>
                             <option value="Social">Socialità</option>
                             <option value="Course">Corso</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                           <label className="text-xs font-bold text-gray-400 block mb-1 uppercase">Descrizione</label>
                           <textarea 
                             className="text-sm text-gray-600 bg-white w-full p-3 rounded-xl border border-gray-100 h-20"
                             value={ev.description}
                             onChange={e => {
                               const newEv = [...tempEvents];
                               newEv[idx].description = e.target.value;
                               setTempEvents(newEv);
                             }}
                           />
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
