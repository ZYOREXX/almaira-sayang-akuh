import * as THREE from 'three';

/** Semua tekstur dibuat prosedural dengan canvas: tanpa file aset. */

function canvasTexture(w, h, draw, { repeat = false, srgb = true } = {}) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d'), w, h);
  const tex = new THREE.CanvasTexture(c);
  if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
  if (repeat) tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  return tex;
}

/** Ubin keramik dasar kolam (1 tile tekstur = 1 m², 4×4 ubin). */
export function tileTexture() {
  return canvasTexture(256, 256, (ctx, w) => {
    ctx.fillStyle = '#d8f1fb';
    ctx.fillRect(0, 0, w, w);
    const n = 4;
    const s = w / n;
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        const v = 225 + Math.random() * 20;
        ctx.fillStyle = `rgb(${v - 18}, ${v}, ${Math.min(255, v + 12)})`;
        ctx.fillRect(x * s + 2, y * s + 2, s - 4, s - 4);
      }
    }
    ctx.strokeStyle = 'rgba(120, 170, 190, 0.6)';
    ctx.lineWidth = 3;
    for (let i = 0; i <= n; i++) {
      ctx.beginPath(); ctx.moveTo(i * s, 0); ctx.lineTo(i * s, w); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * s); ctx.lineTo(w, i * s); ctx.stroke();
    }
  }, { repeat: true });
}

/** Lantai dek: ubin abu-abu terang bertekstur. */
export function deckTexture() {
  return canvasTexture(256, 256, (ctx, w) => {
    ctx.fillStyle = '#c9d2dc';
    ctx.fillRect(0, 0, w, w);
    const s = w / 2;
    for (let y = 0; y < 2; y++) {
      for (let x = 0; x < 2; x++) {
        const v = 196 + Math.random() * 18;
        ctx.fillStyle = `rgb(${v}, ${v + 6}, ${v + 14})`;
        ctx.fillRect(x * s + 3, y * s + 3, s - 6, s - 6);
      }
    }
    for (let i = 0; i < 900; i++) {
      ctx.fillStyle = `rgba(80,90,110,${Math.random() * 0.06})`;
      ctx.fillRect(Math.random() * w, Math.random() * w, 2, 2);
    }
  }, { repeat: true });
}

/** Titik lembut untuk partikel cipratan. */
export function softDotTexture() {
  return canvasTexture(64, 64, (ctx, w) => {
    const g = ctx.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.45, 'rgba(255,255,255,0.75)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, w);
  });
}

/** Lingkaran gelap lembut (bayangan palsu di dasar kolam). */
export function blobTexture() {
  return canvasTexture(64, 64, (ctx, w) => {
    const g = ctx.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
    g.addColorStop(0, 'rgba(0,20,40,0.55)');
    g.addColorStop(1, 'rgba(0,20,40,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, w);
  });
}

/** Panel nomor lintasan di start block. */
export function laneNumberTexture(n, accent = '#0ea5e9') {
  return canvasTexture(128, 128, (ctx, w) => {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, w);
    ctx.fillStyle = accent;
    ctx.fillRect(0, w - 14, w, 14);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 86px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(n), w / 2, w / 2 - 4);
  });
}

/** Spanduk teks (finish gantry, papan iklan). */
export function bannerTexture(text, { bg = '#0b1324', fg = '#ffffff', accent = '#38bdf8', w = 1024, h = 128, checker = false } = {}) {
  return canvasTexture(w, h, (ctx) => {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    if (checker) {
      const s = h / 4;
      for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 3; x++) {
          ctx.fillStyle = (x + y) % 2 ? '#0f172a' : '#f8fafc';
          ctx.fillRect(x * s, y * s, s, s);
          ctx.fillRect(w - (x + 1) * s, y * s, s, s);
        }
      }
    }
    ctx.fillStyle = accent;
    ctx.fillRect(0, h - 8, w, 8);
    ctx.fillStyle = fg;
    ctx.font = `900 ${h * 0.58}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, w / 2, h / 2);
  });
}

/** Penanda pemain (panah + label) untuk sprite. */
export function playerMarkerTexture(label) {
  return canvasTexture(256, 160, (ctx, w) => {
    ctx.fillStyle = '#ef4444';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    const bw = 200;
    roundRect(ctx, (w - bw) / 2, 8, bw, 70, 35);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w / 2 - 26, 84);
    ctx.lineTo(w / 2 + 26, 84);
    ctx.lineTo(w / 2, 150);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 42px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, w / 2, 45);
  });
}

/** Medali angka posisi finis di atas kepala. */
export function placeTexture(place) {
  const colors = { 1: '#facc15', 2: '#e2e8f0', 3: '#f59e0b' };
  return canvasTexture(128, 128, (ctx, w) => {
    ctx.fillStyle = colors[place] ?? '#1e293b';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(w / 2, w / 2, w / 2 - 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = place <= 3 ? '#0f172a' : '#ffffff';
    ctx.font = '900 70px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(place), w / 2, w / 2 + 4);
  });
}

export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
