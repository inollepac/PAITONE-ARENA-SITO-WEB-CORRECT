
import React from 'react';

const CoursesPage: React.FC = () => {
  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
        <div>
            <span className="text-emerald-600 font-bold tracking-widest uppercase text-sm mb-4 block">Impara con noi</span>
            <h1 className="text-5xl font-extrabold mb-6">Qui si impara divertendosi.</h1>
            <p className="text-xl text-gray-500 leading-relaxed">
              Dalla scuola tennis per bambini ai corsi intensivi per adulti che vogliono scalare la classifica. I nostri maestri certificati ti seguiranno passo dopo passo.
            </p>
        </div>
        <img src="https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?auto=format&fit=crop&q=80&w=1000" className="rounded-[40px] shadow-2xl h-96 w-full object-cover" alt="Course" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
              { title: 'Adulti', subtitle: 'Da principianti a PRO', features: ['Lezioni individuali', 'Corsi collettivi (max 4)', 'Analisi video'], color: 'emerald' },
              { title: 'Bambini & Ragazzi', subtitle: 'Scuola Tennis & Padel', features: ['Approccio ludico', 'Preparazione fisica', 'Tornei dedicati'], color: 'blue' },
              { title: 'Intensivi Weekend', subtitle: 'Clinic di 2 giorni', features: ['Tattica di gioco', 'Tecnica avanzata', 'Match commentati'], color: 'purple' }
          ].map((item, i) => (
              <div key={i} className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition flex flex-col">
                  <h3 className="text-2xl font-bold mb-1">{item.title}</h3>
                  <p className="text-emerald-600 font-semibold mb-8">{item.subtitle}</p>
                  <ul className="space-y-4 mb-10 flex-grow">
                      {item.features.map((f, j) => (
                          <li key={j} className="flex items-center gap-3 text-gray-600">
                              <i className="fas fa-check-circle text-emerald-500"></i> {f}
                          </li>
                      ))}
                  </ul>
                  <button className="w-full py-4 rounded-2xl bg-gray-900 text-white font-bold hover:bg-emerald-600 transition">
                      Richiedi info
                  </button>
              </div>
          ))}
      </div>
    </div>
  );
};

export default CoursesPage;
