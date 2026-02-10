
import React from 'react';
import { SiteConfig } from '../types';

const ContactsPage: React.FC<{ config: SiteConfig }> = ({ config }) => {
  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
      <div className="text-center mb-20">
          <h1 className="text-5xl font-extrabold mb-6">Siamo qui per te.</h1>
          <p className="text-xl text-gray-500">Scrivici, chiamaci o passa a trovarci per un caffè.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Info cards */}
          <div className="space-y-6">
              <div className="bg-white p-8 rounded-[30px] shadow-sm border border-gray-100 flex items-start gap-6">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 text-xl">
                      <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div>
                      <h4 className="font-bold mb-1">Dove siamo</h4>
                      <p className="text-gray-500 text-sm">{config.address}</p>
                  </div>
              </div>
              <div className="bg-white p-8 rounded-[30px] shadow-sm border border-gray-100 flex items-start gap-6">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 text-xl">
                      <i className="fas fa-phone-alt"></i>
                  </div>
                  <div>
                      <h4 className="font-bold mb-1">Telefono</h4>
                      <p className="text-gray-500 text-sm">{config.phone}</p>
                      <p className="text-emerald-600 text-sm font-bold mt-2">WhatsApp: {config.whatsapp}</p>
                  </div>
              </div>
              <div className="bg-white p-8 rounded-[30px] shadow-sm border border-gray-100 flex items-start gap-6">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 text-xl">
                      <i className="fas fa-clock"></i>
                  </div>
                  <div>
                      <h4 className="font-bold mb-1">Orari</h4>
                      <p className="text-gray-500 text-sm">{config.workingHours}</p>
                  </div>
              </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white p-10 rounded-[40px] shadow-xl border border-gray-100">
              <h3 className="text-2xl font-bold mb-8">Inviaci un messaggio</h3>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
                  <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Nome e Cognome</label>
                      <input type="text" className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500" placeholder="Inserisci il tuo nome" />
                  </div>
                  <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                      <input type="email" className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500" placeholder="la-tua@email.it" />
                  </div>
                  <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Oggetto</label>
                      <select className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500">
                          <option>Informazione Corsi</option>
                          <option>Prenotazione Evento</option>
                          <option>Collaborazioni</option>
                          <option>Altro</option>
                      </select>
                  </div>
                  <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Messaggio</label>
                      <textarea className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 h-32" placeholder="Come possiamo aiutarti?"></textarea>
                  </div>
                  <div className="md:col-span-2">
                      <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition shadow-lg">
                          Invia Richiesta
                      </button>
                  </div>
              </form>
          </div>
      </div>
      
      <div className="mt-20 h-96 bg-gray-200 rounded-[50px] overflow-hidden shadow-inner flex items-center justify-center text-gray-400">
          <div className="text-center">
              <i className="fas fa-map-marked-alt text-6xl mb-4"></i>
              <p className="font-bold">Google Maps Placeholder</p>
              <p className="text-sm">Integrazione mappa reale qui</p>
          </div>
      </div>
    </div>
  );
};

export default ContactsPage;
