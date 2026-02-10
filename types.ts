
export interface Court {
  id: string;
  name: string;
  type: 'Tennis' | 'Padel';
  surface: string;
  pricePerHour: number;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  type: 'Tournament' | 'Social' | 'Course';
}

export interface SectionContent {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  enabled: boolean;
  navLabel: string;
  isCustom?: boolean;
  showLogo?: boolean; // Opzione per mostrare il logo nella sezione
}

export type LogoShape = 'circle' | 'square' | 'rounded';

export interface SiteConfig {
  centerName: string;
  logoUrl: string; 
  logoShape: LogoShape;
  logoWidth: number; // Dimensione libera in pixel
  logoScale: number; // Zoom dell'immagine dentro il frame
  logoX: number;     // Posizionamento X dell'immagine
  logoY: number;     // Posizionamento Y dell'immagine
  primaryColor: string; // Colore Blue personalizzabile
  accentColor: string;  // Colore Green personalizzabile
  heroTitle: string;
  heroSubtitle: string;
  heroVideoUrl: string;
  heroImageUrl: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  workingHours: string;
  externalBookingUrl: string;
  sections: SectionContent[]; 
}

export interface Slot {
  time: string;
  available: boolean;
  courtId: string;
}

export type Page = string;
