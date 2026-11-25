import {
  PLAYER_LANE, FIELD_PRESETS, SEED_LANES, RIVALS, CAP_COLORS, SKIN_TONES,
  SIM_STEP, WARP_AFTER_PLAYER_FINISH, AI_TIERS,
} from '../config.js';
import { Swimmer } from '../entities/Swimmer.js';
import { PlayerController } from '../controllers/PlayerController.js';
import { AIController } from '../controllers/AIController.js';
import { shuffle, rand } from './utils.js';

/**
 * Satu lomba: membuat 8 perenang, menjalankan urutan start
 * (Bersiap → Take your marks → BEEP) dan menentukan hasil akhir.
 *
 * state: 'prep' | 'marks' | 'racing' | 'done'
 */
export class Race {
  constructor({ distance, level, playerName }, bus) {
    this.bus = bus;
    this.distance = distance;
    this.level = level;
    this.state = 'prep';
    this.stateTime = 0;
    this.clock = 0; // waktu lomba sejak bunyi start
    this.marksDuration = rand(1.4, 2.4);
    this.accumulator = 0;
    this.finishOrder = [];

    this.swimmers = [];
    this.controllers = [];

    this.player = new Swimmer({
      lane: PLAYER_LANE,
      name: playerName || 'Anda',
      country: 'YOU',
      isPlayer: true,
      capColor: CAP_COLORS[PLAYER_LANE],
      skin: SKIN_TONES[1],
    });
    this.playerCtl = new PlayerController(this.player, bus);
    this.swimmers.push(this.player);
    this.controllers.push(this.playerCtl);

    const preset = FIELD_PRESETS[level] ?? FIELD_PRESETS.sedang;
    const tiers = preset.tiers.slice().sort((a, b) => AI_TIERS[b].speed - AI_TIERS[a].speed);
    const rivals = shuffle(RIVALS);
    tiers.forEach((tier, i) => {
      const lane = SEED_LANES[i];
      const sw = new Swimmer({
        lane,
        name: rivals[i].name,
        country: rivals[i].country,
        tier,
        capColor: CAP_COLORS[lane],
        skin: SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)],
      });
      this.swimmers.push(sw);
    });
    this.swimmers.sort((a, b) => a.lane - b.lane);
    this.swimmers.forEach((s) => s.reset(distance, bus));
    this.swimmers
      .filter((s) => !s.isPlayer)
      .forEach((s) => this.controllers.push(new AIController(s, bus, distance)));

    this.unsubFinish = bus.on('finish', ({ swimmer }) => {
      this.finishOrder.push(swimmer);
    });
  }

  get racing() {
    return this.state === 'racing';
  }

  get timeScale() {
    return this.player.phase === 'finished' && this.state === 'racing' ? WARP_AFTER_PLAYER_FINISH : 1;
  }

  /** Waktu lomba presisi (menyertakan sisa accumulator) untuk input. */
  get preciseClock() {
    return this.clock + this.accumulator;
  }

  playerStroke(nowSec) {
    this.playerCtl.stroke(nowSec);
  }

  playerDive() {
    if (this.state === 'prep') return;
    this.playerCtl.dive(this.preciseClock, this.racing);
  }

  playerFlip() {
    if (this.racing) this.playerCtl.flip();
  }

  setState(state) {
    this.state = state;
    this.stateTime = 0;
    this.bus.emit('raceState', { state, race: this });
  }

  update(realDt) {
    const dt = Math.min(realDt, 0.1);
    this.stateTime += dt;

    if (this.state === 'prep' && this.stateTime >= 1.6) this.setState('marks');
    else if (this.state === 'marks' && this.stateTime >= this.marksDuration) {
      this.accumulator = 0;
      this.setState('racing');
    }

    if (this.state !== 'racing') {
      // Animasi kecil di atas block sebelum start
      this.swimmers.forEach((s) => { s.kick += dt; });
      return;
    }

    this.accumulator += dt * this.timeScale;
    while (this.accumulator >= SIM_STEP) {
      this.accumulator -= SIM_STEP;
      this.clock += SIM_STEP;
      this.step(SIM_STEP);
      if (this.state !== 'racing') break;
    }
  }

  step(dt) {
    for (const c of this.controllers) c.update(dt, this.clock, true);
    for (const s of this.swimmers) s.update(dt, this.clock);

    if (this.swimmers.every((s) => s.phase === 'finished')) {
      this.finalize();
    }
  }

  finalize() {
    const ranked = this.swimmers.slice().sort((a, b) => a.finishTime - b.finishTime);
    ranked.forEach((s, i) => { s.place = i + 1; });
    this.results = ranked;
    this.setState('done');
    this.bus.emit('raceDone', { race: this, results: ranked });
  }

  /** Urutan sementara: yang sudah finis dulu, lalu berdasar jarak. */
  standings() {
    return this.swimmers.slice().sort((a, b) => {
      const af = a.finishTime != null;
      const bf = b.finishTime != null;
      if (af && bf) return a.finishTime - b.finishTime;
      if (af) return -1;
      if (bf) return 1;
      return b.dist - a.dist;
    });
  }

  dispose() {
    this.unsubFinish?.();
  }
}
