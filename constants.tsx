
import { SiteConfig, Court, Event } from './types';

export const INITIAL_SITE_CONFIG: SiteConfig = {
  centerName: 'Paitone Arena',
  logoUrl: 'https://i.imgur.com/your_logo_url_here.png', // Placeholder for the uploaded image
  heroTitle: 'Gioca. Incontra. Rilassati.',
  heroSubtitle: 'Tennis e padel: l\'esperienza di sport e socialità firmata Paitone Arena.',
  heroVideoUrl: '',
  heroImageUrl: 'https://images.unsplash.com/photo-1592709823125-a191f07a2a5e?auto=format&fit=crop&q=80&w=2000',
  address: 'Via Paitone, 1 - Paitone (BS)',
  phone: '+39 030 1234567',
  whatsapp: '+39 333 1234567',
  email: 'info@paitonearena.it',
  workingHours: 'Lun-Dom: 07:30 - 23:30',
  externalBookingUrl: 'https://google.com',
  sections: {
    whyUs: { id: 'whyUs', navLabel: '', title: 'Perché Paitone Arena?', description: 'La nostra visione: lo sport come ponte tra persone e benessere.', enabled: true },
    space: { id: 'space', navLabel: 'Il nostro spazio', title: 'Un\'arena per ogni sfida.', description: 'Ambienti moderni disegnati sulle forme del divertimento.', enabled: true },
    sports: { id: 'sports', navLabel: 'Tennis & Padel', title: 'Campi nuovi, zero pensieri.', description: 'Vieni a giocare in un centro nuovo dove l\'unica cosa che conta è divertirsi insieme, senza pressioni e in totale relax.', enabled: true },
    courses: { id: 'courses', navLabel: 'Corsi', title: 'Migliora divertendoti.', description: 'Percorsi formativi per tutti i livelli, dai primi passi ai match più intensi.', enabled: true },
    community: { id: 'community', navLabel: 'Community', title: 'Oltre il rettangolo di gioco.', description: 'Eventi, tornei e momenti di aggregazione che fanno la differenza.', enabled: true },
    booking: { id: 'booking', navLabel: 'Prenota', title: 'Prenotazione Istantanea', description: 'Entra in campo con un semplice click.', enabled: true },
    contacts: { id: 'contacts', navLabel: 'Contatti', title: 'Sempre a tua disposizione.', description: 'Hai domande? Il nostro team è pronto ad aiutarti.', enabled: true },
    staff: { id: 'staff', navLabel: '', title: 'Il team Paitone Arena', description: 'Passione e semplicità al servizio del tuo sport.', enabled: true },
  }
};

export const INITIAL_COURTS: Court[] = [
  { id: 'c1', name: 'Arena Padel 1', type: 'Padel', surface: 'Sintetico Pro Blu', pricePerHour: 44 },
  { id: 'c2', name: 'Arena Padel 2', type: 'Padel', surface: 'Sintetico Pro Blu', pricePerHour: 44 },
  { id: 'c3', name: 'Campo Tennis 1', type: 'Tennis', surface: 'Terra Rossa Mantoflex', pricePerHour: 28 },
  { id: 'c4', name: 'Campo Tennis 2', type: 'Tennis', surface: 'Resina Comfort', pricePerHour: 22 },
];

export const INITIAL_EVENTS: Event[] = [
  { id: 'e1', title: 'Open Day Paitone', date: '2025-06-10', description: 'Prova i nostri campi gratuitamente e incontra i maestri.', type: 'Social' },
  { id: 'e2', title: 'Master Arena Cup', date: '2025-07-05', description: 'Il torneo di Padel più atteso della stagione.', type: 'Tournament' },
  { id: 'e3', title: 'Paitone Junior Camp', date: 'Ogni Lunedì', description: 'Dedicato ai futuri campioni del tennis e padel.', type: 'Course' },
];
