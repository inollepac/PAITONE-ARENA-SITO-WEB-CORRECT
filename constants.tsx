
import { SiteConfig, Court, Event, LogoPlacementConfig } from './types';

const DEFAULT_PLACEMENT: LogoPlacementConfig = {
  enabled: true,
  logoSource: 'primary',
  width: 60,
  height: 60,
  borderRadius: 0,
  borderWidth: 0,
  scale: 1,
  x: 0,
  y: 0,
  objectFit: 'contain',
  showName: true
};

export const INITIAL_SITE_CONFIG: SiteConfig = {
  centerName: 'Paitone Arena',
  primaryLogoUrl: '', 
  secondaryLogoUrl: '',
  
  navbarLogo: { ...DEFAULT_PLACEMENT, width: 60, height: 60, showName: true },
  heroLogo: { ...DEFAULT_PLACEMENT, enabled: false, width: 150, height: 100, borderRadius: 10, showName: false },
  footerLogo: { ...DEFAULT_PLACEMENT, width: 50, height: 50, showName: true },
  
  primaryColor: '#4E5B83',
  accentColor: '#A8D38E',
  heroTitle: 'Gioca. Impara. Stacca.',
  heroSubtitle: 'L’arena dove il relax incontra la competenza tecnica. Tennis e Padel guidati da professionisti laureati e certificati federali.',
  heroVideoUrl: '',
  heroImageUrl: 'https://images.unsplash.com/photo-1592709823125-a191f07a2a5e?auto=format&fit=crop&q=80&w=2000',
  address: 'Via Paitone, 1 - Paitone (BS)',
  phone: '+39 030 1234567',
  whatsapp: '+39 333 1234567',
  email: 'info@paitonearena.it',
  workingHours: 'Lun-Dom: 07:30 - 23:30',
  externalBookingUrl: 'https://google.com',
  sections: [
    { id: 'whyUs', navLabel: '', title: 'Perché Paitone Arena?', description: 'Uniamo la scienza del movimento al divertimento dello sport. Per staccare la spina, serve una guida sicura.', enabled: true },
    { id: 'space', navLabel: 'Il nostro spazio', title: 'Un\'arena per ogni sfida.', description: 'Ambienti moderni disegnati sulle forme del divertimento.', enabled: true },
    { id: 'sports', navLabel: 'Tennis & Padel', title: 'Campi nuovi, competenza vera.', description: 'Vieni a giocare in un centro dove l\'unica cosa che conta è divertirsi insieme, imparando i segreti del gioco dai migliori esperti.', enabled: true },
    { id: 'courses', navLabel: 'Corsi', title: 'L’eccellenza nell’insegnamento.', description: 'Percorsi formativi basati su studi universitari e metodologie federali d’avanguardia.', enabled: true },
    { id: 'community', navLabel: 'Community', title: 'Oltre il rettangolo di gioco.', description: 'Eventi, tornei e momenti di aggregazione che fanno la differenza.', enabled: true },
    { id: 'booking', navLabel: 'Prenota', title: 'Prenotazione Istantanea', description: 'Entra in campo con un semplice click.', enabled: true },
    { id: 'contacts', navLabel: 'Contatti', title: 'Sempre a tua disposizione.', description: 'Hai domande? Il nostro team è pronto ad aiutarti.', enabled: true },
    { id: 'staff', navLabel: '', title: 'Esperti del Movimento', description: 'Passione sportiva supportata da percorsi accademici e federali.', enabled: true },
  ]
};

export const INITIAL_COURTS: Court[] = [
  { id: 'c1', name: 'Arena Padel 1', type: 'Padel', surface: 'Sintetico Pro Blu', pricePerHour: 44 },
  { id: 'c2', name: 'Arena Padel 2', type: 'Padel', surface: 'Sintetico Pro Blu', pricePerHour: 44 },
  { id: 'c3', name: 'Campo Tennis 1', type: 'Tennis', surface: 'Terra Rossa Mantoflex', pricePerHour: 28 },
  { id: 'c4', name: 'Campo Tennis 2', type: 'Tennis', surface: 'Resina Comfort', pricePerHour: 22 },
];

export const INITIAL_EVENTS: Event[] = [
  { id: 'e1', title: 'Open Day Tecnico', date: '2025-06-10', description: 'Test biomeccanico gratuito e prova dei corsi con i nostri laureati.', type: 'Course' },
  { id: 'e2', title: 'Master Arena Cup', date: '2025-07-05', description: 'Il torneo di Padel più atteso della stagione.', type: 'Tournament' },
  { id: 'e3', title: 'Academy Junior', date: 'Ogni Lunedì', description: 'Sviluppo motorio e tecnico per i piccoli campioni.', type: 'Course' },
];
