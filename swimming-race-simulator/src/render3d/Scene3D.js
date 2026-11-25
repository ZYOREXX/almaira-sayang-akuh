import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { POOL } from '../config.js';
import { Pool3D } from './Pool3D.js';
import { Stadium3D } from './Stadium3D.js';
import { Swimmers3D } from './Swimmer3D.js';
import { Effects3D } from './Effects3D.js';
import { CameraRig } from './CameraRig.js';

/** Renderer WebGL + adegan arena renang. */
export class Scene3D {
  constructor(canvas, bus) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0a1628');
    scene.fog = new THREE.Fog('#0a1628', 70, 170);
    this.scene = scene;

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.55;

    scene.add(new THREE.HemisphereLight('#dbeafe', '#334155', 1.1));
    const sun = new THREE.DirectionalLight('#fff7ed', 2.2);
    sun.position.set(POOL.length / 2 + 12, 30, POOL.waterWidth / 2 + 14);
    sun.target.position.set(POOL.length / 2, 0, POOL.waterWidth / 2);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    const sc = sun.shadow.camera;
    sc.left = -32; sc.right = 32; sc.top = 20; sc.bottom = -20; sc.near = 5; sc.far = 80;
    sun.shadow.bias = -0.0005;
    scene.add(sun, sun.target);

    this.camera = new THREE.PerspectiveCamera(52, 1, 0.1, 400);
    this.rig = new CameraRig(this.camera);
    this.pool = new Pool3D(scene);
    this.stadium = new Stadium3D(scene);
    this.swimmers = new Swimmers3D(scene);
    this.effects = new Effects3D(scene, bus);
  }

  setRace(race) {
    this.pool.configure(race.distance);
    this.swimmers.setRace(race);
    this.effects.clear();
  }

  resize(w, h) {
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    // Layar potret: perlebar sudut pandang agar kolam tetap terlihat
    this.camera.fov = w / h < 1 ? 70 : 52;
    this.camera.updateProjectionMatrix();
    this.effects.setPixelScale(h * this.renderer.getPixelRatio());
  }

  update(race, t, dt) {
    this.swimmers.update(race, t, dt);
    this.effects.emitWakes(dt, race.swimmers);
    this.effects.update(dt * race.timeScale);
    this.pool.update(t, race);
    this.stadium.update(t, dt, race.live ? race : null);
    this.rig.update(dt, race, this.swimmers.playerHead(race), t);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  cheer(level) {
    this.stadium.cheer = Math.max(this.stadium.cheer, level);
  }
}
