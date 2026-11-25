import { AI_TIERS, POOL } from '../config.js';
import { rand, randRange } from '../core/utils.js';

/**
 * AI perenang: kecepatan target per tingkat, kelelahan sepanjang lomba,
 * sprint di akhir, waktu reaksi dan kualitas flip turn sesuai tier.
 */
export class AIController {
  constructor(swimmer, bus, totalDistance) {
    this.s = swimmer;
    this.bus = bus;
    const t = AI_TIERS[swimmer.tier];
    this.tier = t;
    this.baseSpeed = t.speed + rand(-t.spread, t.spread);
    this.reaction = randRange(t.reaction);
    this.fade = t.fade * Math.pow(totalDistance / 100, 0.7);
    this.wobbleSeed = Math.random() * 100;
    this.strokeClock = 0;
    this.nextTurnAt = randRange(t.turnAt);
  }

  targetSpeed(clock) {
    const s = this.s;
    const progress = s.dist / s.totalDistance;
    let v = this.baseSpeed * (1 - this.fade * Math.pow(progress, 1.5));
    if (s.totalDistance - s.dist < 15) v *= 1 + this.tier.sprint;
    v *= 1 + 0.025 * Math.sin(clock * 0.9 + this.wobbleSeed); // variasi alami
    return v;
  }

  update(dt, clock, racing) {
    const s = this.s;
    if (!racing) return;

    if (s.phase === 'block' && clock >= this.reaction) {
      s.dive(clock, randRange(this.tier.diveQuality));
      return;
    }

    if (s.phase === 'swim') {
      const target = this.targetSpeed(clock);
      const rate = s.glide > 0 ? 0.9 : 1.8;
      s.v += (target - s.v) * Math.min(1, dt * rate);

      if (s.glide <= 0) {
        // Kayuhan visual sesuai cadence tier
        this.strokeClock += dt * this.tier.cadence * 2;
        if (this.strokeClock >= 1) {
          this.strokeClock -= 1;
          s.armTarget += Math.PI;
          this.bus.emit('stroke', { swimmer: s, rating: 'ai', arm: Math.round(s.armTarget / Math.PI) % 2 });
        }
      }

      if (!s.isFinalLength && s.distToWall <= this.nextTurnAt && s.lengthPos < POOL.length) {
        s.startTurn(randRange(this.tier.turnQuality));
        this.nextTurnAt = randRange(this.tier.turnAt);
      }
    }

    s.armPhase += (s.armTarget - s.armPhase) * Math.min(1, dt * 9);
  }
}
