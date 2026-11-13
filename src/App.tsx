import { Admission } from './components/Admission';
import { Concentrations } from './components/Concentrations';
import { Contact } from './components/Contact';
import { Curriculum } from './components/Curriculum';
import { Faculty } from './components/Faculty';
import { Foundations } from './components/Foundations';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Profile } from './components/Profile';
import { Programs } from './components/Programs';
import { Research } from './components/Research';

export default function App() {
  return (
    <>
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-champagne-300 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-ink-950"
      >
        Lompat ke konten utama
      </a>
      <Header />
      <main id="konten">
        <Hero />
        <Profile />
        <Programs />
        <Concentrations />
        <Curriculum />
        <Foundations />
        <Faculty />
        <Research />
        <Admission />
      </main>
      <Contact />
    </>
  );
}
