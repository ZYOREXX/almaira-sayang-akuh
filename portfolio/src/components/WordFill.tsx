import { useRef } from 'react';
import { gsap, MOTION_OK, useGSAP } from '../lib/gsap';
import { cn } from '../lib/utils';

/**
 * Statement whose words "fill" from slate to navy as it scrolls through the
 * viewport (scrubbed GSAP ScrollTrigger). Without motion the text is simply navy.
 */
export function WordFill({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(' ');

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          '.wf',
          { color: '#7c8ba1' },
          {
            color: '#0f172a',
            ease: 'none',
            stagger: 0.12,
            scrollTrigger: { trigger: ref.current, start: 'top 82%', end: 'bottom 42%', scrub: 0.5 },
          },
        );
      });
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('.wf', { color: '#0f172a' });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <p ref={ref} className={cn('word-fill', className)}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className="wf">
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  );
}
