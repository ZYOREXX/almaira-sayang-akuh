import { RHYTHM, PHYSICS, STAMINA, DIVE, TURN } from '../config.js';
import { clamp } from '../core/utils.js';

/**
 * Mengubah input pemain (kayuh, dive, flip) menjadi kecepatan perenang.
 *
 * Model: tiap kayuhan memberi impuls, air memberi drag eksponensial.
 * Kecepatan rata-rata ≈ impuls × frekuensi ÷ drag, jadi ritme stabil di
 * sweet spot memberi kecepatan tertinggi; spam tombol menurunkan kualitas
 * kayuhan dan menguras stamina, terlalu lambat membuat kecepatan turun.
 */
export class PlayerController {
  constructor(swimmer, bus) {
    this.s = swimmer;
    this.bus = bus;
    this.stamina = STAMINA.max;
    this.lastStroke = null; // detik (waktu nyata)
    this.lastRating = null;
    this.lastRatingAt = -10;
    this.streak = 0;
    this.bestStreak = 0;
    this.counts = { perfect: 0, sweet: 0, fast: 0, slow: 0 };
    this.turnRatings = [];
  }

  /** Jendela sweet spot saat ini (bergeser lebih lambat saat lelah). */
  get window() {
    const fatigue = 1 - this.stamina / STAMINA.max;
    const shift = RHYTHM.fatigueShift * fatigue;
    const min = RHYTHM.sweetMin + shift;
    const max = RHYTHM.sweetMax + shift;
    const mid = (min + max) / 2;
    return {
      min,
      max,
      perfectMin: mid - RHYTHM.perfectHalfWidth,
      perfectMax: mid + RHYTHM.perfectHalfWidth,
    };
  }

  get staminaFactor() {
    if (this.stamina >= STAMINA.lowThreshold) return 1;
    return STAMINA.minFactor + (1 - STAMINA.minFactor) * (this.stamina / STAMINA.lowThreshold);
  }

  canStroke() {
    return this.s.phase === 'swim';
  }

  stroke(now) {
    const s = this.s;
    if (!this.canStroke()) {
      if (s.phase === 'block') this.bus.emit('hint', { text: 'Tekan DIVE untuk start!' });
      return;
    }
    const w = this.window;
    const interval = this.lastStroke == null ? (w.perfectMin + w.perfectMax) / 2 : now - this.lastStroke;
    this.lastStroke = now;

    let rating;
    let quality;
    let cost;
    if (interval < w.min) {
      rating = 'fast';
      quality = PHYSICS.fastQualityBase * Math.pow(interval / w.min, 2);
      cost = STAMINA.costFast * clamp(w.min / Math.max(interval, 0.01), 1, 2.5);
    } else if (interval <= w.max) {
      const perfect = interval >= w.perfectMin && interval <= w.perfectMax;
      rating = perfect ? 'perfect' : 'sweet';
      quality = perfect ? PHYSICS.perfectBonus : 1;
      cost = perfect ? STAMINA.costPerfect : STAMINA.costSweet;
    } else {
      rating = 'slow';
      quality = PHYSICS.slowQuality;
      cost = STAMINA.costSlow;
    }

    this.stamina = clamp(this.stamina - cost, 0, STAMINA.max);
    s.v = Math.min(s.v + PHYSICS.strokeImpulse * quality * this.staminaFactor, PHYSICS.maxSpeed);
    s.armTarget += Math.PI;
    s.glide = 0;

    this.counts[rating] += 1;
    if (rating === 'perfect' || rating === 'sweet') {
      this.streak += 1;
      this.bestStreak = Math.max(this.bestStreak, this.streak);
    } else {
      this.streak = 0;
    }
    this.lastRating = rating;
    this.lastRatingAt = now;
    this.bus.emit('stroke', { swimmer: s, rating, arm: Math.round(s.armTarget / Math.PI) % 2 });
  }

  dive(clock, racing) {
    const s = this.s;
    if (s.phase !== 'block') return;
    if (!racing) {
      if (!s.falseStart) {
        s.falseStart = true;
        this.bus.emit('falseStart', { swimmer: s });
      }
      return;
    }
    if (s.falseStart && clock < DIVE.falseStartPenalty) return;
    // Reaksi 0.15 dtk = sempurna, makin lambat makin buruk.
    const quality = s.falseStart ? 0.3 : clamp(1 - (clock - 0.15) / 0.6, 0.25, 1);
    s.dive(clock, quality);
    this.bus.emit('rating', {
      text: quality > 0.85 ? 'DIVE SEMPURNA!' : quality > 0.55 ? 'Dive Bagus' : 'Dive Lambat',
      tone: quality > 0.85 ? 'perfect' : quality > 0.55 ? 'good' : 'bad',
    });
  }

  flip() {
    const s = this.s;
    if (s.phase !== 'swim' || s.isFinalLength) return;
    const d = s.distToWall;
    if (d > TURN.zoneStart) {
      this.bus.emit('hint', { text: 'Terlalu jauh dari dinding!' });
      return;
    }
    let q;
    if (d >= TURN.idealNear && d <= TURN.idealFar) q = 1;
    else if (d > TURN.idealFar) q = clamp(1 - (d - TURN.idealFar) / (TURN.zoneStart - TURN.idealFar), 0.25, 1);
    else q = clamp(0.4 + 0.6 * (d / TURN.idealNear), 0.3, 1);
    s.startTurn(q);
    const label = q >= 0.95 ? 'FLIP TURN SEMPURNA!' : q >= 0.6 ? 'Flip Turn Bagus' : d > TURN.idealFar ? 'Flip Terlalu Awal' : 'Flip Terlalu Mepet';
    this.turnRatings.push(q);
    this.bus.emit('rating', { text: label, tone: q >= 0.95 ? 'perfect' : q >= 0.6 ? 'good' : 'bad' });
  }

  update(dt, clock, racing) {
    const s = this.s;
    if (racing && s.phase === 'block' && clock >= DIVE.autoDiveAt + (s.falseStart ? DIVE.falseStartPenalty : 0)) {
      s.dive(clock, 0.15);
      this.bus.emit('rating', { text: 'Dive Otomatis — Terlambat!', tone: 'bad' });
    }
    if (s.phase === 'swim') {
      // Saat meluncur (glide) hambatan lebih kecil.
      const drag = s.glide > 0 ? PHYSICS.drag * 0.55 : PHYSICS.drag;
      s.v *= Math.exp(-drag * dt);
    }
    if (s.phase !== 'finished') {
      const recovering = this.lastStroke == null || performance.now() / 1000 - this.lastStroke > 0.25;
      if (recovering || this.lastRating !== 'fast') {
        this.stamina = clamp(this.stamina + STAMINA.regenPerSec * dt, 0, STAMINA.max);
      }
    }
    // Animasi lengan mengejar target dari kayuhan
    s.armPhase += (s.armTarget - s.armPhase) * Math.min(1, dt * 9);
  }

  /** Untuk HUD indikator ritme. */
  rhythmState(now) {
    return {
      ...this.window,
      since: this.lastStroke == null ? null : now - this.lastStroke,
      rating: this.lastRating,
      ratingAge: now - this.lastRatingAt,
      streak: this.streak,
    };
  }
}
