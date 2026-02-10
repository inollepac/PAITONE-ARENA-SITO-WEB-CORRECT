
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
  isCustom?: boolean; // Per distinguere sezioni aggiunte dall'utente
}

export interface SiteConfig {
  centerName: string;
  logoUrl: string; // Manterrà la stringa base64 o l'URL
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
  sections: SectionContent[]; // Trasformato in array per gestione dinamica
}

export interface Slot {
  time: string;
  available: boolean;
  courtId: string;
}

export type Page = string; // Reso stringa per supportare ID di sezioni dinamiche
