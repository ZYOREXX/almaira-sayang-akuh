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

/** Memperbarui elemen DOM HUD; hanya menulis saat nilai berubah. */
export class HUD {
  constructor() {
    this.el = {
      timer: $('timer'), distance: $('distance'), lap: $('lap'), position: $('position'), speed: $('speed'),
      staminaFill: $('staminaFill'), staminaText: $('staminaText'), staminaWarn: $('staminaWarn'),
      zoneSweet: $('zoneSweet'), zonePerfect: $('zonePerfect'), needle: $('needle'),
      rhythmLabel: $('rhythmLabel'), streak: $('streak'), flipPrompt: $('flipPrompt'),
      standings: $('standings'), message: $('messageText'), rating: $('rating'), hint: $('hint'),
      warp: $('warp'), btnDive: $('btnDive'), btnFlip: $('btnFlip'), btnStroke: $('btnStroke'),
    };
    this.cache = new Map();
    this.hintTimer = null;
  }

  set(key, prop, value) {
    const k = `${key}.${prop}`;
    if (this.cache.get(k) === value) return;
    this.cache.set(k, value);
    if (prop === 'text') this.el[key].textContent = value;
    else if (prop === 'html') this.el[key].innerHTML = value;
    else if (prop === 'class') this.el[key].className = value;
    else this.el[key].style[prop] = value;
  }

  message(text) {
    this.set('message', 'text', text);
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

  reset() {
    this.cache.clear();
    this.el.rating.replaceChildren();
    this.message('');
    this.el.warp.classList.add('hidden');
  }

  update(race, nowSec) {
    const p = race.player;
    const ctl = race.playerCtl;

    // Waktu & jarak
    this.set('timer', 'text', formatTime(race.state === 'racing' || race.state === 'done' ? (p.finishTime ?? race.clock) : 0));
    this.set('distance', 'text', `${p.dist.toFixed(1)} / ${race.distance} m`);
    const lapNo = Math.min(p.lapIndex + 1, p.lengths);
    this.set('lap', 'text', p.lengths > 1 ? `Length ${lapNo}/${p.lengths}` : '');
    this.set('speed', 'text', `${p.v.toFixed(2)} m/s`);

    const standings = race.standings();
    const pos = standings.indexOf(p) + 1;
    this.set('position', 'html', race.state === 'racing' || race.state === 'done'
      ? `${pos}<span class="text-sm text-slate-400">/8</span>`
      : '-');

    // Stamina
    const st = ctl.stamina;
    this.set('staminaFill', 'width', `${st.toFixed(1)}%`);
    const color = st > 60 ? '#22c55e' : st > 30 ? '#eab308' : '#ef4444';
    this.set('staminaFill', 'backgroundColor', color);
    this.set('staminaText', 'text', `${Math.round(st)}%`);
    this.set('staminaWarn', 'text', st < 30 ? '⚠ Stamina rendah — kayuhan melemah, perlambat ritme!' : '');

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
    this.set('rhythmLabel', 'text', rs ? rs.text : swimming ? 'Jaga ritme…' : '');
    this.set('rhythmLabel', 'class', `font-bold ${rs ? rs.cls : 'text-slate-400'}`);
    this.set('streak', 'text', r.streak >= 3 ? `🔥 Combo ×${r.streak}` : '');

    // Flip turn prompt
    const inZone = race.racing && swimming && !p.isFinalLength && p.distToWall <= TURN.zoneStart;
    const ideal = inZone && p.distToWall <= TURN.idealFar && p.distToWall >= TURN.idealNear;
    this.set('flipPrompt', 'text', inZone ? (ideal ? '▶ TEKAN F SEKARANG!' : `Dinding ${p.distToWall.toFixed(1)} m — siap FLIP`) : '');
    this.el.btnFlip.classList.toggle('is-active', ideal);
    this.el.btnDive.classList.toggle('is-active', race.racing && p.phase === 'block');
    this.el.btnStroke.classList.toggle('is-active', swimming && r.since != null && r.since >= r.perfectMin && r.since <= r.perfectMax);

    this.el.warp.classList.toggle('hidden', race.timeScale === 1 || race.state !== 'racing');

    this.renderStandings(standings, race);
  }

  renderStandings(standings, race) {
    const leader = standings[0];
    const key = standings.map((s) => `${s.lane}:${s.finishTime ?? ''}:${Math.floor(s.dist)}`).join('|');
    if (this.cache.get('standingsKey') === key) return;
    this.cache.set('standingsKey', key);
    const rows = standings.map((s, i) => {
      let gap = '';
      if (s.finishTime != null) gap = formatTime(s.finishTime);
      else if (race.state === 'racing' && s !== leader) gap = `-${(leader.dist - s.dist).toFixed(1)} m`;
      const highlight = s.isPlayer ? 'ring-rose-400/60 bg-rose-950/50' : '';
      return `<li class="standing-row ${highlight}">
        <span class="w-4 text-right font-black ${i < 3 ? 'text-amber-300' : 'text-slate-400'}">${i + 1}</span>
        <span class="h-3 w-3 shrink-0 rounded-full" style="background:${s.capColor}"></span>
        <span class="min-w-0 flex-1 truncate font-semibold">${escapeHtml(s.name)}</span>
        <span class="font-mono text-[10px] text-slate-400">${gap}</span>
      </li>`;
    });
    this.el.standings.innerHTML = rows.join('');
  }
}

export function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

