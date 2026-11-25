import { DIVE } from '../config.js';
import { clamp } from '../core/utils.js';

/**
 * Menggambar perenang top-down (koordinat lokal: +x = arah kepala, satuan meter).
 * Kepala berada di titik (0,0); tubuh memanjang ke belakang ~1.9 m.
 */
export class SwimmerRenderer {
  constructor(camera) {
    this.camera = camera;
  }

  draw(ctx, race, t) {
    const cam = this.camera;
    cam.apply(ctx);
    for (const s of race.swimmers) this.drawOne(ctx, s, race, t);

    // Label nama & posisi (ruang layar agar teks tajam)
    cam.applyScreen(ctx);
    for (const s of race.swimmers) this.drawLabel(ctx, s, race);
  }

  drawOne(ctx, s, race, t) {
    ctx.save();
    ctx.translate(s.poolX, s.y);
    ctx.scale(1.3, 1.3); // sedikit dibesarkan agar mudah dilihat dari atas

    switch (s.phase) {
      case 'block':
        this.drawOnBlock(ctx, s, race, t);
        break;
      case 'flight':
        this.drawFlight(ctx, s);
        break;
      case 'turn':
        this.drawTurn(ctx, s);
        break;
      case 'finished':
        this.drawFinished(ctx, s, t);
        break;
      default:
        ctx.scale(s.facing, 1);
        this.drawBody(ctx, s, { underwater: s.underwater, stretch: 1 });
    }
    ctx.restore();
  }

  drawOnBlock(ctx, s, race, t) {
    const crouch = race.state === 'marks' ? 1 : 0;
    const sway = Math.sin(t * 2 + s.lane) * 0.02 * (1 - crouch);
    ctx.translate(-0.25 + crouch * 0.08, sway);
    // bayangan
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ellipse(ctx, -0.1, 0.06, 0.32, 0.26);
    // tubuh dilihat dari atas (pendek karena berdiri/membungkuk)
    ctx.fillStyle = '#1e293b';
    ellipse(ctx, -0.18, 0, 0.18 + crouch * 0.12, 0.24);
    ctx.fillStyle = s.skin;
    // lengan ke depan saat take your marks
    ctx.strokeStyle = s.skin;
    ctx.lineWidth = 0.09;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-0.05, -0.18); ctx.lineTo(0.12 + crouch * 0.2, -0.12 + crouch * 0.05);
    ctx.moveTo(-0.05, 0.18); ctx.lineTo(0.12 + crouch * 0.2, 0.12 - crouch * 0.05);
    ctx.stroke();
    this.drawHead(ctx, s, 0.02 + crouch * 0.1, 0);
  }

  drawFlight(ctx, s) {
    const p = clamp(s.flight.t / DIVE.flightTime, 0, 1);
    const h = Math.sin(p * Math.PI); // ketinggian relatif
    // bayangan di air
    ctx.fillStyle = `rgba(2, 30, 60, ${0.25 * (1 - h * 0.5)})`;
    ellipse(ctx, -0.9, 0.35 * h, 0.95, 0.2);
    ctx.translate(0, -0.25 * h);
    const k = 1 + 0.18 * h;
    ctx.scale(k, k);
    this.drawBody(ctx, s, { streamline: true, stretch: 1 });
  }

  drawTurn(ctx, s) {
    const p = s.turn.progress;
    const tuck = Math.sin(Math.PI * clamp((p - 0.25) / 0.6, 0, 1));
    ctx.scale(s.facing, 1);
    this.drawBody(ctx, s, { underwater: p > 0.4, stretch: 1 - 0.6 * tuck, streamline: p > 0.75 });
  }

  drawFinished(ctx, s, t) {
    ctx.scale(-s.facing, 1); // berbalik menghadap kolam
    const bob = Math.sin(t * 3 + s.lane) * 0.04;
    ctx.translate(-0.25, bob);
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ellipse(ctx, -0.2, 0, 0.55, 0.45);
    ctx.strokeStyle = s.skin;
    ctx.lineWidth = 0.1;
    ctx.lineCap = 'round';
    const raise = s.place === 1 ? 0.25 : 0;
    ctx.beginPath();
    ctx.moveTo(-0.25, -0.2); ctx.lineTo(-0.1 + raise, -0.65 - raise * 0.3);
    ctx.moveTo(-0.25, 0.2); ctx.lineTo(-0.1 + raise, 0.65 + raise * 0.3);
    ctx.stroke();
    ctx.fillStyle = s.skin;
    ellipse(ctx, -0.3, 0, 0.17, 0.22);
    this.drawHead(ctx, s, -0.1, 0);
  }

  /** Tubuh berenang gaya bebas. */
  drawBody(ctx, s, { underwater = false, stretch = 1, streamline = false }) {
    const alpha = underwater ? 0.55 : 1;
    ctx.globalAlpha = alpha;
    ctx.scale(stretch, 1);

    // kaki menendang
    const kick = Math.sin(s.kick * 2.2) * 0.07;
    ctx.strokeStyle = s.skin;
    ctx.lineCap = 'round';
    ctx.lineWidth = 0.1;
    ctx.beginPath();
    ctx.moveTo(-1.15, -0.09); ctx.lineTo(-1.85, -0.08 + kick);
    ctx.moveTo(-1.15, 0.09); ctx.lineTo(-1.85, 0.08 - kick);
    ctx.stroke();

    // baju renang & torso
    ctx.fillStyle = s.skin;
    ellipse(ctx, -0.72, 0, 0.48, 0.21);
    ctx.fillStyle = s.isPlayer ? '#b91c1c' : '#0f172a';
    ellipse(ctx, -1.08, 0, 0.14, 0.17);

    // lengan
    ctx.lineWidth = 0.095;
    if (streamline) {
      ctx.strokeStyle = s.skin;
      ctx.beginPath();
      ctx.moveTo(-0.3, -0.16); ctx.lineTo(0.45, -0.04);
      ctx.moveTo(-0.3, 0.16); ctx.lineTo(0.45, 0.04);
      ctx.stroke();
    } else {
      this.drawArm(ctx, s, s.armPhase, -1);
      this.drawArm(ctx, s, s.armPhase + Math.PI, 1);
    }

    this.drawHead(ctx, s, -0.08, 0);
    ctx.globalAlpha = 1;
  }

  drawArm(ctx, s, phase, side) {
    // phase 0 = tangan di depan, π = tangan di pinggul
    const c = Math.cos(phase);
    const sn = Math.sin(phase);
    const recovering = sn < 0; // fase recovery di atas air
    const sx = -0.32;
    const sy = side * 0.22;
    const hx = sx + 0.62 * c;
    const hy = side * (0.2 + (recovering ? 0.22 * -sn : 0.04 * sn));
    const ex = sx + 0.32 * c;
    const ey = side * (0.26 + (recovering ? 0.2 * -sn : 0));
    ctx.strokeStyle = s.skin;
    ctx.globalAlpha = recovering ? 1 : 0.55;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.lineTo(hx, hy);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  drawHead(ctx, s, x, y) {
    ctx.fillStyle = s.capColor;
    ellipse(ctx, x, y, 0.15, 0.13);
    // kacamata
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ellipse(ctx, x + 0.09, y - 0.06, 0.035, 0.03);
    ellipse(ctx, x + 0.09, y + 0.06, 0.035, 0.03);
    if (s.isPlayer) {
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 0.035;
      ctx.beginPath();
      ctx.ellipse(x, y, 0.2, 0.18, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  drawLabel(ctx, s, race) {
    const cam = this.camera;
    const p = cam.toScreen(s.poolX, s.y - 0.82);
    const fs = Math.max(9, cam.scale * 0.42);
    ctx.font = `700 ${fs}px ui-sans-serif, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (s.phase === 'finished' && s.place == null) {
      const idx = race.finishOrder.indexOf(s);
      if (idx >= 0) s.livePlace = idx + 1;
    }
    const place = s.place ?? s.livePlace;
    if (s.phase === 'finished' && place) {
      const medal = ['#facc15', '#e2e8f0', '#f59e0b'][place - 1] ?? '#334155';
      const q = cam.toScreen(s.poolX + (s.facing > 0 ? -1.4 : 1.4), s.y);
      ctx.fillStyle = medal;
      ctx.beginPath();
      ctx.arc(q.x, q.y, fs * 0.95, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = place <= 3 ? '#0f172a' : '#f8fafc';
      ctx.font = `800 ${fs * 1.05}px ui-sans-serif, system-ui, sans-serif`;
      ctx.fillText(String(place), q.x, q.y + 1);
    }

    if (s.isPlayer && s.phase !== 'finished') {
      const text = 'ANDA';
      ctx.font = `800 ${fs}px ui-sans-serif, system-ui, sans-serif`;
      const w = ctx.measureText(text).width + 10;
      ctx.fillStyle = 'rgba(220, 38, 38, 0.92)';
      ctx.beginPath();
      ctx.roundRect?.(p.x - w / 2, p.y - fs * 0.75, w, fs * 1.5, 4);
      if (!ctx.roundRect) ctx.rect(p.x - w / 2, p.y - fs * 0.75, w, fs * 1.5);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.fillText(text, p.x, p.y + 1);
    }
  }
}

function ellipse(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}
