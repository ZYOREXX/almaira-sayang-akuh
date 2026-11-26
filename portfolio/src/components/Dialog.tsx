import { useEffect, useRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useBodyLock } from '../hooks/useBodyLock';

/**
 * Accessible modal panel (render inside <AnimatePresence>).
 * Esc closes, focus is trapped inside and restored on close.
 */
export function Dialog({
  labelledBy,
  onClose,
  children,
  eyebrow,
}: {
  labelledBy: string;
  onClose: () => void;
  children: ReactNode;
  eyebrow?: ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  useBodyLock();

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key !== 'Tab' || !panel.current) return;
      const focusable = panel.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      previous?.focus?.();
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
    >
      <div className="dialog-backdrop absolute inset-0" onClick={onClose} aria-hidden="true" />
      <motion.div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="dialog-panel relative w-full max-w-4xl"
        initial={{ y: 48, opacity: 0, scale: 0.985 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 32, opacity: 0, scale: 0.985 }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      >
        <div className="dialog-head sticky top-0 z-10 flex items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="min-w-0">{eyebrow}</div>
          <button ref={closeBtn} type="button" onClick={onClose} className="icon-btn" aria-label="Close dialog">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="px-5 pb-8 pt-2 sm:px-8 sm:pb-10">{children}</div>
      </motion.div>
    </motion.div>
  );
}
