import { WORLD } from '../config.js';
import { EventBus } from './EventBus.js';
import { Race } from './Race.js';
import { Input } from './Input.js';
import { Camera } from '../render/Camera.js';
import { PoolRenderer } from '../render/PoolRenderer.js';
import { SwimmerRenderer } from '../render/SwimmerRenderer.js';
import { Particles } from '../render/Particles.js';
import { HUD } from '../ui/HUD.js';
import { Menu } from '../ui/Menu.js';
import { Results } from '../ui/Results.js';
import { Sound } from '../audio/Sound.js';

/**
 * Orkestrator: game loop (requestAnimationFrame), ukuran canvas,
 * dan penghubung antara Race (logika), renderer, HUD, dan audio.
 */
export class Game {
  constructor() {
    this.canvas = document.getElementById('pool');
    this.ctx = this.canvas.getContext('2d');
    this.wrap = document.getElementById('canvasWrap');
    this.stage = document.getElementById('stage');

    this.bus = new EventBus();
    this.camera = new Camera();
    this.pool = new PoolRenderer(this.camera);
    this.swimmerRenderer = new SwimmerRenderer(this.camera);
    this.particles = new Particles(this.camera, this.bus);
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
    this.btnQuit = document.getElementById('btnQuit');
    this.raceTag = document.getElementById('raceTag');
    this.btnMute.addEventListener('click', () => this.handleAction('mute'));
    this.btnQuit.addEventListener('click', () => this.toMenu());

    this.bindEvents();
    this.race = null;
    this.time = 0;
    this.last = performance.now();

    new ResizeObserver(() => this.resize()).observe(this.stage);
    this.resize();
    // Lomba "demo" di belakang menu agar kolam terlihat hidup
    this.race = new Race({ distance: 100, level: 'sedang', playerName: 'Anda' }, this.bus);
    requestAnimationFrame((t) => this.frame(t));
  }

  bindEvents() {
    const b = this.bus;
    b.on('raceState', ({ state }) => {
      if (!this.isLive) return;
      if (state === 'prep') this.hud.message('Bersiap…');
      if (state === 'marks') {
        this.hud.message('Take your marks…');
        this.sound.marks();
      }
      if (state === 'racing') {
        this.hud.message('GO!');
        this.sound.startBeep();
        this.sound.crowdStart();
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
      if (this.race.finishOrder.length === 1) this.sound.crowdSwell(0.14);
      if (swimmer.isPlayer) {
        const place = this.race.finishOrder.length;
        this.hud.message(place === 1 ? '🏆 JUARA!' : `Finis #${place}`);
        if (place <= 3) this.sound.fanfare();
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
      }, 1200);
    });
  }

  get isLive() {
    return !!this.race && this.race.live;
  }

  startRace(settings) {
    this.sound.unlock();
    this.lastSettings = settings;
    this.race?.dispose();
    this.particles.clear();
    this.menu.hide();
    this.results.hide();
    this.hud.reset();
    this.race = new Race(settings, this.bus);
    this.race.live = true;
    this.input.enabled = true;
    this.btnQuit.classList.remove('hidden');
    this.raceTag.textContent = `${settings.distance} m Gaya Bebas · ${settings.level.toUpperCase()}`;
    this.raceTag.classList.remove('hidden');
    this.hud.message('Bersiap…');
    this.canvas.focus?.();
  }

  toMenu() {
    this.sound.crowdStop();
    this.input.enabled = false;
    this.results.hide();
    this.hud.reset();
    this.btnQuit.classList.add('hidden');
    this.raceTag.classList.add('hidden');
    this.race?.dispose();
    this.race = new Race({ distance: 100, level: 'sedang', playerName: 'Anda' }, this.bus);
    this.menu.show();
  }

  handleAction(action, now = performance.now() / 1000) {
    if (action === 'mute') {
      this.sound.unlock();
      this.sound.setMuted(!this.sound.muted);
      this.btnMute.textContent = this.sound.muted ? '🔇' : '🔊';
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
    const rect = this.stage.getBoundingClientRect();
    const aspect = WORLD.width / WORLD.height;
    let w = rect.width;
    if (w / aspect > rect.height) w = rect.height * aspect;
    w = Math.max(280, Math.floor(w));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.camera.resize(w, dpr);
    const h = Math.round(this.camera.cssHeight);
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.pool.resize(this.canvas.width, this.canvas.height, this.ctx);
  }

  /** Demo di belakang menu: AI berenang sendiri dan lomba diulang. */
  updateDemo() {
    const r = this.race;
    if (r.live) return;
    if (r.state === 'racing' && r.player.phase === 'block' && r.clock > 0.2) {
      r.player.dive(r.clock, 0.8);
    }
    if (r.state === 'racing' && r.player.phase === 'swim') {
      // pemain demo berenang otomatis dengan ritme ideal
      r.demoTimer = (r.demoTimer ?? 0) + 1 / 60;
      if (r.demoTimer > 0.46) {
        r.demoTimer = 0;
        r.player.v = Math.min(r.player.v + 1.15, 3);
        r.player.armTarget += Math.PI;
        this.bus.emit('stroke', { swimmer: r.player, rating: 'ai', arm: 0 });
      }
      if (!r.player.isFinalLength && r.player.distToWall < 2) r.player.startTurn(0.9);
    }
    if (r.state === 'done' && r.stateTime > 3) {
      r.dispose();
      this.race = new Race({ distance: 100, level: 'sedang', playerName: 'Anda' }, this.bus);
    }
  }

  frame(ts) {
    const dt = Math.min((ts - this.last) / 1000, 0.1);
    this.last = ts;
    this.time += dt;
    const race = this.race;

    this.updateDemo();
    race.update(dt);
    this.particles.emitWakes(dt, race.swimmers);
    this.particles.update(dt * race.timeScale);

    this.render(race);
    if (race.live) this.hud.update(race, performance.now() / 1000);

    requestAnimationFrame((t) => this.frame(t));
  }

  render(race) {
    const ctx = this.ctx;
    const t = this.time;
    this.pool.drawBase(ctx);
    this.pool.drawWater(ctx, t);
    this.pool.drawPlayerLane(ctx, race, t);
    this.particles.draw(ctx);
    this.pool.drawRopes(ctx, t);
    this.pool.drawFinish(ctx, race, t);
    this.swimmerRenderer.draw(ctx, race, t);
  }
}
