import * as THREE from 'three';
import { POOL } from '../config.js';
import { formatTime } from '../core/utils.js';
import { bannerTexture } from './textures.js';

const L = POOL.length;
const W = POOL.waterWidth;
const CROWD_COLORS = ['#ef4444', '#f8fafc', '#2563eb', '#facc15', '#22c55e', '#f97316', '#0ea5e9', '#a855f7', '#1e293b', '#ec4899'];

/**
 * Arena akuatik: tribun bertingkat dengan penonton (instanced),
 * atap dengan panel lampu, papan iklan, dan dua layar skor raksasa
 * yang menampilkan klasemen langsung.
 */
export class Stadium3D {
  constructor(scene) {
    this.group = new THREE.Group();
    scene.add(this.group);
    this.cheer = 0;
    this.buildStands();
    this.buildRoof();
    this.buildBoards();
    this.buildScreens();
    this.lastScreen = -1;
  }

  buildStands() {
    const seatMat = new THREE.MeshStandardMaterial({ color: '#1e3a5f', roughness: 0.8 });
    const rows = 16;
    const rowH = 0.55;
    const rowD = 0.85;
    const crowdPerRow = 150;
    const total = rows * crowdPerRow * 2;
    const body = new THREE.BoxGeometry(0.42, 0.62, 0.32);
    body.translate(0, 0.31, 0);
    const mat = new THREE.MeshStandardMaterial({ roughness: 0.9 });
    this.crowd = new THREE.InstancedMesh(body, mat, total);
    this.crowdBase = [];
    const m = new THREE.Matrix4();
    const c = new THREE.Color();
    let i = 0;
    for (const side of [-1, 1]) {
      const z0 = side < 0 ? -5.5 : W + 5.5;
      for (let r = 0; r < rows; r++) {
        const y = 0.3 + r * rowH;
        const z = z0 + side * r * rowD;
        const step = new THREE.Mesh(new THREE.BoxGeometry(L + 26, rowH, rowD), seatMat);
        step.position.set(L / 2, y - rowH / 2 + 0.25, z);
        this.group.add(step);
        for (let k = 0; k < crowdPerRow; k++) {
          const x = -12 + k * ((L + 24) / crowdPerRow) + (Math.random() - 0.5) * 0.12;
          const empty = Math.random() < 0.12;
          const s = empty ? 0.0001 : 0.85 + Math.random() * 0.3;
          m.makeScale(s, s, s).setPosition(x, y + 0.25, z);
          this.crowd.setMatrixAt(i, m);
          this.crowd.setColorAt(i, c.set(CROWD_COLORS[(Math.random() * CROWD_COLORS.length) | 0]));
          this.crowdBase.push({ x, y: y + 0.25, z, s, phase: Math.random() * 6.28 });
          i++;
        }
      }
      // Dinding belakang tribun
      const wall = new THREE.Mesh(
        new THREE.BoxGeometry(L + 30, 14, 0.5),
        new THREE.MeshStandardMaterial({ color: '#0f1f36', roughness: 0.9 }),
      );
      wall.position.set(L / 2, 7, z0 + side * (rows * rowD + 1));
      this.group.add(wall);
    }
    this.crowd.count = i;
    this.group.add(this.crowd);
  }

  buildRoof() {
    const roof = new THREE.Mesh(
      new THREE.PlaneGeometry(L + 60, W + 60),
      new THREE.MeshStandardMaterial({ color: '#0d1b30', roughness: 1, side: THREE.DoubleSide }),
    );
    roof.rotation.x = Math.PI / 2;
    roof.position.set(L / 2, 20, W / 2);
    this.group.add(roof);
    // Rangka atap
    const truss = new THREE.MeshStandardMaterial({ color: '#334155', metalness: 0.6, roughness: 0.4 });
    for (let x = -10; x <= L + 10; x += 8) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.8, W + 40), truss);
      b.position.set(x, 19.4, W / 2);
      this.group.add(b);
    }
    // Panel lampu
    const lampMat = new THREE.MeshBasicMaterial({ color: '#fffaf0' });
    const lampGeo = new THREE.BoxGeometry(2.6, 0.15, 1.0);
    const lamps = new THREE.InstancedMesh(lampGeo, lampMat, 7 * 4);
    const m = new THREE.Matrix4();
    let i = 0;
    for (let a = 0; a < 7; a++) {
      for (let b = 0; b < 4; b++) {
        m.makeTranslation(-2 + a * 9, 18.8, -4 + b * 9.6);
        lamps.setMatrixAt(i++, m);
      }
    }
    this.group.add(lamps);
  }

  buildBoards() {
    const ads = ['AQUATICS FINAL', 'FREESTYLE', 'SWIM FAST', 'LANE 4', 'WORLD AQUA SERIES', 'SPLASH'];
    let k = 0;
    for (const side of [-1, 1]) {
      const z = side < 0 ? -3.2 : W + 3.2;
      for (let x = -6; x < L + 6; x += 10) {
        const tex = bannerTexture(ads[k++ % ads.length], {
          bg: k % 2 ? '#0c4a6e' : '#111827', fg: '#e0f2fe', accent: k % 2 ? '#22d3ee' : '#f43f5e', w: 512, h: 64,
        });
        const b = new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.8, 0.1), [
          null, null, null, null,
          new THREE.MeshBasicMaterial({ map: tex }), new THREE.MeshBasicMaterial({ map: tex }),
        ].map((mm) => mm ?? new THREE.MeshStandardMaterial({ color: '#0f172a' })));
        b.position.set(x + 5, 0.65, z);
        this.group.add(b);
      }
    }
  }

  buildScreens() {
    this.screenCanvas = document.createElement('canvas');
    this.screenCanvas.width = 1024;
    this.screenCanvas.height = 512;
    this.screenTex = new THREE.CanvasTexture(this.screenCanvas);
    this.screenTex.colorSpace = THREE.SRGBColorSpace;
    const frame = new THREE.MeshStandardMaterial({ color: '#0f172a', metalness: 0.5, roughness: 0.4 });
    for (const end of [0, 1]) {
      const g = new THREE.Group();
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.4, 9, 17), frame);
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(16, 8), new THREE.MeshBasicMaterial({ map: this.screenTex, toneMapped: false }));
      screen.position.x = end === 0 ? 0.21 : -0.21;
      screen.rotation.y = end === 0 ? Math.PI / 2 : -Math.PI / 2;
      g.add(back, screen);
      g.position.set(end === 0 ? -14 : L + 14, 9, W / 2);
      this.group.add(g);
    }
    this.drawScreen(null, 0);
  }

  drawScreen(race, t) {
    const ctx = this.screenCanvas.getContext('2d');
    const w = 1024;
    const h = 512;
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#0b2545');
    g.addColorStop(1, '#020617');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(0, 0, w, 64);
    ctx.fillStyle = '#020617';
    ctx.font = '900 40px system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillText(race ? `${race.distance} M FREESTYLE · FINAL` : 'AQUATICS FINAL', 24, 34);
    ctx.textAlign = 'right';
    ctx.fillText(race ? formatTime(race.clock) : '', w - 24, 34);
    if (!race) return;
    const rows = race.standings();
    rows.forEach((s, i) => {
      const y = 96 + i * 51;
      ctx.fillStyle = s.isPlayer ? 'rgba(239,68,68,0.35)' : i % 2 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)';
      ctx.fillRect(16, y - 23, w - 32, 46);
      ctx.textAlign = 'left';
      ctx.fillStyle = i < 3 ? '#facc15' : '#e2e8f0';
      ctx.font = '900 34px system-ui, sans-serif';
      ctx.fillText(String(i + 1), 32, y);
      ctx.fillStyle = s.capColor;
      ctx.fillRect(84, y - 14, 28, 28);
      ctx.fillStyle = '#f8fafc';
      ctx.font = '700 32px system-ui, sans-serif';
      ctx.fillText(`${s.lane}  ${s.name.toUpperCase()}`, 130, y);
      ctx.textAlign = 'right';
      ctx.font = '700 30px ui-monospace, monospace';
      ctx.fillStyle = '#7dd3fc';
      ctx.fillText(s.finishTime != null ? formatTime(s.finishTime) : `${s.dist.toFixed(1)} m`, w - 32, y);
    });
    void t;
  }

  update(t, dt, race) {
    // Layar skor diperbarui 4× per detik
    const slot = Math.floor(t * 4);
    if (slot !== this.lastScreen) {
      this.lastScreen = slot;
      this.drawScreen(race, t);
      this.screenTex.needsUpdate = true;
    }
    // Penonton bersorak (lompat) saat ada momen seru
    this.cheer = Math.max(0, this.cheer - dt * 0.25);
    const excite = 0.04 + this.cheer * 0.35;
    if (Math.floor(t * 20) % 2 === 0) {
      const m = new THREE.Matrix4();
      const base = this.crowdBase;
      for (let i = 0; i < base.length; i++) {
        const b = base[i];
        const jump = Math.max(0, Math.sin(t * (6 + (i % 5)) + b.phase)) * excite;
        m.makeScale(b.s, b.s, b.s).setPosition(b.x, b.y + jump, b.z);
        this.crowd.setMatrixAt(i, m);
      }
      this.crowd.instanceMatrix.needsUpdate = true;
    }
  }
}
