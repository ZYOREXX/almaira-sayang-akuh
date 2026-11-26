import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useBodyLock } from '../hooks/useBodyLock';

export type LightboxItem = { src: string; alt: string; caption?: string };
type OpenFn = (items: LightboxItem[], index?: number) => void;

const LightboxContext = createContext<OpenFn>(() => undefined);

/** `const open = useLightbox(); open(items, index)` — opens the full-screen viewer. */
export const useLightbox = () => useContext(LightboxContext);

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ items: LightboxItem[]; index: number } | null>(null);
  const open = useCallback<OpenFn>((items, index = 0) => {
    if (items.length) setState({ items, index });
  }, []);

  return (
    <LightboxContext.Provider value={open}>
      {children}
      <AnimatePresence>
        {state && (
          <LightboxView
            key="lightbox"
            items={state.items}
            index={state.index}
            onIndex={(i) => setState((s) => (s ? { ...s, index: i } : s))}
            onClose={() => setState(null)}
          />
        )}
      </AnimatePresence>
    </LightboxContext.Provider>
  );
}

function LightboxView({
  items,
  index,
  onIndex,
  onClose,
}: {
  items: LightboxItem[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const [dir, setDir] = useState(0);
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const many = items.length > 1;
  const item = items[index];
  useBodyLock();

  const go = useCallback(
    (d: number) => {
      if (!many) return;
      setDir(d);
      onIndex((index + d + items.length) % items.length);
    },
    [index, items.length, many, onIndex],
  );

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus();
    return () => previous?.focus?.();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Tab' && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>('button');
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, onClose]);

  // Preload neighbours for instant paging.
  useEffect(() => {
    if (!many) return;
    [items[(index + 1) % items.length], items[(index - 1 + items.length) % items.length]].forEach((it) => {
      const img = new Image();
      img.src = it.src;
    });
  }, [index, items, many]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -70 || info.velocity.x < -500) go(1);
    else if (info.offset.x > 70 || info.velocity.x > 500) go(-1);
  };

  return (
    <motion.div
      ref={panel}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      className="lightbox fixed inset-0 z-[90] flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="lightbox-bar flex items-center justify-between gap-4 px-4 pb-3 pt-4 sm:px-6">
        <p className="font-mono text-xs tracking-wide text-white/70 tabular-nums">
          {many ? `${String(index + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}` : 'Preview'}
        </p>
        <button ref={closeBtn} type="button" onClick={onClose} className="lb-btn" aria-label="Close image viewer">
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.img
            key={item.src}
            src={item.src}
            alt={item.alt}
            custom={dir}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 60, scale: 0.97 }),
              center: { opacity: 1, x: 0, scale: 1 },
              exit: (d: number) => ({ opacity: 0, x: d * -60, scale: 0.97 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            drag={many ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.55}
            onDragEnd={onDragEnd}
            draggable={false}
            className="max-h-full max-w-full select-none rounded-2xl bg-white object-contain shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]"
          />
        </AnimatePresence>

        {many && (
          <>
            <button type="button" onClick={() => go(-1)} className="lb-btn absolute left-3 top-1/2 hidden -translate-y-1/2 sm:grid" aria-label="Previous image">
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => go(1)} className="lb-btn absolute right-3 top-1/2 hidden -translate-y-1/2 sm:grid" aria-label="Next image">
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      <div className="lightbox-bar flex items-center justify-center gap-3 px-4 pb-5 pt-4 sm:px-6">
        {many && (
          <button type="button" onClick={() => go(-1)} className="lb-btn sm:hidden" aria-label="Previous image">
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
        <p className="max-w-3xl text-center text-sm leading-snug text-white/85" aria-live="polite">
          {item.caption ?? item.alt}
        </p>
        {many && (
          <button type="button" onClick={() => go(1)} className="lb-btn sm:hidden" aria-label="Next image">
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
