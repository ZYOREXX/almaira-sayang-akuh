/**
 * Adegan 3D hero (three.js): lima arena olahraga tampak sebagai denah bercahaya di lantai gelap.
 * Kamera berpindah dari satu arena ke arena berikutnya mengikuti nilai `getT()` (0 sampai 4),
 * yang dihitung dari posisi gulir. Modul ini dimuat secara malas agar tidak membebani muat awal.
 */
import * as THREE from 'three';

const SPACING = 72;
const GOLD = 0xf0c676;
const BG = 0x060607;

type Seg = number[];

const line = (s: Seg, x1: number, z1: number, x2: number, z2: number) => s.push(x1, 0, z1, x2, 0, z2);

function rect(s: Seg, x: number, z: number, w: number, h: number) {
  line(s, x, z, x + w, z);
  line(s, x + w, z, x + w, z + h);
  line(s, x + w, z + h, x, z + h);
  line(s, x, z + h, x, z);
}

function arc(s: Seg, cx: number, cz: number, r: number, from: number, to: number, steps = 40) {
  for (let i = 0; i < steps; i++) {
    const a = from + ((to - from) * i) / steps;
    const b = from + ((to - from) * (i + 1)) / steps;
    line(s, cx + Math.cos(a) * r, cz + Math.sin(a) * r, cx + Math.cos(b) * r, cz + Math.sin(b) * r);
  }
}

/** Bentuk stadion: dua lurusan dan dua tikungan setengah lingkaran. */
function stadium(s: Seg, halfStraight: number, r: number) {
  line(s, -halfStraight, -r, halfStraight, -r);
  line(s, -halfStraight, r, halfStraight, r);
  arc(s, halfStraight, 0, r, -Math.PI / 2, Math.PI / 2);
  arc(s, -halfStraight, 0, r, Math.PI / 2, (3 * Math.PI) / 2);
}

/** Lima arena, digambar berpusat di titik asal dengan proporsi ukuran resmi. */
const venues: ((s: Seg) => void)[] = [
  // Lintasan atletik 400 m, delapan lintasan
  (s) => {
    for (let i = 0; i <= 8; i++) stadium(s, 14, 8 + i * 0.9);
    rect(s, -11, -5.5, 22, 11);
    line(s, 0, -5.5, 0, 5.5);
    arc(s, 0, 0, 2, 0, Math.PI * 2);
  },
  // Sepak bola 105 x 68 m
  (s) => {
    rect(s, -21, -13.6, 42, 27.2);
    line(s, 0, -13.6, 0, 13.6);
    arc(s, 0, 0, 3.66, 0, Math.PI * 2);
    rect(s, -21, -8.06, 6.6, 16.12);
    rect(s, 14.4, -8.06, 6.6, 16.12);
    rect(s, -21, -3.66, 2.2, 7.32);
    rect(s, 18.8, -3.66, 2.2, 7.32);
  },
  // Bola basket 28 x 15 m
  (s) => {
    rect(s, -21, -11.25, 42, 22.5);
    line(s, 0, -11.25, 0, 11.25);
    arc(s, 0, 0, 2.7, 0, Math.PI * 2);
    rect(s, -21, -3.68, 8.7, 7.36);
    rect(s, 12.3, -3.68, 8.7, 7.36);
    arc(s, -18.6, 0, 10.1, -Math.PI / 2.25, Math.PI / 2.25);
    arc(s, 18.6, 0, 10.1, Math.PI - Math.PI / 2.25, Math.PI + Math.PI / 2.25);
  },
  // Kolam renang 50 x 25 m, delapan lintasan
  (s) => {
    rect(s, -21, -10.5, 42, 21);
    for (let i = 1; i < 8; i++) {
      const z = -10.5 + (i * 21) / 8;
      for (let x = -21; x < 21; x += 2.4) line(s, x, z, Math.min(x + 1.5, 21), z);
    }
  },
  // Bola voli 18 x 9 m
  (s) => {
    rect(s, -21, -10.5, 42, 21);
    line(s, 0, -12, 0, 12);
    line(s, -7, -10.5, -7, 10.5);
    line(s, 7, -10.5, 7, 10.5);
  },
];

export const CHAPTERS = venues.length;

export function createStoryScene(canvas: HTMLCanvasElement, getT: () => number, getOrbit: () => number = () => 0) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setClearColor(BG);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(BG, 0.0125);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 400);

  // Denah arena
  const lineMaterial = new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.9 });
  const glowTexture = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d')!;
    const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, 'rgba(224,150,60,0.55)');
    grad.addColorStop(0.5, 'rgba(160,80,30,0.16)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  })();
  const glowMaterial = new THREE.MeshBasicMaterial({
    map: glowTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const glowGeometry = new THREE.PlaneGeometry(96, 70);

  venues.forEach((draw, i) => {
    const seg: Seg = [];
    draw(seg);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(seg, 3));
    const lines = new THREE.LineSegments(geometry, lineMaterial);
    lines.position.x = i * SPACING;
    scene.add(lines);
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.rotation.x = -Math.PI / 2;
    glow.position.set(i * SPACING, -0.2, 0);
    scene.add(glow);
  });

  // Lantai bergaris halus
  const grid = new THREE.GridHelper(SPACING * (CHAPTERS + 3), 120, 0x2a2420, 0x15130f);
  grid.position.set((SPACING * (CHAPTERS - 1)) / 2, -0.4, 0);
  scene.add(grid);

  // Debu cahaya
  const dustCount = 700;
  const dust = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dust[i * 3] = -SPACING + Math.random() * SPACING * (CHAPTERS + 1);
    dust[i * 3 + 1] = Math.random() * 26;
    dust[i * 3 + 2] = (Math.random() - 0.5) * 90;
  }
  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute('position', new THREE.BufferAttribute(dust, 3));
  const points = new THREE.Points(
    dustGeometry,
    new THREE.PointsMaterial({ color: 0xf3e2bd, size: 0.14, transparent: true, opacity: 0.55, depthWrite: false }),
  );
  scene.add(points);

  // Bola bercahaya beserta jejak lintasannya (parabola)
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.75, 32, 32), new THREE.MeshBasicMaterial({ color: 0xfff1d0 }));
  const halo = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: glowTexture, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.9 }),
  );
  halo.scale.set(9, 9, 1);
  ball.add(halo);
  scene.add(ball);

  const TRAIL = 90;
  const trailPositions = new Float32Array(TRAIL * 3);
  const trailGeometry = new THREE.BufferGeometry();
  trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
  const trail = new THREE.Line(
    trailGeometry,
    new THREE.LineBasicMaterial({ color: 0xfff1d0, transparent: true, opacity: 0.45 }),
  );
  trail.frustumCulled = false;
  scene.add(trail);

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w < h ? 58 : 42;
    camera.updateProjectionMatrix();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();

  let running = true;
  let frame = 0;
  let smooth = getT();
  let orbit = 0;
  let ballX = smooth * SPACING;
  for (let i = 0; i < TRAIL; i++) trailPositions.set([ballX, 0.8, 0], i * 3);
  const clock = new THREE.Clock();
  const target = new THREE.Vector3();

  const tick = () => {
    if (!running) return;
    frame = requestAnimationFrame(tick);
    const time = clock.getElapsedTime();
    smooth += (getT() - smooth) * 0.06;

    // Kamera: mulai dari atas, lalu turun dan mengitari tiap arena
    const lift = Math.max(0, 1 - smooth * 1.4);
    orbit += (getOrbit() - orbit) * 0.05;
    const angle = -0.55 + smooth * 0.5 + Math.sin(time * 0.12) * 0.08 + orbit;
    const radius = (camera.aspect < 1 ? 58 : 42) - Math.min(smooth, 1) * 4;
    const height = 17 + lift * lift * 40 + Math.sin(time * 0.3) * 0.5;
    target.set(smooth * SPACING, 0, 0);
    camera.position.set(target.x + Math.sin(angle) * radius, height, Math.cos(angle) * radius);
    camera.lookAt(target);

    // Bola memantul mengikuti kamera
    ballX += (smooth * SPACING - ballX) * 0.045;
    const bounce = Math.abs(Math.sin(time * 1.6));
    ball.position.set(ballX + Math.sin(time * 0.7) * 7, 0.8 + bounce * 6.5, Math.cos(time * 0.5) * 6);
    trailPositions.copyWithin(3, 0, (TRAIL - 1) * 3);
    trailPositions[0] = ball.position.x;
    trailPositions[1] = ball.position.y;
    trailPositions[2] = ball.position.z;
    trailGeometry.attributes.position.needsUpdate = true;

    points.rotation.y = Math.sin(time * 0.05) * 0.02;
    renderer.render(scene, camera);
  };
  tick();

  return {
    setRunning(next: boolean) {
      if (next === running) return;
      running = next;
      if (running) tick();
      else cancelAnimationFrame(frame);
    },
    dispose() {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose();
      });
      glowTexture.dispose();
      renderer.dispose();
    },
  };
}
