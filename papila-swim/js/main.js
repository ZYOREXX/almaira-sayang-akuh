/* ===================== PAPILA SWIM — RENDER & INTERAKSI ===================== */
(function () {
  const S = window.SITE;
  const B = S.brand;
  const page = document.body.dataset.page || "home";
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (s = "") => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Ikon SVG ---------- */
  const I = {
    logo: `<svg viewBox="0 0 64 34" aria-hidden="true"><path d="M2 26c8-10 20-14 34-10-9-1-17 3-22 9 6-3 13-4 20-2 7 2 14 2 22-3-6 8-15 11-24 9-8-2-16-1-24 3-2 1-4-1-6-6z" fill="#29a8e8"/><path d="M30 4c3-2 7-1 9 2l6 8c1 1 3 2 5 1l4-1c-2 3-5 4-8 3l-4-2-6 6c-3-3-7-4-11-3l7-6-3-4z" fill="#0a2f6b"/><circle cx="50" cy="8" r="3.4" fill="#0a2f6b"/></svg>`,
    menu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>`,
    left: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M15 4l-8 8 8 8"/></svg>`,
    right: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 4l8 8-8 8"/></svg>`,
    image: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/></svg>`,
    user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></svg>`,
    users: `<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M9 11a4 4 0 100-8 4 4 0 000 8zm7 0a3 3 0 100-6 3 3 0 000 6zM9 13c-4 0-7 2-7 4.5V20h14v-2.5C16 15 13 13 9 13zm7 .2c1.8.5 4 1.6 4 4.3V20h-2v-2.5c0-1.7-.8-3.1-2-4.3z"/></svg>`,
    cal: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>`,
    search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>`,
    pin: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a7 7 0 00-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z"/></svg>`,
    wa: `<svg viewBox="0 0 32 32" fill="currentColor"><path d="M16 3a13 13 0 00-11.2 19.6L3 29l6.6-1.7A13 13 0 1016 3zm0 23.7c-2 0-4-.6-5.7-1.6l-.4-.2-3.9 1 1-3.8-.3-.4A10.7 10.7 0 1116 26.7zm5.9-8c-.3-.2-1.9-1-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7 0-.3-.1-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6.3-.5c.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.7s1.2 3.2 1.3 3.4c.2.2 2.3 3.5 5.6 4.9.8.3 1.4.5 1.9.7.8.2 1.5.2 2 .1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/></svg>`,
    ig: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>`,
    tt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M14 3v11.5a3.5 3.5 0 11-3.5-3.5M14 3c.5 3 2.5 5 5.5 5"/></svg>`,
    yt: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 8.2a3 3 0 00-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 002 8.2 31 31 0 001.6 12 31 31 0 002 15.8a3 3 0 002.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 002.1-2.1c.4-1.2.5-2.5.4-3.8 0-1.3 0-2.6-.4-3.8zM10 15V9l5.2 3L10 15z"/></svg>`,
    fb: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 8.5V6.8c0-.8.2-1.3 1.4-1.3H17V2.3c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2H7.5v3.4h2.8V22H14v-10.1h2.8l.4-3.4H14z"/></svg>`,
    phone: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 013 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"/></svg>`
  };

  const ph = (cls = "", label = "") =>
    `<div class="ph ${cls}" aria-label="Placeholder gambar">${I.image}${label ? `<small>${esc(label)}</small>` : ""}</div>`;
  const media = (img, cls = "", alt = "") =>
    img ? `<img class="cover" src="${esc(img)}" alt="${esc(alt)}" loading="lazy">` : ph(cls);
  const waLink = `https://wa.me/${B.whatsapp}`;
  const fmtDate = d => new Date(d + "T00:00:00").toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });

  /* ---------- HEADER ---------- */
  function renderHeader() {
    const el = $("#site-header");
    if (!el) return;
    if (page === "home") {
      const links = [["#home", "Home"], ["#tentang", "Tentang"], ["#tim", "Tim Kami"], ["#galeri", "Galeri"], ["#berita", "Berita"], ["#kontak", "Kontak"]];
      el.className = "header transparent";
      el.innerHTML = `<div class="container header-inner">
        <a href="index.html" class="logo">${I.logo}<span class="logo-text">${esc(B.fullName)}</span></a>
        <button class="nav-toggle" aria-label="Buka menu">${I.menu}</button>
        <nav class="nav">${links.map(([h, t]) => `<a href="${h}">${t}</a>`).join("")}
          <a href="#" class="nav-login" data-login>${I.users} LOGIN</a></nav></div>`;
    } else {
      const links = [["index.html", "Home", "home"], ["tentang.html", "Tentang Kami", "tentang"], ["tim.html", "Tim Kami", "tim"], ["berita.html", "Berita &amp; Artikel", "berita"], ["galeri.html", "Galeri", "galeri"]];
      el.className = "header";
      el.innerHTML = `<div class="container header-inner">
        <a href="index.html" class="logo">${I.logo}<span class="logo-text">${esc(B.fullName)}</span></a>
        <button class="nav-toggle" aria-label="Buka menu">${I.menu}</button>
        <nav class="nav">${links.map(([h, t, k]) => `<a href="${h}" class="${k === page ? "active" : ""}">${t}</a>`).join("")}
          <div class="nav-actions"><a href="#" class="btn btn-outline" data-login>Login</a>
          <a href="index.html#kontak" class="btn btn-primary">Registrasi &amp; Kontak</a></div></nav></div>`;
    }
    const nav = $(".nav", el);
    $(".nav-toggle", el).addEventListener("click", () => nav.classList.toggle("open"));
    $$(".nav a", el).forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));
    if (page === "home") {
      const onScroll = () => el.classList.toggle("scrolled", window.scrollY > 60);
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      // highlight menu aktif sesuai section
      const sections = $$("section[id]");
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) $$(".nav a", el).forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      sections.forEach(s => io.observe(s));
    }
  }

  /* ---------- PAGE TITLE ---------- */
  function renderPageTitle() {
    const el = $("#page-title");
    if (!el) return;
    const t = el.dataset.title, crumb = el.dataset.crumb;
    if (el.classList.contains("centered")) {
      el.innerHTML = `<div class="container"><h1>${esc(t)}</h1><ul class="breadcrumb"><li><a href="index.html" style="color:var(--heading)">Home</a></li><li><a href="#">${esc(crumb)}</a></li></ul></div>`;
    } else {
      el.innerHTML = `<div class="container"><h1>${esc(t)}</h1><ul class="breadcrumb"><li><a href="index.html">Home</a></li><li>${esc(crumb)}</li></ul></div>`;
    }
  }

  /* ---------- HERO ---------- */
  function renderHero() {
    const el = $("#home");
    if (!el) return;
    const wave = `<svg class="hero-wave" viewBox="0 0 1440 200" preserveAspectRatio="none"><path fill="#fff" d="M0 120c180-60 360-60 540 0s360 60 540 0 270-50 360-20v100H0z"/></svg>`;
    el.innerHTML = S.hero.map((h, i) => `
      <div class="hero-slide ${i === 0 ? "active" : ""}">
        <div class="hero-bg">${h.img ? `<img class="cover" src="${esc(h.img)}" alt="">` : `<div class="ph ${i % 2 ? "ph-alt" : ""}" style="height:100%"></div>`}${wave}</div>
        <div class="hero-content"><h1>${esc(h.title)}</h1><p>"${esc(h.text)}"</p>
          <a href="#kontak" class="btn btn-primary btn-pill">Gabung Sekarang</a></div>
      </div>`).join("") + `
      <button class="hero-arrow hero-prev" aria-label="Sebelumnya">${I.left}</button>
      <button class="hero-arrow hero-next" aria-label="Berikutnya">${I.right}</button>
      <div class="hero-dots">${S.hero.map((_, i) => `<button class="${i === 0 ? "active" : ""}" aria-label="Slide ${i + 1}"></button>`).join("")}</div>`;
    const slides = $$(".hero-slide", el), dots = $$(".hero-dots button", el);
    let idx = 0, timer;
    const go = n => {
      idx = (n + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle("active", i === idx));
      dots.forEach((d, i) => d.classList.toggle("active", i === idx));
    };
    const auto = () => { clearInterval(timer); timer = setInterval(() => go(idx + 1), 6000); };
    $(".hero-prev", el).onclick = () => { go(idx - 1); auto(); };
    $(".hero-next", el).onclick = () => { go(idx + 1); auto(); };
    dots.forEach((d, i) => d.onclick = () => { go(i); auto(); });
    auto();
  }

  /* ---------- ABOUT ---------- */
  function renderAbout() {
    const el = $("#about-block");
    if (!el) return;
    const A = S.about;
    const pattern = `<div class="about-pattern"><svg viewBox="0 0 260 340">${(() => {
      let s = ""; const x = (cx, cy) => `<path d="M${cx - 3} ${cy - 3}l6 6M${cx + 3} ${cy - 3}l-6 6" stroke="currentColor" stroke-width="1.3"/>`;
      for (let c = 0; c < 9; c++) for (let r = 0; r < 2; r++) s += x(6 + c * 30, 6 + r * 30);
      for (let r = 2; r < 12; r++) for (let c = 0; c < 2; c++) s += x(6 + c * 30, 6 + r * 29);
      return s;
    })()}</svg></div>`;
    const isHome = page === "home";
    const visual = A.img
      ? `<img class="about-photo" src="${esc(A.img)}" alt="${esc(B.name)}">`
      : `<div class="about-logo">${I.logo.replace("<svg", '<svg style="width:100%;height:auto"')}<div style="text-align:center;font:900 clamp(28px,4vw,46px)/1 Lato,sans-serif;color:#0a2f6b;letter-spacing:1px;margin-top:6px">${esc(B.name.toUpperCase())}</div><div style="text-align:center;font:700 clamp(13px,1.6vw,18px) Lato,sans-serif;color:#1572e8;letter-spacing:3px;margin-top:6px">SWIMMING SCHOOL</div></div>`;
    el.innerHTML = `<div class="container about-grid">
      <div class="about-media ${isHome ? "about-frame" : ""}">${isHome ? "" : pattern}${visual}</div>
      <div class="about-text">
        ${isHome ? `<div class="eyebrow">Tentang Kami</div>` : ""}
        <h6>${esc(A.heading)}</h6>
        ${A.paragraphs.map(p => `<p>${esc(p)}</p>`).join("")}
        <hr><strong>${esc(B.tagline)}</strong>
      </div></div>`;
  }

  /* ---------- STATS (counter) ---------- */
  function renderStats() {
    const el = $("#stats");
    if (!el) return;
    el.innerHTML = `${el.classList.contains("dark") ? `<div class="stats-band ph"></div>` : ""}<div class="container stats-grid">${S.stats.map(s =>
      `<div><div class="stat-value" data-count="${s.value}">0</div><div class="stat-label">${esc(s.label)}</div></div>`).join("")}</div>`;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        $$("[data-count]", el).forEach(n => {
          const end = +n.dataset.count, t0 = performance.now(), dur = 1600;
          const step = t => { const p = Math.min(1, (t - t0) / dur); n.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
          requestAnimationFrame(step);
        });
        io.disconnect();
      });
    }, { threshold: .4 });
    io.observe(el);
  }

  /* ---------- SERVICES ---------- */
  const serviceBody = s => s.type === "pool"
    ? `<ol>${s.items.map(it => `<li><b>${esc(it.name)}</b><span>${esc(it.address)}</span></li>`).join("")}</ol>`
    : `<p>${esc(s.text)}</p>`;

  function renderServiceTabs() {
    const el = $("#service-tabs");
    if (!el) return;
    el.innerHTML = `<div class="tab-list" role="tablist">${S.services.map((s, i) =>
      `<button role="tab" class="${i === 0 ? "active" : ""}" data-i="${i}">${esc(s.title)}</button>`).join("")}</div>
      <div class="tab-panel" role="tabpanel"></div>
      <div class="tab-art"></div>`;
    const panel = $(".tab-panel", el), art = $(".tab-art", el);
    const show = i => {
      const s = S.services[i];
      panel.innerHTML = `<div class="fade-in"><h4>${esc(s.heading)}</h4>${s.type === "pool" ? `<em>${esc(s.note)}</em>` : `<span class="age">${esc(s.age)}</span>`}${serviceBody(s)}</div>`;
      art.innerHTML = `<div class="fade-in">${ph(i % 2 ? "ph-alt" : "")}</div>`;
      $$(".tab-list button", el).forEach((b, j) => b.classList.toggle("active", j === i));
    };
    $$(".tab-list button", el).forEach(b => b.addEventListener("click", () => show(+b.dataset.i)));
    const hash = location.hash.match(/^#layanan-(\d+)/);
    show(hash ? Math.min(+hash[1], S.services.length - 1) : 0);
  }

  function renderServiceCards() {
    const el = $("#service-cards");
    if (!el) return;
    el.innerHTML = S.services.map((s, i) => `
      <article class="card reveal card-collapsible">
        <div class="card-media">${ph(i % 2 ? "ph-alt" : "")}</div>
        <div class="card-body">
          <h4>${esc(s.title)}</h4>
          ${s.type === "pool" ? `<h5>${esc(s.heading)}</h5><span class="note">${esc(s.note)}</span>` : `<span class="age">${esc(s.heading)} ${esc(s.age)}</span>`}
          ${serviceBody(s)}
          <button class="card-more" hidden>Lihat selengkapnya</button>
        </div>
      </article>`).join("");
    $$(".card-collapsible", el).forEach(card => {
      const body = $("ol, p", card), btn = $(".card-more", card);
      if (body.scrollHeight > 240) {
        btn.hidden = false;
        btn.onclick = () => { card.classList.toggle("open"); btn.textContent = card.classList.contains("open") ? "Tutup" : "Lihat selengkapnya"; };
      }
    });
  }

  /* ---------- TEAM ---------- */
  function renderTeam() {
    const el = $("#team-grid");
    if (!el) return;
    const big = el.classList.contains("cols-3");
    el.innerHTML = S.team.map((t, i) => `
      <div class="team-card reveal">
        <div class="media">${t.img ? `<img src="${esc(t.img)}" alt="${esc(t.name)}" loading="lazy">` : `<div class="ph ${i % 3 === 1 ? "ph-alt" : ""}">${I.user}</div>`}</div>
        <div class="team-info"><h4>${esc(t.name)}</h4><span>${esc(t.role)}</span></div>
      </div>`).join("");
    if (!big) return;
  }

  /* ---------- GALLERY ---------- */
  function renderGallery() {
    const el = $("#gallery-grid");
    if (!el) return;
    const filters = $("#gallery-filters");
    const limit = +(el.dataset.limit || 0);
    const allLabel = filters.classList.contains("pill") ? "Semua" : "All";
    filters.innerHTML = [allLabel, ...S.galleryCategories].map((c, i) =>
      `<button class="${i === 0 ? "active" : ""}" data-cat="${i === 0 ? "*" : esc(c)}">${esc(c)}</button>`).join("");
    el.innerHTML = S.gallery.map((g, i) => `
      <div class="gallery-item reveal" data-cat="${esc(g.category)}" data-i="${i}">
        ${g.img ? `<img src="${esc(g.img)}" alt="${esc(g.title)}" loading="lazy">` : `<div class="ph ${i % 3 === 1 ? "ph-alt" : ""}"><div class="gallery-stripes"></div>${I.user}</div>
        <div class="gallery-label">${esc(g.title)}<small>${esc(B.name)}</small></div>`}
      </div>`).join("");
    let cat = "*", shown = limit || Infinity;
    const more = $("#gallery-more");
    const apply = () => {
      let n = 0;
      $$(".gallery-item", el).forEach(it => {
        const match = cat === "*" || it.dataset.cat === cat;
        const vis = match && n < shown;
        if (match) n++;
        it.classList.toggle("hide", !vis);
        if (vis) it.classList.add("in");
      });
      if (more) more.hidden = n <= shown;
    };
    $$("button", filters).forEach(b => b.addEventListener("click", () => {
      $$("button", filters).forEach(x => x.classList.toggle("active", x === b));
      cat = b.dataset.cat; shown = limit || Infinity; apply();
    }));
    if (more) more.addEventListener("click", () => { shown += limit || 6; apply(); });
    apply();

    // Lightbox
    const lb = document.createElement("div");
    lb.className = "lightbox";
    lb.innerHTML = `<button class="lightbox-close" aria-label="Tutup">&times;</button><div class="lightbox-inner"></div>`;
    document.body.appendChild(lb);
    el.addEventListener("click", e => {
      const it = e.target.closest(".gallery-item");
      if (!it) return;
      $(".lightbox-inner", lb).innerHTML = it.innerHTML;
      lb.classList.add("open");
    });
    lb.addEventListener("click", e => { if (e.target === lb || e.target.classList.contains("lightbox-close")) lb.classList.remove("open"); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") lb.classList.remove("open"); });
  }

  /* ---------- NEWS ---------- */
  function renderNewsCards() {
    const el = $("#news-grid");
    if (!el) return;
    el.innerHTML = S.news.slice(0, 3).map((n, i) => `
      <article class="news-card reveal">
        <span class="tag ${n.color}">${esc(n.tag)}</span>
        <div class="media">${media(n.img, i % 2 ? "ph-alt" : "", n.title)}</div>
        <div class="news-body"><div class="news-date">${fmtDate(n.date)}</div>
          <h4>${esc(n.title)}</h4><p>${esc(n.excerpt)}</p>
          <a href="berita.html" class="more">Baca Selengkapnya</a></div>
      </article>`).join("");
  }

  function renderBlog() {
    const list = $("#post-list");
    if (!list) return;
    const perPage = 3;
    let q = "", tag = "", pg = 1;
    const tagsEl = $("#tag-list"), recentEl = $("#recent-posts"), pager = $("#pager");
    const tagCounts = S.news.reduce((m, n) => (m[n.tag] = (m[n.tag] || 0) + 1, m), {});
    tagsEl.innerHTML = Object.entries(tagCounts).map(([t, c]) => `<button data-tag="${esc(t)}">${esc(t)} (${c})</button>`).join("");
    recentEl.innerHTML = S.news.slice(-2).map(n => `<a href="#" class="mini-post">${n.img ? `<img src="${esc(n.img)}" style="width:64px;height:64px;object-fit:cover;border-radius:4px" alt="">` : ph()}<div><b>${esc(n.title)}</b><small>${fmtDate(n.date)}</small></div></a>`).join("");

    const draw = () => {
      const items = S.news.filter(n => (!tag || n.tag === tag) && (!q || (n.title + " " + n.excerpt).toLowerCase().includes(q)));
      const pages = Math.max(1, Math.ceil(items.length / perPage));
      pg = Math.min(pg, pages);
      const slice = items.slice((pg - 1) * perPage, pg * perPage);
      list.innerHTML = slice.length ? slice.map((n, i) => `
        <article class="post reveal in">
          <span class="tag square ${n.color}">${esc(n.tag)}</span>
          <div class="media">${media(n.img, i % 2 ? "ph-alt" : "", n.title)}</div>
          <div class="post-body">
            <div class="post-meta"><span>${I.user} ${esc(n.author)}</span><span>${I.cal} ${fmtDate(n.date)}</span></div>
            <h3>${esc(n.title)}</h3><p>${esc(n.excerpt)}</p>
            <a href="#" class="btn btn-primary btn-pill">Baca Selengkapnya</a>
          </div></article>`).join("") : `<div class="empty">Artikel tidak ditemukan.</div>`;
      const from = items.length ? (pg - 1) * perPage + 1 : 0;
      $("#pager-info").innerHTML = `Showing <b>${from}</b> to <b>${(pg - 1) * perPage + slice.length}</b> of <b>${items.length}</b> results`;
      pager.innerHTML = `<button data-p="${pg - 1}" ${pg === 1 ? "disabled" : ""}>&lsaquo;</button>` +
        Array.from({ length: pages }, (_, i) => `<button data-p="${i + 1}" class="${i + 1 === pg ? "active" : ""}">${i + 1}</button>`).join("") +
        `<button data-p="${pg + 1}" ${pg === pages ? "disabled" : ""}>&rsaquo;</button>`;
    };
    pager.addEventListener("click", e => { const b = e.target.closest("button"); if (b && !b.disabled) { pg = +b.dataset.p; draw(); list.scrollIntoView({ behavior: "smooth", block: "start" }); } });
    $("#search-form").addEventListener("submit", e => { e.preventDefault(); q = $("#search-input").value.trim().toLowerCase(); pg = 1; draw(); });
    tagsEl.addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      tag = tag === b.dataset.tag ? "" : b.dataset.tag;
      $$("button", tagsEl).forEach(x => x.classList.toggle("active", x.dataset.tag === tag));
      pg = 1; draw();
    });
    draw();
  }

  /* ---------- CONTACT ---------- */
  function renderContact() {
    const el = $("#kontak");
    if (!el) return;
    el.innerHTML = `<div class="contact-bg ph"></div>
      <div class="container">
        <div class="title-center"><h2>Siap Memulai?</h2><p>Hubungi kami untuk sesi percobaan gratis</p></div>
        <div class="contact-grid">
          <div class="glass reveal"><h4>Informasi Kontak</h4>
            <div class="info-item"><b>Lokasi</b><span>${B.locations.map(esc).join(", ")}</span></div>
            <div class="info-item"><b>WhatsApp</b><span>${esc(B.phone)}</span></div>
            <div class="info-item"><b>Email</b><span>${esc(B.email)}</span></div>
            <div class="map"><iframe title="Peta lokasi" loading="lazy" src="https://maps.google.com/maps?q=${encodeURIComponent(B.mapQuery)}&z=5&output=embed"></iframe></div>
          </div>
          <form class="glass form reveal" id="contact-form"><h4>Formulir pendaftaran atau pertanyaan</h4>
            <div class="field"><label for="f-nama">Nama Lengkap</label><input id="f-nama" required placeholder="Nama Anda"></div>
            <div class="field"><label for="f-email">Email</label><input id="f-email" type="email" required placeholder="email@contoh.com"></div>
            <div class="field"><label for="f-subj">Subject</label><input id="f-subj" placeholder="Pendaftaran anggota baru."></div>
            <div class="field"><label for="f-msg">Pesan</label><textarea id="f-msg" required></textarea></div>
            <button class="btn btn-primary" type="submit">Kirim Pesan</button>
            <div class="form-msg" aria-live="polite"></div>
          </form>
        </div>
      </div>`;
    // Sementara: kirim isi form ke WhatsApp
    $("#contact-form").addEventListener("submit", e => {
      e.preventDefault();
      const v = id => $("#" + id).value.trim();
      const text = `Halo ${B.name}!%0A%0ANama: ${encodeURIComponent(v("f-nama"))}%0AEmail: ${encodeURIComponent(v("f-email"))}%0ASubject: ${encodeURIComponent(v("f-subj"))}%0A%0A${encodeURIComponent(v("f-msg"))}`;
      $(".form-msg", el).textContent = "Terima kasih! Anda akan diarahkan ke WhatsApp.";
      window.open(`${waLink}?text=${text}`, "_blank", "noopener");
      e.target.reset();
    });
  }

  /* ---------- FOOTER ---------- */
  function renderFooter() {
    const el = $("#site-footer");
    if (!el) return;
    const so = B.socials;
    const socials = `<div class="socials"><a href="${esc(so.instagram)}" aria-label="Instagram">${I.ig}</a><a href="${esc(so.tiktok)}" aria-label="TikTok">${I.tt}</a><a href="${esc(so.youtube)}" aria-label="YouTube">${I.yt}</a><a href="${esc(so.facebook)}" aria-label="Facebook">${I.fb}</a></div>`;
    const year = new Date().getFullYear();
    if (el.classList.contains("alt")) {
      el.innerHTML = `<div class="container footer-grid">
        <div><span class="brand-big">${esc(B.fullName)}</span>${B.locations.map(l => `<p>${esc(l)}</p>`).join("")}
          <p style="margin-top:14px"><b>Phone:</b> ${esc(B.phone)}</p><p><b>Email:</b> ${esc(B.email)}</p>${socials}</div>
        <div><h5>Useful Links</h5><ul><li><a href="index.html">Home</a></li><li><a href="tentang.html">About us</a></li><li><a href="tim.html">Our Team</a></li><li><a href="berita.html">News &amp; Blogs</a></li><li><a href="galeri.html">Gallery</a></li></ul></div>
        <div></div></div>
        <div class="container footer-bottom">&copy; Copyright <a href="index.html">${esc(B.copyright)}</a> All Rights Reserved</div>`;
    } else {
      el.innerHTML = `<div class="container footer-grid">
        <div><h5>${I.pin} ${esc(B.fullName)}</h5>${B.locations.map(l => `<p>${esc(l)}</p>`).join("")}<a class="phone" href="${waLink}">${I.wa} ${esc(B.phone)}</a></div>
        <div><h5>Navigasi</h5><ul><li><a href="tentang.html">Tentang Kami</a></li><li><a href="tim.html">Tim Kami</a></li><li><a href="berita.html">Berita &amp; Event</a></li><li><a href="galeri.html">Galeri</a></li><li><a href="index.html#kontak">Registrasi &amp; Kontak</a></li></ul></div>
        <div><h5>Sosial Media</h5><p>Dapatkan update kegiatan harian dan pengumuman lomba melalui media sosial kami.</p>${socials}</div></div>
        <div class="container footer-bottom">&copy; ${year} <a href="index.html">${esc(B.copyright)}</a>. All Rights Reserved.</div>`;
    }
  }

  /* ---------- WA FLOAT + LOGIN MODAL ---------- */
  function renderExtras() {
    const wa = document.createElement("a");
    wa.className = "wa-float"; wa.href = waLink; wa.target = "_blank"; wa.rel = "noopener"; wa.setAttribute("aria-label", "Chat WhatsApp");
    wa.innerHTML = I.wa;
    document.body.appendChild(wa);

    const m = document.createElement("div");
    m.className = "modal"; m.setAttribute("role", "dialog"); m.setAttribute("aria-modal", "true");
    m.innerHTML = `<div class="modal-box"><button class="modal-close" aria-label="Tutup">&times;</button>
      <div class="logo-mark">${I.logo}</div><h3>Login ${esc(B.fullName)}</h3><p>Masukkan kredensial Anda.</p>
      <form><div class="field"><label for="l-user">Username</label><input id="l-user" autocomplete="username" required></div>
      <div class="field"><label for="l-pass">Password</label><input id="l-pass" type="password" autocomplete="current-password" required></div>
      <button class="btn btn-primary" type="submit">MASUK</button><p class="form-msg" style="color:var(--primary)"></p></form></div>`;
    document.body.appendChild(m);
    const close = () => m.classList.remove("open");
    $$("[data-login]").forEach(b => b.addEventListener("click", e => { e.preventDefault(); m.classList.add("open"); $("#l-user").focus(); }));
    m.addEventListener("click", e => { if (e.target === m || e.target.classList.contains("modal-close")) close(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
    $("form", m).addEventListener("submit", e => { e.preventDefault(); $(".form-msg", m).textContent = "Fitur login belum aktif (demo)."; });
  }

  /* ---------- REVEAL ON SCROLL ---------- */
  function initReveal() {
    const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
    $$(".reveal").forEach(el => io.observe(el));
  }

  document.title = document.title.replace("{brand}", B.fullName);
  renderHeader(); renderPageTitle(); renderHero(); renderAbout(); renderStats();
  renderServiceTabs(); renderServiceCards(); renderTeam(); renderGallery();
  renderNewsCards(); renderBlog(); renderContact(); renderFooter(); renderExtras(); initReveal();
})();
