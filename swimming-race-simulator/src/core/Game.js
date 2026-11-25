import { EventBus } from './EventBus.js';
import { Race } from './Race.js';
import { Input } from './Input.js';
import { Scene3D } from '../render3d/Scene3D.js';
import { CAMERA_LABELS } from '../render3d/CameraRig.js';
import { HUD } from '../ui/HUD.js';
import { Menu } from '../ui/Menu.js';
import { Results } from '../ui/Results.js';
import { Sound } from '../audio/Sound.js';

const DEMO = { distance: 100, level: 'sedang', playerName: 'Anda' };

/**
 * Orkestrator: game loop, penghubung Race (logika) ↔ Scene3D (render),
 * HUD, menu, layar hasil, dan audio.
 */
export class Game {
  constructor() {
    this.canvas = document.getElementById('scene');
    this.bus = new EventBus();
    this.scene3d = new Scene3D(this.canvas, this.bus);
    this.sound = new Sound();
    this.hud = new HUD();

    this.menu = new Menu((settings) => this.startRace(settings));
    this.results = new Results({
      onAgain: () => this.startRace(this.lastSettings),
      onMenu: () => this.toMenu(),
    });

    this.input = new Input({
      canvas: this.canvas,
      buttons: {
        stroke: document.getElementById('btnStroke'),
        dive: document.getElementById('btnDive'),
        flip: document.getElementById('btnFlip'),
      },
      onAction: (a, now) => this.handleAction(a, now),
    });

    this.btnMute = document.getElementById('btnMute');
    this.btnCamera = document.getElementById('btnCamera');
    this.camLabel = document.getElementById('camLabel');
    this.btnMute.addEventListener('click', () => this.handleAction('mute'));
    this.btnCamera.addEventListener('click', () => this.handleAction('camera'));
    document.getElementById('btnQuit').addEventListener('click', () => this.toMenu());

    this.bindEvents();
    this.time = 0;
    this.last = performance.now();

    new ResizeObserver(() => this.resize()).observe(this.canvas);
    this.resize();
    this.setRace(new Race(DEMO, this.bus));
    requestAnimationFrame((t) => this.frame(t));
  }

  setRace(race) {
    this.race?.dispose();
    this.race = race;
    this.scene3d.setRace(race);
  }

  bindEvents() {
    const b = this.bus;
    b.on('raceState', ({ state }) => {
      if (!this.isLive) return;
      if (state === 'prep') this.hud.message('Bersiap…');
      if (state === 'marks') {
        this.hud.message('Take your marks');
        this.sound.marks();
      }
      if (state === 'racing') {
        this.hud.message('GO!');
        this.sound.startBeep();
        this.sound.crowdStart();
        this.scene3d.cheer(0.6);
        setTimeout(() => { if (this.race?.state === 'racing') this.hud.message(''); }, 700);
      }
    });
    b.on('falseStart', () => {
      if (!this.isLive) return;
      this.hud.popRating('FALSE START! Penalti +1 dtk', 'bad');
      this.sound.bad();
    });
    b.on('rating', ({ text, tone }) => {
      if (!this.isLive) return;
      this.hud.popRating(text, tone);
      if (tone === 'perfect') this.sound.good();
      if (tone === 'bad') this.sound.bad();
    });
    b.on('hint', ({ text }) => this.isLive && this.hud.hint(text));
    b.on('stroke', ({ swimmer, rating }) => {
      if (this.isLive && swimmer.isPlayer) this.sound.stroke(rating);
    });
    b.on('entry', ({ swimmer }) => {
      if (this.isLive && (swimmer.isPlayer || swimmer.lane === 5)) this.sound.splash(swimmer.isPlayer ? 1 : 0.6);
    });
    b.on('turnStart', ({ swimmer }) => {
      if (this.isLive && swimmer.isPlayer) this.sound.splash(0.6);
    });
    b.on('finish', ({ swimmer }) => {
      if (!this.isLive) return;
      if (this.race.finishOrder.length === 1) {
        this.sound.crowdSwell(0.14);
        this.scene3d.cheer(1);
      }
      if (swimmer.isPlayer) {
        const place = this.race.finishOrder.length;
        this.hud.message(place === 1 ? '🏆 Juara!' : `Finis #${place}`);
        if (place <= 3) {
          this.sound.fanfare();
          this.scene3d.cheer(1);
        }
        this.sound.splash(1);
      }
    });
    b.on('raceDone', () => {
      if (!this.isLive) return;
      this.input.enabled = false;
      this.sound.crowdStop();
      setTimeout(() => {
        if (this.race?.state !== 'done' || !this.isLive) return;
        this.hud.message('');
        this.results.show(this.race);
      }, 2200);
    });
  }

  get isLive() {
    return !!this.race?.live;
  }

  startRace(settings) {
    this.sound.unlock();
    this.lastSettings = settings;
    this.menu.hide();
    this.results.hide();
    const race = new Race(settings, this.bus);
    race.live = true;
    this.setRace(race);
    this.hud.reset(race);
    this.hud.show(true);
    this.hud.message('Bersiap…');
    this.input.enabled = true;
  }

  toMenu() {
    this.sound.crowdStop();
    this.input.enabled = false;
    this.results.hide();
    this.hud.reset(null);
    this.hud.show(false);
    this.setRace(new Race(DEMO, this.bus));
    this.menu.show();
  }

  handleAction(action, now = performance.now() / 1000) {
    if (action === 'mute') {
      this.sound.unlock();
      this.sound.setMuted(!this.sound.muted);
      this.btnMute.textContent = this.sound.muted ? '🔇' : '🔊';
      return;
    }
    if (action === 'camera') {
      const mode = this.scene3d.rig.cycle();
      this.camLabel.textContent = CAMERA_LABELS[mode];
      return;
    }
    if (action === 'quit') {
      if (this.race?.live) this.toMenu();
      return;
    }
    const race = this.race;
    if (!race?.live) return;
    if (action === 'stroke') race.playerStroke(now);
    if (action === 'dive') race.playerDive();
    if (action === 'flip') race.playerFlip();
  }

  resize() {
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    this.scene3d.resize(w, h);
  }

  /** Lomba demo di belakang menu: semua perenang otomatis. */
  updateDemo(dt) {
    const r = this.race;
    if (r.live) return;
    const p = r.player;
    if (r.state === 'racing' && p.phase === 'block' && r.clock > 0.2) p.dive(r.clock, 0.8);
    if (r.state === 'racing' && p.phase === 'swim') {
      r.demoTimer = (r.demoTimer ?? 0) + dt;
      if (r.demoTimer > 0.46) {
        r.demoTimer = 0;
        p.v = Math.min(p.v + 1.12, 3);
        p.armTarget += Math.PI;
        this.bus.emit('stroke', { swimmer: p, rating: 'ai', arm: Math.round(p.armTarget / Math.PI) % 2 });
      }
      if (!p.isFinalLength && p.distToWall < 2) p.startTurn(0.9);
    }
    if (r.state === 'done' && r.stateTime > 4) this.setRace(new Race(DEMO, this.bus));
  }

  frame(ts) {
    const dt = Math.min((ts - this.last) / 1000, 0.1);
    this.last = ts;
    this.time += dt;

    this.updateDemo(dt);
    this.race.update(dt);
    this.scene3d.update(this.race, this.time, dt);
    this.scene3d.render();
    if (this.race.live) this.hud.update(this.race, performance.now() / 1000);

    requestAnimationFrame((t) => this.frame(t));
  }
}
