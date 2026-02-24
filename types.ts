
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
  content: string; 
  style?: {
    width?: string;
    height?: string;
    rotation?: number;
    opacity?: number;
    borderRadius?: string;
    shadow?: string;
    color?: string;
    fontSize?: string;
    fontWeight?: string | number;
    lineHeight?: string | number;
    textShadow?: string;
    textAlign?: 'left' | 'center' | 'right';
    x?: number;
    y?: number;
    zIndex?: number;
    scale?: number;
    brightness?: number;
    contrast?: number;
    grayscale?: number;
    sepia?: number;
    blur?: number;
    hueRotate?: number;
    saturate?: number;
    invert?: number;
    borderWidth?: number;
    borderColor?: string;
    hoverEffect?: 'none' | 'zoom' | 'lift' | 'brighten';
    aspectRatio?: string;
    objectFit?: 'cover' | 'contain' | 'fill' | 'none';
    /* Advanced styling properties */
    letterSpacing?: string;
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    fontStyle?: 'normal' | 'italic';
    padding?: string;
    backgroundColor?: string;
    imageZoom?: number;
    objectX?: number;
    objectY?: number;
  };
}

export interface SectionStyle {
  variant: 'glass' | 'solid' | 'transparent' | 'dark' | 'brand' | 'image-bg' | 'custom';
  shape: 'rounded' | 'sharp' | 'pill' | 'oval' | 'arc-top' | 'arc-bottom';
  padding: 'none' | 'small' | 'medium' | 'large' | 'huge';
  width: 'narrow' | 'contained' | 'full';
  shadow: 'none' | 'soft' | 'medium' | 'heavy' | 'extra';
  borderWidth: number;
  borderColor: string;
  bgColor?: string;
  bgGradient?: string;
  bgImageUrl?: string;
  bgOpacity?: number;
  parallax?: boolean;
}

export interface SectionContent {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  navLabel: string;
  isCustom?: boolean;
  elements?: SectionElement[];
  style?: SectionStyle;
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
  rotation?: number;
  filter?: string;
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
  heroBgOpacity: number;
  sportsImageUrl: string;
  tennisImageUrl: string;
  padelImageUrl: string;
  communityImageUrl: string;
  spaceImageUrls: string[]; 
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  workingHours: string;
  externalBookingUrl: string;
  sections: SectionContent[]; 
}

export type Page = string;
