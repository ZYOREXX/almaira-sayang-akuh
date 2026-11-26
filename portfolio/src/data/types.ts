import type { IconName } from '../components/Icon';
import type { BrandId } from './brandIcons';

/** A documentation photo. `thumb` is optional (used on cards & thumbnails). */
export interface Photo {
  src: string;
  thumb?: string;
  alt: string;
  caption: string;
  /** 'contain' for diagrams, documents and scans that must not be cropped. */
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

/** Animated number. `display` overrides the final text; omit `value` for text-only metrics. */
export interface MetricData {
  label: string;
  value?: number;
  from?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  display?: string;
  note?: string;
  prestige?: boolean;
}

export interface Pill {
  icon: IconName;
  label: string;
  detail: string;
  prestige?: boolean;
}

export interface Persona {
  icon: IconName;
  title: string;
  body: string;
  points: string[];
}

export interface SkillGroup {
  title: string;
  icon: IconName;
  tools: BrandId[];
}

export interface ExperienceItem {
  role: string;
  org: string;
  period?: string;
  ongoing?: boolean;
  body: string;
  icon: IconName;
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

export interface DescriptiveRow {
  measure: string;
  unit: string;
  lowerIsBetter?: boolean;
  domain: [number, number];
  ticks: number[];
  pre: { mean: number; sd: number; min: number; max: number };
  post: { mean: number; sd: number; min: number; max: number };
}

interface WorkBase {
  id: string;
  label: string; // short label for thumbnails
  kind: string; // e.g. International Conference Paper
  title: string;
  titleAlt?: string;
  venue: string;
  role: string;
  year: string;
  summary: string;
  tags: string[];
  metrics: MetricData[];
  /** Photo ids from PORTFOLIO_DATA.photos; the first one is the cover. */
  images: string[];
  cta: string;
}

export interface ConferenceWork extends WorkBase {
  type: 'conference';
  byline: string;
  affiliation: string;
  abstract: string[];
  keywords: string[];
  method: Array<[string, string]>;
  descriptives: Array<{ variable: string; mean: number; sd: number; level: string }>;
  ci: { low: number; high: number; estimate: number; resamples: number };
  bayes: { bf01: number; posteriorMean: number; credible: [number, number] };
  implication: string;
}

export interface JournalWork extends WorkBase {
  type: 'journal';
  byline: string;
  affiliation: string;
  citation: string;
  link?: string;
  abstract: string[];
  keywords: string[];
  method: Array<[string, string]>;
  program: Array<{ sessions: string; focus: string; content: string }>;
  descriptives: DescriptiveRow[];
  effects: Effect[];
  conclusion: string;
}

export interface ProjectWork extends WorkBase {
  type: 'project';
  subtitleId: string;
  achievements: Array<{ label: string; detail: string; prestige?: boolean }>;
  specs: Array<{ icon: IconName; label: string; detail: string }>;
  team: Array<{ name: string; unit: string; role?: string; self?: boolean }>;
}

export interface ServiceWork extends WorkBase {
  type: 'service';
  services: Array<{ icon: IconName; title: string; body: string }>;
  tools: BrandId[];
}

export type Work = ConferenceWork | JournalWork | ProjectWork | ServiceWork;

/** How an achievement card shows its visual. */
export type AchievementVisual =
  | { kind: 'scan'; images: ImageRef[] } // certificate scan(s)
  | { kind: 'photo'; photo: string } // documentation photo id
  | { kind: 'emblem'; code: string }; // designed summary card (no scan yet)

export interface Achievement {
  id: string;
  title: string;
  issuer: string;
  date: string;
  category: string;
  icon: IconName;
  meta?: string[];
  note?: string;
  prestige?: boolean;
  /** Short, factual tag such as "E-signed · BSrE–BSSN". */
  badge?: string;
  visual: AchievementVisual;
}

export interface Social {
  key: BrandId;
  label: string;
  /** Full URL. Leave '#' until the profile link is ready. */
  url: string;
}

export interface PortfolioData {
  nav: Array<{ id: string; label: string }>;
  hero: {
    eyebrow: string;
    title: string;
    name: string;
    suffix: string;
    roles: string[];
    tagline: string;
    portrait: ImageRef;
    pills: Pill[];
  };
  about: {
    eyebrow: string;
    heading: string;
    statement: string;
    body: string;
    photo: ImageRef;
    metrics: MetricData[];
    stack: SkillGroup[];
    personas: Persona[];
  };
  photos: Record<string, Photo>;
  experience: ExperienceItem[];
  works: Work[];
  achievements: Achievement[];
  contact: {
    email: string;
    heading: string;
    intro: string;
    areas: Array<{ icon: IconName; title: string; body: string }>;
    socials: Social[];
  };
}
