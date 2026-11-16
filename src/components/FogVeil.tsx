import { useEffect, useRef, useState } from 'react';

/**
 * Tirai kabut pembuka: pengunjung mengusap layar untuk menyingkap adegan.
 * Dapat dilewati dengan tombol, gulir, atau papan ketik, dan hilang sendiri setelah cukup terusap.
 */
export function FogVeil({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [leaving, setLeaving] = useState(false);
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setLeaving(true);
    window.setTimeout(onDone, 1200);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const w = (canvas.width = Math.round(canvas.clientWidth / 2));
    const h = (canvas.height = Math.round(canvas.clientHeight / 2));

    // Kabut: gradasi gelap keemasan dengan butiran halus
    const grad = ctx.createRadialGradient(w / 2, h * 0.55, 0, w / 2, h * 0.55, Math.max(w, h) * 0.75);
    grad.addColorStop(0, 'rgba(58,44,26,0.94)');
    grad.addColorStop(1, 'rgba(8,8,10,0.985)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 2600; i++) {
      ctx.fillStyle = `rgba(255,240,210,${Math.random() * 0.05})`;
      ctx.fillRect(Math.random() * w, Math.random() * h, 1.4, 1.4);
    }

    let wiped = 0;
    let last: { x: number; y: number } | null = null;
    const radius = Math.max(w, h) * 0.085;
    const wipe = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * w;
      const y = ((event.clientY - rect.top) / rect.height) * h;
      ctx.globalCompositeOperation = 'destination-out';
      const brush = ctx.createRadialGradient(x, y, 0, x, y, radius);
      brush.addColorStop(0, 'rgba(0,0,0,0.9)');
      brush.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = brush;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      if (last) wiped += Math.hypot(x - last.x, y - last.y);
      last = { x, y };
      if (wiped > (w + h) * 1.6) finish();
    };
    const onKey = (event: KeyboardEvent) => {
      if (['Enter', ' ', 'Escape', 'ArrowDown', 'PageDown', 'Tab'].includes(event.key)) finish();
    };
    const onWheel = () => finish();
    canvas.addEventListener('pointermove', wipe);
    canvas.addEventListener('pointerdown', wipe);
    window.addEventListener('keydown', onKey);
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('scroll', onWheel, { passive: true });
    return () => {
      canvas.removeEventListener('pointermove', wipe);
      canvas.removeEventListener('pointerdown', wipe);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onWheel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`absolute inset-0 z-30 transition-opacity duration-[1200ms] ease-out ${leaving ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 size-full cursor-crosshair touch-none" />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-6 text-center">
        <p className="eyebrow text-mute-600">Usap layar untuk menyingkap arena</p>
        <span className="h-10 w-px animate-pulse bg-navy-900/40" aria-hidden="true" />
        <button type="button" onClick={finish} className="btn btn-line-light pointer-events-auto min-h-11">
          Masuk
        </button>
      </div>
    </div>
  );
}
