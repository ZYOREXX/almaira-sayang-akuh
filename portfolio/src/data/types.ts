import type { IconName } from '../components/Icon';
import type { BrandId } from './brandIcons';

/** A documentation photo. `thumb` is optional (used on cards & tiles). */
export interface Photo {
  src: string;
  thumb?: string;
  alt: string;
  caption: string;
  /** 'contain' for diagrams/scans that must not be cropped. */
  fit?: 'cover' | 'contain';
  /** CSS object-position, e.g. '50% 30%'. */
  position?: string;
}

/** A certificate scan or any standalone image. */
export interface ImageRef {
  src: string;
  thumb?: string;
  alt: string;
  caption?: string;
}

export interface BadgeData {
  icon: IconName;
  label: string;
  detail: string;
}

/** Animated number (counter). `display` overrides the final text. */
export interface CounterData {
  label: string;
  value: number;
  from?: number;
  decimals: number;
  prefix?: string;
  suffix?: string;
  display?: string;
}

export interface HeroStat extends CounterData {
  note: string;
  prestige?: boolean;
}

export interface Pillar {
  icon: IconName;
  title: string;
  body: string;
  tags: string[];
  /** Photo ids from PORTFOLIO_DATA.photos shown inside the card. */
  photos?: string[];
}

export interface Effect {
  outcome: string;
  t: string;
  p: string;
  d: number;
  ngain: number;
  magnitude: string;
}

export interface Publication {
  id: string;
  kind: string;
  venue: string;
  venueFull: string;
  citation?: string;
  authorship: string;
  year: string;
  title: string;
  titleAlt?: string;
  byline: string;
  affiliation: string;
  design: string;
  instruments: string[];
  metrics: CounterData[];
  ci?: { low: number; high: number; estimate: number; resamples: number };
  bayes?: { bf01: number; posteriorMean: number };
  effects?: Effect[];
  finding: string;
  abstract: string[];
  notes: Array<[string, string]>;
  photos?: string[];
}

export interface Spec {
  icon: IconName;
  label: string;
  detail: string;
}

export interface TeamMember {
  name: string;
  unit: string;
  role?: string;
  self?: boolean;
}

export interface GalleryFilter {
  id: string;
  label: string;
}

export interface GalleryItem {
  photo: string;
  category: string;
  /** Tile size in the "All" view: big = 2×2, wide = 2×1, tall = 1×2. */
  span: 'big' | 'wide' | 'tall' | 'normal';
}

export interface Certificate {
  id: string;
  title: string;
  subtitle?: string;
  issuer: string;
  date: string;
  meta?: string;
  category: string;
  icon: IconName;
  /** Short code printed on the summary card when no scan is available. */
  code: string;
  prestige?: boolean;
  prestigeLabel?: string;
  focus?: string;
  /** null = no scan yet → elegant summary card is shown instead. */
  image: ImageRef | null;
  more?: ImageRef[];
}

export interface AdditionalCredential {
  title: string;
  issuer: string;
  date: string;
  images: ImageRef[];
}

export interface ExperienceItem {
  role: string;
  org: string;
  period?: string;
  ongoing?: boolean;
  body: string;
  icon: IconName;
  photo?: string;
}

export interface LeadershipItem {
  org: string;
  unit: string;
  note: string;
}

export interface SkillGroup {
  title: string;
  icon: IconName;
  tools: BrandId[];
}

export interface Social {
  key: BrandId;
  label: string;
  /** Full URL. Leave '#' until the profile link is ready. */
  url: string;
}

export interface PortfolioData {
  nav: Array<{ id: string; label: string }>;
  profile: {
    name: string;
    suffix: string;
    roles: string[];
    tagline: string;
    affiliation: string;
    focus: string[];
    portrait: ImageRef;
    status: { label: string; detail: string };
  };
  prestigeBadges: BadgeData[];
  heroStats: HeroStat[];
  summary: string;
  pillars: Pillar[];
  photos: Record<string, Photo>;
  publications: Publication[];
  swipe: {
    program: string;
    acronym: string;
    title: string;
    summary: string;
    subtitleId: string;
    achievements: Array<{ label: string; detail: string; prestige?: boolean }>;
    role: string;
    specs: Spec[];
    team: TeamMember[];
    photos: string[];
  };
  experience: ExperienceItem[];
  leadership: LeadershipItem[];
  gallery: { filters: GalleryFilter[]; items: GalleryItem[] };
  certificates: { featured: Certificate[]; additional: AdditionalCredential[] };
  skills: SkillGroup[];
  contact: {
    email: string;
    heading: string;
    intro: string;
    areas: Array<{ icon: IconName; title: string; body: string }>;
    socials: Social[];
  };
}
