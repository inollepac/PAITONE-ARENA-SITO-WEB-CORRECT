
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
}

export interface SiteConfig {
  centerName: string;
  logoUrl: string;
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
  // Dynamic Section Management
  sections: {
    space: SectionContent;
    sports: SectionContent;
    courses: SectionContent;
    community: SectionContent;
    contacts: SectionContent;
    booking: SectionContent;
    whyUs: SectionContent; // Home-only section
    staff: SectionContent; // Home-only section
  };
}

export interface Slot {
  time: string;
  available: boolean;
  courtId: string;
}

export type Page = 'home' | 'space' | 'sports' | 'courses' | 'community' | 'booking' | 'contacts' | 'admin';
