
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

export interface SiteConfig {
  centerName: string;
  logoUrl: string; 
  logoBorderRadius: number; // Valore 0-100 per controllo totale della forma
  logoWidth: number;
  logoScale: number;
  logoX: number;
  logoY: number;
  hideCenterName: boolean; 
  showLogoInHero: boolean;  // Nuova posizione: Hero
  showLogoInNavbar: boolean; // Nuova posizione: Navbar
  showLogoInFooter: boolean; // Nuova posizione: Footer
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
