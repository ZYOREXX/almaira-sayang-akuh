import { POOL, WORLD, PLAYER_LANE, TURN, laneCenterY } from '../config.js';

const WATER_TOP = 0;
const WATER_BOTTOM = POOL.waterWidth;

/**
 * Menggambar kolam: dek, air beranimasi (caustics + kilau),
 * tali lintasan, start block, garis finis, dan zona flip pemain.
 * Elemen statis dirender sekali ke canvas offscreen.
 */
export class PoolRenderer {
  constructor(camera) {
    this.camera = camera;
    this.staticLayer = document.createElement('canvas');
    this.caustics = makeCausticTexture(256, 18);
    this.causticPattern = null;
  }

  resize(pixelW, pixelH, ctx) {
    this.staticLayer.width = pixelW;
    this.staticLayer.height = pixelH;
    const sctx = this.staticLayer.getContext('2d');
    this.camera.apply(sctx);
    drawStatic(sctx);
    this.camera.applyScreen(sctx);
    drawStaticLabels(sctx, this.camera);
    this.causticPattern = ctx.createPattern(this.caustics, 'repeat');
  }

  drawBase(ctx) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(this.staticLayer, 0, 0);
  }

  drawWater(ctx, t) {
    const cam = this.camera;
    cam.apply(ctx);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, WATER_TOP, POOL.length, WATER_BOTTOM);
    ctx.clip();

    // Dua lapis caustics bergerak berlawanan arah
    if (this.causticPattern && 'setTransform' in this.causticPattern) {
      const tex = 7; // meter per tile
      const k = tex / this.caustics.width;
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.11;
      this.causticPattern.setTransform(new DOMMatrix().translate(t * 0.35, t * 0.18).scale(k));
      ctx.fillStyle = this.causticPattern;
      ctx.fillRect(0, 0, POOL.length, WATER_BOTTOM);
      ctx.globalAlpha = 0.08;
      this.causticPattern.setTransform(new DOMMatrix().translate(-t * 0.27, t * 0.31).rotate(35).scale(k * 1.4));
      ctx.fillRect(0, 0, POOL.length, WATER_BOTTOM);
      ctx.globalCompositeOperation = 'source-over';
    }

    // Kilau permukaan: pita cahaya lembut yang bergelombang
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 6; i++) {
      const x0 = ((t * 2.2 + i * 11) % 66) - 8;
      ctx.beginPath();
      for (let y = 0; y <= WATER_BOTTOM; y += 1) {
        const x = x0 + Math.sin(y * 0.45 + t * 1.3 + i) * 0.9;
        if (y === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      for (let y = WATER_BOTTOM; y >= 0; y -= 1) {
        ctx.lineTo(x0 + 1.4 + Math.sin(y * 0.45 + t * 1.3 + i + 0.6) * 0.9, y);
      }
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  drawRopes(ctx, t) {
    this.camera.apply(ctx);
    for (let i = 0; i <= POOL.lanes; i++) {
      const y = POOL.sideWater + i * POOL.laneWidth;
      drawLaneRope(ctx, y, t, i);
    }
  }

  /** Garis finis & penanda dinding balik sesuai jarak lomba. */
  drawFinish(ctx, race, t) {
    const cam = this.camera;
    cam.apply(ctx);
    const lengths = Math.round(race.distance / POOL.length);
    const finishX = lengths % 2 === 1 ? POOL.length : 0;
    const sign = finishX === 0 ? 1 : -1; // arah ke dalam kolam

    // Pita kotak-kotak di dinding finis
    const band = 0.45;
    const x0 = finishX === 0 ? 0 : POOL.length - band;
    const cell = band / 2;
    for (let y = 0, r = 0; y < WATER_BOTTOM; y += cell, r++) {
      for (let c = 0; c < 2; c++) {
        ctx.fillStyle = (r + c) % 2 === 0 ? '#0f172a' : '#f8fafc';
        ctx.fillRect(x0 + c * cell, y, cell, Math.min(cell, WATER_BOTTOM - y));
      }
    }
    // Garis cahaya berdenyut
    const pulse = 0.45 + 0.35 * Math.sin(t * 4);
    ctx.strokeStyle = `rgba(250, 204, 21, ${pulse})`;
    ctx.lineWidth = 0.12;
    ctx.beginPath();
    ctx.moveTo(finishX + sign * (band + 0.08), 0);
    ctx.lineTo(finishX + sign * (band + 0.08), WATER_BOTTOM);
    ctx.stroke();

    cam.applyScreen(ctx);
    const fs = Math.max(10, cam.scale * 0.75);
    for (const y of [-1.05, WATER_BOTTOM + 1.05]) {
      drawChip(ctx, cam, finishX, y, '🏁 FINISH', fs, `rgba(250, 204, 21, ${0.75 + 0.25 * pulse})`, '#0f172a');
      if (lengths > 1) {
        drawChip(ctx, cam, POOL.length - finishX, y, '↺ TURN', fs * 0.85, 'rgba(15, 23, 42, 0.75)', '#e2e8f0');
      }
    }
  }

  /** Sorot lintasan pemain dan zona flip turn saat mendekati dinding. */
  drawPlayerLane(ctx, race, t) {
    const cam = this.camera;
    cam.apply(ctx);
    const y = laneCenterY(PLAYER_LANE);
    const half = POOL.laneWidth / 2 - 0.12;
    ctx.fillStyle = 'rgba(255,255,255,0.045)';
    ctx.fillRect(0, y - half, POOL.length, half * 2);

    const p = race.player;
    if (race.racing && p.phase === 'swim' && !p.isFinalLength && p.distToWall <= TURN.zoneStart + 2.5) {
      const wallX = p.dir > 0 ? POOL.length : 0;
      const s = -p.dir;
      const zone = (a, b, color) => {
        const xa = wallX + s * a;
        const xb = wallX + s * b;
        ctx.fillStyle = color;
        ctx.fillRect(Math.min(xa, xb), y - half, Math.abs(xb - xa), half * 2);
      };
      const blink = 0.5 + 0.5 * Math.sin(t * 10);
      zone(0, TURN.zoneStart, `rgba(250, 204, 21, ${0.14 + 0.08 * blink})`);
      zone(TURN.idealNear, TURN.idealFar, `rgba(34, 197, 94, ${0.3 + 0.15 * blink})`);
    }
  }
}

function drawStatic(ctx) {
  // Dek
  const deck = ctx.createLinearGradient(0, WORLD.minY, 0, WORLD.maxY);
  deck.addColorStop(0, '#cbd5e1');
  deck.addColorStop(1, '#94a3b8');
  ctx.fillStyle = deck;
  ctx.fillRect(WORLD.minX, WORLD.minY, WORLD.width, WORLD.height);
  // Ubin dek
  ctx.strokeStyle = 'rgba(71, 85, 105, 0.18)';
  ctx.lineWidth = 0.03;
  for (let x = Math.ceil(WORLD.minX); x <= WORLD.maxX; x += 1) {
    ctx.beginPath(); ctx.moveTo(x, WORLD.minY); ctx.lineTo(x, WORLD.maxY); ctx.stroke();
  }
  for (let y = Math.ceil(WORLD.minY); y <= WORLD.maxY; y += 1) {
    ctx.beginPath(); ctx.moveTo(WORLD.minX, y); ctx.lineTo(WORLD.maxX, y); ctx.stroke();
  }

  // Bibir kolam & talang
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(-0.35, -0.35, POOL.length + 0.7, WATER_BOTTOM + 0.7);
  ctx.fillStyle = '#334155';
  ctx.fillRect(-0.12, -0.12, POOL.length + 0.24, WATER_BOTTOM + 0.24);

  // Air: gradasi dalam
  const water = ctx.createLinearGradient(0, 0, 0, WATER_BOTTOM);
  water.addColorStop(0, '#0e7ab8');
  water.addColorStop(0.5, '#0b8fd0');
  water.addColorStop(1, '#0a6fa8');
  ctx.fillStyle = water;
  ctx.fillRect(0, 0, POOL.length, WATER_BOTTOM);
  // Vinyet tepi
  const edge = ctx.createLinearGradient(0, 0, 0, 1.2);
  edge.addColorStop(0, 'rgba(2, 44, 80, 0.45)');
  edge.addColorStop(1, 'rgba(2, 44, 80, 0)');
  ctx.fillStyle = edge;
  ctx.fillRect(0, 0, POOL.length, 1.2);
  const edge2 = ctx.createLinearGradient(0, WATER_BOTTOM, 0, WATER_BOTTOM - 1.2);
  edge2.addColorStop(0, 'rgba(2, 44, 80, 0.45)');
  edge2.addColorStop(1, 'rgba(2, 44, 80, 0)');
  ctx.fillStyle = edge2;
  ctx.fillRect(0, WATER_BOTTOM - 1.2, POOL.length, 1.2);

  // Garis T di dasar kolam
  ctx.fillStyle = 'rgba(8, 30, 60, 0.55)';
  for (let lane = 1; lane <= POOL.lanes; lane++) {
    const y = laneCenterY(lane);
    ctx.fillRect(2, y - 0.125, POOL.length - 4, 0.25);
    ctx.fillRect(2, y - 0.5, 0.25, 1.0);
    ctx.fillRect(POOL.length - 2.25, y - 0.5, 0.25, 1.0);
    // Target di dinding
    ctx.fillRect(0, y - 0.125, 0.5, 0.25);
    ctx.fillRect(POOL.length - 0.5, y - 0.125, 0.5, 0.25);
  }
  // Garis 25 m di dasar
  ctx.fillStyle = 'rgba(8, 30, 60, 0.18)';
  ctx.fillRect(24.9, 0, 0.2, WATER_BOTTOM);

  // Touch pad di kedua dinding
  ctx.fillStyle = '#facc15';
  ctx.fillRect(-0.1, 0, 0.1, WATER_BOTTOM);
  ctx.fillRect(POOL.length, 0, 0.1, WATER_BOTTOM);

  // Bendera gaya punggung (5 m dari tiap dinding)
  for (const fx of [5, POOL.length - 5]) {
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.5)';
    ctx.lineWidth = 0.04;
    ctx.beginPath(); ctx.moveTo(fx, -1.5); ctx.lineTo(fx, WATER_BOTTOM + 1.5); ctx.stroke();
    const colors = ['#ef4444', '#f8fafc', '#2563eb'];
    for (let y = -1.2, i = 0; y < WATER_BOTTOM + 1.2; y += 0.6, i++) {
      ctx.fillStyle = colors[i % 3];
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.moveTo(fx - 0.18, y);
      ctx.lineTo(fx + 0.18, y);
      ctx.lineTo(fx, y + 0.35);
      ctx.closePath();
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // Start block di kedua ujung
  for (let lane = 1; lane <= POOL.lanes; lane++) {
    const y = laneCenterY(lane);
    for (const side of [0, 1]) {
      const bx = side === 0 ? -0.75 : POOL.length + 0.05;
      ctx.fillStyle = '#1e293b';
      roundRect(ctx, bx, y - 0.32, 0.7, 0.64, 0.08);
      ctx.fill();
      ctx.fillStyle = side === 0 ? '#e2e8f0' : '#cbd5e1';
      roundRect(ctx, bx + 0.06, y - 0.26, 0.58, 0.52, 0.06);
      ctx.fill();
    }
  }
}

function drawStaticLabels(ctx, cam) {
  const fs = Math.max(9, cam.scale * 0.42);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  // Nomor lintasan di start block & dek
  for (let lane = 1; lane <= POOL.lanes; lane++) {
    const y = laneCenterY(lane);
    const p = cam.toScreen(-0.4, y);
    ctx.font = `800 ${fs}px ui-sans-serif, system-ui, sans-serif`;
    ctx.fillStyle = lane === PLAYER_LANE ? '#dc2626' : '#0f172a';
    ctx.fillText(String(lane), p.x, p.y);
    const q = cam.toScreen(POOL.length + 0.4, y);
    ctx.fillText(String(lane), q.x, q.y);
    const r = cam.toScreen(-2.3, y);
    ctx.font = `800 ${fs * 1.6}px ui-sans-serif, system-ui, sans-serif`;
    ctx.fillStyle = lane === PLAYER_LANE ? 'rgba(220, 38, 38, 0.85)' : 'rgba(30, 41, 59, 0.45)';
    ctx.fillText(String(lane), r.x, r.y);
  }
  // Penanda jarak di dek atas & bawah
  ctx.font = `700 ${fs}px ui-sans-serif, system-ui, sans-serif`;
  ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
  for (const m of [5, 10, 15, 20, 25, 30, 35, 40, 45]) {
    const top = cam.toScreen(m, -1.0);
    const bottom = cam.toScreen(m, WATER_BOTTOM + 1.0);
    ctx.fillText(`${m}`, top.x, top.y);
    ctx.fillText(`${m}`, bottom.x, bottom.y);
  }
}

function drawLaneRope(ctx, y, t, index) {
  const outer = index === 0 || index === POOL.lanes;
  const wobble = (x) => Math.sin(x * 0.35 + t * 1.6 + index) * 0.035;
  const seg = 0.5;
  ctx.lineCap = 'round';
  ctx.lineWidth = 0.2;
  for (let x = 0; x < POOL.length; x += seg) {
    let color;
    if (x < 5 || x >= POOL.length - 5) color = '#dc2626';
    else if ((x >= 14.5 && x < 15.5) || (x >= POOL.length - 15.5 && x < POOL.length - 14.5)) color = '#f8fafc';
    else if (outer) color = Math.floor(x / seg) % 2 === 0 ? '#2563eb' : '#1d4ed8';
    else color = Math.floor(x / seg) % 4 < 2 ? '#2563eb' : (Math.floor(x / seg) % 4 === 2 ? '#facc15' : '#f8fafc');
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + 0.08, y + wobble(x));
    ctx.lineTo(x + seg - 0.08, y + wobble(x + seg));
    ctx.stroke();
  }
  // Bayangan tipis tali
  ctx.strokeStyle = 'rgba(2, 30, 60, 0.25)';
  ctx.lineWidth = 0.06;
  ctx.beginPath();
  ctx.moveTo(0, y + 0.16);
  ctx.lineTo(POOL.length, y + 0.16);
  ctx.stroke();
}

function drawChip(ctx, cam, x, y, text, fs, bg, fg) {
  const p = cam.toScreen(x, y);
  ctx.font = `800 ${fs}px ui-sans-serif, system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const w = ctx.measureText(text).width + fs;
  const h = fs * 1.5;
  ctx.fillStyle = bg;
  roundRect(ctx, p.x - w / 2, p.y - h / 2, w, h, h / 2);
  ctx.fill();
  ctx.fillStyle = fg;
  ctx.fillText(text, p.x, p.y + 1);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * Tekstur caustics tileable dari diagram Voronoi:
 * cahaya terang di tepi sel (f2 - f1 kecil) meniru pola dasar kolam.
 */
function makeCausticTexture(size, cells) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(size, size);
  const pts = [];
  for (let i = 0; i < cells; i++) pts.push([Math.random() * size, Math.random() * size]);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let f1 = Infinity;
      let f2 = Infinity;
      for (const [px, py] of pts) {
        let dx = Math.abs(x - px);
        let dy = Math.abs(y - py);
        if (dx > size / 2) dx = size - dx;
        if (dy > size / 2) dy = size - dy;
        const d = dx * dx + dy * dy;
        if (d < f1) { f2 = f1; f1 = d; } else if (d < f2) f2 = d;
      }
      const edge = Math.sqrt(f2) - Math.sqrt(f1);
      const v = Math.max(0, 1 - edge / 9);
      const b = Math.pow(v, 2.2) * 255;
      const i = (y * size + x) * 4;
      img.data[i] = b;
      img.data[i + 1] = b;
      img.data[i + 2] = b;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c;
}
