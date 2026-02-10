
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

export type LogoShape = 'circle' | 'square' | 'rounded';
export type LogoSize = 'sm' | 'md' | 'lg';

export interface SiteConfig {
  centerName: string;
  logoUrl: string; 
  logoShape: LogoShape;
  logoSize: LogoSize;
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
