
import React from 'react';
import { SiteConfig } from '../types';

const CoursesPage: React.FC<{
  config: SiteConfig;
  isEditMode: boolean;
  onUpdateConfig: (config: SiteConfig) => void;
}> = ({ config, isEditMode, onUpdateConfig }) => {
  const updateCoursesPage = (updates: Partial<SiteConfig['coursesPage']>) => {
    onUpdateConfig({
      ...config,
      coursesPage: { ...config.coursesPage, ...updates }
    });
  };

  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
        <div className="space-y-6">
            <span className="text-brand-green font-black tracking-[0.4em] uppercase text-xs mb-4 block">Competenza Scientifica</span>
            {isEditMode ? (
              <div className="space-y-4">
                <input 
                  value={config.coursesPage.title}
                  onChange={e => updateCoursesPage({ title: e.target.value })}
                  className="w-full text-6xl font-black uppercase tracking-tighter text-brand-blue italic leading-[0.9] bg-brand-blue/5 border-2 border-brand-green rounded-2xl p-4 outline-none"
                />
                <textarea 
                  value={config.coursesPage.subtitle}
                  onChange={e => updateCoursesPage({ subtitle: e.target.value })}
                  className="w-full text-xl text-brand-blue/60 leading-relaxed font-medium italic border-l-4 border-brand-green pl-6 bg-brand-blue/5 outline-none h-32"
                />
              </div>
            ) : (
              <>
                <h1 className="text-6xl font-black uppercase tracking-tighter text-brand-blue italic leading-[0.9]">{config.coursesPage.title}</h1>
                <p className="text-xl text-brand-blue/60 leading-relaxed font-medium italic border-l-4 border-brand-green pl-6">
                  {config.coursesPage.subtitle}
                </p>
              </>
            )}
        </div>
        <div className="relative group">
          <img src={config.coursesPage.imageUrl} className="rounded-[4rem] shadow-2xl h-96 w-full object-cover border-4 border-brand-green/20" alt="Course" />
          {isEditMode && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-[4rem] opacity-0 group-hover:opacity-100 transition-opacity">
              <input 
                type="text" 
                value={config.coursesPage.imageUrl} 
                onChange={e => updateCoursesPage({ imageUrl: e.target.value })}
                className="w-3/4 p-2 rounded-lg text-xs"
                placeholder="URL Immagine..."
              />
            </div>
          )}
        </div>
      </div>

      <div className="mb-24 bg-brand-blue p-12 md:p-20 rounded-[5rem] text-white relative overflow-hidden">
          <div className="circle-accent w-64 h-64 -top-32 -right-32"></div>
          <div className="relative z-10 max-w-3xl">
              {isEditMode ? (
                <input 
                  value={config.coursesPage.methodTitle}
                  onChange={e => updateCoursesPage({ methodTitle: e.target.value })}
                  className="text-4xl font-black uppercase italic mb-8 bg-white/10 border-2 border-brand-green rounded-xl p-2 outline-none w-full"
                />
              ) : (
                <h2 className="text-4xl font-black uppercase italic mb-8">{config.coursesPage.methodTitle}</h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                      {isEditMode ? (
                        <div className="space-y-4">
                          <input 
                            value={config.coursesPage.methodBaseTitle}
                            onChange={e => updateCoursesPage({ methodBaseTitle: e.target.value })}
                            className="text-brand-green font-black uppercase tracking-widest text-sm mb-4 bg-white/10 border border-brand-green/30 rounded-lg p-1 outline-none w-full"
                          />
                          <textarea 
                            value={config.coursesPage.methodBaseDesc}
                            onChange={e => updateCoursesPage({ methodBaseDesc: e.target.value })}
                            className="text-white/60 text-sm leading-relaxed bg-white/10 border border-brand-green/30 rounded-lg p-2 outline-none w-full h-24"
                          />
                        </div>
                      ) : (
                        <>
                          <h4 className="text-brand-green font-black uppercase tracking-widest text-sm mb-4">{config.coursesPage.methodBaseTitle}</h4>
                          <p className="text-white/60 text-sm leading-relaxed">{config.coursesPage.methodBaseDesc}</p>
                        </>
                      )}
                  </div>
                  <div>
                      {isEditMode ? (
                        <div className="space-y-4">
                          <input 
                            value={config.coursesPage.methodFocusTitle}
                            onChange={e => updateCoursesPage({ methodFocusTitle: e.target.value })}
                            className="text-brand-green font-black uppercase tracking-widest text-sm mb-4 bg-white/10 border border-brand-green/30 rounded-lg p-1 outline-none w-full"
                          />
                          <textarea 
                            value={config.coursesPage.methodFocusDesc}
                            onChange={e => updateCoursesPage({ methodFocusDesc: e.target.value })}
                            className="text-white/60 text-sm leading-relaxed bg-white/10 border border-brand-green/30 rounded-lg p-2 outline-none w-full h-24"
                          />
                        </div>
                      ) : (
                        <>
                          <h4 className="text-brand-green font-black uppercase tracking-widest text-sm mb-4">{config.coursesPage.methodFocusTitle}</h4>
                          <p className="text-white/60 text-sm leading-relaxed">{config.coursesPage.methodFocusDesc}</p>
                        </>
                      )}
                  </div>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
              { title: 'Adulti Technical', subtitle: 'Competenza e Risultati', features: ['Dottori in Scienze Motorie', 'Correzione Biomeccanica', 'Video Analisi Pro'], color: 'brand-green' },
              { title: 'Kids & Junior', subtitle: 'Crescita Motoria Armonica', features: ['Sviluppo Coordinativo', 'Psicomotricità e Gioco', 'Maestri Certificati'], color: 'brand-blue' },
              { title: 'Clinic Weekend', subtitle: 'Full Immersion Tecnica', features: ['Tattica Applicata', 'Strategie di Match', 'Sessioni di Teoria Tecnica'], color: 'brand-green' }
          ].map((item, i) => (
              <div key={i} className="bg-white p-10 rounded-[40px] border border-brand-green/5 shadow-xl hover:shadow-2xl transition-all flex flex-col group">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-brand-blue mb-1">{item.title}</h3>
                  <p className="text-brand-green font-black uppercase tracking-widest text-[10px] mb-8">{item.subtitle}</p>
                  <ul className="space-y-4 mb-10 flex-grow">
                      {item.features.map((f, j) => (
                          <li key={j} className="flex items-center gap-3 text-brand-blue/60 text-sm font-bold">
                              <i className="fas fa-check-circle text-brand-green"></i> {f}
                          </li>
                      ))}
                  </ul>
                  <button className="w-full py-5 rounded-2xl bg-brand-blue text-white font-black uppercase tracking-widest text-xs hover:bg-brand-green hover:text-brand-blue transition-all shadow-lg group-hover:scale-105">
                      Richiedi info tecniche
                  </button>
              </div>
          ))}
      </div>
    </div>
  );
};

export default CoursesPage;
