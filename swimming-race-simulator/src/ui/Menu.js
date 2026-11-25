import { DISTANCES, FIELD_PRESETS, AI_TIERS } from '../config.js';
import { storageGet, storageSet, formatTime } from '../core/utils.js';

const SETTINGS_KEY = 'srs.settings';
export const PB_KEY = 'srs.pb';

/** Layar menu: nama, jarak lomba, tingkat kompetisi. */
export class Menu {
  constructor(onStart) {
    this.root = document.getElementById('menu');
    this.form = document.getElementById('menuForm');
    this.inName = document.getElementById('inName');
    this.inDistance = document.getElementById('inDistance');
    this.inLevel = document.getElementById('inLevel');
    this.preview = document.getElementById('fieldPreview');
    this.pbInfo = document.getElementById('pbInfo');

    const saved = storageGet(SETTINGS_KEY, {});
    this.settings = {
      playerName: saved.playerName ?? '',
      distance: DISTANCES.includes(saved.distance) ? saved.distance : 100,
      level: FIELD_PRESETS[saved.level] ? saved.level : 'sedang',
    };

    this.inName.value = this.settings.playerName;
    this.inDistance.innerHTML = DISTANCES.map((d) => `<button type="button" data-d="${d}">${d} m</button>`).join('');
    this.inLevel.innerHTML = Object.entries(FIELD_PRESETS)
      .map(([k, v]) => `<option value="${k}">${v.label}</option>`)
      .join('');
    this.inLevel.value = this.settings.level;

    this.inDistance.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-d]');
      if (!b) return;
      this.settings.distance = Number(b.dataset.d);
      this.refresh();
    });
    this.inLevel.addEventListener('change', () => {
      this.settings.level = this.inLevel.value;
      this.refresh();
    });
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.settings.playerName = this.inName.value.trim().slice(0, 16);
      storageSet(SETTINGS_KEY, this.settings);
      onStart({ ...this.settings });
    });
    this.refresh();
  }

  refresh() {
    this.inDistance.querySelectorAll('button').forEach((b) => {
      b.setAttribute('aria-pressed', String(Number(b.dataset.d) === this.settings.distance));
    });
    const tiers = FIELD_PRESETS[this.settings.level].tiers;
    const count = tiers.reduce((acc, t) => ({ ...acc, [t]: (acc[t] ?? 0) + 1 }), {});
    this.preview.innerHTML = 'Lawan: ' + Object.entries(count)
      .map(([t, n]) => `<b class="text-slate-200">${n}× ${AI_TIERS[t].label}</b>`)
      .join(' · ');
    const pb = storageGet(PB_KEY, {})[this.settings.distance];
    this.pbInfo.innerHTML = pb ? `🏅 Rekor pribadi ${this.settings.distance} m: <b class="font-mono text-amber-300">${formatTime(pb)}</b>` : '';
  }

  show() {
    this.refresh();
    this.root.classList.remove('hidden');
  }

  hide() {
    this.root.classList.add('hidden');
  }

  get visible() {
    return !this.root.classList.contains('hidden');
  }
}
