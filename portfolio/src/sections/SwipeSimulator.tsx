import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Flag, Megaphone, Pause, Play, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { cn } from '../lib/utils';

/*
  Interactive interface simulation of the SWIPE concept (stopwatch, lap/flag
  timer, tone mode selector, whistle). Time is written straight to the DOM in
  a requestAnimationFrame loop, so React never re-renders 60×/s.
  Sound plays only when the visitor presses "Blow whistle".
*/

const TONES = [
  { id: 'trill', label: 'Trill' },
  { id: 'long', label: 'Long' },
  { id: 'double', label: 'Double' },
] as const;
type ToneId = (typeof TONES)[number]['id'];

type Lap = { n: number; lap: number; split: number };

const pad = (n: number) => String(n).padStart(2, '0');
function fmt(ms: number) {
  const total = Math.max(0, ms);
  const h = Math.floor(total / 3_600_000);
  const m = Math.floor(total / 60_000) % 60;
  const s = Math.floor(total / 1000) % 60;
  const cs = Math.floor(total / 10) % 100;
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}.${pad(cs)}` : `${pad(m)}:${pad(s)}.${pad(cs)}`;
}

function useWhistle() {
  const ctxRef = useRef<AudioContext | null>(null);
  return useCallback((tone: ToneId) => {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    try {
      ctxRef.current ??= new Ctor();
      const ctx = ctxRef.current;
      if (ctx.state === 'suspended') void ctx.resume();
      const blast = (start: number, dur: number, trill: boolean) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2850, start);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.14, start + 0.025);
        gain.gain.setValueAtTime(0.14, Math.max(start + 0.03, start + dur - 0.06));
        gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
        if (trill) {
          // A pea whistle "rolls": fast frequency + amplitude flutter.
          const lfo = ctx.createOscillator();
          const depth = ctx.createGain();
          lfo.frequency.setValueAtTime(26, start);
          depth.gain.setValueAtTime(170, start);
          lfo.connect(depth).connect(osc.frequency);
          const am = ctx.createGain();
          am.gain.setValueAtTime(0.05, start);
          lfo.connect(am).connect(gain.gain);
          lfo.start(start);
          lfo.stop(start + dur);
        }
        osc.connect(gain).connect(ctx.destination);
        osc.start(start);
        osc.stop(start + dur + 0.02);
      };
      const t = ctx.currentTime + 0.01;
      if (tone === 'trill') blast(t, 0.75, true);
      else if (tone === 'long') blast(t, 1.25, false);
      else {
        blast(t, 0.22, true);
        blast(t + 0.32, 0.22, true);
      }
    } catch {
      /* audio is optional */
    }
  }, []);
}

export function SwipeSimulator() {
  const mainRef = useRef<HTMLSpanElement>(null);
  const lapRef = useRef<HTMLSpanElement>(null);
  const splitRef = useRef<HTMLSpanElement>(null);
  const startAt = useRef(0);
  const acc = useRef(0);
  const lastSplit = useRef(0);
  const raf = useRef(0);
  const runningRef = useRef(false);

  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const [toneIdx, setToneIdx] = useState(0);
  const [blowing, setBlowing] = useState(false);
  const [hasTime, setHasTime] = useState(false);
  const whistle = useWhistle();
  const tone = TONES[toneIdx];

  const elapsed = () => acc.current + (runningRef.current ? performance.now() - startAt.current : 0);

  const paint = useCallback(() => {
    const e = elapsed();
    if (mainRef.current) mainRef.current.textContent = fmt(e);
    if (lapRef.current) lapRef.current.textContent = fmt(e - lastSplit.current);
  }, []);

  const loop = useCallback(() => {
    paint();
    raf.current = requestAnimationFrame(loop);
  }, [paint]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const toggle = () => {
    if (runningRef.current) {
      acc.current += performance.now() - startAt.current;
      runningRef.current = false;
      cancelAnimationFrame(raf.current);
      paint();
      setRunning(false);
    } else {
      startAt.current = performance.now();
      runningRef.current = true;
      raf.current = requestAnimationFrame(loop);
      setRunning(true);
      setHasTime(true);
    }
  };

  const lap = () => {
    if (!runningRef.current) return;
    const e = elapsed();
    const entry = { n: laps.length + 1, lap: e - lastSplit.current, split: e };
    lastSplit.current = e;
    if (splitRef.current) splitRef.current.textContent = fmt(e);
    setLaps((prev) => [entry, ...prev].slice(0, 99));
  };

  const reset = () => {
    if (runningRef.current) return;
    acc.current = 0;
    lastSplit.current = 0;
    setLaps([]);
    setHasTime(false);
    if (splitRef.current) splitRef.current.textContent = fmt(0);
    paint();
  };

  const blow = () => {
    whistle(tone.id);
    setBlowing(true);
    window.setTimeout(() => setBlowing(false), tone.id === 'long' ? 1250 : 800);
  };

  const lapNo = pad(laps.length + 1);

  return (
    <div className="flex h-full flex-col">
      {/* Device */}
      <div className="relative mx-auto w-full max-w-[330px] pt-4">
        <button
          type="button"
          onClick={() => setToneIdx((i) => (i + 1) % TONES.length)}
          className="absolute left-1/2 top-0 z-[2] h-5 w-16 -translate-x-1/2 rounded-t-xl bg-cerulean-500 shadow-[inset_0_2px_0_rgba(255,255,255,0.35)] transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
          aria-label={`Tone mode: ${tone.label}. Press to change`}
        />
        <motion.div
          className="device relative rounded-[46px] p-4"
          animate={blowing ? { rotate: [0, -1.2, 1.2, -0.8, 0.8, 0] } : { rotate: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span aria-hidden="true" className="device-btn left-[-5px] top-[38%]" />
          <span aria-hidden="true" className="device-btn right-[-5px] top-[22%]" />
          <span aria-hidden="true" className="device-btn right-[-5px] top-[62%]" />
          <div className="oled rounded-[30px] px-5 pb-4 pt-3.5">
            <div className="flex items-center justify-between font-label text-[10px] tracking-[0.14em] text-cyan-300/70">
              <span className="font-sans text-[13px] font-extrabold tracking-[0.08em] text-cyan-200">SWIPE</span>
              <span>TONE · {tone.label.toUpperCase()}</span>
            </div>
            <div className="mt-3 flex items-baseline justify-between font-label text-cyan-200">
              <span className="text-[10px] tracking-[0.14em] text-cyan-300/60">SPLIT</span>
              <span ref={splitRef} className="text-[17px] tabular-nums">
                00:00.00
              </span>
            </div>
            <div className="mt-1 flex items-baseline justify-between font-label text-cyan-200">
              <span className="text-[10px] tracking-[0.14em] text-cyan-300/60">LAP {lapNo}</span>
              <span ref={lapRef} className="text-[17px] tabular-nums">
                00:00.00
              </span>
            </div>
            <div className="mt-3 text-center font-label text-[clamp(2.1rem,9vw,2.6rem)] leading-none text-cyan-100 [text-shadow:0_0_14px_rgba(34,211,238,0.55)]">
              <span ref={mainRef} className="tabular-nums">
                00:00.00
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between font-label text-[10px] tracking-[0.14em]">
              <span className={cn('flex items-center gap-1.5', running ? 'text-emerald-300' : 'text-cyan-300/60')}>
                <span className={cn('h-1.5 w-1.5 rounded-full', running ? 'bg-emerald-300 animate-pulse' : 'bg-cyan-300/40')} />
                {running ? 'RUN' : hasTime ? 'HOLD' : 'READY'}
              </span>
              <AnimatePresence>
                {blowing && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: [0.4, 1, 0.4] }} exit={{ opacity: 0 }} transition={{ repeat: Infinity, duration: 0.4 }} className="text-amber-300">
                    ♪ WHISTLE
                  </motion.span>
                )}
              </AnimatePresence>
              <span className="text-cyan-300/60">LAPS {pad(laps.length)}</span>
            </div>
          </div>
        </motion.div>
        <div aria-hidden="true" className="mx-auto -mt-1 h-10 w-10 rounded-b-full border-[5px] border-t-0 border-slate-700" />
      </div>

      {/* Controls */}
      <div className="mt-5 grid grid-cols-2 gap-2">
        <button type="button" onClick={toggle} className={cn('sim-btn', 'sim-btn-primary')}>
          {running ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
          {running ? 'Stop' : hasTime ? 'Resume' : 'Start'}
        </button>
        <button type="button" onClick={lap} disabled={!running} className="sim-btn">
          <Flag className="h-4 w-4" aria-hidden="true" />
          Lap / Flag
        </button>
        <button type="button" onClick={reset} disabled={running || !hasTime} className="sim-btn">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Reset
        </button>
        <button type="button" onClick={() => setToneIdx((i) => (i + 1) % TONES.length)} className="sim-btn">
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Tone: {tone.label}
        </button>
        <button type="button" onClick={blow} className="sim-btn sim-btn-whistle col-span-2">
          <Megaphone className="h-4 w-4" aria-hidden="true" />
          Blow whistle · {tone.label} tone
        </button>
      </div>

      {/* Lap list */}
      <div className="mt-4 min-h-[112px] rounded-2xl border border-line bg-white p-3">
        {laps.length === 0 ? (
          <p className="px-1 py-2 text-[13px] leading-snug text-muted">Press Start, then Lap / Flag to record splits the way a coach would at the pool or track.</p>
        ) : (
          <ol aria-live="polite" className="space-y-1 font-label text-[12.5px]">
            <AnimatePresence initial={false}>
              {laps.slice(0, 4).map((l) => (
                <motion.li
                  key={l.n}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-between rounded-lg px-2 py-1 odd:bg-canvas"
                >
                  <span className="text-muted">LAP {pad(l.n)}</span>
                  <span className="tabular-nums text-ink">{fmt(l.lap)}</span>
                  <span className="tabular-nums text-muted">{fmt(l.split)}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>
        )}
      </div>
      <p className="mt-3 text-[12px] leading-snug text-muted">
        Interface simulation of the SWIPE concept for demonstration; sound plays only when you press the whistle.
      </p>
    </div>
  );
}
