import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Check, Copy, Mail } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolio';
import { BrandLogo } from '../components/BrandLogo';
import { Section } from '../components/ui';
import { SpotlightCard } from '../components/SpotlightCard';
import { MagneticButton } from '../components/MagneticButton';
import { Icon } from '../components/Icon';
import { cn, isPlaceholderUrl } from '../lib/utils';
import { BRAND } from '../data/brandIcons';

export function Contact() {
  const { contact } = PORTFOLIO_DATA;
  const [toast, setToast] = useState<string | null>(null);
  const emailRef = useRef<HTMLSpanElement>(null);
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const flash = (msg: string) => {
    setToast(msg);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 2200);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      flash('Email address copied');
    } catch {
      // Clipboard blocked: select the address so it can be copied manually.
      const el = emailRef.current;
      if (el) {
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
      flash('Address selected · press Ctrl/⌘ + C');
    }
  };

  return (
    <Section id="contact" tone="white">
      <div data-reveal>
        <SpotlightCard lift={2} innerClassName="grid gap-10 p-6 sm:p-10 lg:grid-cols-12 lg:gap-12 lg:p-14">
          <div className="lg:col-span-7">
            <p className="eyebrow">Academic consultation &amp; collaboration</p>
            <h2 className="mt-5 text-[clamp(2.2rem,5vw,4rem)] font-extrabold leading-[1.02] tracking-[-0.04em] text-ink">{contact.heading}</h2>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted">{contact.intro}</p>
            <ul className="mt-9 grid gap-3 sm:grid-cols-3">
              {contact.areas.map((a) => (
                <li key={a.title} className="rounded-2xl border border-line bg-canvas/70 p-4 transition-colors hover:border-cerulean-200 hover:bg-cerulean-50/60">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-cerulean-600 ring-1 ring-line">
                    <Icon name={a.icon} className="h-[18px] w-[18px]" />
                  </span>
                  <p className="mt-3 text-[14px] font-bold leading-snug text-ink">{a.title}</p>
                  <p className="mt-1.5 text-[13px] leading-snug text-muted">{a.body}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-5">
            <div className="rounded-[24px] border border-line bg-white p-5 shadow-soft sm:p-6">
              <p className="flex items-center gap-2 text-[13px] font-semibold text-muted">
                <Mail className="h-4 w-4 text-cerulean-600" aria-hidden="true" /> Email
              </p>
              <span ref={emailRef} className="mt-2 block select-all break-all font-label text-[clamp(1.05rem,2.4vw,1.35rem)] font-semibold text-ink">
                {contact.email}
              </span>
              <div className="mt-5 flex flex-wrap gap-2.5">
                <MagneticButton onClick={copy} size="sm">
                  <Copy className="h-4 w-4" aria-hidden="true" /> Copy address
                </MagneticButton>
                <MagneticButton href={`mailto:${contact.email}?subject=Academic%20Consultation`} variant="secondary" size="sm">
                  Open email app <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </MagneticButton>
              </div>
            </div>

            <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-2">
              {contact.socials.map((s) => {
                const pending = isPlaceholderUrl(s.url);
                return (
                  <li key={s.key}>
                    <motion.a
                      href={pending ? '#contact' : s.url}
                      target={pending ? undefined : '_blank'}
                      rel={pending ? undefined : 'noopener noreferrer'}
                      onClick={(e) => {
                        if (pending) {
                          e.preventDefault();
                          flash(`${s.label} link not added yet`);
                        }
                      }}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.97 }}
                      className="social-link"
                      style={{ ['--brand' as string]: `#${BRAND[s.key].hex}` }}
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-canvas ring-1 ring-line">
                        <BrandLogo id={s.key} size={20} decorative />
                      </span>
                      <span className="min-w-0 truncate text-[13.5px] font-semibold text-ink">{s.label}</span>
                      <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                    </motion.a>
                  </li>
                );
              })}
            </ul>
          </div>
        </SpotlightCard>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            className="toast"
            initial={{ opacity: 0, y: 16, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 16, x: '-50%' }}
          >
            <Check className={cn('h-4 w-4 text-emerald-400')} aria-hidden="true" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
