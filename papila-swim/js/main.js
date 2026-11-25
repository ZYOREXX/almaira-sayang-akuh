/* =========================================================================
   PAPILA SWIM — APP
   Merender seluruh konten dari js/data.js dan mengatur interaksi.
   Tidak memakai library eksternal.
   ========================================================================= */
(function () {
  "use strict";

  /* ---------------------------------------------------------------------
     0. UTILITAS
     --------------------------------------------------------------------- */
  const S = window.SITE || {};
  const B = S.brand || {};
  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;
  root.classList.add("js");

  const page = body.dataset.page || "home";
  const isHome = page === "home";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior = reduced ? "auto" : "smooth";

  const $ = (s, r = doc) => r.querySelector(s);
  const $$ = (s, r = doc) => Array.from(r.querySelectorAll(s));
  const esc = (v = "") =>
    String(v).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const slugify = (v = "") =>
    String(v).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const mark = (v = "") => esc(v).replace(/\*(.+?)\*/g, "<em>$1</em>");
  const plain = (v = "") => String(v).replace(/\*/g, "");
  const homeLink = hash => (isHome ? "" : "index.html") + hash;
  const waUrl = (text = "") => `https://wa.me/${B.whatsapp || ""}${text ? "?text=" + encodeURIComponent(text) : ""}`;
  const mapsUrl = q => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
  const fmtDate = d => {
    const x = new Date(d + "T00:00:00");
    return isNaN(x) ? d : x.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };
  const fmtNum = n => Number(n).toLocaleString("id-ID");
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* abaikan */ } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* abaikan */ } }
  };
  const removeSection = el => { const s = el && el.closest("section"); if (s) s.remove(); };

  /* Satu listener scroll untuk semua kebutuhan (di-throttle dengan rAF) */
  const onScroll = (() => {
    const fns = [];
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { ticking = false; fns.forEach(f => f(window.scrollY)); });
    }, { passive: true });
    return fn => { fns.push(fn); fn(window.scrollY); };
  })();

  /* ---------------------------------------------------------------------
     1. IKON (SVG inline, 24×24)
     --------------------------------------------------------------------- */
  const P = {
    menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowLeft: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    arrowUp: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    chevRight: '<path d="M9 6l6 6-6 6"/>',
    chevLeft: '<path d="M15 6l-6 6 6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    checkCircle: '<circle cx="12" cy="12" r="9"/><path d="M8 12.3l2.7 2.7L16 9.5"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
    users: '<circle cx="9" cy="8" r="3"/><path d="M3 20v-1a6 6 0 0 1 12 0v1"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.2a5 5 0 0 1 5 4.8v1"/>',
    shield: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"/><path d="M9 12l2 2 4-4"/>',
    award: '<circle cx="12" cy="9" r="5"/><path d="M8.5 13.5L7 21l5-2.5 5 2.5-1.5-7.5"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h4"/>',
    heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    thermo: '<path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z"/><path d="M12 11v5"/>',
    waves: '<path d="M2 9c2 0 2-1.5 4-1.5S8 9 10 9s2-1.5 4-1.5S16 9 18 9s2-1.5 4-1.5M2 15c2 0 2-1.5 4-1.5S8 15 10 15s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5"/>',
    swimmer: '<circle cx="17" cy="6.5" r="2"/><path d="M3 13l4.5-3.5 3.5 2.5 3-2.5 2.5 2"/><path d="M2 18c2 0 2-1.5 4-1.5S8 18 10 18s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5"/>',
    baby: '<circle cx="12" cy="8" r="4"/><path d="M10.5 7.6h.01M13.5 7.6h.01M10.8 9.7c.7.5 1.7.5 2.4 0"/><path d="M6 21v-1.5a6 6 0 0 1 12 0V21"/>',
    duck: '<circle cx="14" cy="8" r="3"/><path d="M17 8h3l-2 1.6"/><path d="M5 12h7.5c3.5 0 6 1.2 6 3.5S16 19 12 19H9c-3 0-4.5-2.5-4-7z"/><path d="M2 22c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1"/>',
    ring: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4"/><path d="M6 6l3.2 3.2M18 6l-3.2 3.2M6 18l3.2-3.2M18 18l-3.2-3.2"/>',
    stopwatch: '<circle cx="12" cy="14" r="7"/><path d="M12 14v-3.5M10 3h4M12 3v4M18.5 7.5L20 6"/>',
    sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
    building: '<path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16M15 9h4a1 1 0 0 1 1 1v11M3 21h18M8 8h3M8 12h3M8 16h3"/>',
    route: '<path d="M3 11l18-8-8 18-2-8-8-2z"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
    camera: '<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.5" r="3.5"/>',
    book: '<path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5zM5 19.5A1.5 1.5 0 0 0 6.5 21H19v-3"/>',
    megaphone: '<path d="M3 10v4a1 1 0 0 0 1 1h3l7 4V5L7 9H4a1 1 0 0 0-1 1z"/><path d="M18 8.5a5 5 0 0 1 0 7"/>',
    login: '<path d="M10 17l5-5-5-5M15 12H3M14 4h5a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-5"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><path d="M4 4l16 16"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    play: '<path class="f" d="M8 5.5v13l10-6.5z"/>',
    pause: '<path class="f" d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/>',
    quote: '<path class="f" d="M4 11.5C4 7.9 6.2 5.3 9.6 4.5l.7 1.6C8.3 6.9 7.3 8.3 7.2 10H10v7H4zm10 0c0-3.6 2.2-6.2 5.6-7l.7 1.6c-2 .8-3 2.2-3.1 3.9H20v7h-6z"/>',
    wa: '<g transform="scale(.75)"><path class="f" d="M16 3a13 13 0 00-11.2 19.6L3 29l6.6-1.7A13 13 0 1016 3zm0 23.7c-2 0-4-.6-5.7-1.6l-.4-.2-3.9 1 1-3.8-.3-.4A10.7 10.7 0 1116 26.7zm5.9-8c-.3-.2-1.9-1-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7 0-.3-.1-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6.3-.5c.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.7s1.2 3.2 1.3 3.4c.2.2 2.3 3.5 5.6 4.9.8.3 1.4.5 1.9.7.8.2 1.5.2 2 .1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/></g>',
    ig: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle class="f" cx="17.5" cy="6.5" r="1.1"/>',
    tiktok: '<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.5 3 2.5 5 5.5 5"/>',
    yt: '<path class="f" fill-rule="evenodd" d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12a31 31 0 0 0 .4 3.8 3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1c.4-1.2.5-2.5.4-3.8 0-1.3 0-2.6-.4-3.8zM10 15V9l5.2 3z"/>',
    fb: '<path class="f" d="M14 8.5V6.8c0-.8.2-1.3 1.4-1.3H17V2.3c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2H7.5v3.4h2.8V22H14V11.9h2.8l.4-3.4H14z"/>'
  };
  const ic = (n, c = "") =>
    `<svg class="i${c ? " " + c : ""}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${P[n] || P.sparkle}</svg>`;

  const logoMark = () =>
    `<svg class="brand-mark" viewBox="0 0 64 34" aria-hidden="true" focusable="false"><path class="lm-wave" d="M2 26c8-10 20-14 34-10-9-1-17 3-22 9 6-3 13-4 20-2 7 2 14 2 22-3-6 8-15 11-24 9-8-2-16-1-24 3-2 1-4-1-6-6z"/><path class="lm-body" d="M30 4c3-2 7-1 9 2l6 8c1 1 3 2 5 1l4-1c-2 3-5 4-8 3l-4-2-6 6c-3-3-7-4-11-3l7-6-3-4z"/><circle class="lm-body" cx="50" cy="8" r="3.4"/></svg>`;
  const brandLockup = (extra = "") =>
    `<a class="brand${extra ? " " + extra : ""}" href="${isHome ? "#beranda" : "index.html"}" aria-label="${esc(B.fullName)}, ke beranda">${logoMark()}<span class="brand-text"><span class="brand-name">${esc(B.name)}</span><span class="brand-sub">Swimming School</span></span></a>`;

  /* ---------------------------------------------------------------------
     2. ILUSTRASI PENGGANTI FOTO (SVG generatif, deterministik per seed)
     --------------------------------------------------------------------- */
  let uid = 0;
  const PAL = {
    deep: ["#06224a", "#1572e8"],
    aqua: ["#0a7fd1", "#62d4f5"],
    sun: ["#ef7d22", "#ffcf5c"],
    coral: ["#de4256", "#ff9a6a"],
    mint: ["#0c8a7e", "#3fd3a2"],
    night: ["#051a36", "#0b3f86"],
    sky: ["#1572e8", "#7fdcff"]
  };
  const PAL_KEYS = Object.keys(PAL);
  function rng(seed) {
    let s = 2166136261;
    for (const ch of String(seed)) { s ^= ch.charCodeAt(0); s = Math.imul(s, 16777619) >>> 0; }
    return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  }
  function art({ seed = "papila", pal = "deep", icon = "waves", w = 400, h = 300, label = "" } = {}) {
    const r = rng(seed + pal + icon);
    const id = "a" + (++uid);
    const [c1, c2] = PAL[pal] || PAL.deep;
    let lines = "";
    for (let k = 0; k < 5; k++) {
      const y0 = h * (0.14 + k * 0.18) + r() * 16;
      const amp = 5 + r() * 12;
      const len = 80 + r() * 90;
      const ph = r() * 400;
      let d = "";
      for (let x = -20; x <= w + 20; x += 20) {
        d += (x === -20 ? "M" : "L") + x + " " + (y0 + Math.sin(((x + ph) / len) * Math.PI * 2) * amp).toFixed(1) + " ";
      }
      lines += `<path d="${d}" stroke-opacity="${(0.07 + r() * 0.11).toFixed(2)}" stroke-width="${(1.2 + r() * 2.6).toFixed(1)}"/>`;
    }
    let bubbles = "";
    for (let k = 0; k < 9; k++) {
      bubbles += `<circle cx="${(r() * w).toFixed(0)}" cy="${(r() * h).toFixed(0)}" r="${(2 + r() * 7).toFixed(1)}" stroke-opacity="${(0.16 + r() * 0.22).toFixed(2)}"/>`;
    }
    const sz = Math.min(w, h) * 0.3;
    const s = sz / 24;
    const tx = (w - sz) / 2;
    const ty = (h - sz) / 2;
    const a11y = label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true"';
    return `<svg class="art" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" ${a11y}>` +
      `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>` +
      `<radialGradient id="${id}g" cx=".82" cy=".08" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".34"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>` +
      `<rect width="${w}" height="${h}" fill="url(#${id})"/><rect width="${w}" height="${h}" fill="url(#${id}g)"/>` +
      `<g fill="none" stroke="#fff" stroke-linecap="round">${lines}${bubbles}</g>` +
      (icon === "none" ? "" :
        `<circle cx="${w / 2}" cy="${h / 2}" r="${(sz * 0.86).toFixed(1)}" fill="#fff" fill-opacity=".1"/>` +
        `<g class="art-ic" transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${s.toFixed(3)})" fill="none" stroke="#fff" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${P[icon] || P.waves}</g>`) +
      `</svg>`;
  }
  const media = (img, opts, alt = "") =>
    img ? `<img src="${esc(img)}" alt="${esc(alt)}" loading="lazy" decoding="async">` : art(Object.assign({ label: alt }, opts));

  function initials(name = "") {
    const words = String(name).replace(/^nama\s+/i, "").split(/\s+/).filter(Boolean);
    return (words.slice(0, 2).map(w => w[0]).join("") || "P").toUpperCase();
  }
  /* Poster pelatih ala "lane": garis vertikal + inisial + tali lintasan */
  function poster(m, i) {
    if (m.img) return `<img src="${esc(m.img)}" alt="${esc(m.name)}" loading="lazy" decoding="async">`;
    const id = "p" + (++uid);
    const light = i % 3 === 1;
    const [c1, c2] = light ? ["#0a7fd1", "#6ad6f6"] : ["#06224a", "#1572e8"];
    let stripes = "";
    for (let x = 30; x < 300; x += 60) stripes += `<rect x="${x}" y="0" width="30" height="400" fill="#fff" fill-opacity=".06"/>`;
    const cols = ["#1572e8", "#ffffff", "#1572e8", "#ffc845"];
    let floats = "";
    for (let x = 0, k = 0; x < 300; x += 25, k++) floats += `<rect x="${x + 1.5}" y="372" width="22" height="12" rx="6" fill="${cols[k % 4]}"/>`;
    return `<svg class="art poster" viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${esc(m.name)}">` +
      `<defs><linearGradient id="${id}" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>` +
      `<rect width="300" height="400" fill="url(#${id})"/>${stripes}` +
      `<text x="150" y="58" text-anchor="middle" font-family="Poppins, sans-serif" font-size="12" font-weight="600" letter-spacing="4" fill="#fff" fill-opacity=".72">${esc(String(B.name || "").toUpperCase())}</text>` +
      `<circle cx="150" cy="190" r="58" fill="#fff" fill-opacity=".15"/>` +
      `<text x="150" y="207" text-anchor="middle" font-family="Poppins, sans-serif" font-size="46" font-weight="700" fill="#fff">${esc(initials(m.name))}</text>` +
      `<path d="M58 372c0-58 41-98 92-98s92 40 92 98z" fill="#fff" fill-opacity=".12"/>` +
      `<rect x="0" y="377" width="300" height="2" fill="#051a36" fill-opacity=".45"/>${floats}</svg>`;
  }

  /* Peta ilustrasi (iframe peta diblokir di beberapa tempat, jadi pakai ilustrasi + link) */
  const mapArt = () =>
    `<svg class="map-art" viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="400" height="220" fill="#e4eefa"/><path d="M-10 150C60 118 110 172 180 140S300 70 410 100" stroke="#a9dbf5" stroke-width="18" fill="none"/><g stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round"><path d="M0 60h400M0 190h400M90 0v220M250 0v220M330 0v220"/><path d="M0 18l400 124" stroke-width="5"/></g><g fill="#d2e3f5"><rect x="104" y="72" width="60" height="40" rx="6"/><rect x="264" y="16" width="52" height="30" rx="6"/><rect x="18" y="80" width="58" height="44" rx="6"/><rect x="344" y="152" width="50" height="28" rx="6"/></g><rect x="266" y="152" width="52" height="30" rx="6" fill="#cbeedd"/></svg>`;

  /* ---------------------------------------------------------------------
     3. KOMPONEN GLOBAL: kunci scroll, layer (modal/drawer/lightbox), toast
     --------------------------------------------------------------------- */
  let locks = 0;
  function lock(on) {
    if (on) {
      if (locks === 0) {
        root.style.setProperty("--sbw", window.innerWidth - root.clientWidth + "px");
        root.classList.add("is-locked");
      }
      locks++;
    } else {
      locks = Math.max(0, locks - 1);
      if (locks === 0) root.classList.remove("is-locked");
    }
  }

  const layers = [];
  const removeLayer = l => { const i = layers.indexOf(l); if (i > -1) layers.splice(i, 1); };
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  function trap(container, e) {
    const f = $$(FOCUSABLE, container).filter(x => x.offsetParent !== null || x === doc.activeElement);
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  doc.addEventListener("keydown", e => {
    const top = layers[layers.length - 1];
    if (!top) return;
    if (e.key === "Escape") { e.preventDefault(); top.close(); }
    else if (e.key === "Tab") trap(top.el, e);
    else if (top.key) top.key(e);
  });

  /* Toast */
  const toastBox = doc.createElement("div");
  toastBox.className = "toasts";
  toastBox.setAttribute("role", "status");
  toastBox.setAttribute("aria-live", "polite");
  body.append(toastBox);
  function toast(msg, icon = "checkCircle") {
    const t = doc.createElement("div");
    t.className = "toast";
    t.innerHTML = ic(icon) + `<span>${esc(msg)}</span>`;
    toastBox.append(t);
    setTimeout(() => { t.classList.add("out"); setTimeout(() => t.remove(), 320); }, 2800);
  }

  /* Salin teks (dengan cadangan bila clipboard ditolak) */
  function copyText(text, okMsg = "Tersalin ke clipboard") {
    const fallback = () => {
      const ta = doc.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;top:0;left:0;opacity:0";
      body.append(ta);
      ta.select();
      let ok = false;
      try { ok = doc.execCommand("copy"); } catch (e) { ok = false; }
      ta.remove();
      toast(ok ? okMsg : "Tidak bisa menyalin otomatis. Silakan salin manual.", ok ? "checkCircle" : "info");
    };
    try {
      navigator.clipboard.writeText(text).then(() => toast(okMsg), fallback);
    } catch (e) { fallback(); }
  }

  /* Modal serbaguna */
  const modal = (() => {
    const el = doc.createElement("div");
    el.className = "modal";
    el.inert = true;
    el.innerHTML = `<div class="modal-backdrop" data-close></div><div class="modal-dialog" role="dialog" aria-modal="true" tabindex="-1"><button type="button" class="icon-btn modal-close" data-close aria-label="Tutup">${ic("close")}</button><div class="modal-body"></div></div>`;
    body.append(el);
    const dialog = $(".modal-dialog", el);
    const bodyEl = $(".modal-body", el);
    let lastFocus = null;
    const api = {
      el,
      isOpen: false,
      open(html, { label = "Dialog", size = "md" } = {}) {
        if (api.isOpen) { bodyEl.innerHTML = html; dialog.setAttribute("aria-label", label); dialog.className = "modal-dialog " + size; dialog.scrollTop = 0; return bodyEl; }
        lastFocus = doc.activeElement;
        bodyEl.innerHTML = html;
        dialog.setAttribute("aria-label", label);
        dialog.className = "modal-dialog " + size;
        el.inert = false;
        el.classList.add("open");
        api.isOpen = true;
        lock(true);
        layers.push(api);
        dialog.scrollTop = 0;
        requestAnimationFrame(() => dialog.focus({ preventScroll: true }));
        return bodyEl;
      },
      close() {
        if (!api.isOpen) return;
        el.classList.remove("open");
        el.inert = true;
        api.isOpen = false;
        lock(false);
        removeLayer(api);
        if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
      }
    };
    el.addEventListener("click", e => {
      if (e.target.closest("[data-close]")) api.close();
      else if (e.target.closest('a[href^="#"]')) api.close();
    });
    return api;
  })();

  /* Gesekan (swipe) horizontal untuk layar sentuh */
  function swipe(target, cb) {
    let x0 = null;
    let y0 = 0;
    target.addEventListener("pointerdown", e => { if (e.pointerType === "mouse") return; x0 = e.clientX; y0 = e.clientY; }, { passive: true });
    target.addEventListener("pointercancel", () => { x0 = null; }, { passive: true });
    target.addEventListener("pointerup", e => {
      if (x0 === null) return;
      const dx = e.clientX - x0;
      const dy = e.clientY - y0;
      x0 = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.2) cb(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  /* Hubungkan elemen statis HTML ke data (nomor WA, nama brand) */
  function hydrateStatic() {
    $$("[data-wa]").forEach(a => { a.href = waUrl(a.dataset.wa); a.target = "_blank"; a.rel = "noopener"; });
    $$("[data-brand]").forEach(n => { n.textContent = B[n.dataset.brand] || ""; });
  }

  /* ---------------------------------------------------------------------
     4. HEADER, NAVIGASI, DRAWER (menu mobile)
     --------------------------------------------------------------------- */
  const NAV = [
    { key: "tentang", label: "Tentang", full: "Tentang Kami", home: "#tentang", href: "tentang.html" },
    { key: "program", label: "Program", full: "Program", home: "#program", href: "index.html#program" },
    { key: "lokasi", label: "Lokasi", full: "Lokasi Kolam", home: "#lokasi", href: "index.html#lokasi" },
    { key: "tim", label: "Tim", full: "Tim Pelatih", home: "#tim", href: "tim.html" },
    { key: "galeri", label: "Galeri", full: "Galeri", home: "#galeri", href: "galeri.html" },
    { key: "berita", label: "Berita", full: "Berita & Artikel", home: "#berita", href: "berita.html" }
  ];
  const navHref = n => (isHome ? n.home : n.href);
  const current = n => (!isHome && n.key === page ? ' aria-current="page"' : "");

  function renderHeader() {
    const el = $("#site-header");
    if (!el) return;
    el.className = "header" + (isHome ? " is-overlay" : "");
    el.innerHTML = `<div class="container header-inner">
        ${brandLockup()}
        <nav class="nav" aria-label="Navigasi utama"><ul>${NAV.map(n => `<li><a href="${navHref(n)}" data-nav="${n.key}"${current(n)}>${n.label}</a></li>`).join("")}</ul></nav>
        <div class="header-actions">
          <button type="button" class="btn btn-ghost btn-sm hide-md" data-login>${ic("login")}<span>Masuk</span></button>
          <a class="btn btn-primary btn-sm hide-xs" href="${homeLink("#daftar")}">Daftar</a>
          <button type="button" class="icon-btn nav-toggle" aria-label="Buka menu" aria-expanded="false" aria-controls="drawer">${ic("menu")}</button>
        </div>
      </div>
      <div class="progress" aria-hidden="true"><span></span></div>`;

    const bar = $(".progress span", el);
    onScroll(y => {
      const solid = !(isHome && y < 40);
      el.classList.toggle("is-overlay", !solid);
      el.classList.toggle("is-scrolled", y > 4);
      root.classList.toggle("header-solid", solid);
      const max = root.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    });

    if (isHome && "IntersectionObserver" in window) {
      const links = $$("[data-nav]");
      const io = new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (!en.isIntersecting) return;
          links.forEach(a => a.classList.toggle("is-active", a.dataset.nav === en.target.id));
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      $$("main section[id]").forEach(s => io.observe(s));
    }
  }

  function renderDrawer() {
    const d = doc.createElement("div");
    d.className = "drawer";
    d.id = "drawer";
    d.inert = true;
    d.innerHTML = `<div class="drawer-backdrop" data-close></div>
      <div class="drawer-panel" role="dialog" aria-modal="true" aria-label="Menu navigasi">
        <div class="drawer-head">${brandLockup()}<button type="button" class="icon-btn" data-close aria-label="Tutup menu">${ic("close")}</button></div>
        <nav class="drawer-nav" aria-label="Navigasi utama (mobile)">
          <a href="${isHome ? "#beranda" : "index.html"}">Beranda${ic("chevRight")}</a>
          ${NAV.map(n => `<a href="${navHref(n)}" data-nav="${n.key}"${current(n)}>${n.full}${ic("chevRight")}</a>`).join("")}
        </nav>
        <div class="drawer-cta">
          <a class="btn btn-primary btn-block" href="${homeLink("#daftar")}">Daftar sekarang</a>
          <a class="btn btn-wa btn-block" href="${waUrl(`Halo Admin ${B.name}, saya ingin bertanya.`)}" target="_blank" rel="noopener">${ic("wa")} Chat WhatsApp</a>
          <button type="button" class="btn btn-outline btn-block" data-login>${ic("login")} Masuk portal siswa</button>
        </div>
        <div class="drawer-contact">
          <span>${ic("phone")}${esc(B.phone)}</span>
          <span>${ic("mail")}${esc(B.email)}</span>
          ${(B.hours || []).map(h => `<span>${ic("clock")}${esc(h.day)}: ${esc(h.time)}</span>`).join("")}
        </div>
      </div>`;
    body.append(d);
    const toggle = $(".nav-toggle");
    let last = null;
    const api = {
      el: d,
      open() {
        last = doc.activeElement;
        d.inert = false;
        d.classList.add("open");
        toggle && toggle.setAttribute("aria-expanded", "true");
        lock(true);
        layers.push(api);
        setTimeout(() => { const c = $("[data-close].icon-btn", d); c && c.focus(); }, 60);
      },
      close() {
        if (!d.classList.contains("open")) return;
        d.classList.remove("open");
        d.inert = true;
        toggle && toggle.setAttribute("aria-expanded", "false");
        lock(false);
        removeLayer(api);
        if (last && last.focus) last.focus({ preventScroll: true });
      }
    };
    toggle && toggle.addEventListener("click", api.open);
    d.addEventListener("click", e => {
      if (e.target.closest("[data-close]") || e.target.closest("a") || e.target.closest("[data-login]")) api.close();
    });
    window.addEventListener("resize", () => { if (window.innerWidth > 991) api.close(); });
  }

  /* ---------------------------------------------------------------------
     5. HERO: kanvas air (WebGL) + slider + pencari program
     --------------------------------------------------------------------- */
  function waterCanvas(canvas) {
    let gl = null;
    try { gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" }); } catch (e) { gl = null; }
    if (!gl) return false;
    const vs = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
    const fs = [
      "precision mediump float;",
      "uniform vec2 r;uniform float t;",
      "void main(){",
      " vec2 uv=gl_FragCoord.xy/r;",
      " vec2 p=gl_FragCoord.xy/r.y*3.0;",
      " p+=0.45*vec2(sin(p.y*1.3+t*0.55),cos(p.x*1.1-t*0.45));",
      " float v=sin(dot(p,vec2(0.96,0.28))*2.2+t*0.9)+sin(dot(p,vec2(-0.37,0.93))*2.6-t*0.7)+sin(dot(p,vec2(0.66,-0.75))*3.1+t*1.1);",
      " float c=pow(1.0-min(abs(v)/1.15,1.0),5.0);",
      " vec3 deep=vec3(0.024,0.133,0.29);",
      " vec3 mid=vec3(0.06,0.38,0.82);",
      " vec3 aqua=vec3(0.17,0.70,0.92);",
      " vec3 col=mix(deep,mid,smoothstep(0.0,1.1,uv.y*0.85+uv.x*0.4));",
      " col=mix(col,aqua,0.28*smoothstep(0.45,1.0,uv.x)*smoothstep(0.2,1.0,uv.y));",
      " col+=c*0.24*vec3(0.78,0.93,1.0);",
      " gl_FragColor=vec4(col,1.0);",
      "}"
    ].join("\n");
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; };
    const v = sh(gl.VERTEX_SHADER, vs);
    const f = sh(gl.FRAGMENT_SHADER, fs);
    if (!v || !f) return false;
    const prog = gl.createProgram();
    gl.attachShader(prog, v);
    gl.attachShader(prog, f);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(prog, "r");
    const uT = gl.getUniformLocation(prog, "t");
    const scale = 0.55;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * scale));
      canvas.height = Math.max(1, Math.round(rect.height * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uR, canvas.width, canvas.height);
    };
    const draw = t => { gl.uniform1f(uT, t); gl.drawArrays(gl.TRIANGLES, 0, 3); };
    resize();
    window.addEventListener("resize", () => { resize(); if (reduced) draw(14); });
    if (reduced) { draw(14); return true; }
    let raf = 0;
    let last = 0;
    let visible = true;
    const t0 = performance.now() - 14000;
    const frame = now => {
      raf = requestAnimationFrame(frame);
      if (now - last < 33) return; // ~30fps cukup untuk air
      last = now;
      draw((now - t0) / 1000);
    };
    const start = () => { if (!raf && visible && !doc.hidden) raf = requestAnimationFrame(frame); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(es => { visible = es[0].isIntersecting; visible ? start() : stop(); }).observe(canvas);
    }
    doc.addEventListener("visibilitychange", () => (doc.hidden ? stop() : start()));
    draw((performance.now() - t0) / 1000);
    start();
    return true;
  }

  const PROGRAMS = S.programs || [];
  const programsIn = g => PROGRAMS.filter(p => (p.groups || []).includes(g));
  const ageGroups = () => (S.ageGroups || []).filter(g => programsIn(g.id).length);

  function finderHtml() {
    const groups = ageGroups();
    if (!groups.length) return "";
    return `<aside class="finder" aria-labelledby="finder-title">
        <span class="finder-eyebrow">${ic("search")} Cari kelas yang pas</span>
        <h2 id="finder-title">Berapa usia peserta?</h2>
        <div class="finder-grid">${groups.map(g => `<button type="button" class="finder-opt" data-age="${esc(g.id)}"><span class="ic">${ic(g.icon)}</span><span><b>${esc(g.label)}</b><small>${esc(g.range)}</small></span></button>`).join("")}</div>
        <p class="finder-foot">Masih bingung? <a href="${waUrl(`Halo Admin ${B.name}, saya ingin konsultasi memilih program renang.`)}" target="_blank" rel="noopener">Tanya admin ${ic("arrowRight")}</a></p>
      </aside>`;
  }

  function renderHero() {
    const el = $("#beranda");
    if (!el) return;
    const H = S.hero || {};
    const slides = H.slides || [];
    const hasImg = slides.some(s => s.img);
    el.innerHTML = `<canvas class="hero-canvas" aria-hidden="true"></canvas>
      ${hasImg ? `<div class="hero-media" aria-hidden="true">${slides.map((s, i) => (s.img ? `<img src="${esc(s.img)}" alt="" data-i="${i}" class="${i === 0 ? "is-active" : ""}">` : "")).join("")}</div>` : ""}
      <div class="container hero-grid">
        <div class="hero-copy">
          <h1 class="sr-only">${esc(B.fullName)}: sekolah renang untuk semua usia</h1>
          <div class="hero-slides" aria-roledescription="carousel" aria-label="Sorotan ${esc(B.name)}">
            ${slides.map((s, i) => `<div class="hero-slide${i === 0 ? " is-active" : ""}" role="group" aria-roledescription="slide" aria-label="${i + 1} dari ${slides.length}"${i ? ' aria-hidden="true"' : ""}>
              ${s.kicker ? `<span class="hero-kicker"><span class="dot">${ic("sparkle")}</span>${esc(s.kicker)}</span>` : ""}
              <p class="hero-title">${mark(s.title)}</p>
              <p class="hero-text">${esc(s.text)}</p>
            </div>`).join("")}
          </div>
          <div class="hero-actions">
            <a class="btn btn-primary btn-lg" href="#daftar">Daftar sekarang ${ic("arrowRight")}</a>
            <a class="btn btn-glass btn-lg" href="#program">Lihat program</a>
          </div>
          ${(H.trust || []).length ? `<ul class="hero-trust">${H.trust.map(t => `<li>${ic("checkCircle")}<span>${esc(t)}</span></li>`).join("")}</ul>` : ""}
          ${slides.length > 1 ? `<div class="hero-controls">
            <div class="hero-dots" aria-label="Pilih slide">${slides.map((_, i) => `<button type="button" aria-label="Tampilkan slide ${i + 1}"${i === 0 ? ' class="is-active" aria-current="true"' : ""}><span></span></button>`).join("")}</div>
            <button type="button" class="icon-btn hero-pause" aria-label="Jeda slide">${ic("pause")}</button>
          </div>` : ""}
        </div>
        ${finderHtml()}
      </div>
      <div class="hero-wave" aria-hidden="true"><svg viewBox="0 0 1440 100" preserveAspectRatio="none"><path d="M0 62c120-26 240-40 360-28s240 48 360 48 240-36 360-48 240 2 360 28v38H0z"/></svg></div>`;

    const canvas = $(".hero-canvas", el);
    if (!waterCanvas(canvas)) canvas.remove();

    $$(".finder-opt", el).forEach(b => b.addEventListener("click", () => {
      setProgramFilter(b.dataset.age);
      const target = doc.getElementById("program");
      if (target) target.scrollIntoView({ behavior, block: "start" });
    }));

    if (slides.length < 2) return;
    el.style.setProperty("--hero-dur", (H.interval || 7) + "s");
    const slideEls = $$(".hero-slide", el);
    const dots = $$(".hero-dots button", el);
    const imgs = $$(".hero-media img", el);
    const pauseBtn = $(".hero-pause", el);
    let idx = 0;
    let paused = false;
    const go = n => {
      idx = (n + slideEls.length) % slideEls.length;
      slideEls.forEach((s, i) => { if (i === idx) { s.classList.add("is-active"); s.removeAttribute("aria-hidden"); } else { s.classList.remove("is-active"); s.setAttribute("aria-hidden", "true"); } });
      dots.forEach((d, i) => { d.classList.toggle("is-active", i === idx); if (i === idx) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current"); });
      imgs.forEach(im => im.classList.toggle("is-active", +im.dataset.i === idx));
    };
    const setPaused = p => {
      paused = p;
      el.classList.toggle("is-paused", p);
      pauseBtn.innerHTML = ic(p ? "play" : "pause");
      pauseBtn.setAttribute("aria-label", p ? "Putar slide" : "Jeda slide");
    };
    setPaused(reduced);
    pauseBtn.addEventListener("click", () => setPaused(!paused));
    dots.forEach((d, i) => {
      d.addEventListener("click", () => go(i));
      d.addEventListener("animationend", () => { if (d.classList.contains("is-active")) go(idx + 1); });
    });
    const copy = $(".hero-copy", el);
    copy.addEventListener("mouseenter", () => el.classList.add("is-hover"));
    copy.addEventListener("mouseleave", () => el.classList.remove("is-hover"));
    copy.addEventListener("focusin", () => el.classList.add("is-hover"));
    copy.addEventListener("focusout", () => el.classList.remove("is-hover"));
    swipe($(".hero-slides", el), dir => go(idx + dir));
    $(".hero-dots", el).addEventListener("keydown", e => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        go(idx + (e.key === "ArrowRight" ? 1 : -1));
        dots[idx].focus();
      }
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(es => el.classList.toggle("is-off", !es[0].isIntersecting)).observe(el);
    }
  }

  /* ---------------------------------------------------------------------
     6. STATISTIK (papan skor)
     --------------------------------------------------------------------- */
  function animateNum(n) {
    const end = +n.dataset.count;
    const t0 = performance.now();
    const dur = 1400;
    const step = t => {
      const p = Math.min(1, (t - t0) / dur);
      n.textContent = fmtNum(Math.round(end * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  function renderStats() {
    $$("[data-stats]").forEach(el => {
      const st = S.stats || [];
      if (!st.length) { const w = el.closest(".stats-wrap, section"); if (w) w.remove(); return; }
      el.innerHTML = st.map((s, i) => `<div class="score">
          <div class="score-top">${ic(s.icon || "waves")}<span class="score-lane">Lintasan ${i + 1}</span></div>
          <div class="score-value"><span data-count="${Number(s.value) || 0}">${fmtNum(Number(s.value) || 0)}</span>${s.suffix ? `<sup>${esc(s.suffix)}</sup>` : ""}</div>
          <div class="score-label">${esc(s.label)}</div>
        </div>`).join("");
      if (reduced || !("IntersectionObserver" in window)) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) return; // sudah terlihat saat dimuat: biarkan angka akhir
      const io = new IntersectionObserver(es => {
        if (!es.some(e => e.isIntersecting)) return;
        io.disconnect();
        $$("[data-count]", el).forEach(animateNum);
      }, { rootMargin: "0px 0px 8% 0px" });
      io.observe(el);
    });
  }

  /* ---------------------------------------------------------------------
     7. TENTANG KAMI
     --------------------------------------------------------------------- */
  const points = list => (list || []).length
    ? `<ul class="checklist cols-2">${list.map(p => `<li>${ic("checkCircle")}<span>${esc(p)}</span></li>`).join("")}</ul>` : "";

  function renderAboutHome() {
    const el = $("#about-home");
    if (!el) return;
    const A = S.about || {};
    const badge = (S.stats || []).find(s => /tahun/i.test(s.label)) || (S.stats || [])[0];
    el.innerHTML = `<div class="about-media reveal">
        <div class="about-main">${media(A.img, { seed: "about-main", pal: "deep", icon: "swimmer", w: 480, h: 540 }, "Suasana kelas renang")}</div>
        <div class="about-sub">${media(A.img2, { seed: "about-sub", pal: "aqua", icon: "duck", w: 360, h: 360 }, "Kelas renang anak")}</div>
        ${badge ? `<div class="about-badge"><b>${fmtNum(badge.value)}${esc(badge.suffix || "")}</b><span>${esc(badge.label)}</span></div>` : ""}
      </div>
      <div class="about-body reveal" style="--d:1">
        <span class="eyebrow">Tentang kami</span>
        <h2 class="sec-title">${mark(A.heading)}</h2>
        ${(A.paragraphs || []).map(p => `<p>${esc(p)}</p>`).join("")}
        ${points(A.points)}
        <div class="about-foot">
          <a class="btn btn-primary" href="tentang.html">Kenali kami lebih dekat ${ic("arrowRight")}</a>
          <span class="signature">${esc(B.tagline)}</span>
        </div>
      </div>`;
  }

  function xPattern() {
    let s = "";
    const x = (cx, cy) => `<path d="M${cx - 3} ${cy - 3}l6 6M${cx + 3} ${cy - 3}l-6 6"/>`;
    for (let c = 0; c < 9; c++) for (let r = 0; r < 2; r++) s += x(6 + c * 30, 6 + r * 30);
    for (let r = 2; r < 12; r++) for (let c = 0; c < 2; c++) s += x(6 + c * 30, 6 + r * 29);
    return `<svg viewBox="0 0 260 330" aria-hidden="true"><g stroke="currentColor" stroke-width="1.4" stroke-linecap="round">${s}</g></svg>`;
  }
  function renderAboutClassic() {
    const el = $("#about-classic");
    if (!el) return;
    const A = S.about || {};
    el.innerHTML = `<div class="about-media classic reveal">
        <div class="x-pattern">${xPattern()}</div>
        ${A.img ? `<div class="about-main">${media(A.img, {}, B.fullName)}</div>` : `<div class="logo-lockup">${logoMark()}<b>${esc(String(B.name || "").toUpperCase())}</b><span>Swimming School</span></div>`}
      </div>
      <div class="about-body reveal" style="--d:1">
        <span class="eyebrow">Selamat datang</span>
        <h2 class="sec-title">${mark(A.heading)}</h2>
        ${(A.paragraphs || []).map(p => `<p>${esc(p)}</p>`).join("")}
        ${points(A.points)}
        <span class="signature">${esc(B.tagline)}</span>
      </div>`;
  }

  function renderVisionMission() {
    const el = $("#vm");
    if (!el) return;
    const V = S.visionMission;
    if (!V) { removeSection(el); return; }
    el.innerHTML = `<article class="vm-card vision reveal">
        <span class="eyebrow on-dark">Visi</span>
        <p class="vm-quote">${esc(V.vision)}</p>
        ${ic("target", "vm-ic")}
      </article>
      <article class="vm-card mission reveal" style="--d:1">
        <span class="eyebrow">Misi</span>
        <ul class="checklist">${(V.missions || []).map(m => `<li>${ic("checkCircle")}<span>${esc(m)}</span></li>`).join("")}</ul>
      </article>`;
  }

  function renderPartners() {
    const el = $("#partners");
    if (!el) return;
    const list = S.partners || [];
    if (!list.length) { removeSection(el); return; }
    const items = list.map(p => `<span class="partner">${ic(p.icon || "shield")}${esc(p.name)}</span>`).join("");
    el.innerHTML = `<div class="marquee-track"><div class="marquee-group">${items}</div><div class="marquee-group" aria-hidden="true">${items}</div></div>`;
  }

  function renderFeatures() {
    $$("[data-features]").forEach(el => {
      const f = S.features || [];
      if (!f.length) { removeSection(el); return; }
      el.innerHTML = f.map((x, i) => `<article class="feature reveal" style="--d:${i % 3}">
          <span class="feature-ic">${ic(x.icon)}</span><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p>
        </article>`).join("");
    });
  }

  /* ---------------------------------------------------------------------
     8. PROGRAM: filter usia, kartu, modal detail
     --------------------------------------------------------------------- */
  let setProgramFilter = () => {};
  const programHref = p => homeLink("#program-" + p.id);
  const daftarProgramHref = p => homeLink("#daftar-program-" + p.id);
  const askProgram = p => waUrl(`Halo Admin ${B.name}, saya ingin bertanya tentang program ${p.name}.`);

  function programCard(p) {
    return `<article class="prog" data-id="${esc(p.id)}" data-groups="${esc((p.groups || []).join(" "))}">
        <a class="prog-media" href="${programHref(p)}" data-program-open="${esc(p.id)}" tabindex="-1" aria-hidden="true">
          ${media(p.img, { seed: p.id, pal: p.color || "deep", icon: p.icon || "swimmer", w: 400, h: 230 }, "")}
          <span class="badge badge-light">${ic("user")}${esc(p.age)}</span>
        </a>
        <div class="prog-body">
          <span class="prog-level">Level ${esc(p.levels)}</span>
          <h3><a href="${programHref(p)}" data-program-open="${esc(p.id)}">${esc(p.name)}</a></h3>
          <p>${esc(p.summary)}</p>
          <div class="meta">${p.duration ? `<span>${ic("clock")}${esc(p.duration)}</span>` : ""}${p.ratio ? `<span>${ic("users")}${esc(p.ratio)}</span>` : ""}</div>
          <div class="prog-actions">
            <button type="button" class="btn btn-outline btn-sm" data-program-open="${esc(p.id)}">Detail</button>
            <a class="btn btn-primary btn-sm" href="${daftarProgramHref(p)}" data-prefill-program="${esc(p.id)}">Daftar</a>
          </div>
        </div>
      </article>`;
  }

  function renderPrograms() {
    const grid = $("#program-grid");
    if (!grid) return;
    if (!PROGRAMS.length) { removeSection(grid); return; }
    const chips = $("#program-filter");
    const info = $("#program-info");
    const groups = ageGroups();
    chips.innerHTML = [`<button type="button" class="chip" aria-pressed="true" data-g="semua">Semua usia <span class="count">${PROGRAMS.length}</span></button>`]
      .concat(groups.map(g => `<button type="button" class="chip" aria-pressed="false" data-g="${esc(g.id)}">${ic(g.icon)}${esc(g.label)} <span class="count">${programsIn(g.id).length}</span></button>`))
      .join("");
    grid.innerHTML = PROGRAMS.map(programCard).join("") +
      `<article class="prog prog-cta">
        <span class="feature-ic">${ic("sparkle")}</span>
        <h3>Bingung memilih program?</h3>
        <p>Ceritakan usia dan kemampuan peserta. Admin kami bantu mencocokkan level yang tepat.</p>
        <a class="btn btn-wa" href="${waUrl(`Halo Admin ${B.name}, saya ingin konsultasi memilih program renang.`)}" target="_blank" rel="noopener">${ic("wa")} Tanya admin</a>
      </article>`;
    let first = true;
    setProgramFilter = g => {
      if (g !== "semua" && !groups.some(x => x.id === g)) g = "semua";
      $$(".chip", chips).forEach(c => c.setAttribute("aria-pressed", String(c.dataset.g === g)));
      let n = 0;
      $$(".prog[data-id]", grid).forEach(c => {
        const show = g === "semua" || c.dataset.groups.split(" ").includes(g);
        c.hidden = !show;
        c.classList.remove("is-entering");
        if (show) {
          if (!first && !reduced) { void c.offsetWidth; c.style.setProperty("--d", n); c.classList.add("is-entering"); }
          n++;
        }
      });
      const grp = groups.find(x => x.id === g);
      info.textContent = grp
        ? `${n} program untuk ${grp.label.toLowerCase()} (${grp.range}).`
        : `${n} program tersedia untuk semua usia.`;
      first = false;
    };
    chips.addEventListener("click", e => { const b = e.target.closest(".chip"); if (b) setProgramFilter(b.dataset.g); });
    setProgramFilter("semua");
  }

  function openProgram(id) {
    const p = PROGRAMS.find(x => x.id === id);
    if (!p) return false;
    modal.open(`<div class="pm">
        <div class="pm-media">${media(p.img, { seed: p.id, pal: p.color || "deep", icon: p.icon || "swimmer", w: 420, h: 560 }, p.name)}</div>
        <div class="pm-content">
          <div class="badges"><span class="badge badge-aqua">${ic("user")}${esc(p.age)}</span><span class="badge badge-soft">Level ${esc(p.levels)}</span></div>
          <h2 class="pm-title">${esc(p.name)}</h2>
          <p class="lead">${esc(p.summary)}</p>
          <p>${esc(p.description)}</p>
          ${(p.focus || []).length ? `<h3 class="mini-title">Fokus latihan</h3><ul class="checklist">${p.focus.map(f => `<li>${ic("checkCircle")}<span>${esc(f)}</span></li>`).join("")}</ul>` : ""}
          <dl class="pm-meta"><div><dt>Durasi</dt><dd>${esc(p.duration || "-")}</dd></div><div><dt>Rasio</dt><dd>${esc(p.ratio || "-")}</dd></div><div><dt>Usia</dt><dd>${esc(p.age || "-")}</dd></div></dl>
          <div class="pm-actions">
            <a class="btn btn-primary" href="${daftarProgramHref(p)}" data-prefill-program="${esc(p.id)}">Daftar program ini ${ic("arrowRight")}</a>
            <a class="btn btn-outline" href="${askProgram(p)}" target="_blank" rel="noopener">${ic("wa")} Tanya via WhatsApp</a>
          </div>
        </div>
      </div>`, { label: `Program ${p.name}`, size: "lg" });
    return true;
  }

  /* ---------------------------------------------------------------------
     9. LOKASI KOLAM
     --------------------------------------------------------------------- */
  const POOLS = (S.pools || []).map(c => ({
    city: c.city,
    note: c.note,
    id: slugify(c.city),
    items: (c.items || []).map(p => Object.assign({}, p, { city: c.city, id: slugify(c.city + " " + p.name) }))
  }));
  const ALL_POOLS = POOLS.reduce((a, c) => a.concat(c.items), []);
  const poolById = id => ALL_POOLS.find(p => p.id === id);
  const poolMaps = p => p.maps || mapsUrl(p.name + ", " + p.address);
  const tagBadge = t => {
    const warm = /hangat/i.test(t);
    return `<span class="badge ${warm ? "badge-sun" : "badge-soft"}">${warm ? ic("thermo") : ""}${esc(t)}</span>`;
  };

  function poolCard(p, showCity) {
    return `<article class="pool">
        <div class="pool-head">
          <span class="pool-ic">${ic(/hotel/i.test(p.name) ? "building" : "waves")}</span>
          <div>${showCity ? `<span class="pool-city">${esc(p.city)}</span>` : ""}<h3>${esc(p.name)}</h3></div>
        </div>
        <p class="pool-addr">${ic("pin")}<span>${esc(p.address)}</span></p>
        ${(p.tags || []).length ? `<div class="pool-tags">${p.tags.map(tagBadge).join("")}</div>` : ""}
        <div class="pool-actions">
          <a class="btn btn-ghost btn-sm" href="${esc(poolMaps(p))}" target="_blank" rel="noopener">${ic("route")} Rute</a>
          <a class="btn btn-outline btn-sm" href="${homeLink("#daftar-kolam-" + p.id)}" data-prefill-pool="${esc(p.id)}">Pilih kolam ini</a>
        </div>
      </article>`;
  }

  function renderLocations() {
    const el = $("#lokasi-app");
    if (!el) return;
    if (!POOLS.length) { removeSection(el); return; }
    let city = POOLS[0].id;
    let q = "";
    const askPool = waUrl(`Halo Admin ${B.name}, apakah ada kolam mitra di dekat lokasi saya?`);
    el.innerHTML = `<div class="loc-toolbar">
        <div class="chips scroll-x loc-tabs" role="group" aria-label="Pilih kota">${POOLS.map((c, i) => `<button type="button" class="chip" aria-pressed="${i === 0}" data-city="${esc(c.id)}">${ic("pin")}${esc(c.city)} <span class="count">${c.items.length}</span></button>`).join("")}</div>
        <label class="search"><span class="sr-only">Cari kolam</span>${ic("search")}<input id="pool-search" type="search" placeholder="Cari nama kolam atau alamat" autocomplete="off"></label>
      </div>
      <p class="filter-info loc-info" aria-live="polite"></p>
      <div class="loc-grid"></div>
      <p class="loc-note">${ic("info")}<span>${esc(POOLS[0].note || "*Bisa memilih kolam terdekat")}. Lokasi Anda belum ada? <a href="${askPool}" target="_blank" rel="noopener">Tanyakan ke admin</a></span></p>`;
    const grid = $(".loc-grid", el);
    const info = $(".loc-info", el);
    const input = $("#pool-search", el);
    const draw = () => {
      const qq = q.trim().toLowerCase();
      const c = POOLS.find(x => x.id === city) || POOLS[0];
      const list = qq
        ? ALL_POOLS.filter(p => (p.name + " " + p.address + " " + p.city + " " + (p.tags || []).join(" ")).toLowerCase().includes(qq))
        : c.items;
      grid.innerHTML = list.length
        ? list.map(p => poolCard(p, !!qq)).join("")
        : `<div class="empty">${ic("search")}<p>Tidak ada kolam yang cocok dengan “${esc(q)}”.</p><a class="btn btn-outline btn-sm" href="${askPool}" target="_blank" rel="noopener">${ic("wa")} Tanya admin</a></div>`;
      info.textContent = qq ? `${list.length} kolam ditemukan di semua kota.` : `${list.length} kolam renang mitra di ${c.city}.`;
      el.classList.toggle("is-searching", !!qq);
    };
    $(".loc-tabs", el).addEventListener("click", e => {
      const b = e.target.closest("[data-city]");
      if (!b) return;
      city = b.dataset.city;
      q = "";
      input.value = "";
      $$(".loc-tabs .chip", el).forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      draw();
    });
    input.addEventListener("input", () => { q = input.value; draw(); });
    draw();
  }

  /* ---------------------------------------------------------------------
     10. ALUR, FORMAT KELAS, TIM, TESTIMONI, FAQ
     --------------------------------------------------------------------- */
  function renderSteps() {
    const el = $("#steps");
    if (!el) return;
    const st = S.steps || [];
    if (!st.length) { removeSection(el); return; }
    el.innerHTML = st.map((s, i) => `<li class="step reveal" style="--d:${i}"><span class="step-num" aria-hidden="true">${i + 1}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join("");
  }

  function renderFormats() {
    const el = $("#formats");
    if (!el) return;
    const F = S.formats || [];
    if (!F.length) { removeSection(el); return; }
    el.innerHTML = F.map((f, i) => `<article class="format${f.highlight ? " is-featured" : ""} reveal" style="--d:${i}">
        ${f.label ? `<span class="badge badge-sun ribbon">${esc(f.label)}</span>` : ""}
        <h3>${esc(f.name)}</h3>
        <div class="format-ratio">${esc(f.ratio)}<small>pelatih : siswa</small></div>
        <p>${esc(f.text)}</p>
        <ul class="checklist">${(f.points || []).map(p => `<li>${ic("checkCircle")}<span>${esc(p)}</span></li>`).join("")}</ul>
        <a class="btn ${f.highlight ? "btn-light" : "btn-outline"} btn-block" href="${waUrl(`Halo Admin ${B.name}, saya ingin tanya jadwal dan biaya kelas ${f.name}.`)}" target="_blank" rel="noopener">${ic("wa")} Tanya jadwal & biaya</a>
      </article>`).join("");
  }

  const TEAM = S.team || [];
  const teamCard = (m, i) => `<button type="button" class="team-card" data-member="${i}" aria-label="Lihat profil ${esc(m.name)}, ${esc(m.role)}">
      <span class="team-photo">${poster(m, i)}</span>
      <span class="team-body"><span class="team-name">${esc(m.name)}</span><span class="team-role">${esc(m.role)}</span></span>
    </button>`;

  function carousel(track, prev, next) {
    if (!track || !prev || !next) return;
    const step = () => { const c = track.firstElementChild; return c ? c.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 20) : 300; };
    prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior }));
    next.addEventListener("click", () => track.scrollBy({ left: step(), behavior }));
    const upd = () => {
      prev.disabled = track.scrollLeft < 8;
      next.disabled = track.scrollLeft + track.clientWidth > track.scrollWidth - 8;
    };
    track.addEventListener("scroll", upd, { passive: true });
    window.addEventListener("resize", upd);
    upd();
  }

  function renderTeamRow() {
    const el = $("#team-row");
    if (!el) return;
    if (!TEAM.length) { removeSection(el); return; }
    el.innerHTML = TEAM.slice(0, 10).map(teamCard).join("");
    carousel(el, $("#team-prev"), $("#team-next"));
  }

  function renderTeamPage() {
    const grid = $("#team-grid");
    if (!grid) return;
    const chips = $("#team-filter");
    const search = $("#team-search");
    const info = $("#team-info");
    const empty = $("#team-empty");
    const roles = [...new Set(TEAM.map(m => m.role))];
    chips.innerHTML = [`<button type="button" class="chip" aria-pressed="true" data-role="*">Semua <span class="count">${TEAM.length}</span></button>`]
      .concat(roles.map(r => `<button type="button" class="chip" aria-pressed="false" data-role="${esc(r)}">${esc(r)} <span class="count">${TEAM.filter(m => m.role === r).length}</span></button>`))
      .join("");
    grid.innerHTML = TEAM.map(teamCard).join("");
    let role = "*";
    let q = "";
    const apply = () => {
      let n = 0;
      $$(".team-card", grid).forEach(c => {
        const m = TEAM[+c.dataset.member];
        const ok = (role === "*" || m.role === role) && (!q || (m.name + " " + m.role).toLowerCase().includes(q));
        c.hidden = !ok;
        if (ok) n++;
      });
      info.textContent = `${n} anggota tim ditampilkan.`;
      if (empty) empty.hidden = n > 0;
    };
    chips.addEventListener("click", e => {
      const b = e.target.closest(".chip");
      if (!b) return;
      role = b.dataset.role;
      $$(".chip", chips).forEach(c => c.setAttribute("aria-pressed", String(c === b)));
      apply();
    });
    search.addEventListener("input", () => { q = search.value.trim().toLowerCase(); apply(); });
    apply();
  }

  function openMember(i) {
    const m = TEAM[i];
    if (!m) return;
    modal.open(`<div class="tm">
        <div class="tm-photo">${poster(m, i)}</div>
        <div class="tm-body">
          <span class="team-role">${esc(m.role)}</span>
          <h2 class="pm-title">${esc(m.name)}</h2>
          <p>${esc(m.bio || "Profil singkat akan segera ditambahkan.")}</p>
          ${(m.certs || []).length ? `<h3 class="mini-title">Sertifikasi</h3><ul class="checklist">${m.certs.map(c => `<li>${ic("award")}<span>${esc(c)}</span></li>`).join("")}</ul>` : ""}
          <div class="pm-actions">
            ${m.instagram ? `<a class="btn btn-outline btn-sm" href="${esc(m.instagram)}" target="_blank" rel="noopener">${ic("ig")} Instagram</a>` : ""}
            <a class="btn btn-primary btn-sm" href="${homeLink("#daftar")}">Belajar bersama tim kami</a>
          </div>
        </div>
      </div>`, { label: `Profil ${m.name}`, size: "md" });
  }

  const AVATAR = ["#1572e8", "#0a7fd1", "#0c8a7e", "#de4256", "#ef7d22", "#0b3f86"];
  function renderTestimonials() {
    const el = $("#testi-track");
    if (!el) return;
    const T = S.testimonials || [];
    if (!T.length) { removeSection(el); return; }
    el.innerHTML = T.map((t, i) => `<figure class="testi">
        <span class="testi-q">${ic("quote")}</span>
        <blockquote>${esc(t.text)}</blockquote>
        <figcaption class="testi-foot">
          <span class="avatar" style="background:${AVATAR[i % AVATAR.length]}">${esc(initials(t.name))}</span>
          <span class="testi-who"><b>${esc(t.name)}</b><small>${esc(t.relation || "")}</small></span>
          ${t.example ? `<span class="badge badge-soft">Contoh</span>` : ""}
        </figcaption>
      </figure>`).join("");
    carousel(el, $("#testi-prev"), $("#testi-next"));
  }

  function renderFaq() {
    const el = $("#faq-list");
    if (!el) return;
    const F = S.faq || [];
    if (!F.length) { removeSection(el); return; }
    el.innerHTML = F.map((f, i) => `<details name="faq"${i === 0 ? " open" : ""}>
        <summary><span>${esc(f.q)}</span><span class="acc-ic" aria-hidden="true">${ic("plus")}</span></summary>
        <div class="acc-body"><p>${esc(f.a)}</p></div>
      </details>`).join("");
  }

  /* ---------------------------------------------------------------------
     11. GALERI + LIGHTBOX
     --------------------------------------------------------------------- */
  const GALLERY = S.gallery || [];
  const GALLERY_ICON = { Latihan: "swimmer", Kompetisi: "stopwatch", Kegiatan: "sparkle", "Tim Pelatih": "users", Fasilitas: "building" };
  const galleryArt = (g, i, big) => media(g.img, {
    seed: "g" + i + g.title,
    pal: PAL_KEYS[(i * 3) % PAL_KEYS.length],
    icon: g.icon || GALLERY_ICON[g.category] || "camera",
    w: big ? 960 : 420,
    h: big ? 720 : 420
  }, g.title);
  const RATIOS = ["3/4", "1/1", "4/3", "4/5", "1/1", "3/4", "4/3", "1/1", "4/5", "4/3"];
  const ratio = i => RATIOS[i % RATIOS.length];

  const lightbox = (() => {
    let el = null;
    let items = [];
    let cur = 0;
    let lastFocus = null;
    const api = {
      el: null,
      open(list, start) {
        if (!el) build();
        items = list;
        lastFocus = doc.activeElement;
        show(start);
        el.inert = false;
        el.classList.add("open");
        lock(true);
        layers.push(api);
        setTimeout(() => $(".lb-close", el).focus(), 30);
      },
      close() {
        if (!el || !el.classList.contains("open")) return;
        el.classList.remove("open");
        el.inert = true;
        lock(false);
        removeLayer(api);
        if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
      },
      key(e) {
        if (e.key === "ArrowLeft") show(cur - 1);
        if (e.key === "ArrowRight") show(cur + 1);
      }
    };
    function build() {
      el = doc.createElement("div");
      el.className = "lightbox";
      el.setAttribute("role", "dialog");
      el.setAttribute("aria-modal", "true");
      el.setAttribute("aria-label", "Galeri foto");
      el.inert = true;
      el.innerHTML = `<div class="lb-top"><span class="lb-count" aria-live="polite"></span><button type="button" class="icon-btn lb-close" aria-label="Tutup galeri">${ic("close")}</button></div>
        <div class="lb-stage"><button type="button" class="icon-btn lb-nav lb-prev" aria-label="Foto sebelumnya">${ic("chevLeft")}</button><figure class="lb-figure"></figure><button type="button" class="icon-btn lb-nav lb-next" aria-label="Foto berikutnya">${ic("chevRight")}</button></div>
        <div class="lb-cap"><b></b><small></small></div>`;
      body.append(el);
      api.el = el;
      $(".lb-close", el).addEventListener("click", api.close);
      $(".lb-prev", el).addEventListener("click", () => show(cur - 1));
      $(".lb-next", el).addEventListener("click", () => show(cur + 1));
      el.addEventListener("click", e => { if (e.target === el || e.target.classList.contains("lb-stage")) api.close(); });
      swipe($(".lb-stage", el), dir => show(cur + dir));
    }
    function show(n) {
      cur = (n + items.length) % items.length;
      const it = items[cur];
      $(".lb-figure", el).innerHTML = galleryArt(it.g, it.i, true);
      $(".lb-cap b", el).textContent = it.g.title;
      $(".lb-cap small", el).textContent = it.g.category;
      $(".lb-count", el).textContent = `${cur + 1} / ${items.length}`;
      const single = items.length < 2;
      $(".lb-prev", el).hidden = single;
      $(".lb-next", el).hidden = single;
    }
    return api;
  })();

  function renderGallery() {
    const grid = $("#gallery-grid");
    if (!grid) return;
    if (!GALLERY.length) { removeSection(grid); return; }
    const chips = $("#gallery-filter");
    const more = $("#gallery-more");
    const stepN = +(grid.dataset.step || 8);
    const cats = [...new Set(GALLERY.map(g => g.category))];
    chips.innerHTML = [`<button type="button" class="chip" aria-pressed="true" data-cat="*">Semua <span class="count">${GALLERY.length}</span></button>`]
      .concat(cats.map(c => `<button type="button" class="chip" aria-pressed="false" data-cat="${esc(c)}">${esc(c)} <span class="count">${GALLERY.filter(g => g.category === c).length}</span></button>`))
      .join("");
    grid.innerHTML = GALLERY.map((g, i) => `<button type="button" class="g-item" style="--ar:${ratio(i)}" data-i="${i}" data-cat="${esc(g.category)}" aria-label="Perbesar foto: ${esc(g.title)}">
        ${galleryArt(g, i)}
        <span class="g-cap"><b>${esc(g.title)}</b><small>${esc(g.category)}</small></span>
        <span class="g-zoom" aria-hidden="true">${ic("plus")}</span>
      </button>`).join("");
    let cat = "*";
    let limit = stepN;
    let visible = [];
    const apply = () => {
      let n = 0;
      visible = [];
      $$(".g-item", grid).forEach(it => {
        const ok = cat === "*" || it.dataset.cat === cat;
        if (ok) n++;
        const vis = ok && n <= limit;
        it.hidden = !vis;
        if (vis) visible.push(+it.dataset.i);
      });
      if (more) {
        more.hidden = n <= limit;
        more.innerHTML = `Muat lebih banyak <span class="count">+${Math.max(0, n - limit)}</span>`;
      }
    };
    chips.addEventListener("click", e => {
      const b = e.target.closest(".chip");
      if (!b) return;
      cat = b.dataset.cat;
      limit = stepN;
      $$(".chip", chips).forEach(c => c.setAttribute("aria-pressed", String(c === b)));
      apply();
    });
    if (more) more.addEventListener("click", () => { limit += stepN; apply(); });
    grid.addEventListener("click", e => {
      const it = e.target.closest(".g-item");
      if (!it) return;
      const list = visible.map(i => ({ g: GALLERY[i], i }));
      lightbox.open(list, visible.indexOf(+it.dataset.i));
    });
    apply();
  }

  /* ---------------------------------------------------------------------
     12. BERITA (beranda + halaman berita dengan pembaca artikel)
     --------------------------------------------------------------------- */
  const NEWS = (S.news || [])
    .map(n => Object.assign({}, n, { slug: n.slug || slugify(n.title) }))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const TAG_COLOR = { red: "coral", green: "mint", yellow: "sun", blue: "brand" };
  const tagClass = n => "badge-" + (TAG_COLOR[n.color] || n.color || "brand");
  const NEWS_ICON = { Pengumuman: "megaphone", Edukasi: "book", Aktivitas: "swimmer", Kerjasama: "users" };
  const newsArt = (n, w = 480, h = 300) => media(n.img, {
    seed: n.slug,
    pal: ["deep", "aqua", "night", "sky", "mint", "coral"][Math.max(0, NEWS.indexOf(n)) % 6],
    icon: n.icon || NEWS_ICON[n.tag] || "book",
    w,
    h
  }, n.title);
  const readMins = n => Math.max(1, Math.round(JSON.stringify(n.body || []).split(/\s+/).length / 180));
  const newsHref = n => (page === "berita" ? "#" : "berita.html#") + n.slug;

  const newsCard = n => `<a class="news-card" href="${newsHref(n)}">
      <span class="news-media">${newsArt(n)}<span class="badge ${tagClass(n)}">${esc(n.tag)}</span></span>
      <span class="news-body">
        <span class="news-date">${ic("calendar")}${fmtDate(n.date)}</span>
        <span class="news-title">${esc(n.title)}</span>
        <span class="news-excerpt">${esc(n.excerpt)}</span>
        <span class="link-arrow">Baca selengkapnya ${ic("arrowRight")}</span>
      </span>
    </a>`;

  function renderNewsHome() {
    const el = $("#news-grid");
    if (!el) return;
    if (!NEWS.length) { removeSection(el); return; }
    el.innerHTML = NEWS.slice(0, 3).map(newsCard).join("");
  }

  function renderBody(n) {
    return (n.body || []).map(b => {
      if (b && typeof b === "object" && Array.isArray(b.list)) return `<ul>${b.list.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;
      const s = String(b);
      if (s.startsWith("## ")) return `<h2>${esc(s.slice(3))}</h2>`;
      return `<p>${esc(s)}</p>`;
    }).join("");
  }

  function renderBlog() {
    const main = $("#blog-main");
    if (!main) return;
    const hero = $("#page-hero");
    const heroTitle = hero && $("h1", hero);
    const heroLead = hero && $(".page-lead", hero);
    const crumbs = hero && $(".crumbs", hero);
    const orig = { title: heroTitle ? heroTitle.textContent : "", lead: heroLead ? heroLead.textContent : "", crumbs: crumbs ? crumbs.innerHTML : "", doc: doc.title };
    const perPage = 5;
    let q = "";
    let tag = "";
    let pg = 1;

    const tags = [...new Set(NEWS.map(n => n.tag))];
    const tagList = $("#tag-list");
    if (tagList) tagList.innerHTML = tags.map(t => `<button type="button" class="chip chip-sm" aria-pressed="false" data-tag="${esc(t)}">${esc(t)} <span class="count">${NEWS.filter(n => n.tag === t).length}</span></button>`).join("");
    const recent = $("#recent-posts");
    if (recent) recent.innerHTML = NEWS.slice(0, 4).map(n => `<a class="mini" href="#${esc(n.slug)}"><span class="mini-thumb">${newsArt(n, 160, 160)}</span><span><b>${esc(n.title)}</b><small>${fmtDate(n.date)}</small></span></a>`).join("");

    const postMeta = n => `<div class="post-meta"><span class="badge ${tagClass(n)}">${esc(n.tag)}</span><span>${ic("calendar")}${fmtDate(n.date)}</span><span>${ic("clock")}${readMins(n)} menit baca</span></div>`;
    const featured = n => `<article class="post-feature">
        <a class="post-media" href="#${esc(n.slug)}" tabindex="-1" aria-hidden="true">${newsArt(n, 640, 420)}</a>
        <div class="post-body">
          ${postMeta(n)}
          <h2 class="post-title"><a href="#${esc(n.slug)}">${esc(n.title)}</a></h2>
          <p>${esc(n.excerpt)}</p>
          <div class="post-foot"><span class="post-author">${ic("user")}${esc(n.author || B.name)}</span><a class="btn btn-primary btn-sm" href="#${esc(n.slug)}">Baca selengkapnya</a></div>
        </div>
      </article>`;

    const filtered = () => NEWS.filter(n => (!tag || n.tag === tag) && (!q || (n.title + " " + n.excerpt + " " + n.tag).toLowerCase().includes(q)));

    function list() {
      const items = filtered();
      const pages = Math.max(1, Math.ceil(items.length / perPage));
      pg = Math.min(Math.max(1, pg), pages);
      const slice = items.slice((pg - 1) * perPage, pg * perPage);
      const [first, ...rest] = slice;
      const from = items.length ? (pg - 1) * perPage + 1 : 0;
      const to = (pg - 1) * perPage + slice.length;
      main.innerHTML = `${q || tag ? `<div class="filter-note">${ic("search")}<span><b>${items.length}</b> artikel${tag ? ` bertag “${esc(tag)}”` : ""}${q ? ` untuk “${esc(q)}”` : ""}</span><button type="button" class="link-btn" data-reset>Hapus filter</button></div>` : ""}
        ${first ? featured(first) : `<div class="empty">${ic("search")}<p>Artikel tidak ditemukan. Coba kata kunci lain.</p><button type="button" class="btn btn-outline btn-sm" data-reset>Tampilkan semua artikel</button></div>`}
        ${rest.length ? `<div class="post-grid">${rest.map(newsCard).join("")}</div>` : ""}
        ${pages > 1 ? `<nav class="pager" aria-label="Halaman artikel"><span>Menampilkan ${from}–${to} dari ${items.length} artikel</span><div class="pages">
          <button type="button" data-p="${pg - 1}"${pg === 1 ? " disabled" : ""} aria-label="Halaman sebelumnya">${ic("chevLeft")}</button>
          ${Array.from({ length: pages }, (_, i) => `<button type="button" data-p="${i + 1}"${i + 1 === pg ? ' aria-current="page"' : ""}>${i + 1}</button>`).join("")}
          <button type="button" data-p="${pg + 1}"${pg === pages ? " disabled" : ""} aria-label="Halaman berikutnya">${ic("chevRight")}</button>
        </div></nav>` : ""}`;
      if (heroTitle) heroTitle.textContent = orig.title;
      if (heroLead) heroLead.textContent = orig.lead;
      if (crumbs) crumbs.innerHTML = orig.crumbs;
      doc.title = orig.doc;
    }

    function article(n) {
      const i = NEWS.indexOf(n);
      const older = NEWS[i + 1];
      const newer = NEWS[i - 1];
      const url = location.href.split("#")[0] + "#" + n.slug;
      const related = NEWS.filter(x => x !== n && x.tag === n.tag).slice(0, 2);
      if (heroTitle) heroTitle.textContent = n.title;
      if (heroLead) heroLead.textContent = n.excerpt;
      if (crumbs) crumbs.innerHTML = `<li><a href="index.html">Beranda</a></li><li><a href="#">Berita</a></li><li aria-current="page">${esc(n.tag)}</li>`;
      doc.title = `${n.title} - ${B.fullName}`;
      main.innerHTML = `<article class="article">
          <div class="article-cover">${newsArt(n, 1200, 520)}</div>
          <div class="article-body">
            <a class="back-link" href="#">${ic("arrowLeft")} Semua berita</a>
            <div class="post-meta">${postMeta(n).replace(/^<div class="post-meta">|<\/div>$/g, "")}<span>${ic("user")}${esc(n.author || B.name)}</span></div>
            <div class="prose">${renderBody(n)}</div>
            <div class="share"><span>Bagikan artikel</span>
              <a class="btn btn-wa btn-sm" href="https://wa.me/?text=${encodeURIComponent(n.title + " " + url)}" target="_blank" rel="noopener">${ic("wa")} WhatsApp</a>
              <button type="button" class="btn btn-outline btn-sm" data-copy="${esc(url)}">${ic("copy")} Salin tautan</button>
            </div>
          </div>
        </article>
        <nav class="article-nav" aria-label="Artikel lainnya">
          ${newer ? `<a href="#${esc(newer.slug)}"><small>${ic("arrowLeft")} Lebih baru</small><b>${esc(newer.title)}</b></a>` : "<span></span>"}
          ${older ? `<a class="next" href="#${esc(older.slug)}"><small>Lebih lama ${ic("arrowRight")}</small><b>${esc(older.title)}</b></a>` : ""}
        </nav>
        ${related.length ? `<h2 class="related-title">Artikel terkait</h2><div class="post-grid">${related.map(newsCard).join("")}</div>` : ""}`;
    }

    const route = () => {
      const h = decodeURIComponent(location.hash.slice(1));
      const n = NEWS.find(x => x.slug === h);
      if (n) article(n); else list();
      $$("#recent-posts .mini").forEach(a => a.classList.toggle("is-active", n && a.getAttribute("href") === "#" + n.slug));
    };
    window.addEventListener("hashchange", () => {
      route();
      const top = $("#page-hero") || main;
      window.scrollTo({ top: Math.max(0, top.getBoundingClientRect().top + window.scrollY - 10), behavior });
    });
    const toList = () => { if (location.hash && location.hash !== "#") location.hash = ""; else list(); };

    main.addEventListener("click", e => {
      const p = e.target.closest("[data-p]");
      if (p && !p.disabled) { pg = +p.dataset.p; list(); main.scrollIntoView({ behavior, block: "start" }); return; }
      if (e.target.closest("[data-reset]")) {
        q = ""; tag = ""; pg = 1;
        const input = $("#blog-search-input");
        if (input) input.value = "";
        $$("#tag-list .chip").forEach(c => c.setAttribute("aria-pressed", "false"));
        list();
      }
    });
    const form = $("#blog-search");
    if (form) form.addEventListener("submit", e => {
      e.preventDefault();
      q = $("#blog-search-input").value.trim().toLowerCase();
      pg = 1;
      toList();
      main.scrollIntoView({ behavior, block: "start" });
    });
    if (tagList) tagList.addEventListener("click", e => {
      const b = e.target.closest(".chip");
      if (!b) return;
      tag = tag === b.dataset.tag ? "" : b.dataset.tag;
      $$(".chip", tagList).forEach(c => c.setAttribute("aria-pressed", String(c.dataset.tag === tag)));
      pg = 1;
      toList();
    });
    route();
  }

  /* ---------------------------------------------------------------------
     13. LAYANAN (tab di halaman Tentang)
     --------------------------------------------------------------------- */
  function renderServices() {
    const el = $("#svc");
    if (!el) return;
    const tabs = POOLS.map(c => ({ id: "kolam-" + c.id, group: "Lokasi kolam", label: `Kolam Renang (${c.city})`, type: "pool", data: c }))
      .concat(PROGRAMS.map(p => ({ id: "program-" + p.id, group: "Program", label: p.name, type: "program", data: p })));
    if (!tabs.length) { removeSection(el); return; }
    let listHtml = "";
    let selectHtml = "";
    let lastGroup = "";
    tabs.forEach(t => {
      if (t.group !== lastGroup) {
        listHtml += `<p class="svc-group">${t.group}</p>`;
        selectHtml += `${lastGroup ? "</optgroup>" : ""}<optgroup label="${t.group}">`;
        lastGroup = t.group;
      }
      listHtml += `<button type="button" class="svc-tab" data-tab="${esc(t.id)}" aria-controls="svc-panel" aria-pressed="false"><span>${esc(t.label)}</span>${ic("chevRight")}</button>`;
      selectHtml += `<option value="${esc(t.id)}">${esc(t.label)}</option>`;
    });
    selectHtml += "</optgroup>";
    el.innerHTML = `<div class="svc-list" role="group" aria-label="Daftar layanan">${listHtml}</div>
      <div class="svc-select"><label class="sr-only" for="svc-select">Pilih layanan</label><select class="input" id="svc-select">${selectHtml}</select></div>
      <div class="svc-panel" id="svc-panel" aria-live="polite"></div>
      <div class="svc-art" aria-hidden="true"></div>`;
    const panel = $("#svc-panel", el);
    const artBox = $(".svc-art", el);
    const select = $("#svc-select", el);

    const poolPanel = c => `<span class="eyebrow">Lokasi kolam</span>
      <h3 class="svc-title">Alamat kolam di ${esc(c.city)}</h3>
      <p class="svc-note">${esc(c.note || "*Bisa memilih kolam terdekat")}</p>
      <ul class="svc-pools">${c.items.map(p => `<li>
          <span class="pool-ic">${ic("pin")}</span>
          <div class="svc-pool-text"><b>${esc(p.name)}</b><span>${esc(p.address)}</span>${(p.tags || []).length ? `<span class="pool-tags">${p.tags.map(tagBadge).join("")}</span>` : ""}</div>
          <a class="btn btn-ghost btn-sm" href="${esc(poolMaps(p))}" target="_blank" rel="noopener" aria-label="Rute ke ${esc(p.name)}">${ic("route")}<span class="hide-xs">Rute</span></a>
        </li>`).join("")}</ul>`;
    const programPanel = p => `<span class="eyebrow">Program · Level ${esc(p.levels)}</span>
      <h3 class="svc-title">${esc(p.name)}</h3>
      <p class="svc-age">${ic("user")}Usia ${esc(p.age)}</p>
      <p class="lead">${esc(p.summary)}</p>
      <p>${esc(p.description)}</p>
      ${(p.focus || []).length ? `<h4 class="mini-title">Fokus latihan</h4><ul class="checklist cols-2">${p.focus.map(f => `<li>${ic("checkCircle")}<span>${esc(f)}</span></li>`).join("")}</ul>` : ""}
      <dl class="pm-meta"><div><dt>Durasi</dt><dd>${esc(p.duration || "-")}</dd></div><div><dt>Rasio</dt><dd>${esc(p.ratio || "-")}</dd></div><div><dt>Usia</dt><dd>${esc(p.age || "-")}</dd></div></dl>
      <div class="pm-actions"><a class="btn btn-primary" href="${daftarProgramHref(p)}">Daftar program ini ${ic("arrowRight")}</a><a class="btn btn-outline" href="${askProgram(p)}" target="_blank" rel="noopener">${ic("wa")} Tanya via WhatsApp</a></div>`;

    const show = id => {
      const t = tabs.find(x => x.id === id) || tabs[0];
      $$(".svc-tab", el).forEach(b => b.setAttribute("aria-pressed", String(b.dataset.tab === t.id)));
      select.value = t.id;
      panel.innerHTML = `<div class="svc-anim">${t.type === "pool" ? poolPanel(t.data) : programPanel(t.data)}</div>`;
      artBox.innerHTML = `<div class="svc-anim">${t.type === "pool"
        ? art({ seed: t.id, pal: "aqua", icon: "pin", w: 400, h: 400 })
        : media(t.data.img, { seed: t.data.id, pal: t.data.color || "deep", icon: t.data.icon || "swimmer", w: 400, h: 400 }, "")}</div>`;
    };
    el.addEventListener("click", e => { const b = e.target.closest(".svc-tab"); if (b) show(b.dataset.tab); });
    select.addEventListener("change", () => show(select.value));
    const h = location.hash.slice(1);
    show(tabs.some(t => t.id === h) ? h : tabs[0].id);
    if (tabs.some(t => t.id === h)) setTimeout(() => el.scrollIntoView({ behavior, block: "start" }), 100);
  }

  /* Latar ilustrasi untuk judul halaman dalam & bagian kontak */
  function renderBackdrops() {
    const ph = $("#page-hero");
    if (ph && !$(".page-hero-bg", ph)) {
      const bg = doc.createElement("div");
      bg.className = "page-hero-bg";
      bg.setAttribute("aria-hidden", "true");
      bg.innerHTML = art({ seed: "hero-" + page, pal: "deep", icon: "none", w: 1440, h: 420 });
      ph.prepend(bg);
    }
    const ct = $("#daftar");
    if (ct && !$(".contact-bg", ct)) {
      const bg = doc.createElement("div");
      bg.className = "contact-bg";
      bg.setAttribute("aria-hidden", "true");
      bg.innerHTML = art({ seed: "kontak", pal: "sky", icon: "none", w: 1440, h: 900 });
      ct.prepend(bg);
    }
  }

  /* ---------------------------------------------------------------------
     14. KONTAK + FORMULIR PENDAFTARAN (dikirim lewat WhatsApp)
     --------------------------------------------------------------------- */
  const DRAFT_KEY = "papila-draft";
  const DAYS = ["minggu", "senin", "selasa", "rabu", "kamis", "jumat", "sabtu"];
  const DAY_LABEL = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  /* Status buka/tutup dari B.hours, mis. { day: "Senin – Jumat", time: "14.00 – 19.00" } */
  function openStatus(now = new Date()) {
    const slots = [];
    (B.hours || []).forEach(h => {
      const d = String(h.day).toLowerCase().replace(/['’]/g, "").match(/[a-z]+/g) || [];
      const tm = String(h.time).match(/(\d{1,2})[.:](\d{2})\D+(\d{1,2})[.:](\d{2})/);
      const a = DAYS.indexOf(d[0]);
      const b = DAYS.indexOf(d[d.length - 1]);
      if (a < 0 || b < 0 || !tm) return;
      const from = +tm[1] * 60 + +tm[2];
      const to = +tm[3] * 60 + +tm[4];
      for (let k = a, guard = 0; guard < 7; k = (k + 1) % 7, guard++) {
        slots.push({ day: k, from, to, start: tm[1] + "." + tm[2], end: tm[3] + "." + tm[4] });
        if (k === b) break;
      }
    });
    if (!slots.length) return null;
    const day = now.getDay();
    const min = now.getHours() * 60 + now.getMinutes();
    const cur = slots.find(x => x.day === day && min >= x.from && min < x.to);
    if (cur) return { open: true, text: `Buka sekarang · sampai ${cur.end}` };
    for (let k = 0; k < 8; k++) {
      const dd = (day + k) % 7;
      const next = slots.filter(x => x.day === dd && (k > 0 || x.from > min)).sort((x, y) => x.from - y.from)[0];
      if (next) return { open: false, text: `Tutup · buka ${k === 0 ? "hari ini" : k === 1 ? "besok" : DAY_LABEL[dd]} pukul ${next.start}` };
    }
    return null;
  }
  let showFormView = () => {};

  function renderContact() {
    const el = $("#daftar-app");
    if (!el) return;
    const progOpts = PROGRAMS.map(p => `<option value="${esc(p.id)}">${esc(p.name)} (${esc(p.age)})</option>`).join("");
    const poolOpts = POOLS.map(c => `<optgroup label="${esc(c.city)}">${c.items.map(p => `<option value="${esc(p.id)}">${esc(p.name)}</option>`).join("")}</optgroup>`).join("");
    const hours = (B.hours || []).length
      ? `<div class="info-row"><span class="info-ic">${ic("clock")}</span><div class="grow"><b>Jam operasional</b>${(() => { const st = openStatus(); return st ? `<span class="open-status${st.open ? " is-open" : ""}">${esc(st.text)}</span>` : ""; })()}<dl class="hours">${B.hours.map(h => `<div><dt>${esc(h.day)}</dt><dd>${esc(h.time)}</dd></div>`).join("")}</dl></div></div>` : "";
    el.innerHTML = `<div class="info-card reveal">
        <h3>Informasi kontak</h3>
        <div class="info-row"><span class="info-ic">${ic("pin")}</span><div><b>Alamat</b><span>${esc(B.address)}</span></div></div>
        <div class="info-row"><span class="info-ic">${ic("wa")}</span><div><b>WhatsApp</b><a href="${waUrl()}" target="_blank" rel="noopener">${esc(B.phone)}</a></div></div>
        <div class="info-row"><span class="info-ic">${ic("mail")}</span><div><b>Email</b><span class="selectable">${esc(B.email)}</span> <button type="button" class="link-btn" data-copy="${esc(B.email)}">Salin</button></div></div>
        ${hours}
        <a class="map-card" href="${mapsUrl(B.mapsQuery || B.address || B.fullName)}" target="_blank" rel="noopener">${mapArt()}<span class="map-pin">${ic("pin")}</span><span class="btn btn-light btn-sm">${ic("external")} Buka di Google Maps</span></a>
      </div>
      <div class="form-card reveal" style="--d:1">
        <form id="daftar-form" novalidate>
          <div class="form-head"><h3>Formulir pendaftaran</h3><p>Isi data berikut. Pesan pendaftaran akan diteruskan ke admin melalui WhatsApp.</p></div>
          <div class="form-grid">
            <div class="field"><label for="f-parent">Nama orang tua/wali <span class="req">*</span></label><input class="input" id="f-parent" name="parent" autocomplete="name" required placeholder="Nama lengkap" aria-describedby="e-parent"><p class="field-error" id="e-parent"></p></div>
            <div class="field"><label for="f-name">Nama peserta <span class="req">*</span></label><input class="input" id="f-name" name="name" required placeholder="Nama anak atau peserta" aria-describedby="e-name"><p class="field-error" id="e-name"></p></div>
            <div class="field"><label for="f-age">Usia peserta</label><input class="input" id="f-age" name="age" placeholder="Contoh: 5 tahun"></div>
            <div class="field"><label for="f-phone">No. WhatsApp <span class="req">*</span></label><input class="input" id="f-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required placeholder="08xx xxxx xxxx" aria-describedby="e-phone"><p class="field-error" id="e-phone"></p></div>
            <div class="field"><label for="f-program">Program <span class="req">*</span></label><select class="input" id="f-program" name="program" required aria-describedby="e-program"><option value="">Pilih program</option>${progOpts}<option value="bantu">Belum tahu, bantu pilihkan</option></select><p class="field-error" id="e-program"></p></div>
            <div class="field"><label for="f-pool">Kolam pilihan</label><select class="input" id="f-pool" name="pool"><option value="">Pilih kolam (opsional)</option>${poolOpts}</select></div>
            <div class="field full"><label for="f-note">Catatan</label><textarea class="input" id="f-note" name="note" rows="3" placeholder="Jadwal yang diinginkan, kemampuan renang saat ini, dll."></textarea></div>
          </div>
          <div class="form-foot"><p class="form-hint">${ic("shield")}Data hanya dipakai untuk keperluan pendaftaran.</p><button class="btn btn-primary btn-lg" type="submit">Lanjutkan ${ic("arrowRight")}</button></div>
        </form>
        <div class="form-success" hidden tabindex="-1">
          <span class="success-ic">${ic("check")}</span>
          <h3>Pesan pendaftaran siap dikirim</h3>
          <p>Periksa kembali isinya, lalu kirim ke admin melalui WhatsApp. Admin akan membalas pada jam operasional.</p>
          <pre class="msg-preview"></pre>
          <div class="success-actions">
            <a class="btn btn-wa btn-lg" target="_blank" rel="noopener" href="#" data-send>${ic("wa")} Kirim lewat WhatsApp</a>
            <button type="button" class="btn btn-outline" data-copy-msg>${ic("copy")} Salin pesan</button>
          </div>
          <button type="button" class="link-btn" data-edit>${ic("arrowLeft")} Ubah data</button>
        </div>
      </div>`;

    const form = $("#daftar-form", el);
    const success = $(".form-success", el);
    const preview = $(".msg-preview", el);
    const send = $("[data-send]", el);
    const fields = ["parent", "name", "age", "phone", "program", "pool", "note"];
    const rules = {
      parent: v => v.trim().length >= 2 || "Mohon isi nama orang tua atau wali.",
      name: v => v.trim().length >= 2 || "Mohon isi nama peserta.",
      phone: v => /^(\+?62|0)8\d{7,12}$/.test(v.replace(/[\s.-]/g, "")) || "Masukkan nomor WhatsApp yang valid, contoh 0812 3456 7890.",
      program: v => !!v || "Silakan pilih program."
    };
    const check = name => {
      const inp = form.elements[name];
      const res = rules[name](inp.value);
      const err = $("#e-" + name, el);
      if (res === true) { inp.removeAttribute("aria-invalid"); err.textContent = ""; return true; }
      inp.setAttribute("aria-invalid", "true");
      err.textContent = res;
      return false;
    };
    Object.keys(rules).forEach(name => {
      const inp = form.elements[name];
      inp.addEventListener("blur", () => { if (inp.value) check(name); });
      inp.addEventListener("input", () => { if (inp.getAttribute("aria-invalid")) check(name); });
      inp.addEventListener("change", () => { if (inp.getAttribute("aria-invalid")) check(name); });
    });

    const saveDraft = () => { const d = {}; fields.forEach(f => { d[f] = form.elements[f].value; }); store.set(DRAFT_KEY, d); };
    const draft = store.get(DRAFT_KEY);
    if (draft && typeof draft === "object") fields.forEach(f => { if (draft[f] && !form.elements[f].value) form.elements[f].value = draft[f]; });
    form.addEventListener("input", saveDraft);
    form.addEventListener("change", saveDraft);

    showFormView = () => { success.hidden = true; form.hidden = false; };
    const buildMessage = () => {
      const v = f => form.elements[f].value.trim();
      const prog = PROGRAMS.find(p => p.id === v("program"));
      const pool = poolById(v("pool"));
      const lines = [
        `Halo Admin ${B.name}, saya ingin mendaftar.`,
        "",
        `Nama orang tua/wali: ${v("parent")}`,
        `Nama peserta: ${v("name")}`,
        v("age") ? `Usia peserta: ${v("age")}` : "",
        `Program: ${prog ? prog.name : "Belum tahu, mohon dibantu pilihkan"}`,
        pool ? `Kolam pilihan: ${pool.name} (${pool.city})` : "",
        `No. WhatsApp: ${v("phone")}`,
        v("note") ? `Catatan: ${v("note")}` : ""
      ];
      return lines.filter((l, i) => l !== "" || i === 1).join("\n");
    };
    form.addEventListener("submit", e => {
      e.preventDefault();
      const bad = Object.keys(rules).filter(n => !check(n));
      if (bad.length) {
        form.elements[bad[0]].focus();
        toast("Lengkapi data yang ditandai terlebih dahulu.", "info");
        return;
      }
      const msg = buildMessage();
      preview.textContent = msg;
      send.href = waUrl(msg);
      form.hidden = true;
      success.hidden = false;
      success.focus({ preventScroll: true });
      success.closest(".form-card").scrollIntoView({ behavior, block: "start" });
    });
    send.addEventListener("click", () => { store.del(DRAFT_KEY); toast("Membuka WhatsApp…", "wa"); });
    $("[data-copy-msg]", el).addEventListener("click", () => copyText(preview.textContent, "Pesan tersalin"));
    $("[data-edit]", el).addEventListener("click", () => { showFormView(); form.elements.parent.focus(); });
  }

  function prefill({ program, pool }) {
    const form = $("#daftar-form");
    if (!form) return false;
    showFormView();
    let label = "";
    if (program && PROGRAMS.some(p => p.id === program)) { form.elements.program.value = program; label = PROGRAMS.find(p => p.id === program).name; }
    if (pool && poolById(pool)) { form.elements.pool.value = pool; label = poolById(pool).name; }
    form.dispatchEvent(new Event("change"));
    const target = doc.getElementById("daftar");
    if (target) target.scrollIntoView({ behavior, block: "start" });
    if (label) toast(`${label} dipilih di formulir`);
    setTimeout(() => {
      const first = ["parent", "name", "phone", "program"].map(n => form.elements[n]).find(x => !x.value);
      (first || form.elements.parent).focus({ preventScroll: true });
    }, reduced ? 0 : 700);
    return true;
  }

  /* ---------------------------------------------------------------------
     15. LOGIN (portal siswa, masih demo)
     --------------------------------------------------------------------- */
  function openLogin() {
    const box = modal.open(`<form class="login" novalidate>
        <div class="login-head">${logoMark()}<h2>Masuk portal siswa</h2><p>Pantau jadwal dan progres belajar. Fitur ini segera hadir.</p></div>
        <div class="field"><label for="l-user">Email atau nomor WhatsApp</label><input class="input" id="l-user" name="user" autocomplete="username" required></div>
        <div class="field"><label for="l-pass">Kata sandi</label><div class="pass-wrap"><input class="input" id="l-pass" name="pass" type="password" autocomplete="current-password" required><button type="button" class="icon-btn pass-toggle" aria-label="Tampilkan kata sandi" aria-pressed="false">${ic("eye")}</button></div></div>
        <div class="login-row"><label class="check" for="l-remember"><input type="checkbox" id="l-remember"> Ingat saya</label><a href="${waUrl(`Halo Admin ${B.name}, saya lupa kata sandi portal siswa.`)}" target="_blank" rel="noopener">Lupa kata sandi?</a></div>
        <button class="btn btn-primary btn-block" type="submit">Masuk</button>
        <p class="form-status" role="status"></p>
      </form>`, { label: "Masuk portal siswa", size: "sm" });
    const f = $(".login", box);
    const pass = $("#l-pass", f);
    const tg = $(".pass-toggle", f);
    tg.addEventListener("click", () => {
      const show = pass.type === "password";
      pass.type = show ? "text" : "password";
      tg.innerHTML = ic(show ? "eyeOff" : "eye");
      tg.setAttribute("aria-pressed", String(show));
      tg.setAttribute("aria-label", show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi");
    });
    f.addEventListener("submit", e => {
      e.preventDefault();
      const st = $(".form-status", f);
      if (!f.elements.user.value.trim() || !pass.value) { st.textContent = "Isi email/nomor WhatsApp dan kata sandi."; st.className = "form-status is-error"; return; }
      st.textContent = "Portal siswa belum aktif. Untuk info jadwal dan progres, hubungi admin via WhatsApp.";
      st.className = "form-status";
    });
  }

  /* ---------------------------------------------------------------------
     16. FOOTER + TOMBOL MENGAMBANG
     --------------------------------------------------------------------- */
  function renderFooter() {
    const el = $("#site-footer");
    if (!el) return;
    const so = B.socials || {};
    const soc = [["instagram", "ig", "Instagram"], ["tiktok", "tiktok", "TikTok"], ["youtube", "yt", "YouTube"], ["facebook", "fb", "Facebook"]].filter(([k]) => so[k]);
    el.className = "footer";
    el.innerHTML = `<div class="lane" aria-hidden="true"></div>
      <div class="container footer-top">
        <div class="footer-about">
          ${brandLockup("on-dark")}
          <p>${esc(B.slogan)}</p>
          ${soc.length ? `<div class="socials">${soc.map(([k, i, l]) => `<a href="${esc(so[k])}" target="_blank" rel="noopener" aria-label="${l}">${ic(i)}</a>`).join("")}</div>` : ""}
        </div>
        <div><h2 class="footer-title">Jelajahi</h2><ul>
          <li><a href="${isHome ? "#beranda" : "index.html"}">Beranda</a></li>
          ${NAV.map(n => `<li><a href="${navHref(n)}">${n.full}</a></li>`).join("")}
          <li><a href="${homeLink("#faq")}">Tanya jawab</a></li>
        </ul></div>
        <div><h2 class="footer-title">Program</h2><ul>
          ${PROGRAMS.slice(0, 7).map(p => `<li><a href="${programHref(p)}" data-program-open="${esc(p.id)}">${esc(p.name)}</a></li>`).join("")}
        </ul></div>
        <div><h2 class="footer-title">Hubungi kami</h2><ul class="contact-list">
          <li>${ic("pin")}<span>${esc(B.address)}</span></li>
          <li>${ic("wa")}<a href="${waUrl()}" target="_blank" rel="noopener">${esc(B.phone)}</a></li>
          <li>${ic("mail")}<a href="mailto:${esc(B.email)}">${esc(B.email)}</a></li>
          ${(B.hours || []).map(h => `<li>${ic("clock")}<span>${esc(h.day)}: ${esc(h.time)}</span></li>`).join("")}
        </ul></div>
      </div>
      <div class="container footer-bottom"><span>© ${new Date().getFullYear()} ${esc(B.copyright || B.name)}. Semua hak dilindungi.</span><a href="${homeLink("#daftar")}">Daftar sekarang ${ic("arrowRight")}</a></div>`;
  }

  function renderFabs() {
    const wrap = doc.createElement("div");
    wrap.className = "fab-stack";
    wrap.innerHTML = `<button type="button" class="to-top" aria-label="Kembali ke atas">${ic("arrowUp")}</button>
      <a class="wa-fab" href="${waUrl(`Halo Admin ${B.name}, saya ingin bertanya.`)}" target="_blank" rel="noopener" aria-label="Chat admin via WhatsApp">${ic("wa")}<span>Chat admin</span></a>`;
    body.append(wrap);
    const bar = doc.createElement("div");
    bar.className = "mbar";
    bar.innerHTML = `<a class="btn btn-wa" href="${waUrl(`Halo Admin ${B.name}, saya ingin bertanya.`)}" target="_blank" rel="noopener">${ic("wa")} Chat</a><a class="btn btn-primary" href="${homeLink("#daftar")}">Daftar sekarang</a>`;
    body.append(bar);
    const top = $(".to-top", wrap);
    top.addEventListener("click", () => window.scrollTo({ top: 0, behavior }));
    onScroll(y => top.classList.toggle("show", y > 700));
    const daftar = doc.getElementById("daftar");
    if (daftar && "IntersectionObserver" in window) {
      new IntersectionObserver(es => bar.classList.toggle("is-hidden", es[0].isIntersecting), { threshold: 0.1 }).observe(daftar);
    }
  }

  /* ---------------------------------------------------------------------
     17. ANIMASI MUNCUL SAAT SCROLL (konten tetap terlihat tanpa JS)
     --------------------------------------------------------------------- */
  function initReveal() {
    if (reduced || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      io.unobserve(e.target);
    }), { rootMargin: "0px 0px 10% 0px" });
    const vh = window.innerHeight;
    $$(".reveal").forEach(el => {
      if (el.getBoundingClientRect().top < vh) return; // sudah terlihat: jangan dianimasikan
      el.classList.add("pending");
      io.observe(el);
    });
  }

  /* ---------------------------------------------------------------------
     18. DATA TERSTRUKTUR (SEO)
     --------------------------------------------------------------------- */
  function jsonLd() {
    if (!isHome) return;
    const data = {
      "@context": "https://schema.org",
      "@type": "SportsActivityLocation",
      name: B.fullName,
      description: B.slogan,
      telephone: B.phone,
      email: B.email,
      address: B.address,
      sameAs: Object.values(B.socials || {}).filter(u => /^https?:\/\/.+\/.+/.test(u))
    };
    const s = doc.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(data);
    doc.head.append(s);
  }

  /* ---------------------------------------------------------------------
     19. DELEGASI KLIK GLOBAL + HASH
     --------------------------------------------------------------------- */
  doc.addEventListener("click", e => {
    const po = e.target.closest("[data-program-open]");
    if (po && !e.defaultPrevented) {
      if (openProgram(po.dataset.programOpen)) e.preventDefault();
      return;
    }
    const pp = e.target.closest("[data-prefill-program], [data-prefill-pool]");
    if (pp && $("#daftar-form")) {
      e.preventDefault();
      modal.close();
      prefill({ program: pp.dataset.prefillProgram, pool: pp.dataset.prefillPool });
      return;
    }
    const mem = e.target.closest("[data-member]");
    if (mem) { openMember(+mem.dataset.member); return; }
    const lg = e.target.closest("[data-login]");
    if (lg) { e.preventDefault(); openLogin(); return; }
    const cp = e.target.closest("[data-copy]");
    if (cp) { copyText(cp.dataset.copy); }
  });

  function handleHomeHash() {
    if (!isHome) return;
    const h = decodeURIComponent(location.hash.slice(1));
    let m;
    if ((m = h.match(/^daftar-program-(.+)$/))) prefill({ program: m[1] });
    else if ((m = h.match(/^daftar-kolam-(.+)$/))) prefill({ pool: m[1] });
    else if ((m = h.match(/^program-(.+)$/))) {
      const t = doc.getElementById("program");
      if (t) t.scrollIntoView({ behavior: "auto", block: "start" });
      openProgram(m[1]);
    }
  }

  /* ---------------------------------------------------------------------
     20. JALANKAN
     --------------------------------------------------------------------- */
  const run = fn => { try { fn(); } catch (err) { console.error("[Papila]", fn.name, err); } };
  [
    hydrateStatic, renderHeader, renderDrawer, renderPrograms, renderHero, renderStats,
    renderAboutHome, renderAboutClassic, renderVisionMission, renderPartners, renderFeatures,
    renderLocations, renderSteps, renderFormats, renderTeamRow, renderTeamPage, renderTestimonials,
    renderGallery, renderNewsHome, renderBlog, renderFaq, renderServices, renderContact,
    renderBackdrops, renderFooter, renderFabs, jsonLd
  ].forEach(run);
  run(initReveal);
  run(handleHomeHash);
  window.addEventListener("hashchange", handleHomeHash);
})();
