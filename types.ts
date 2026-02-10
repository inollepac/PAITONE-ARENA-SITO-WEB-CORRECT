
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

export interface LogoPlacementConfig {
  enabled: boolean;
  width: number;
  height: number;
  borderRadius: number;
  scale: number;
  x: number;
  y: number;
  objectFit: 'cover' | 'contain'; // 'contain' per non tagliare mai il logo, 'cover' per riempire
  showName: boolean; // Se mostrare il nome del centro accanto al logo in quel punto
}

export interface SiteConfig {
  centerName: string;
  logoUrl: string; 
  // Configurazioni specifiche per punto di inserimento
  navbarLogo: LogoPlacementConfig;
  heroLogo: LogoPlacementConfig;
  footerLogo: LogoPlacementConfig;
  
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
