import { PORTFOLIO_DATA } from '../data/portfolio';
import type { Logo, Tool } from '../data/types';
import { cn } from '../lib/utils';
import { Tilt } from './Tilt';

/** Official logo from PORTFOLIO_DATA.logos, shown on a clean white tile. */
export function OrgLogo({ id, className, tile = true }: { id: string; className?: string; tile?: boolean }) {
  const logo = (PORTFOLIO_DATA.logos as Record<string, Logo>)[id];
  if (!logo) return null;
  const img = <img src={logo.src} alt={logo.alt} loading="lazy" decoding="async" className="h-full w-full object-contain" />;
  if (!tile) return <span className={cn('block', className)}>{img}</span>;
  return <span className={cn('grid place-items-center overflow-hidden rounded-2xl border border-line bg-white p-2', className)}>{img}</span>;
}

/** Grid of official software logos with short names. */
export function ToolGrid({ ids }: { ids: string[] }) {
  const tools = PORTFOLIO_DATA.tools as Record<string, Tool>;
  return (
    <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-6">
      {ids.map((id) => {
        const t = tools[id];
        if (!t) return null;
        return (
          <Tilt as="li" key={id} max={10} scale={1.06} className="tool-tile group/tool">
            <span className="grid h-12 w-12 place-items-center transition-transform duration-500 ease-out group-hover/tool:-translate-y-1 group-hover/tool:scale-110">
              <img src={t.logo} alt={`${t.name} logo`} loading="lazy" decoding="async" className="max-h-12 max-w-12 object-contain" />
            </span>
            <span className="mt-2 text-center text-[12px] font-semibold leading-tight text-ink/85">{t.name}</span>
          </Tilt>
        );
      })}
    </ul>
  );
}
