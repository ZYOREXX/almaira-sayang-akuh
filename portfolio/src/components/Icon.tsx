import {
  Award,
  BatteryCharging,
  BookOpenCheck,
  Bot,
  CalendarRange,
  Clock,
  Cpu,
  Flag,
  FlaskConical,
  GraduationCap,
  Landmark,
  Medal,
  Mic,
  Microscope,
  Milestone,
  Monitor,
  Network,
  Palette,
  PenLine,
  Presentation,
  Route,
  School,
  ShieldCheck,
  Sigma,
  SlidersHorizontal,
  Sparkles,
  Timer,
  Trophy,
  Users,
  Volume2,
  Waves,
  type LucideIcon,
} from 'lucide-react';

/** Icon names that PORTFOLIO_DATA may reference (all Lucide icons). */
export const ICONS = {
  graduation: GraduationCap,
  award: Award,
  mic: Mic,
  journal: BookOpenCheck,
  research: FlaskConical,
  event: Flag,
  flag: Flag,
  cpu: Cpu,
  monitor: Monitor,
  clock: Clock,
  speaker: Volume2,
  battery: BatteryCharging,
  timer: Timer,
  sliders: SlidersHorizontal,
  medal: Medal,
  bot: Bot,
  landmark: Landmark,
  presentation: Presentation,
  school: School,
  shield: ShieldCheck,
  waves: Waves,
  trophy: Trophy,
  route: Route,
  sparkles: Sparkles,
  users: Users,
  sigma: Sigma,
  network: Network,
  palette: Palette,
  pen: PenLine,
  microscope: Microscope,
  calendar: CalendarRange,
  milestone: Milestone,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

export function Icon({
  name,
  className,
  strokeWidth = 1.75,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}) {
  const Cmp = ICONS[name];
  return <Cmp aria-hidden="true" className={className} strokeWidth={strokeWidth} />;
}
