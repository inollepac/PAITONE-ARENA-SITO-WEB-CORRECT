
import React from 'react';
import { SiteConfig, Court } from '../types';

const SportsPage: React.FC<{ 
  config: SiteConfig; 
  courts: Court[];
  isEditMode: boolean;
  onUpdateConfig: (config: SiteConfig) => void;
}> = ({ config, courts, isEditMode, onUpdateConfig }) => {
  const updateSportsPage = (updates: Partial<SiteConfig['sportsPage']>) => {
    onUpdateConfig({
      ...config,
      sportsPage: { ...config.sportsPage, ...updates }
    });
  };

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-20">
            {isEditMode ? (
              <div className="space-y-4">
                <input 
                  value={config.sportsPage.title}
                  onChange={e => updateSportsPage({ title: e.target.value })}
                  className="w-full text-5xl font-black uppercase italic text-center bg-brand-blue/5 border-2 border-brand-green rounded-2xl p-4 text-brand-blue outline-none"
                />
                <textarea 
                  value={config.sportsPage.subtitle}
                  onChange={e => updateSportsPage({ subtitle: e.target.value })}
                  className="w-full text-xl text-brand-blue/60 italic text-center bg-brand-blue/5 border-2 border-brand-green rounded-2xl p-4 outline-none h-32"
                />
              </div>
            ) : (
              <>
                <h1 className="text-5xl font-black mb-6 uppercase tracking-tighter text-brand-blue italic">{config.sportsPage.title}</h1>
                <p className="text-xl text-brand-blue/60 max-w-3xl mx-auto italic font-medium">
                  {config.sportsPage.subtitle}
                </p>
              </>
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Tennis Section */}
            <div className="space-y-8">
                <div className="relative h-96 rounded-[40px] overflow-hidden group shadow-2xl">
                    <img src={config.tennisImageUrl} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt="Tennis" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/90 via-transparent to-transparent flex items-end p-10">
                        <h2 className="text-4xl font-black text-white uppercase italic">Tennis</h2>
                    </div>
                </div>
                <div className="space-y-4">
                    {isEditMode ? (
                      <div className="space-y-4">
                        <input 
                          value={config.sportsPage.tennisTitle}
                          onChange={e => updateSportsPage({ tennisTitle: e.target.value })}
                          className="w-full text-2xl font-black uppercase tracking-tight text-brand-blue bg-brand-blue/5 border-2 border-brand-green rounded-xl p-2 outline-none"
                        />
                        <textarea 
                          value={config.sportsPage.tennisDescription}
                          onChange={e => updateSportsPage({ tennisDescription: e.target.value })}
                          className="w-full text-brand-blue/60 italic font-medium bg-brand-blue/5 border-2 border-brand-green rounded-xl p-2 outline-none h-24"
                        />
                      </div>
                    ) : (
                      <>
                        <h3 className="text-2xl font-black uppercase tracking-tight text-brand-blue">{config.sportsPage.tennisTitle}</h3>
                        <p className="text-brand-blue/60 italic font-medium">{config.sportsPage.tennisDescription}</p>
                      </>
                    )}
                    <ul className="grid grid-cols-2 gap-4">
                        {courts.filter(c => c.type === 'Tennis').map(c => (
                            <li key={c.id} className="p-4 bg-white rounded-2xl border border-brand-green/10 shadow-sm transition hover:shadow-md">
                                <span className="font-bold block text-brand-blue uppercase tracking-tight text-sm">{c.name}</span>
                                <span className="text-[10px] text-brand-green font-black uppercase tracking-widest">{c.surface}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Padel Section */}
            <div className="space-y-8">
                <div className="relative h-96 rounded-[40px] overflow-hidden group shadow-2xl">
                    <img src={config.padelImageUrl} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt="Padel" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-green/80 via-transparent to-transparent flex items-end p-10">
                        <h2 className="text-4xl font-black text-brand-blue uppercase italic">Padel</h2>
                    </div>
                </div>
                <div className="space-y-4">
                    {isEditMode ? (
                      <div className="space-y-4">
                        <input 
                          value={config.sportsPage.padelTitle}
                          onChange={e => updateSportsPage({ padelTitle: e.target.value })}
                          className="w-full text-2xl font-black uppercase tracking-tight text-brand-blue bg-brand-blue/5 border-2 border-brand-green rounded-xl p-2 outline-none"
                        />
                        <textarea 
                          value={config.sportsPage.padelDescription}
                          onChange={e => updateSportsPage({ padelDescription: e.target.value })}
                          className="w-full text-brand-blue/60 italic font-medium bg-brand-blue/5 border-2 border-brand-green rounded-xl p-2 outline-none h-24"
                        />
                      </div>
                    ) : (
                      <>
                        <h3 className="text-2xl font-black uppercase tracking-tight text-brand-blue">{config.sportsPage.padelTitle}</h3>
                        <p className="text-brand-blue/60 italic font-medium">{config.sportsPage.padelDescription}</p>
                      </>
                    )}
                    <ul className="grid grid-cols-2 gap-4">
                        {courts.filter(c => c.type === 'Padel').map(c => (
                            <li key={c.id} className="p-4 bg-white rounded-2xl border border-brand-green/10 shadow-sm transition hover:shadow-md">
                                <span className="font-bold block text-brand-blue uppercase tracking-tight text-sm">{c.name}</span>
                                <span className="text-[10px] text-brand-green font-black uppercase tracking-widest">{c.surface}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>

        <div className="mt-24 bg-brand-green/10 rounded-[50px] p-12 text-center border border-brand-green/20 shadow-inner">
            {isEditMode ? (
              <div className="space-y-4">
                <input 
                  value={config.sportsPage.footerTitle}
                  onChange={e => updateSportsPage({ footerTitle: e.target.value })}
                  className="w-full text-3xl font-black uppercase tracking-tighter text-brand-blue mb-4 italic bg-brand-blue/5 border-2 border-brand-green rounded-xl p-2 outline-none text-center"
                />
                <textarea 
                  value={config.sportsPage.footerDescription}
                  onChange={e => updateSportsPage({ footerDescription: e.target.value })}
                  className="w-full text-brand-blue/60 max-w-2xl mx-auto mb-8 font-medium italic bg-brand-blue/5 border-2 border-brand-green rounded-xl p-2 outline-none h-24 text-center"
                />
              </div>
            ) : (
              <>
                <h3 className="text-3xl font-black uppercase tracking-tighter text-brand-blue mb-4 italic">{config.sportsPage.footerTitle}</h3>
                <p className="text-brand-blue/60 max-w-2xl mx-auto mb-8 font-medium italic">
                  {config.sportsPage.footerDescription}
                </p>
              </>
            )}
            <button className="bg-brand-blue text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-sm shadow-xl hover:bg-brand-green hover:text-brand-blue transition-all active:scale-95">
                Vieni a trovarci
            </button>
        </div>
      </div>
    </div>
  );
};

export default SportsPage;
