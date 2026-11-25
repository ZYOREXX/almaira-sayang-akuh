import * as THREE from 'three';
import { POOL } from '../config.js';
import { rand } from '../core/utils.js';
import { softDotTexture } from './textures.js';

const MAX = 2500;
const RINGS = 60;

/**
 * Efek air 3D: butiran cipratan (gravitasi), buih di permukaan,
 * dan cincin riak. Satu draw call untuk semua partikel.
 */
export class Effects3D {
  constructor(scene, bus) {
    this.scene = scene;
    this.parts = [];
    this.foamTimer = 0;

    const geo = new THREE.BufferGeometry();
    this.pos = new Float32Array(MAX * 3);
    this.alpha = new Float32Array(MAX);
    this.size = new Float32Array(MAX);
    geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('aAlpha', new THREE.BufferAttribute(this.alpha, 1).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('aSize', new THREE.BufferAttribute(this.size, 1).setUsage(THREE.DynamicDrawUsage));
    geo.setDrawRange(0, 0);
    this.geo = geo;
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uTex: { value: softDotTexture() }, uScale: { value: 400 } },
      vertexShader: /* glsl */ `
        attribute float aAlpha;
        attribute float aSize;
        uniform float uScale;
        varying float vAlpha;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * uScale / -mv.z;
          vAlpha = aAlpha;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uTex;
        varying float vAlpha;
        void main() {
          vec4 c = texture2D(uTex, gl_PointCoord);
          gl_FragColor = vec4(vec3(0.95, 0.99, 1.0), c.a * vAlpha);
        }
      `,
    });
    this.points = new THREE.Points(geo, this.material);
    this.points.frustumCulled = false;
    this.points.renderOrder = 12;
    scene.add(this.points);

    // Cincin riak
    const ringGeo = new THREE.RingGeometry(0.85, 1, 40);
    ringGeo.rotateX(-Math.PI / 2);
    this.rings = [];
    for (let i = 0; i < RINGS; i++) {
      const m = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0, depthWrite: false }));
      m.visible = false;
      m.renderOrder = 11;
      scene.add(m);
      this.rings.push({ mesh: m, age: 0, life: 1, maxR: 1 });
    }
    this.ringIdx = 0;
    this.bind(bus);
  }

  bind(bus) {
    bus.on('stroke', ({ swimmer: s, arm }) => {
      const side = arm ? 1 : -1;
      const x = s.poolX + s.facing * 0.55;
      this.splash(x, s.y + side * 0.22, 10, 1.6, 1.4);
      this.ring(x, s.y + side * 0.22, 0.9, 0.7);
    });
    bus.on('entry', ({ swimmer: s, quality }) => {
      this.splash(s.poolX - 0.4, s.y, 60 + quality * 30, 3.2, 2.8);
      this.ring(s.poolX - 0.4, s.y, 2.6, 1.4);
      this.ring(s.poolX - 0.4, s.y, 1.5, 1.0);
    });
    bus.on('turnStart', ({ swimmer: s }) => {
      const wallX = s.dir > 0 ? POOL.length : 0;
      this.splash(wallX - s.dir * 0.8, s.y, 40, 2.6, 2.2);
      this.ring(wallX - s.dir * 0.8, s.y, 1.8, 1.1);
    });
    bus.on('pushOff', ({ swimmer: s }) => this.ring(s.poolX, s.y, 1.5, 1.0));
    bus.on('finish', ({ swimmer: s }) => {
      this.splash(s.poolX, s.y, 70, 3, 3);
      this.ring(s.poolX, s.y, 2.6, 1.4);
    });
  }

  add(p) {
    if (this.parts.length >= MAX) this.parts.shift();
    this.parts.push(p);
  }

  splash(x, z, count, spread, up) {
    for (let i = 0; i < count; i++) {
      const a = rand(0, Math.PI * 2);
      const r = rand(0.2, 1) * spread;
      this.add({
        kind: 'drop', x, y: 0.05, z,
        vx: Math.cos(a) * r * 0.6, vy: rand(0.4, 1) * up, vz: Math.sin(a) * r * 0.6,
        age: 0, life: rand(0.6, 1.2), size: rand(0.04, 0.1),
      });
    }
  }

  foam(x, z, size, life = 1) {
    this.add({
      kind: 'foam', x: x + rand(-0.12, 0.12), y: 0.03, z: z + rand(-0.2, 0.2),
      vx: rand(-0.1, 0.1), vy: 0, vz: rand(-0.2, 0.2),
      age: 0, life: rand(0.6, 1.2) * life, size,
    });
  }

  ring(x, z, maxR, life) {
    const r = this.rings[this.ringIdx++ % RINGS];
    r.mesh.position.set(x, 0.04, z);
    r.age = 0;
    r.life = life;
    r.maxR = maxR;
    r.mesh.visible = true;
  }

  emitWakes(dt, swimmers) {
    this.foamTimer += dt;
    if (this.foamTimer < 1 / 45) return;
    this.foamTimer = 0;
    for (const s of swimmers) {
      if (s.phase !== 'swim' && s.phase !== 'turn') continue;
      if (s.underwater) {
        if (Math.random() < 0.3) this.foam(s.poolX - s.facing * 0.6, s.y, 0.08, 0.6);
        continue;
      }
      const k = Math.min(1, s.v / 2.2);
      // buih tendangan kaki
      this.foam(s.poolX - s.facing * 1.55, s.y, 0.16 + k * 0.14);
      if (Math.random() < k) this.foam(s.poolX - s.facing * 1.75, s.y, 0.2 + k * 0.1);
      // percikan kecil dari kaki
      if (Math.random() < k * 0.6) {
        this.add({
          kind: 'drop', x: s.poolX - s.facing * 1.6 + rand(-0.1, 0.1), y: 0.05, z: s.y + rand(-0.12, 0.12),
          vx: -s.facing * rand(0, 0.4), vy: rand(0.8, 1.6), vz: rand(-0.3, 0.3),
          age: 0, life: 0.5, size: rand(0.03, 0.06),
        });
      }
      // gelombang haluan di kepala
      if (Math.random() < k * 0.7) this.foam(s.poolX + s.facing * 0.15, s.y + rand(-0.25, 0.25), 0.1, 0.5);
    }
  }

  update(dt) {
    const g = -9.8;
    const parts = this.parts;
    let n = 0;
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.age += dt;
      if (p.kind === 'drop') {
        p.vy += g * dt;
        p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
        if (p.y < 0 && p.vy < 0) {
          parts.splice(i, 1);
          if (Math.random() < 0.3) this.foam(p.x, p.z, 0.08, 0.5);
          continue;
        }
      } else {
        p.x += p.vx * dt; p.z += p.vz * dt;
        p.vx *= 0.98; p.vz *= 0.98;
      }
      if (p.age >= p.life) { parts.splice(i, 1); continue; }
    }
    for (const p of parts) {
      if (n >= MAX) break;
      const k = 1 - p.age / p.life;
      this.pos[n * 3] = p.x;
      this.pos[n * 3 + 1] = p.y;
      this.pos[n * 3 + 2] = p.z;
      if (p.kind === 'drop') {
        this.alpha[n] = 0.9 * Math.min(1, k * 2);
        this.size[n] = p.size;
      } else {
        this.alpha[n] = 0.55 * k;
        this.size[n] = p.size * (1 + (1 - k) * 1.5);
      }
      n++;
    }
    this.geo.setDrawRange(0, n);
    this.geo.attributes.position.needsUpdate = true;
    this.geo.attributes.aAlpha.needsUpdate = true;
    this.geo.attributes.aSize.needsUpdate = true;

    for (const r of this.rings) {
      if (!r.mesh.visible) continue;
      r.age += dt;
      const t = r.age / r.life;
      if (t >= 1) { r.mesh.visible = false; continue; }
      const sc = 0.15 + r.maxR * t;
      r.mesh.scale.set(sc, 1, sc * 0.85);
      r.mesh.material.opacity = 0.4 * (1 - t);
    }
  }

  setPixelScale(heightPx) {
    this.material.uniforms.uScale.value = heightPx * 0.9;
  }

  clear() {
    this.parts.length = 0;
    this.rings.forEach((r) => { r.mesh.visible = false; });
  }
}
