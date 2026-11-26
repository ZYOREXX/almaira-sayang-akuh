import { useEffect, useRef } from 'react';
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from './lib/gsap';
import { LightboxProvider } from './components/Lightbox';
import { Nav } from './sections/Nav';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Experience } from './sections/Experience';
import { Works } from './sections/Works';
import { Achievements } from './sections/Achievements';
import { Contact } from './sections/Contact';
import { Footer } from './sections/Footer';

export default function App() {
  const mainRef = useRef<HTMLElement>(null);

  /*
    Scroll-triggered reveal for every [data-reveal] block below the fold.
    Blocks stay fully visible at rest (only offset in 3D), then settle into
    place with a stagger as they enter the viewport.
  */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const vh = window.innerHeight;
        const items = gsap.utils
          .toArray<HTMLElement>('[data-reveal]')
          .filter((el) => el.getBoundingClientRect().top > vh * 0.92);
        if (!items.length) return;
        gsap.set(items, { y: 64, rotateX: 7, scale: 0.97, transformPerspective: 1200, transformOrigin: '50% 0%' });
        ScrollTrigger.batch(items, {
          start: 'top 92%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              y: 0,
              rotateX: 0,
              scale: 1,
              duration: 1.15,
              ease: 'back.out(1.5)',
              stagger: 0.09,
              overwrite: true,
              clearProps: 'transform',
            }),
        });
      });
      return () => mm.revert();
    },
    { scope: mainRef },
  );

  // Keep ScrollTrigger positions accurate when fonts/images/filters change the layout.
  useEffect(() => {
    let t = 0;
    const refresh = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => ScrollTrigger.refresh(), 220);
    };
    const ro = new ResizeObserver(refresh);
    ro.observe(document.body);
    document.fonts?.ready.then(refresh).catch(() => undefined);
    window.addEventListener('load', refresh);
    return () => {
      ro.disconnect();
      window.removeEventListener('load', refresh);
      window.clearTimeout(t);
    };
  }, []);

  return (
    <LightboxProvider>
      <div className="site">
        <a href="#about" className="skip-link">
          Skip to content
        </a>
        <Nav />
        <main ref={mainRef}>
          <Hero />
          <About />
          <Experience />
          <Works />
          <Achievements />
          <Contact />
        </main>
        <Footer />
      </div>
    </LightboxProvider>
  );
}
