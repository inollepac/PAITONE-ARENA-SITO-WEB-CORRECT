
import React from 'react';

const CoursesPage: React.FC = () => {
  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
        <div className="space-y-6">
            <span className="text-brand-green font-black tracking-[0.4em] uppercase text-xs mb-4 block">Competenza Scientifica</span>
            <h1 className="text-6xl font-black uppercase tracking-tighter text-brand-blue italic leading-[0.9]">Impara davvero, staccando tutto.</h1>
            <p className="text-xl text-brand-blue/60 leading-relaxed font-medium italic border-l-4 border-brand-green pl-6">
              Il nostro team è composto da Dottori in Scienze Motorie e Tecnici qualificati dalle federazioni. Non ti insegniamo solo a colpire la pallina: ti insegniamo la biomeccanica del movimento per giocare meglio e più a lungo.
            </p>
        </div>
        <img src="https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?auto=format&fit=crop&q=80&w=1000" className="rounded-[4rem] shadow-2xl h-96 w-full object-cover border-4 border-brand-green/20" alt="Course" />
      </div>

      <div className="mb-24 bg-brand-blue p-12 md:p-20 rounded-[5rem] text-white relative overflow-hidden">
          <div className="circle-accent w-64 h-64 -top-32 -right-32"></div>
          <div className="relative z-10 max-w-3xl">
              <h2 className="text-4xl font-black uppercase italic mb-8">Il "Metodo Arena"</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                      <h4 className="text-brand-green font-black uppercase tracking-widest text-sm mb-4">Base Accademica</h4>
                      <p className="text-white/60 text-sm leading-relaxed">Programmi di allenamento strutturati secondo i più recenti studi universitari sulla fisiologia dell'esercizio e sul coordinamento motorio.</p>
                  </div>
                  <div>
                      <h4 className="text-brand-green font-black uppercase tracking-widest text-sm mb-4">Focus Federale</h4>
                      <p className="text-white/60 text-sm leading-relaxed">Aggiornamento costante con le metodologie delle federazioni di Tennis e Padel per garantire standard tecnici d'eccellenza.</p>
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
