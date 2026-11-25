import * as THREE from 'three';
import { POOL, PLAYER_LANE, TURN, laneCenterY } from '../config.js';
import { createWaterMaterial, createPoolFloorMaterial, MAX_WAKES } from './WaterMaterials.js';
import { tileTexture, deckTexture, laneNumberTexture, bannerTexture } from './textures.js';

export const DEPTH = 2.2;
export const DECK_Y = 0.25;
export const BLOCK_TOP = 0.95;
const L = POOL.length;
const W = POOL.waterWidth;

/**
 * Kolam 50 m: cekungan berubin dengan caustics, air beranimasi,
 * tali lintasan (instanced), start block bernomor, bendera 5 m,
 * gantry FINISH, dan zona flip turn pemain.
 */
export class Pool3D {
  constructor(scene) {
    this.group = new THREE.Group();
    scene.add(this.group);
    this.tiles = tileTexture();
    this.floorMats = [];
    this.buildBasin();
    this.buildDeck();
    this.buildLaneLines();
    this.buildRopes();
    this.buildBlocks();
    this.buildFlags();
    this.buildWater();
    this.buildTurnZone();
    this.buildGantries();
  }

  /** Material ubin + caustics; UV geometri sudah dalam meter. */
  floorMaterial() {
    const m = createPoolFloorMaterial(this.tiles, { repeat: 1 });
    this.floorMats.push(m);
    return m;
  }

  buildBasin() {
    // Dasar kolam
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(L, W), this.floorMaterial());
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(L / 2, -DEPTH, W / 2);
    setUvRepeat(floor.geometry, L, W);
    this.group.add(floor);

    // Dinding dalam (4 sisi)
    const walls = [
      { w: L, pos: [L / 2, -DEPTH / 2, 0], rotY: 0 },
      { w: L, pos: [L / 2, -DEPTH / 2, W], rotY: Math.PI },
      { w: W, pos: [0, -DEPTH / 2, W / 2], rotY: Math.PI / 2 },
      { w: W, pos: [L, -DEPTH / 2, W / 2], rotY: -Math.PI / 2 },
    ];
    for (const wl of walls) {
      const g = new THREE.PlaneGeometry(wl.w, DEPTH + DECK_Y);
      setUvRepeat(g, wl.w, DEPTH + DECK_Y);
      const m = new THREE.Mesh(g, this.floorMaterial());
      m.position.set(wl.pos[0], wl.pos[1] + DECK_Y / 2, wl.pos[2]);
      m.rotation.y = wl.rotY;
      this.group.add(m);
    }

    // Touch pad kuning di kedua ujung
    const padMat = new THREE.MeshStandardMaterial({ color: '#facc15', roughness: 0.5 });
    for (const x of [0.02, L - 0.02]) {
      const pad = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.9, W), padMat);
      pad.position.set(x, -0.25, W / 2);
      this.group.add(pad);
    }
  }

  buildDeck() {
    const tex = deckTexture();
    tex.repeat.set(30, 20);
    const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.75, metalness: 0 });
    const outer = 16;
    // Dek dibentuk dari 4 potong mengelilingi kolam
    const pieces = [
      [L + outer * 2, outer, L / 2, -outer / 2],
      [L + outer * 2, outer, L / 2, W + outer / 2],
      [outer, W, -outer / 2, W / 2],
      [outer, W, L + outer / 2, W / 2],
    ];
    for (const [w, d, x, z] of pieces) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, 0.5, d), mat);
      m.position.set(x, DECK_Y - 0.25, z);
      m.receiveShadow = true;
      this.group.add(m);
    }
    // Bibir kolam putih (coping)
    const coping = new THREE.MeshStandardMaterial({ color: '#f1f5f9', roughness: 0.4 });
    const c1 = new THREE.BoxGeometry(L + 0.6, 0.12, 0.3);
    const c2 = new THREE.BoxGeometry(0.3, 0.12, W + 0.6);
    for (const z of [-0.15, W + 0.15]) {
      const m = new THREE.Mesh(c1, coping); m.position.set(L / 2, DECK_Y + 0.02, z); this.group.add(m);
    }
    for (const x of [-0.15, L + 0.15]) {
      const m = new THREE.Mesh(c2, coping); m.position.set(x, DECK_Y + 0.02, W / 2); this.group.add(m);
    }
  }

  buildLaneLines() {
    const mat = new THREE.MeshBasicMaterial({ color: '#123a63' });
    const geoLine = new THREE.BoxGeometry(L - 4, 0.02, 0.25);
    const geoT = new THREE.BoxGeometry(0.25, 0.02, 1.0);
    const geoWall = new THREE.BoxGeometry(0.02, 1.0, 0.25);
    for (let lane = 1; lane <= POOL.lanes; lane++) {
      const z = laneCenterY(lane);
      const line = new THREE.Mesh(geoLine, mat); line.position.set(L / 2, -DEPTH + 0.012, z); this.group.add(line);
      for (const x of [2.1, L - 2.1]) {
        const t = new THREE.Mesh(geoT, mat); t.position.set(x, -DEPTH + 0.012, z); this.group.add(t);
      }
      for (const x of [0.012, L - 0.012]) {
        const t = new THREE.Mesh(geoWall, mat); t.position.set(x, -0.9, z); this.group.add(t);
      }
    }
  }

  buildRopes() {
    const spacing = 0.13;
    const perRope = Math.floor(L / spacing);
    const count = perRope * (POOL.lanes + 1);
    const geo = new THREE.CylinderGeometry(0.075, 0.075, 0.1, 14);
    geo.rotateZ(Math.PI / 2);
    const mat = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.05 });
    const mesh = new THREE.InstancedMesh(geo, mat, count);
    const m = new THREE.Matrix4();
    const color = new THREE.Color();
    let i = 0;
    for (let r = 0; r <= POOL.lanes; r++) {
      const z = POOL.sideWater + r * POOL.laneWidth;
      for (let k = 0; k < perRope; k++) {
        const x = k * spacing + spacing / 2;
        m.makeTranslation(x, 0.02, z);
        mesh.setMatrixAt(i, m);
        let c;
        if (x < 5 || x > L - 5) c = '#e11d48';
        else if (Math.abs(x - 15) < 0.5 || Math.abs(x - (L - 15)) < 0.5) c = '#f8fafc';
        else c = Math.floor(x / 1.0) % 2 === 0 ? '#1d4ed8' : (r === 0 || r === POOL.lanes ? '#1d4ed8' : '#fbbf24');
        mesh.setColorAt(i, color.set(c));
        i++;
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.castShadow = false;
    this.group.add(mesh);
  }

  buildBlocks() {
    const baseMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.5, metalness: 0.3 });
    const topMat = new THREE.MeshStandardMaterial({ color: '#e2e8f0', roughness: 0.8 });
    for (const end of [0, 1]) {
      for (let lane = 1; lane <= POOL.lanes; lane++) {
        const z = laneCenterY(lane);
        const x = end === 0 ? -0.42 : L + 0.42;
        const g = new THREE.Group();
        const base = new THREE.Mesh(new THREE.BoxGeometry(0.6, BLOCK_TOP - DECK_Y, 0.55), baseMat);
        base.position.y = (BLOCK_TOP - DECK_Y) / 2 + DECK_Y;
        const top = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.06, 0.6), topMat);
        top.position.y = BLOCK_TOP;
        top.rotation.z = end === 0 ? -0.1 : 0.1;
        const num = new THREE.Mesh(
          new THREE.PlaneGeometry(0.4, 0.4),
          new THREE.MeshBasicMaterial({ map: laneNumberTexture(lane, lane === PLAYER_LANE ? '#ef4444' : '#38bdf8') }),
        );
        num.position.set(end === 0 ? 0.305 : -0.305, (BLOCK_TOP + DECK_Y) / 2 + 0.05, 0);
        num.rotation.y = end === 0 ? Math.PI / 2 : -Math.PI / 2;
        g.add(base, top, num);
        g.position.set(x, 0, z);
        base.castShadow = true;
        this.group.add(g);
      }
    }
  }

  buildFlags() {
    const flagGeo = new THREE.BufferGeometry();
    flagGeo.setAttribute('position', new THREE.Float32BufferAttribute([-0.15, 0, 0, 0.15, 0, 0, 0, -0.3, 0], 3));
    flagGeo.computeVertexNormals();
    const colors = ['#ef4444', '#f8fafc', '#2563eb'];
    const mat = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, roughness: 0.7 });
    const n = Math.ceil((W + 2) / 0.45);
    const poleMat = new THREE.MeshStandardMaterial({ color: '#94a3b8', metalness: 0.6, roughness: 0.3 });
    for (const fx of [5, L - 5]) {
      const flags = new THREE.InstancedMesh(flagGeo, mat, n);
      const m = new THREE.Matrix4();
      const col = new THREE.Color();
      for (let i = 0; i < n; i++) {
        m.makeRotationY(Math.PI / 2).setPosition(fx, 1.8, -1 + i * 0.45);
        flags.setMatrixAt(i, m);
        flags.setColorAt(i, col.set(colors[i % 3]));
      }
      this.group.add(flags);
      for (const z of [-1.2, W + 1.2]) {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.8, 8), poleMat);
        pole.position.set(fx, DECK_Y + 0.9, z);
        this.group.add(pole);
      }
      const line = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.01, W + 2.4), poleMat);
      line.position.set(fx, 1.8, W / 2);
      this.group.add(line);
    }
  }

  buildWater() {
    this.waterMat = createWaterMaterial();
    const geo = new THREE.PlaneGeometry(L, W, 240, 100);
    geo.rotateX(-Math.PI / 2);
    this.water = new THREE.Mesh(geo, this.waterMat);
    this.water.position.set(L / 2, 0, W / 2);
    this.water.renderOrder = 10;
    this.group.add(this.water);
  }

  buildTurnZone() {
    const z = laneCenterY(PLAYER_LANE);
    const w = POOL.laneWidth - 0.4;
    const mk = (len, color) => {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(len, w),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.3, depthWrite: false }),
      );
      m.rotation.x = -Math.PI / 2;
      m.position.y = 0.05;
      m.position.z = z;
      m.renderOrder = 11;
      m.visible = false;
      this.group.add(m);
      return m;
    };
    this.zoneAll = mk(TURN.zoneStart, '#facc15');
    this.zoneIdeal = mk(TURN.idealFar - TURN.idealNear, '#22c55e');
  }

  buildGantries() {
    this.gantries = {};
    const frameMat = new THREE.MeshStandardMaterial({ color: '#cbd5e1', metalness: 0.7, roughness: 0.3 });
    for (const end of [0, 1]) {
      const g = new THREE.Group();
      const x = end === 0 ? 0 : L;
      for (const z of [-1.4, W + 1.4]) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4.2, 0.2), frameMat);
        post.position.set(0, DECK_Y + 2.1, z);
        g.add(post);
      }
      const beam = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.9, W + 3), frameMat);
      beam.position.set(0, DECK_Y + 4.0, W / 2);
      g.add(beam);
      g.position.x = x;
      this.group.add(g);
      this.gantries[end] = { group: g, faces: [] };
    }
    this.finishTex = bannerTexture('FINISH', { bg: '#0b1324', fg: '#facc15', accent: '#facc15', checker: true });
    this.turnTex = bannerTexture('TURN', { bg: '#0b1324', fg: '#e2e8f0', accent: '#38bdf8' });
    for (const end of [0, 1]) {
      for (const side of [-1, 1]) {
        const face = new THREE.Mesh(new THREE.PlaneGeometry(W + 3, 0.85), new THREE.MeshBasicMaterial({ map: this.turnTex }));
        face.position.set(side * 0.13, DECK_Y + 4.0, W / 2);
        face.rotation.y = side > 0 ? Math.PI / 2 : -Math.PI / 2;
        this.gantries[end].group.add(face);
        this.gantries[end].faces.push(face);
      }
    }
    // Pita kotak-kotak di dinding finis (diatur per lomba)
    this.checker = new THREE.Mesh(
      new THREE.PlaneGeometry(W, 0.35),
      new THREE.MeshBasicMaterial({ map: bannerTexture('', { bg: '#f8fafc', checker: true, w: 1024, h: 32, accent: '#f8fafc' }) }),
    );
    this.group.add(this.checker);
  }

  /** Atur gantry FINISH sesuai jarak lomba. */
  configure(distance) {
    const lengths = Math.round(distance / L);
    const finishEnd = lengths % 2 === 1 ? 1 : 0;
    for (const end of [0, 1]) {
      const tex = end === finishEnd ? this.finishTex : this.turnTex;
      this.gantries[end].faces.forEach((f) => { f.material.map = tex; f.material.needsUpdate = true; });
    }
    const x = finishEnd ? L + 0.01 : -0.01;
    this.checker.position.set(x, DECK_Y - 0.05, W / 2);
    this.checker.rotation.y = finishEnd ? -Math.PI / 2 : Math.PI / 2;
  }

  update(t, race) {
    this.waterMat.uniforms.uTime.value = t;
    for (const m of this.floorMats) m.uniforms.uTime.value = t;

    // Gelombang di sekitar perenang
    const wakes = this.waterMat.uniforms.uWakes.value;
    race.swimmers.slice(0, MAX_WAKES).forEach((s, i) => {
      const active = (s.phase === 'swim' && s.glide <= 0) || s.phase === 'turn' || s.phase === 'finished';
      wakes[i].set(s.poolX, s.y, Math.min(s.v / 2.2, 1.3) + (s.phase === 'finished' ? 0.4 : 0), active ? s.facing : 0);
    });

    // Zona flip turn pemain
    const p = race.player;
    const show = race.racing && p.phase === 'swim' && !p.isFinalLength && p.distToWall <= TURN.zoneStart + 3;
    this.zoneAll.visible = this.zoneIdeal.visible = show;
    if (show) {
      const wallX = p.dir > 0 ? L : 0;
      const pulse = 0.25 + 0.15 * Math.sin(t * 10);
      this.zoneAll.position.x = wallX - p.dir * (TURN.zoneStart / 2);
      this.zoneIdeal.position.x = wallX - p.dir * ((TURN.idealNear + TURN.idealFar) / 2);
      this.zoneAll.material.opacity = pulse;
      this.zoneIdeal.material.opacity = pulse + 0.25;
    }
  }
}

/** Skala UV agar 1 tile tekstur = 1 m. */
function setUvRepeat(geo, u, v) {
  const uv = geo.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * u, uv.getY(i) * v);
  uv.needsUpdate = true;
}
