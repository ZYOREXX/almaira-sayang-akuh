/**
 * Efek suara sintetis dengan Web Audio API (tanpa file aset):
 * bunyi start elektronik, cipratan, kayuhan, dan sorak penonton.
 */
export class Sound {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.crowd = null;
  }

  /** Harus dipanggil dari gesture pengguna (klik / tombol). */
  unlock() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.7;
      this.master.connect(this.ctx.destination);
      this.noise = this.makeNoise();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }

  setMuted(m) {
    this.muted = m;
    if (this.master) this.master.gain.value = m ? 0 : 0.7;
  }

  makeNoise() {
    const len = this.ctx.sampleRate * 2;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  tone(freq, dur, { type = 'sine', vol = 0.3, delay = 0 } = {}) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime + delay;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.01);
    g.gain.setValueAtTime(vol, t + dur - 0.04);
    g.gain.linearRampToValueAtTime(0, t + dur);
    o.connect(g).connect(this.master);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  whoosh(dur, { freq = 900, q = 0.8, vol = 0.3, type = 'bandpass', sweepTo = null } = {}) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    src.playbackRate.value = 0.8 + Math.random() * 0.4;
    const f = this.ctx.createBiquadFilter();
    f.type = type;
    f.frequency.setValueAtTime(freq, t);
    if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t + dur);
    f.Q.value = q;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(f).connect(g).connect(this.master);
    src.start(t, Math.random());
    src.stop(t + dur + 0.05);
  }

  startBeep() {
    this.tone(880, 0.55, { type: 'square', vol: 0.12 });
    this.tone(1320, 0.55, { type: 'sine', vol: 0.1 });
  }

  marks() {
    this.tone(520, 0.12, { type: 'triangle', vol: 0.15 });
  }

  stroke(rating) {
    const vol = rating === 'fast' ? 0.07 : 0.12;
    this.whoosh(0.18, { freq: 1400 + Math.random() * 600, q: 0.6, vol });
  }

  splash(big = 1) {
    this.whoosh(0.6 * big, { freq: 2200, q: 0.4, vol: 0.3 * big, type: 'lowpass', sweepTo: 400 });
  }

  good() {
    this.tone(660, 0.08, { type: 'triangle', vol: 0.12 });
    this.tone(990, 0.12, { type: 'triangle', vol: 0.12, delay: 0.07 });
  }

  bad() {
    this.tone(220, 0.18, { type: 'sawtooth', vol: 0.07 });
  }

  fanfare() {
    [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.22, { type: 'triangle', vol: 0.14, delay: i * 0.12 }));
  }

  crowdStart() {
    if (!this.ctx || this.crowd) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    const f = this.ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 700;
    f.Q.value = 0.5;
    const g = this.ctx.createGain();
    g.gain.value = 0.0;
    g.gain.linearRampToValueAtTime(0.05, this.ctx.currentTime + 1.5);
    src.connect(f).connect(g).connect(this.master);
    src.start();
    this.crowd = { src, g };
  }

  crowdSwell(level = 0.12) {
    if (!this.crowd) return;
    const t = this.ctx.currentTime;
    this.crowd.g.gain.cancelScheduledValues(t);
    this.crowd.g.gain.setValueAtTime(this.crowd.g.gain.value, t);
    this.crowd.g.gain.linearRampToValueAtTime(level, t + 0.4);
    this.crowd.g.gain.linearRampToValueAtTime(0.05, t + 3.5);
  }

  crowdStop() {
    if (!this.crowd) return;
    const { src, g } = this.crowd;
    const t = this.ctx.currentTime;
    g.gain.cancelScheduledValues(t);
    g.gain.setValueAtTime(g.gain.value, t);
    g.gain.linearRampToValueAtTime(0, t + 1.2);
    src.stop(t + 1.3);
    this.crowd = null;
  }
}
