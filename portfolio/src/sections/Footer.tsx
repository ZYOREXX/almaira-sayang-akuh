import { ArrowUp } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolio';

export function Footer() {
  const { profile } = PORTFOLIO_DATA;
  return (
    <footer className="border-t border-line bg-white/70">
      <div className="gutter mx-auto flex max-w-7xl flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="monogram">TIW</span>
          <p className="text-[13px] leading-snug text-muted">
            © {new Date().getFullYear()} {profile.name}, {profile.suffix}
            <span className="block">{profile.affiliation}</span>
          </p>
        </div>
        <a href="#top" className="inline-flex items-center gap-2 self-start rounded-full border border-line bg-white px-4 py-2 text-[13px] font-semibold text-ink transition-colors hover:border-cerulean-300 hover:text-cerulean-700 sm:self-auto">
          Back to top <ArrowUp className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
