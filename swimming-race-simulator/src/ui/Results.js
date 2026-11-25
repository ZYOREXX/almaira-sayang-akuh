import { AI_TIERS } from '../config.js';
import { formatTime, storageGet, storageSet } from '../core/utils.js';
import { escapeHtml } from './HUD.js';
import { PB_KEY } from './Menu.js';

const MEDALS = {
  1: { emoji: '🥇', color: 'from-yellow-300 to-amber-500', h: 'h-40 sm:h-48' },
  2: { emoji: '🥈', color: 'from-slate-200 to-slate-400', h: 'h-28 sm:h-36' },
  3: { emoji: '🥉', color: 'from-orange-300 to-amber-700', h: 'h-20 sm:h-28' },
};

/** Layar akhir: podium juara 1-2-3, tabel hasil, dan statistik pemain. */
export class Results {
  constructor({ onAgain, onMenu }) {
    this.root = document.getElementById('results');
    this.title = document.getElementById('resultTitle');
    this.podium = document.getElementById('podium');
    this.table = document.getElementById('resultTable');
    this.stats = document.getElementById('playerStats');
    document.getElementById('btnAgain').addEventListener('click', onAgain);
    document.getElementById('btnMenu').addEventListener('click', onMenu);
  }

  show(race) {
    const results = race.results;
    const player = race.player;
    const winner = results[0];

    // Rekor pribadi
    const pbs = storageGet(PB_KEY, {});
    const prevPb = pbs[race.distance];
    const isPb = !prevPb || player.finishTime < prevPb;
    if (isPb) storageSet(PB_KEY, { ...pbs, [race.distance]: player.finishTime });

    const titles = {
      1: '🏆 JUARA! Medali Emas untuk Anda!',
      2: '🥈 Medali Perak — luar biasa!',
      3: '🥉 Medali Perunggu — naik podium!',
    };
    this.title.innerHTML = `${titles[player.place] ?? `Anda finis di posisi ${player.place}`}
      ${isPb ? '<div class="mt-1 text-sm font-bold text-amber-300">⭐ Rekor pribadi baru!</div>' : ''}`;

    // Podium dengan urutan visual 2 - 1 - 3
    this.podium.innerHTML = [2, 1, 3].map((place) => {
      const s = results[place - 1];
      const m = MEDALS[place];
      const you = s.isPlayer ? '<span class="rounded bg-rose-500 px-1.5 text-[10px] font-black text-white">ANDA</span>' : '';
      return `<div class="flex flex-col items-center gap-1">
        <div class="text-3xl">${m.emoji}</div>
        <div class="flex items-center gap-1 text-center text-sm font-bold">
          <span class="inline-block h-3 w-3 rounded-full" style="background:${s.capColor}"></span>${escapeHtml(s.name)} ${you}
        </div>
        <div class="text-[11px] text-slate-400">${s.isPlayer ? 'Lintasan 4' : `${AI_TIERS[s.tier].label} · ${s.country}`}</div>
        <div class="font-mono text-sm font-bold text-white">${formatTime(s.finishTime)}</div>
        <div class="podium-step ${m.h} w-full bg-gradient-to-b ${m.color}" style="animation-delay:${place * 0.15}s">
          <span class="text-4xl font-black sm:text-5xl">${place}</span>
        </div>
      </div>`;
    }).join('');

    // Tabel lengkap
    this.table.innerHTML = results.map((s) => {
      const diff = s === winner ? '—' : `+${(s.finishTime - winner.finishTime).toFixed(2)}`;
      const row = s.isPlayer ? 'bg-rose-950/50 font-bold' : 'odd:bg-white/[.03]';
      return `<tr class="${row}">
        <td class="py-1.5 pr-2 font-black">${s.place}</td>
        <td class="pr-2">${s.lane}</td>
        <td class="pr-2"><span class="mr-1 inline-block h-2.5 w-2.5 rounded-full" style="background:${s.capColor}"></span>${escapeHtml(s.name)} <span class="text-[10px] text-slate-500">${s.isPlayer ? '' : s.country}</span></td>
        <td class="pr-2 text-xs text-slate-400">${s.isPlayer ? 'Pemain' : AI_TIERS[s.tier].label}</td>
        <td class="pr-2 text-right font-mono text-xs">${s.reactionTime != null ? s.reactionTime.toFixed(2) : '-'}${s.falseStart ? ' <span class="text-rose-400">FS</span>' : ''}</td>
        <td class="pr-2 text-right font-mono">${formatTime(s.finishTime)}</td>
        <td class="text-right font-mono text-xs text-slate-400">${diff}</td>
      </tr>`;
    }).join('');

    // Statistik pemain
    const c = race.playerCtl.counts;
    const total = c.perfect + c.sweet + c.fast + c.slow || 1;
    const acc = Math.round(((c.perfect + c.sweet) / total) * 100);
    const turns = race.playerCtl.turnRatings;
    const turnText = player.lengths > 1
      ? turns.length ? `${Math.round((turns.reduce((a, b) => a + b, 0) / turns.length) * 100)}%` : 'Open turn'
      : '—';
    const splits = player.splits.map((t, i) => formatTime(t - (player.splits[i - 1] ?? 0))).join(' · ');
    const stat = (label, value) => `<div class="rounded-lg bg-white/5 p-2"><div class="text-slate-400">${label}</div><div class="mt-0.5 font-mono text-sm font-bold text-white">${value}</div></div>`;
    this.stats.innerHTML = [
      stat('Akurasi ritme', `${acc}%`),
      stat('Perfect / Combo', `${c.perfect} / ×${race.playerCtl.bestStreak}`),
      stat('Kualitas flip', turnText),
      stat('Split per 50 m', splits || '-'),
    ].join('');

    this.root.classList.remove('hidden');
    return { playerPlace: player.place };
  }

  hide() {
    this.root.classList.add('hidden');
  }

  get visible() {
    return !this.root.classList.contains('hidden');
  }
}
