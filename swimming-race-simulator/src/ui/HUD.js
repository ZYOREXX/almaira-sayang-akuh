import { RHYTHM, TURN } from '../config.js';
import { formatTime, clamp } from '../core/utils.js';

const $ = (id) => document.getElementById(id);

const RATING_STYLE = {
  perfect: { text: 'PERFECT!', cls: 'text-emerald-200' },
  sweet: { text: 'Sweet Spot', cls: 'text-emerald-300' },
  fast: { text: 'Terlalu cepat — stamina terkuras!', cls: 'text-rose-300' },
  slow: { text: 'Terlalu lambat — kecepatan turun', cls: 'text-amber-300' },
};

const TONE_CLASS = {
  perfect: 'bg-emerald-400 text-emerald-950',
  good: 'bg-sky-400 text-sky-950',
  bad: 'bg-rose-500 text-white',
};

/** HUD bergaya siaran di atas adegan 3D. Hanya menulis DOM saat nilai berubah. */
export class HUD {
  constructor() {
    const ids = [
      'hud', 'timer', 'remaining', 'lap', 'position', 'posSuffix', 'speed', 'playerName', 'raceTag', 'track',
      'staminaFill', 'staminaText', 'zoneSweet', 'zonePerfect', 'needle', 'rhythmLabel', 'streak', 'flipPrompt',
      'standings', 'messageText', 'rating', 'hint', 'warp', 'btnDive', 'btnFlip', 'btnStroke',
    ];
    this.el = Object.fromEntries(ids.map((id) => [id, $(id)]));
    this.cache = new Map();
    this.hintTimer = null;
    this.dots = [];
  }

  show(visible) {
    this.el.hud.classList.toggle('hidden', !visible);
  }

  set(key, prop, value) {
    const k = `${key}.${prop}`;
    if (this.cache.get(k) === value) return;
    this.cache.set(k, value);
    const el = this.el[key];
    if (prop === 'text') el.textContent = value;
    else if (prop === 'html') el.innerHTML = value;
    else if (prop === 'class') el.className = value;
    else el.style[prop] = value;
  }

  message(text) {
    this.set('messageText', 'text', text);
  }

  popRating(text, tone) {
    const div = document.createElement('div');
    div.className = `rating-pop ${TONE_CLASS[tone] ?? TONE_CLASS.good}`;
    div.textContent = text;
    this.el.rating.replaceChildren(div);
  }

  hint(text) {
    this.el.hint.textContent = text;
    this.el.hint.style.opacity = '1';
    clearTimeout(this.hintTimer);
    this.hintTimer = setTimeout(() => { this.el.hint.style.opacity = '0'; }, 1400);
  }

  /** Siapkan untuk lomba baru. */
  reset(race) {
    this.cache.clear();
    this.el.rating.replaceChildren();
    this.message('');
    this.el.warp.classList.add('hidden');
    if (!race) return;
    this.set('playerName', 'text', race.player.name.toUpperCase());
    this.set('raceTag', 'text', `${race.distance} m Gaya Bebas · Final`);
    // Titik-titik progres per lintasan
    this.el.track.innerHTML = '';
    const lanes = race.swimmers.length;
    this.dots = race.swimmers.map((s) => {
      const top = `${((s.lane - 0.5) / lanes) * 100}%`;
      // garis lintasan tipis
      const line = document.createElement('div');
      line.className = 'absolute inset-x-1 h-px bg-white/10';
      line.style.top = top;
      this.el.track.appendChild(line);
      const d = document.createElement('div');
      d.className = 'track-dot';
      d.style.top = top;
      d.style.background = s.capColor;
      if (s.isPlayer) {
        d.style.width = d.style.height = '11px';
        d.style.boxShadow = '0 0 0 2px #ef4444, 0 0 10px #ef4444';
        d.style.zIndex = '2';
      }
      this.el.track.appendChild(d);
      return { s, d, last: '' };
    });
  }

  update(race, nowSec) {
    const p = race.player;
    const ctl = race.playerCtl;
    const racingOrDone = race.state === 'racing' || race.state === 'done';

    this.set('timer', 'text', formatTime(racingOrDone ? (p.finishTime ?? race.clock) : 0));
    this.set('remaining', 'text', (race.distance - p.dist).toFixed(p.dist > race.distance - 10 ? 1 : 0));
    this.set('lap', 'text', p.lengths > 1 ? `Length ${Math.min(p.lapIndex + 1, p.lengths)} / ${p.lengths}` : 'Satu length · 50 m');
    this.set('speed', 'text', `${p.v.toFixed(2)} m/s`);

    const standings = race.standings();
    const pos = standings.indexOf(p) + 1;
    this.set('position', 'text', racingOrDone ? String(pos) : '-');
    this.set('posSuffix', 'text', racingOrDone ? (pos === 1 ? 'st' : pos === 2 ? 'nd' : pos === 3 ? 'rd' : 'th') : '');

    // Stamina
    const st = ctl.stamina;
    this.set('staminaFill', 'width', `${st.toFixed(1)}%`);
    this.set('staminaFill', 'background', st > 60
      ? 'linear-gradient(90deg,#16a34a,#4ade80)'
      : st > 30 ? 'linear-gradient(90deg,#ca8a04,#facc15)' : 'linear-gradient(90deg,#b91c1c,#f87171)');
    this.set('staminaText', 'text', `${Math.round(st)}%`);

    // Indikator ritme
    const r = ctl.rhythmState(nowSec);
    const pct = (v) => `${clamp(v / RHYTHM.meterMax, 0, 1) * 100}%`;
    this.set('zoneSweet', 'left', pct(r.min));
    this.set('zoneSweet', 'width', `${((r.max - r.min) / RHYTHM.meterMax) * 100}%`);
    this.set('zonePerfect', 'left', pct(r.perfectMin));
    this.set('zonePerfect', 'width', `${((r.perfectMax - r.perfectMin) / RHYTHM.meterMax) * 100}%`);
    const swimming = p.phase === 'swim';
    const since = swimming && r.since != null ? r.since : (swimming ? (r.min + r.max) / 2 : 0);
    this.set('needle', 'left', pct(since));
    this.set('needle', 'opacity', swimming ? '1' : '0.3');

    const rs = r.rating && r.ratingAge < 1.2 ? RATING_STYLE[r.rating] : null;
    const lowStamina = st < 30 && swimming;
    this.set('rhythmLabel', 'text', lowStamina ? '⚠ Stamina rendah — perlambat ritme!' : rs ? rs.text : swimming ? 'Jaga ritme…' : '');
    this.set('rhythmLabel', 'class', `font-bold ${lowStamina ? 'text-rose-300' : rs ? rs.cls : 'text-slate-300'}`);
    this.set('streak', 'text', r.streak >= 3 ? `🔥×${r.streak}` : '');

    // Flip turn
    const inZone = race.racing && swimming && !p.isFinalLength && p.distToWall <= TURN.zoneStart;
    const ideal = inZone && p.distToWall <= TURN.idealFar && p.distToWall >= TURN.idealNear;
    this.set('flipPrompt', 'text', inZone ? (ideal ? '▶ FLIP SEKARANG! (F)' : `Dinding ${p.distToWall.toFixed(1)} m`) : '');
    this.el.btnFlip.classList.toggle('is-active', ideal);
    this.el.btnDive.classList.toggle('is-active', race.racing && p.phase === 'block');
    this.el.btnStroke.classList.toggle('is-active', swimming && r.since != null && r.since >= r.perfectMin && r.since <= r.perfectMax);

    this.el.warp.classList.toggle('hidden', race.timeScale === 1 || race.state !== 'racing');

    // Progres lintasan
    for (const dot of this.dots) {
      const left = `${clamp(dot.s.dist / race.distance, 0, 1) * 100}%`;
      if (dot.last !== left) {
        dot.d.style.left = left;
        dot.last = left;
      }
    }

    this.renderStandings(standings, race);
  }

  renderStandings(standings, race) {
    const leader = standings[0];
    const key = standings.map((s) => `${s.lane}:${s.finishTime ?? ''}:${Math.floor(s.dist)}`).join('|');
    if (this.cache.get('standingsKey') === key) return;
    this.cache.set('standingsKey', key);
    this.el.standings.innerHTML = standings.map((s, i) => {
      let gap = '';
      if (s.finishTime != null) gap = formatTime(s.finishTime);
      else if (race.state === 'racing' && s !== leader) gap = `-${(leader.dist - s.dist).toFixed(1)} m`;
      const highlight = s.isPlayer ? 'ring-rose-400/70 bg-rose-950/60' : '';
      return `<li class="standing-row ${highlight}">
        <span class="w-4 text-right font-display text-base font-black italic ${i < 3 ? 'text-amber-300' : 'text-slate-300'}">${i + 1}</span>
        <span class="h-3 w-3 shrink-0 rounded-full" style="background:${s.capColor}"></span>
        <span class="min-w-0 flex-1 truncate font-semibold">${escapeHtml(s.name)}</span>
        <span class="font-mono text-[10px] text-slate-300">${gap}</span>
      </li>`;
    }).join('');
  }
}

export function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
