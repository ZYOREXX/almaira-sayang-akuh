import * as THREE from 'three';
import { DIVE } from '../config.js';
import { clamp, lerp, easeInOut } from '../core/utils.js';
import { BLOCK_TOP, DEPTH } from './Pool3D.js';
import { playerMarkerTexture, placeTexture, blobTexture } from './textures.js';

const HEAD = 0.68; // jarak pinggul → kepala (m)
const AXIS_X = new THREE.Vector3(1, 0, 0);
const AXIS_Y = new THREE.Vector3(0, 1, 0);
const AXIS_Z = new THREE.Vector3(0, 0, 1);

const G = {
  torso: capsuleX(0.16, 0.42),
  suit: capsuleX(0.155, 0.14),
  upper: capsuleX(0.05, 0.22),
  fore: capsuleX(0.044, 0.2),
  thigh: capsuleX(0.075, 0.3),
  shin: capsuleX(0.055, 0.32),
  hand: new THREE.SphereGeometry(0.055, 10, 8),
  foot: new THREE.BoxGeometry(0.22, 0.06, 0.09),
  head: new THREE.SphereGeometry(0.105, 20, 16),
  cap: new THREE.SphereGeometry(0.112, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.62),
  goggle: new THREE.SphereGeometry(0.03, 10, 8),
};

function capsuleX(r, len) {
  const g = new THREE.CapsuleGeometry(r, len, 6, 12);
  g.rotateZ(Math.PI / 2);
  return g;
}

/** Satu perenang: rangka sederhana dari kapsul dengan pivot bahu, siku, pinggul, lutut. */
class SwimmerModel {
  constructor(s, markerTex) {
    this.s = s;
    const skin = new THREE.MeshStandardMaterial({ color: s.skin, roughness: 0.55 });
    const suit = new THREE.MeshStandardMaterial({ color: s.isPlayer ? '#b91c1c' : '#111827', roughness: 0.45 });
    const cap = new THREE.MeshStandardMaterial({ color: s.capColor, roughness: 0.25, metalness: 0.1 });
    const goggle = new THREE.MeshStandardMaterial({ color: '#0b1020', roughness: 0.1, metalness: 0.6 });

    this.root = new THREE.Group();
    this.body = new THREE.Group();
    this.root.add(this.body);

    const torso = mesh(G.torso, skin);
    torso.position.x = 0.3;
    torso.scale.set(1, 0.82, 1.28);
    const trunks = mesh(G.suit, suit);
    trunks.position.x = 0.02;
    trunks.scale.set(1, 0.85, 1.15);
    this.body.add(torso, trunks);

    // Kepala: wajah menghadap -y (ke dasar kolam saat telungkup)
    this.head = new THREE.Group();
    this.head.position.x = HEAD;
    const head = mesh(G.head, skin);
    const capM = mesh(G.cap, cap);
    capM.rotation.z = Math.PI / 2 - 0.35; // tutup bagian belakang-atas kepala
    capM.position.x = -0.01;
    const g1 = mesh(G.goggle, goggle);
    const g2 = mesh(G.goggle, goggle);
    g1.position.set(0.055, -0.075, 0.04);
    g2.position.set(0.055, -0.075, -0.04);
    this.head.add(head, capM, g1, g2);
    this.body.add(this.head);

    // Lengan
    this.arms = [1, -1].map((side) => {
      const shoulder = new THREE.Group();
      shoulder.position.set(0.5, 0, side * 0.21);
      const upper = mesh(G.upper, skin);
      upper.position.x = 0.13;
      const elbow = new THREE.Group();
      elbow.position.x = 0.27;
      const fore = mesh(G.fore, skin);
      fore.position.x = 0.12;
      const hand = mesh(G.hand, skin);
      hand.position.x = 0.27;
      hand.scale.set(1.3, 0.55, 1);
      elbow.add(fore, hand);
      shoulder.add(upper, elbow);
      this.body.add(shoulder);
      return { shoulder, elbow };
    });

    // Kaki
    this.legs = [1, -1].map((side) => {
      const hip = new THREE.Group();
      hip.position.set(-0.04, 0, side * 0.09);
      const thigh = mesh(G.thigh, skin);
      thigh.position.x = -0.2;
      const knee = new THREE.Group();
      knee.position.x = -0.42;
      const shin = mesh(G.shin, skin);
      shin.position.x = -0.2;
      const foot = mesh(G.foot, skin);
      foot.position.set(-0.42, 0, 0);
      knee.add(shin, foot);
      hip.add(thigh, knee);
      this.body.add(hip);
      return { hip, knee };
    });

    // Bayangan palsu di dasar kolam
    this.blob = new THREE.Mesh(
      new THREE.PlaneGeometry(2.2, 0.9),
      new THREE.MeshBasicMaterial({ map: blobTexture(), transparent: true, depthWrite: false }),
    );
    this.blob.rotation.x = -Math.PI / 2;

    if (s.isPlayer) {
      this.marker = new THREE.Sprite(new THREE.SpriteMaterial({ map: markerTex, depthTest: false }));
      this.marker.scale.set(0.95, 0.6, 1);
      this.marker.renderOrder = 20;
    }
    this.placeSprite = null;
    this.y = 0;
    this.q = new THREE.Quaternion();
  }

  setArms(thetaR, thetaL, bend = true) {
    [thetaR, thetaL].forEach((theta, i) => {
      const a = this.arms[i];
      a.shoulder.rotation.z = -theta;
      const ph = ((theta % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      // siku menekuk saat recovery (lengan di atas air) dan saat menarik
      a.elbow.rotation.z = bend ? (ph > Math.PI ? 1.1 * Math.sin(ph - Math.PI) : -0.45 * Math.sin(ph)) : 0;
    });
  }

  setLegs(kick, amp = 0.25, bend = 0) {
    this.legs.forEach((l, i) => {
      const k = Math.sin(kick + i * Math.PI) * amp;
      l.hip.rotation.z = k + bend;
      l.knee.rotation.z = -Math.max(0, -k) * 0.8 - bend * 1.6;
    });
  }

  /** Tempatkan model sehingga kepala berada di H dengan orientasi q. */
  place(H, q) {
    this.root.quaternion.copy(q);
    const off = new THREE.Vector3(HEAD, 0, 0).applyQuaternion(q);
    this.root.position.copy(H).sub(off);
  }
}

function mesh(geo, mat) {
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = true;
  return m;
}

function quat(yawSign, pitch = 0, roll = 0) {
  const q = new THREE.Quaternion().setFromAxisAngle(AXIS_Y, yawSign > 0 ? 0 : Math.PI);
  if (pitch) q.multiply(new THREE.Quaternion().setFromAxisAngle(AXIS_Z, pitch));
  if (roll) q.multiply(new THREE.Quaternion().setFromAxisAngle(AXIS_X, roll));
  return q;
}

/** Mengelola model 3D semua perenang dan menerjemahkan fase simulasi ke pose. */
export class Swimmers3D {
  constructor(scene) {
    this.scene = scene;
    this.models = [];
    this.markerTex = null;
    this.placeTex = {};
  }

  setRace(race) {
    for (const m of this.models) {
      this.scene.remove(m.root, m.blob);
      if (m.marker) this.scene.remove(m.marker);
      if (m.placeSprite) this.scene.remove(m.placeSprite);
    }
    this.markerTex?.dispose();
    this.markerTex = playerMarkerTexture(race.player.name.slice(0, 8).toUpperCase() || 'ANDA');
    this.models = race.swimmers.map((s) => {
      const m = new SwimmerModel(s, this.markerTex);
      this.scene.add(m.root, m.blob);
      if (m.marker) this.scene.add(m.marker);
      return m;
    });
  }

  placeTexture(n) {
    if (!this.placeTex[n]) this.placeTex[n] = placeTexture(n);
    return this.placeTex[n];
  }

  update(race, t, dt) {
    for (const m of this.models) this.pose(m, race, t, dt);
  }

  pose(m, race, t, dt) {
    const s = m.s;
    const z = s.y;
    const H = new THREE.Vector3();
    let q;
    m.body.rotation.set(0, 0, 0);
    m.head.rotation.set(0, 0, 0);

    switch (s.phase) {
      case 'block': {
        if (race.state === 'marks' || race.state === 'racing') {
          const pitch = -0.75;
          q = quat(1, pitch);
          H.set(-0.45 + Math.cos(pitch) * HEAD, BLOCK_TOP + 0.62 + Math.sin(pitch) * HEAD, z);
          m.setArms(Math.PI / 2 + pitch, Math.PI / 2 + pitch, false);
          // paha turun ke block, lutut sedikit menekuk
          m.legs.forEach((l, i) => { l.hip.rotation.z = 2.25 + i * 0.35; l.knee.rotation.z = -0.5 - i * 0.3; });
        } else {
          const sway = Math.sin(t * 1.5 + s.lane) * 0.03;
          q = quat(1, Math.PI / 2 - 0.05);
          H.set(-0.38, BLOCK_TOP + 0.86 + HEAD, z + sway);
          m.setArms(Math.PI - 0.15 + Math.sin(t * 2 + s.lane) * 0.15, Math.PI - 0.15, false);
          m.setLegs(0, 0);
        }
        m.y = 0;
        break;
      }
      case 'flight': {
        const p = clamp(s.flight.t / DIVE.flightTime, 0, 1);
        const pitch = lerp(0.2, -0.5, p);
        q = quat(1, pitch);
        const y = lerp(BLOCK_TOP + 0.9, -0.2, p) + Math.sin(p * Math.PI) * 0.6;
        H.set(s.poolX + 0.3, y, z);
        m.setArms(0, 0, false);
        m.setLegs(0, 0);
        m.y = -0.45;
        break;
      }
      case 'swim': {
        const target = s.glide > 0 ? -0.45 : -0.05;
        m.y += (target - m.y) * Math.min(1, dt * 3);
        q = quat(s.facing);
        H.set(s.poolX, m.y + Math.sin(t * 6 + s.lane) * 0.015, z);
        if (s.glide > 0) {
          m.setArms(0, 0, false);
          m.setLegs(s.kick * 1.2, 0.18);
        } else {
          const th = s.armPhase;
          m.setArms(th, th + Math.PI);
          m.body.rotation.x = Math.sin(th) * 0.5;
          // ambil napas tiap dua siklus
          const cycle = Math.floor(th / (Math.PI * 2));
          if (cycle % 2 === 0) m.head.rotation.x = Math.max(0, -Math.sin(th)) * 0.9;
          m.setLegs(s.kick * 2.2, 0.26);
        }
        break;
      }
      case 'turn': {
        const p = s.turn.progress;
        const s1 = easeInOut(clamp((p - 0.3) / 0.45, 0, 1)); // salto
        const s2 = easeInOut(clamp((p - 0.62) / 0.38, 0, 1)); // putar badan
        q = quat(s.dir, -Math.PI * s1, Math.PI * s2);
        const depth = lerp(-0.05, -0.55, Math.min(1, p * 2.2));
        H.set(s.poolX - s.dir * 0.25 * s1, depth - 0.3 * Math.sin(Math.PI * s1), z);
        m.setArms(0.2 - 0.6 * Math.sin(Math.PI * s1), 0.2 - 0.6 * Math.sin(Math.PI * s1), false);
        m.setLegs(0, 0, 1.4 * Math.sin(Math.PI * s1));
        m.y = -0.5;
        break;
      }
      case 'finished': {
        const pitch = 1.2;
        q = quat(s.facing, pitch);
        H.set(s.poolX - s.facing * 0.35, 0.18 + Math.sin(t * 2.5 + s.lane) * 0.04, z);
        const up = s.place === 1 || (s.livePlace === 1);
        m.setArms(up ? pitch - Math.PI / 2 + Math.sin(t * 6) * 0.15 : 1.4, 1.4, false);
        m.setLegs(t * 3, 0.3);
        break;
      }
      default:
        q = quat(1);
    }

    m.place(H, q);

    // Bayangan di dasar kolam
    const inWater = s.phase !== 'block';
    m.blob.visible = inWater;
    m.blob.position.set(H.x - s.facing * 0.7, -DEPTH + 0.02, z);
    m.blob.rotation.z = 0;

    if (m.marker) {
      m.marker.position.set(H.x, Math.max(H.y, 0) + 1.15, z);
      m.marker.visible = race.live && s.phase !== 'finished';
    }

    // Medali posisi di atas kepala setelah finis
    if (s.phase === 'finished') {
      const idx = race.finishOrder.indexOf(s);
      s.livePlace = idx >= 0 ? idx + 1 : null;
      if (s.livePlace && !m.placeSprite) {
        m.placeSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.placeTexture(s.livePlace), depthTest: false }));
        m.placeSprite.scale.set(0.7, 0.7, 1);
        m.placeSprite.renderOrder = 21;
        this.scene.add(m.placeSprite);
      }
      if (m.placeSprite) m.placeSprite.position.set(H.x, 1.3 + Math.sin(t * 3) * 0.05, z);
    }
  }

  /** Posisi kepala pemain untuk kamera. */
  playerHead(race) {
    const m = this.models.find((x) => x.s === race.player);
    return m ? m.root.position.clone().add(new THREE.Vector3(HEAD, 0, 0).applyQuaternion(m.root.quaternion)) : new THREE.Vector3();
  }
}

export { AXIS_Y };
