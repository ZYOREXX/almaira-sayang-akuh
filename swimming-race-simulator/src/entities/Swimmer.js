import { POOL, DIVE, TURN, laneCenterY } from '../config.js';
import { clamp, lerp, easeOutCubic } from '../core/utils.js';

/**
 * Status & gerak dasar seorang perenang. Kecepatan diatur oleh controller
 * (pemain atau AI); kelas ini menangani posisi, start, dinding, dan finis.
 *
 * Fase: block -> flight -> swim <-> turn -> finished
 */
export class Swimmer {
  constructor({ lane, name, country, tier = null, isPlayer = false, capColor, skin }) {
    this.lane = lane;
    this.name = name;
    this.country = country;
    this.tier = tier;
    this.isPlayer = isPlayer;
    this.capColor = capColor;
    this.skin = skin;
    this.y = laneCenterY(lane);
  }

  reset(totalDistance, bus) {
    this.bus = bus;
    this.totalDistance = totalDistance;
    this.lengths = Math.round(totalDistance / POOL.length);
    this.dist = 0;
    this.v = 0;
    this.phase = 'block';
    this.phaseTime = 0;
    this.lapIndex = 0;
    this.glide = 0;
    this.finishTime = null;
    this.reactionTime = null;
    this.splits = [];
    this.place = null;
    this.falseStart = false;
    this.flight = null;
    this.turn = null;
    // animasi
    this.armPhase = Math.random() * Math.PI * 2;
    this.armTarget = this.armPhase;
    this.kick = Math.random() * 10;
  }

  get lengthPos() {
    return this.dist - this.lapIndex * POOL.length;
  }

  get distToWall() {
    return POOL.length - this.lengthPos;
  }

  get isFinalLength() {
    return this.lapIndex >= this.lengths - 1;
  }

  /** Arah renang pada length saat ini: +1 menuju x=50, -1 menuju x=0. */
  get dir() {
    return this.lapIndex % 2 === 0 ? 1 : -1;
  }

  /** Arah hadap untuk render (berbalik di tengah animasi flip). */
  get facing() {
    if (this.phase === 'turn' && this.turn.progress > 0.62) return -this.dir;
    if (this.phase === 'finished') return this.lengths % 2 === 1 ? 1 : -1;
    return this.dir;
  }

  /** Posisi x kepala perenang di kolam. */
  get poolX() {
    if (this.phase === 'block') return -0.15;
    if (this.phase === 'finished') return this.lengths % 2 === 1 ? POOL.length : 0;
    const p = clamp(this.lengthPos, 0, POOL.length);
    return this.dir > 0 ? p : POOL.length - p;
  }

  get underwater() {
    return (this.phase === 'swim' && this.glide > 0) || (this.phase === 'turn' && this.turn.progress > 0.4);
  }

  setPhase(phase) {
    this.phase = phase;
    this.phaseTime = 0;
  }

  /** Mulai melompat dari start block. quality 0..1 */
  dive(clock, quality) {
    if (this.phase !== 'block') return;
    this.reactionTime = clock;
    const q = clamp(quality, 0, 1);
    this.flight = {
      t: 0,
      to: lerp(DIVE.flightMin, DIVE.flightMax, q),
      entry: lerp(DIVE.entrySpeedMin, DIVE.entrySpeedMax, q),
      quality: q,
    };
    this.setPhase('flight');
    this.bus.emit('dive', { swimmer: this, quality: q });
  }

  /**
   * Mulai pembalikan. quality 0..1, open = open turn (lupa flip).
   * Durasi bergantung jarak tersisa sehingga flip terlalu awal tetap rugi.
   */
  startTurn(quality, open = false) {
    const d = this.distToWall;
    const q = clamp(quality, 0, 1);
    const travel = d / Math.max(this.v, 1.4);
    const dur = open ? TURN.openDuration : TURN.baseDuration + travel * 0.75 + (1 - q) * 0.4;
    this.turn = {
      from: this.dist,
      to: (this.lapIndex + 1) * POOL.length,
      t: 0,
      dur,
      progress: 0,
      push: open ? TURN.openPush : lerp(TURN.pushMin, TURN.pushMax, q),
      open,
      quality: q,
    };
    this.setPhase('turn');
    this.bus.emit('turnStart', { swimmer: this, quality: q, open });
  }

  update(dt, clock) {
    this.phaseTime += dt;
    this.kick += dt * (4 + this.v * 3);

    switch (this.phase) {
      case 'flight': {
        const f = this.flight;
        f.t += dt;
        const p = clamp(f.t / DIVE.flightTime, 0, 1);
        this.dist = f.to * easeOutCubic(p);
        this.v = f.to / DIVE.flightTime;
        if (p >= 1) {
          this.v = f.entry;
          this.glide = DIVE.glideTime;
          this.setPhase('swim');
          this.bus.emit('entry', { swimmer: this, quality: f.quality });
        }
        break;
      }
      case 'swim': {
        if (this.glide > 0) this.glide -= dt;
        this.dist += this.v * dt;
        if (this.lengthPos >= POOL.length) {
          if (this.isFinalLength) {
            const overshoot = this.lengthPos - POOL.length;
            this.finishTime = clock - overshoot / Math.max(this.v, 0.1);
            this.dist = this.totalDistance;
            this.v = 0;
            this.splits.push(this.finishTime);
            this.setPhase('finished');
            this.bus.emit('finish', { swimmer: this });
          } else {
            // Sampai dinding tanpa flip: open turn
            this.dist = (this.lapIndex + 1) * POOL.length - 0.001;
            this.startTurn(0, true);
          }
        }
        break;
      }
      case 'turn': {
        const tr = this.turn;
        tr.t += dt;
        tr.progress = clamp(tr.t / tr.dur, 0, 1);
        this.dist = lerp(tr.from, tr.to - 0.001, easeOutCubic(clamp(tr.progress / 0.7, 0, 1)));
        if (tr.progress >= 1) {
          this.splits.push(clock);
          this.lapIndex += 1;
          this.dist = this.lapIndex * POOL.length;
          this.v = tr.push;
          this.glide = DIVE.glideTime;
          this.setPhase('swim');
          this.bus.emit('pushOff', { swimmer: this, quality: tr.quality, open: tr.open });
        }
        break;
      }
      default:
        break;
    }
  }
}
