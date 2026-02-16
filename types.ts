
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

export interface SectionElement {
  id: string;
  type: 'text' | 'image' | 'logo';
  content: string; // Testo o URL/Base64 immagine
  label?: string; // Etichetta opzionale (es. didascalia)
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
  elements?: SectionElement[]; // Lista di elementi aggiuntivi (immagini, didascalie, loghi)
}

export interface LogoPlacementConfig {
  enabled: boolean;
  logoSource: 'primary' | 'secondary';
  width: number;
  height: number;
  borderRadius: number; 
  borderWidth: number; 
  scale: number;
  x: number;
  y: number;
  objectFit: 'cover' | 'contain';
  showName: boolean; 
}

export interface SiteConfig {
  centerName: string;
  primaryLogoUrl: string; 
  secondaryLogoUrl: string;
  
  navbarLogo: LogoPlacementConfig;
  heroLogo: LogoPlacementConfig;
  footerLogo: LogoPlacementConfig;
  
  primaryColor: string;
  accentColor: string;
  heroTitle: string;
  heroSubtitle: string;
  heroVideoUrl: string;
  heroImageUrl: string;
  
  sportsImageUrl: string;
  tennisImageUrl: string;
  padelImageUrl: string;
  communityImageUrl: string;
  spaceImageUrls: string[]; 
  
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
