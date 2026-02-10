
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
  showLogo?: boolean;
}

export type LogoShape = 'circle' | 'square' | 'rounded' | 'none';

export interface SiteConfig {
  centerName: string;
  logoUrl: string; 
  logoShape: LogoShape;
  logoWidth: number;
  logoScale: number;
  logoX: number;
  logoY: number;
  hideCenterName: boolean; // Se true, mostra solo il logo
  primaryColor: string;
  accentColor: string;
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
