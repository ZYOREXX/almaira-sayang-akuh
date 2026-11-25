import { POOL } from '../config.js';
import { rand } from '../core/utils.js';

/**
 * Sistem partikel air: cipratan (droplet), buih (foam), dan riak (ripple).
 * Semua dalam satuan meter.
 */
export class Particles {
  constructor(camera, bus) {
    this.camera = camera;
    this.items = [];
    this.max = 1400;
    this.foamTimer = 0;
    this.bind(bus);
  }

  bind(bus) {
    bus.on('stroke', ({ swimmer: s, arm }) => {
      const side = arm ? 1 : -1;
      const hx = s.poolX + s.facing * 0.25;
      this.splash(hx, s.y + side * 0.3, 6, 0.9, s.facing);
      this.ripple(hx, s.y + side * 0.3, 0.9, 0.7);
    });
    bus.on('entry', ({ swimmer: s, quality }) => {
      this.splash(s.poolX, s.y, 28 + quality * 10, 2.2, s.dir);
      this.ripple(s.poolX - 0.5 * s.dir, s.y, 2.4, 1.3);
      this.ripple(s.poolX - 0.5 * s.dir, s.y, 1.4, 1.0);
    });
    bus.on('turnStart', ({ swimmer: s }) => {
      const wallX = s.dir > 0 ? POOL.length : 0;
      this.splash(wallX - s.dir * 0.6, s.y, 18, 1.6, -s.dir);
      this.ripple(wallX - s.dir * 0.6, s.y, 1.8, 1.1);
    });
    bus.on('pushOff', ({ swimmer: s }) => {
      this.ripple(s.poolX, s.y, 1.5, 1.0);
    });
    bus.on('finish', ({ swimmer: s }) => {
      this.splash(s.poolX, s.y, 30, 2.4, -s.facing);
      this.ripple(s.poolX, s.y, 2.6, 1.4);
    });
  }

  add(p) {
    if (this.items.length >= this.max) this.items.shift();
    this.items.push(p);
  }

  splash(x, y, count, power, dir = 0) {
    for (let i = 0; i < count; i++) {
      const a = rand(0, Math.PI * 2);
      const sp = rand(0.4, 1) * power;
      this.add({
        type: 'drop',
        x, y,
        vx: Math.cos(a) * sp - dir * rand(0, 0.6),
        vy: Math.sin(a) * sp * 0.8,
        life: rand(0.35, 0.75),
        age: 0,
        r: rand(0.04, 0.11),
      });
    }
  }

  ripple(x, y, maxR, life) {
    this.add({ type: 'ring', x, y, r: 0.1, maxR, life, age: 0 });
  }

  foam(x, y, size) {
    this.add({
      type: 'foam',
      x: x + rand(-0.1, 0.1),
      y: y + rand(-0.15, 0.15),
      vx: rand(-0.1, 0.1),
      vy: rand(-0.15, 0.15),
      r: size * rand(0.6, 1.1),
      life: rand(0.6, 1.2),
      age: 0,
    });
  }

  /** Buih dari kaki dan jejak (wake) di belakang perenang yang bergerak. */
  emitWakes(dt, swimmers) {
    this.foamTimer += dt;
    if (this.foamTimer < 1 / 40) return;
    this.foamTimer = 0;
    for (const s of swimmers) {
      if (s.phase !== 'swim' && s.phase !== 'turn') continue;
      if (s.underwater) {
        if (Math.random() < 0.35) this.foam(s.poolX - s.facing * 0.6, s.y, 0.08);
        continue;
      }
      const intensity = Math.min(1, s.v / 2.2);
      if (Math.random() < 0.4 + intensity * 0.6) {
        this.foam(s.poolX - s.facing * 1.9, s.y, 0.12 + intensity * 0.12);
      }
      if (Math.random() < intensity * 0.5) {
        this.foam(s.poolX + s.facing * 0.05, s.y + rand(-0.25, 0.25), 0.08);
      }
    }
  }

  update(dt) {
    const items = this.items;
    for (let i = items.length - 1; i >= 0; i--) {
      const p = items[i];
      p.age += dt;
      if (p.age >= p.life) {
        items.splice(i, 1);
        continue;
      }
      if (p.type === 'drop' || p.type === 'foam') {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const damp = p.type === 'drop' ? 2.5 : 1.2;
        p.vx *= Math.exp(-damp * dt);
        p.vy *= Math.exp(-damp * dt);
      } else if (p.type === 'ring') {
        p.r = 0.1 + (p.maxR - 0.1) * (p.age / p.life);
      }
    }
  }

  draw(ctx) {
    this.camera.apply(ctx);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, POOL.length, POOL.waterWidth);
    ctx.clip();
    for (const p of this.items) {
      const k = 1 - p.age / p.life;
      if (p.type === 'ring') {
        ctx.strokeStyle = `rgba(255,255,255,${0.35 * k})`;
        ctx.lineWidth = 0.05;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.r, p.r * 0.8, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (p.type === 'foam') {
        ctx.fillStyle = `rgba(240,249,255,${0.32 * k})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (1 + (1 - k) * 0.8), 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = `rgba(255,255,255,${0.85 * k})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (0.6 + 0.4 * k), 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  clear() {
    this.items.length = 0;
  }
}
