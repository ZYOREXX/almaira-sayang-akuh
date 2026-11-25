import * as THREE from 'three';
import { POOL } from '../config.js';

const W = POOL.waterWidth;
const L = POOL.length;

export const CAMERA_MODES = ['chase', 'tv', 'top'];
export const CAMERA_LABELS = { chase: 'Belakang', tv: 'Siaran TV', top: 'Atas' };

/**
 * Kamera sinematik: orbit di menu, sapuan start block, kamera kejar
 * di belakang pemain, sudut siaran TV, tampak atas, dan sudut finis.
 */
export class CameraRig {
  constructor(camera) {
    this.camera = camera;
    this.mode = 'chase';
    this.pos = new THREE.Vector3(L / 2, 18, -20);
    this.look = new THREE.Vector3(L / 2, 0, W / 2);
    this.desiredPos = new THREE.Vector3();
    this.desiredLook = new THREE.Vector3();
    this.sideSign = 1;
  }

  cycle() {
    const i = CAMERA_MODES.indexOf(this.mode);
    this.mode = CAMERA_MODES[(i + 1) % CAMERA_MODES.length];
    return this.mode;
  }

  snap() {
    this.pos.copy(this.desiredPos);
    this.look.copy(this.desiredLook);
  }

  update(dt, race, head, t) {
    const p = race.player;
    const dp = this.desiredPos;
    const dl = this.desiredLook;
    let rate = 3;

    if (!race.live) {
      // Orbit perlahan di atas kolam (latar menu)
      const a = t * 0.06;
      dp.set(L / 2 + Math.cos(a) * 38, 15 + Math.sin(a * 0.7) * 3, W / 2 + Math.sin(a) * 26);
      dl.set(L / 2, -1, W / 2);
      rate = 1;
    } else if (race.state === 'prep') {
      dp.set(9, 3.6, W / 2 + 6);
      dl.set(-0.5, 1.2, W / 2);
      rate = 1.6;
    } else if (p.phase === 'block' || (race.state === 'marks')) {
      dp.set(3.2, 2.2, p.y + 2.6);
      dl.set(-0.3, 1.3, p.y);
      rate = 2;
    } else if (p.phase === 'finished') {
      const fx = p.poolX;
      const dir = p.facing;
      dp.set(fx - dir * 9, 4.2, W / 2 + 7);
      dl.set(fx - dir * 1, 0, W / 2);
      rate = 1.2;
    } else if (this.mode === 'chase') {
      const dir = p.phase === 'turn' && p.turn.progress > 0.55 ? -p.dir : p.facing;
      dp.set(head.x - dir * 3.9, 1.95, p.y + 0.55);
      dl.set(head.x + dir * 6, -0.35, p.y);
      rate = 2.6;
    } else if (this.mode === 'tv') {
      dp.set(head.x - p.facing * 3, 7.5, -9);
      dl.set(head.x + p.facing * 2, -0.5, W / 2 - 2);
      rate = 2;
    } else {
      dp.set(head.x - p.facing * 5, 20, W / 2 + 4);
      dl.set(head.x + p.facing * 3, -1, W / 2);
      rate = 2;
    }

    const k = 1 - Math.exp(-rate * dt);
    this.pos.lerp(dp, k);
    this.look.lerp(dl, k);
    this.camera.position.copy(this.pos);
    this.camera.lookAt(this.look);
  }
}
