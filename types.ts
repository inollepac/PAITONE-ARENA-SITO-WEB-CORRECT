
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
  logoSource: 'primary' | 'secondary'; // Scelta tra i due loghi caricati
  width: number;
  height: number;
  borderRadius: number; // 0 per rettangoli, 50 per cerchi/ovali
  borderWidth: number;  // 0 per rimuovere il contorno
  scale: number;
  x: number;
  y: number;
  objectFit: 'cover' | 'contain';
  showName: boolean; // Toggle per il nome testuale del brand
}

export interface SiteConfig {
  centerName: string;
  primaryLogoUrl: string;   // Logo principale
  secondaryLogoUrl: string; // Secondo logo opzionale
  
  navbarLogo: LogoPlacementConfig;
  heroLogo: LogoPlacementConfig;
  footerLogo: LogoPlacementConfig;
  
  primaryColor: string;
  accentColor: string;
  heroTitle: string;
  heroSubtitle: string;
  heroVideoUrl: string;
  heroImageUrl: string;
  
  // Immagini Sezioni
  sportsImageUrl: string;
  tennisImageUrl: string;
  padelImageUrl: string;
  communityImageUrl: string;
  spaceImageUrls: string[]; // Grid immagini "Il nostro spazio"
  
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
