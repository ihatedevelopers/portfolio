// Sinematik balon yolculuğu: GSAP ScrollTrigger + Lenis ile kaydırmaya bağlı sahneler.
import { PROJECTS, GALLERY, PEOPLE, CONTACT, REELS, ACCOUNTS } from "./content.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const bi = (o) => `data-en="${esc(o.en)}" data-tr="${esc(o.tr)}"`;
const L = (en, tr) => ({ en, tr });
const store = {
  get(k, d) { try { return localStorage.getItem(k) ?? d; } catch (_) { return d; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (_) {} },
};

const { gsap, ScrollTrigger, Lenis } = window;
const hasGsap = !!(gsap && ScrollTrigger);
const fine = matchMedia("(pointer: fine)").matches;
// Not: masaüstü sürümü (os.html) dili JSON olarak ("\"tr\"") kaydediyor; ikisini de kabul et.
const savedLang = String(store.get("om-lang", "")).replace(/"/g, "");
let lang = savedLang === "tr" || savedLang === "en" ? savedLang : (navigator.language || "en").toLowerCase().startsWith("tr") ? "tr" : "en";

// ---------------- İçerik ----------------
// Biz: iki dikdörtgen portre (SD camının mavi ve pembe tonunda), altında kişinin yaptığı işlere linkler.
const MADE = {
  omer: [
    [L("Outreach engine", "Başvuru motoru"), "#engine"], [L("VTDiag tool", "VTDiag aracı"), "#lab"],
    [L("A Godot game", "Godot oyunu"), "#lab"], [L("10+ websites", "10+ site"), "#route"],
  ],
  muge: [
    [L("Reels & carousels", "Reel ve karuseller"), "#studio"], [L("Brand kits", "Marka kitleri"), "#studio"],
    [L("YouTube thumbnails", "YouTube kapakları"), "#studio"], [L("AI short videos", "AI kısa videolar"), "#studio"],
  ],
};
function buildDuo() {
  $("#duo").innerHTML = PEOPLE.map((p) => `
    <article class="half" data-who="${p.id}">
      <figure class="half-ph">
        <img src="assets/${p.id}_card.webp" alt="${esc(p.name)}" loading="lazy" width="640" height="640">
        <figcaption>${esc(p.name.split(" ").slice(-2).join(" "))}</figcaption>
      </figure>
      <div class="half-copy">
        <p class="role" ${bi(p.role)}></p>
        <p ${bi(p.text)}></p>
        <p class="made-l" ${bi(L("Made by " + p.name.split(" ")[p.id === "muge" ? 1 : 0], (p.id === "muge" ? "Müge" : "Ömer") + "'" + (p.id === "muge" ? "nin" : "in") + " işleri"))}></p>
        <ul class="made">${MADE[p.id].map(([t, h]) => `<li><a href="${h}"><span ${bi(t)}></span><span class="arr">↘</span></a></li>`).join("")}</ul>
      </div>
    </article>`).join("");
}

// Rota = müşteri ve işletme siteleri, Atölye = kendi ürünlerimiz (content.js içindeki kind alanı).
const ROUTE = PROJECTS.filter((p) => p.kind === "site").map((p) => p.id);
const LAB = PROJECTS.filter((p) => p.kind === "lab");
const host = (u) => { try { return new URL(u).host + new URL(u).pathname.replace(/\/$/, ""); } catch (_) { return u; } };
// Ekran görüntüsü: büyük/küçük webp çiftleri (-1200/-600 ya da -1280/-640), telefona küçüğü gider.
// shotTr varsa dil değişince görsel de değişir (data-en / data-tr-img).
const smallOf = (u) => u.replace("-1200.", "-600.").replace("-1280.", "-640.");
const shotImg = (p, sizes) => {
  const src = lang === "tr" && p.shotTr ? p.shotTr : p.shot;
  const set = /-(1200|1280)\./.test(src) ? ` srcset="${smallOf(src)} 640w, ${src} 1280w" sizes="${sizes}"` : "";
  const sw = p.shotTr ? ` data-img-en="${p.shot}" data-img-tr="${p.shotTr}"` : "";
  return `<img src="${src}"${set}${sw} alt="${esc(p.title)}" loading="lazy" decoding="async" width="1280" height="800">`;
};
// Videolu projelerde poster + sadece görünürken oynayan video.
const media = (p, sizes) => p.video
  ? `<video data-src="${p.video.includes("/") ? p.video : `assets/v4/reels/${p.video}.mp4`}" poster="${p.shot}" muted loop playsinline preload="none" aria-label="${esc(p.title)}"></video>`
  : shotImg(p, sizes);
// Linki olan çerçeve <a>, olmayan <div>.
const frameTag = (p, inner, cls = "frame") => p.url
  ? `<a class="${cls}" href="${p.url}" target="_blank" rel="noopener" data-cursor-en="Visit" data-cursor-tr="Gez">${inner}</a>`
  : `<div class="${cls}">${inner}</div>`;

function buildTrack() {
  const stops = ROUTE.map((id) => PROJECTS.find((p) => p.id === id)).map((p, i) => `
    <article class="stop" data-color="${p.color}">
      ${frameTag(p, `<div class="screen"><div class="frame-bar"><i></i><i></i><i></i><span>${esc(p.url ? host(p.url) : (p.titleTr && lang === "tr" ? p.titleTr : p.title))}</span></div>${media(p, "(max-width: 900px) 46vw, 640px")}</div>`, "frame monitor")}
      <div>
        <div class="stop-n"><b>${String(i + 1).padStart(2, "0")}</b><span ${bi(p.tag)}></span></div>
        <h3${p.titleTr ? ` ${bi(L(p.title, p.titleTr))}` : ""}>${esc(p.title)}</h3>
        <p ${bi(p.text)}></p>
        <ul class="tags">${p.stack.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
        ${p.url ? `<a class="link" href="${p.url}" target="_blank" rel="noopener"><span ${bi(L("Visit the live site", "Canlı siteye git"))}></span><span class="arr">↗</span></a>` : ""}
      </div>
    </article>`).join("");
  $("#track").innerHTML = stops + `
    <article class="stop end" data-color="#ff7a45">
      <div class="stop-n"><b>${String(ROUTE.length + 1).padStart(2, "0")}</b><span ${bi(L("Your business", "Sizin işletmeniz"))}></span></div>
      <h3 ${bi(L("Could you be the <em>next stop?</em>", "Sıradaki durak <em>siz olabilirsiniz</em>"))}></h3>
      <p ${bi(L("Fast websites, local SEO, booking flows and automations for small businesses. Built by two people who answer their messages.", "Küçük işletmeler için hızlı siteler, yerel SEO, rezervasyon akışları ve otomasyonlar. Mesajlarına cevap veren iki kişi tarafından."))}></p>
      <a class="link" href="#contact"><span ${bi(L("Let's talk", "Konuşalım"))}></span><span class="arr">↗</span></a>
    </article>`;
}

// Atölye: her proje tam ekran bir sahne (position: sticky ile üst üste biner).
// Kapak: yatay ekranda -l.webp, dikey ekranda -p.webp; metin HTML'de, görselin sakin tarafında.
function buildLab() {
  const n = LAB.length;
  $("#labGrid").innerHTML = LAB.map((p, i) => {
    const label = p.linkLabel || L("Open", "Aç");
    const title = p.titleEn ? `<h3 ${bi(L(p.titleEn, p.title))}></h3>` : `<h3>${esc(p.title)}</h3>`;
    return `<article class="ws-slide" style="--c:${p.color}">
      <div class="ws-in">
        <picture class="ws-bg">
          <source media="(max-aspect-ratio: 1/1)" srcset="${p.cover}-p.webp">
          <img src="${p.cover}-l.webp" alt="${esc(p.title)}" loading="lazy" decoding="async" width="1920" height="1200">
        </picture>
        <div class="ws-shade"></div>
        <div class="ws-copy">
          <p class="ws-n"><b>${String(i + 1).padStart(2, "0")}</b> / ${String(n).padStart(2, "0")}<span ${bi(p.tag)}></span></p>
          ${title}
          <p class="ws-t" ${bi(p.text)}></p>
          <ul class="tags">${p.stack.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
          ${p.url ? `<a class="link" href="${p.url}" target="_blank" rel="noopener"><span ${bi(label)}></span><span class="arr">↗</span></a>` : ""}
        </div>
        <div class="ws-dim"></div>
      </div>
    </article>`;
  }).join("");
}

// Karusel slaytları (4:5) film şeridine Müge'nin tasarımlarıyla karışık girer.
const SLIDES = ["valocar", "win11car"].flatMap((d) => [1, 2, 3, 4].map((i) => ({ src: `assets/v4/carousel/${d}-${i}.webp`, cap: "Instagram carousel", tall: true })));
function buildMarquee() {
  const beauty = GALLERY.filter((g) => !g.wide);
  const wide = GALLERY.filter((g) => g.wide);
  const row = (list) => {
    const html = list.map((g) => `<img src="${g.src}" alt="${esc(g.cap)}" class="${g.wide ? "wide" : g.tall ? "tall" : ""}" loading="lazy">`).join("");
    return html + html;
  };
  $("#m1").innerHTML = row([...beauty.slice(0, 3), ...SLIDES.slice(0, 4), ...beauty.slice(3), ...wide.slice(0, 1)]);
  $("#m2").innerHTML = row([...wide.slice(1), ...SLIDES.slice(4), ...beauty.slice().reverse().slice(0, 3)]);
}

// Yönettiğimiz sayfalar: platform ikonu + hesap + ne paylaştığı.
const NET_ICON = {
  ig: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.3" cy="6.7" r="1.2" fill="currentColor"/></svg>',
  yt: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5.5" width="19" height="13" rx="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor"/></svg>',
};
function buildAccounts() {
  $("#accounts").innerHTML = ACCOUNTS.map((a) => `<li><a href="${a.url}" target="_blank" rel="noopener">
    <span class="acc-ic acc-${a.net}">${NET_ICON[a.net]}</span>
    <span class="acc-t"><b>${esc(a.handle)}</b><small ${bi(a)}></small></span><span class="arr">↗</span></a></li>`).join("");
}

// Telefondaki reel: alttaki kapaklardan seçilir, ses düğmesi telefonun üstünde.
function buildReels() {
  const pick = $("#reelPick"), vid = $("#phoneVid"), snd = $("#phoneSnd");
  pick.innerHTML = REELS.map((r, i) => `
    <button class="rp${i === 0 ? " on" : ""}" type="button" data-id="${r.id}" aria-pressed="${i === 0}">
      <img src="assets/v4/reels/${r.id}.webp" alt="" loading="lazy" width="540" height="960"><span ${bi(r)}></span>
    </button>`).join("");
  pick.addEventListener("click", (e) => {
    const b = e.target.closest(".rp");
    if (!b) return;
    $$(".rp", pick).forEach((x) => { x.classList.toggle("on", x === b); x.setAttribute("aria-pressed", x === b); });
    const src = `assets/v4/reels/${b.dataset.id}.mp4`;
    vid.dataset.src = src;
    vid.poster = `assets/v4/reels/${b.dataset.id}.webp`;
    vid.src = src;
    vid.play().catch(() => {});
    audio.blip(1500, 0.05, 0.05);
  });
  snd.addEventListener("click", () => {
    vid.muted = !vid.muted;
    if (!vid.src) vid.src = vid.dataset.src;
    vid.play().catch(() => {});
    snd.setAttribute("aria-pressed", String(!vid.muted));
  });
}

const LOGS = [
  ["dim", "› scanning 9 inboxes…"],
  ["ok", "✓ new reply · classified: positive (de)"],
  ["", "› drafting an answer in German…"],
  ["dim", "› bounce detected · address removed"],
  ["hot", "★ warm reply · flagged for a human"],
  ["ok", "✓ personalised emails sent in local office hours"],
  ["", "› auto-reply recognised · ignored"],
  ["ok", "✓ site audit: 3 SEO quick wins found"],
  ["dim", "› next send window: 09:00 local time"],
  ["hot", "★ meeting request · reply drafted"],
  ["ok", "✓ polite no (fr) · thank-you + collab offer drafted"],
  ["", "› reading reply in Italian…"],
];
let logTimer = 0;
function startLog() {
  if (logTimer) return;
  const box = $("#log");
  let i = 0;
  const add = () => {
    const [cls, text] = LOGS[i++ % LOGS.length];
    const d = document.createElement("div");
    d.className = cls;
    d.textContent = `${new Date().toLocaleTimeString("en-GB")}  ${text}`;
    box.appendChild(d);
    if (hasGsap) gsap.from(d, { y: 14, opacity: 0, duration: 0.5, ease: "power3.out" });
    while (box.children.length > 13) box.firstChild.remove();
  };
  for (let k = 0; k < 6; k++) add();
  logTimer = setInterval(add, 1400);
}

// ---------------- Dil ----------------
function splitStatement() {
  const el = $("#statement");
  el.innerHTML = (el.dataset[lang] || el.dataset.en || "").split(/\s+/).map((w) => `<span class="wd">${esc(w)}</span>`).join(" ");
  if (!hasGsap) $$(".wd", el).forEach((w) => w.classList.add("on"));
}
function applyLang() {
  document.documentElement.lang = lang;
  $$("[data-en]").forEach((el) => { if (el.id !== "statement") el.innerHTML = el.dataset[lang]; });
  $$("img[data-img-en]").forEach((im) => {
    const src = lang === "tr" ? im.dataset.imgTr : im.dataset.imgEn;
    if (im.getAttribute("src") !== src) { im.src = src; im.srcset = `${smallOf(src)} 640w, ${src} 1280w`; }
  });
  $("#lang").textContent = lang === "tr" ? "EN" : "TR";
  splitStatement();
  updateStatement(statementProgress);
  if (hasGsap) ScrollTrigger.refresh();
}
let statementProgress = 0;
function updateStatement(p) {
  statementProgress = p;
  const words = $$("#statement .wd");
  const n = Math.round(p * words.length * 1.05);
  words.forEach((w, i) => w.classList.toggle("on", i < n));
}

// ---------------- Ses (isteğe bağlı) ----------------
const audio = {
  ctx: null, wind: null, on: false,
  init() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = (this.ctx = new AC());
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(ctx.destination);
    // Rüzgar: filtrelenmiş gürültü + yavaş dalgalanma.
    const len = ctx.sampleRate * 3, buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = buf.getChannelData(c); let last = 0; for (let i = 0; i < len; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 3.5; } }
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    const bp = ctx.createBiquadFilter(); bp.type = "lowpass"; bp.frequency.value = 520;
    const lfo = ctx.createOscillator(), lfoG = ctx.createGain(); lfo.frequency.value = 0.07; lfoG.gain.value = 260;
    lfo.connect(lfoG).connect(bp.frequency);
    const g = ctx.createGain(); g.gain.value = 0.55;
    src.connect(bp).connect(g).connect(this.master);
    src.start(); lfo.start();
  },
  toggle() {
    this.init();
    if (!this.ctx) return;
    this.ctx.resume();
    this.on = !this.on;
    this.master.gain.setTargetAtTime(this.on ? 0.5 : 0, this.ctx.currentTime, 0.4);
    $("#snd").setAttribute("aria-pressed", this.on);
    store.set("om-sound", this.on ? "1" : "0");
  },
  blip(freq = 1600, dur = 0.04, vol = 0.05, type = "sine") {
    if (!this.on || !this.ctx) return;
    const t = this.ctx.currentTime, o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(this.ctx.destination); o.start(t); o.stop(t + dur + 0.02);
  },
  tear() {
    if (!this.on || !this.ctx) return;
    const ctx = this.ctx, t = ctx.currentTime, len = ctx.sampleRate * 0.35, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (Math.random() < 0.3 ? 1 : 0.2) * (1 - i / len);
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = buf; f.type = "highpass"; f.frequency.value = 1800; g.gain.value = 0.4;
    s.connect(f).connect(g).connect(ctx.destination); s.start(t);
    [784, 988, 1175].forEach((n, i) => this.blip(n, 0.25, 0.06, "triangle"));
  },
};

// ---------------- İmleç ----------------
function initCursor() {
  if (!fine) return;
  const c = $("#cursor"), dot = $("#curDot"), lbl = $("#cursorL");
  let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y, last = 0;
  addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; c.classList.add("on"); dot.classList.add("on"); }, { passive: true });
  document.addEventListener("pointerleave", () => { c.classList.remove("on"); dot.classList.remove("on"); });
  addEventListener("pointerdown", () => c.classList.add("press"));
  addEventListener("pointerup", () => c.classList.remove("press"));
  const loop = () => {
    x += (tx - x) * 0.2; y += (ty - y) * 0.2;
    c.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    dot.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    requestAnimationFrame(loop);
  };
  loop();
  document.addEventListener("pointerover", (e) => {
    const t = e.target.closest("a, button, [data-cursor-en]");
    c.classList.toggle("big", !!t);
    dot.classList.toggle("big", !!t);
    lbl.textContent = t?.dataset?.[lang === "tr" ? "cursorTr" : "cursorEn"] || "";
    if (t && t !== last) audio.blip(1900, 0.03, 0.035);
    last = t;
  });
}

// ---------------- Kart eğimi ----------------
function initTilt() {
  if (!fine) return;
  $$("[data-tilt]").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${px * 10}deg) rotateX(${-py * 10}deg) translateZ(0)`;
    });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  });
}


// ---------------- Videolar ----------------
function lazyVideos() {
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    const v = en.target;
    if (en.isIntersecting) {
      if (!v.src && v.dataset.src) v.src = v.dataset.src;
      v.play().catch(() => {});
    } else v.pause();
  }), { rootMargin: "200px" });
  $$("video[data-src]").forEach((v) => io.observe(v));
}

// ---------------- Sahneler (GSAP) ----------------
let lenis = null;
function scenes() {
  gsap.registerPlugin(ScrollTrigger);
  if (Lenis) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
  }

  // İrtifa ölçer
  ScrollTrigger.create({
    start: 0, end: "max",
    onUpdate: (self) => {
      const alt = Math.round(Math.sin(Math.min(1, self.progress * 1.04) * Math.PI) * 1250);
      $("#altN").textContent = Math.max(0, alt).toLocaleString("en");
      $("#altDot").style.bottom = `calc(${(Math.max(0, alt) / 1250) * 100}% - 4px)`;
    },
  });

  const mm = gsap.matchMedia();

  // 1. Kalkış: video yakınlaşır, yazı uçar, bulutlar yükselir, gökyüzüne geçilir.
  const hero = gsap.timeline({ scrollTrigger: { trigger: ".hero", start: "top top", end: "+=130%", scrub: 1, pin: true } });
  hero.to(".hero-media", { scale: 1.35, yPercent: 8, ease: "none", duration: 1 }, 0)
    .to(".hero-copy", { y: -160, opacity: 0, ease: "power1.in", duration: 0.45 }, 0)
    .to(".cue", { opacity: 0, duration: 0.15 }, 0)
    .to(".hc1", { y: "-75vh", opacity: 1, ease: "none", duration: 0.9 }, 0.1)
    .to(".hc2", { y: "-95vh", opacity: 1, ease: "none", duration: 0.9 }, 0.15)
    .to(".hc3", { y: "-100vh", opacity: 1, ease: "none", duration: 0.85 }, 0.2)
    .to(".hc4", { y: "-85vh", opacity: 1, ease: "none", duration: 0.8 }, 0.28)
    .to(".hero-fog", { opacity: 1, ease: "power1.in", duration: 0.35 }, 0.68);

  // 2. Bulut paralaksı + cümle kelime kelime yanar + balonlu kartlar süzülür.
  $$(".sc").forEach((c) => gsap.to(c, { y: () => +c.dataset.speed * 500, x: () => +c.dataset.speed * -120, ease: "none", scrollTrigger: { trigger: ".sky", start: "top bottom", end: "bottom top", scrub: true } }));
  ScrollTrigger.create({ trigger: "#statement", start: "top 78%", end: "bottom 45%", scrub: true, onUpdate: (s) => updateStatement(s.progress) });
  $$(".half").forEach((el, i) => {
    gsap.from(el, { y: 120, opacity: 0, duration: 1.4, ease: "power4.out", delay: i * 0.12, scrollTrigger: { trigger: "#duo", start: "top 85%" } });
    gsap.fromTo($(".half-ph img", el), { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
  });

  // 3. Rota: masaüstünde yatay kayan duraklar ve yol boyunca ilerleyen balon.
  mm.add("(min-width: 901px)", () => {
    const track = $("#track"), route = $("#route"), path = $("#routePath"), balloon = $("#routeBalloon"), line = $(".route-line");
    const total = path.getTotalLength();
    const dist = () => track.scrollWidth - innerWidth;
    const moveBalloon = (p) => {
      const pt = path.getPointAtLength(p * total);
      const w = line.clientWidth;
      balloon.style.transform = `translate(${(pt.x / 1000) * w - 17}px, ${pt.y - 6}px) rotate(${Math.sin(p * 40) * 6}deg)`;
    };
    moveBalloon(0);
    const tween = gsap.to(track, {
      x: () => -dist(), ease: "none",
      scrollTrigger: { trigger: route, start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 1, invalidateOnRefresh: true, onUpdate: (s) => moveBalloon(s.progress) },
    });
    $$(".stop", track).forEach((stop) => {
      ScrollTrigger.create({
        trigger: stop, containerAnimation: tween, start: "left 60%", end: "right 40%",
        onToggle: (s) => { if (s.isActive) route.style.backgroundColor = `color-mix(in srgb, ${stop.dataset.color} 16%, #f7efe6)`; },
      });
      gsap.from($(".frame", stop), { yPercent: 12, rotate: 4, opacity: 0.2, ease: "none", scrollTrigger: { trigger: stop, containerAnimation: tween, start: "left right", end: "left 45%", scrub: true } });
    });
  });
  mm.add("(max-width: 900px)", () => {
    $$(".stop").forEach((stop) => gsap.from(stop, { y: 80, opacity: 0, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: stop, start: "top 85%" } }));
  });

  // 3b. Atölye ve 5b. AI ekibi: kartlar sırayla süzülür.
  // Atölye sahneleri: öndeki geri çekilip kararır, sıradaki çerçeveli karttan tam ekrana açılır.
  const slides = $$(".ws-slide");
  slides.forEach((sl, i) => {
    const inn = $(".ws-in", sl), next = slides[i + 1];
    gsap.fromTo($(".ws-copy", sl).children, { y: 50, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.07, ease: "power3.out", duration: 1,
      scrollTrigger: { trigger: sl, start: "top 55%", toggleActions: "play none none reverse" } });
    if (!next) return;
    gsap.to(inn, { scale: 0.88, borderRadius: 28, ease: "none", scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true } });
    gsap.to($(".ws-dim", sl), { opacity: 0.75, ease: "none", scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true } });
  });
  mm.add("(min-width: 901px)", () => {
    slides.slice(1).forEach((sl) => {
      gsap.fromTo($(".ws-in", sl), { clipPath: "inset(9% 9% 0% 9% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none",
        scrollTrigger: { trigger: sl, start: "top bottom", end: "top top", scrub: true } });
      gsap.fromTo($(".ws-bg img", sl), { scale: 1.18 }, { scale: 1, ease: "none", scrollTrigger: { trigger: sl, start: "top bottom", end: "top top", scrub: true } });
    });
  });
  gsap.from(".crew-flow li", { y: 60, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.09, scrollTrigger: { trigger: ".crew-flow", start: "top 82%" } });
  gsap.from(".crew-facts li", { y: 40, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.08, scrollTrigger: { trigger: ".crew-facts", start: "top 88%" } });

  // 4. Stüdyo: sonsuz film şeridi, kaydırma hızıyla hızlanır.
  const m1 = gsap.to("#m1", { xPercent: -50, ease: "none", duration: 40, repeat: -1 });
  const m2 = gsap.fromTo("#m2", { xPercent: -50 }, { xPercent: 0, ease: "none", duration: 46, repeat: -1 });
  ScrollTrigger.create({
    trigger: ".studio", start: "top bottom", end: "bottom top",
    onUpdate: (s) => {
      const boost = 1 + Math.min(6, Math.abs(s.getVelocity()) / 300);
      gsap.to([m1, m2], { timeScale: boost, duration: 0.2, overwrite: true, onComplete: () => gsap.to([m1, m2], { timeScale: 1, duration: 1.2 }) });
    },
  });
  gsap.fromTo(".phone", { rotate: -9 }, { rotate: 3, ease: "none", scrollTrigger: { trigger: ".studio", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.from(".studio-head .h2", { y: 120, opacity: 0, duration: 1.3, ease: "power4.out", scrollTrigger: { trigger: ".studio", start: "top 70%" } });

  // 5. Motor: sayaçlar ve canlı kayıt.
  ScrollTrigger.create({
    trigger: ".engine", start: "top 65%", once: true,
    onEnter: () => {
      startLog();
      $$(".stat b").forEach((b) => {
        const o = { v: 0 };
        gsap.to(o, { v: +b.dataset.n, duration: 2.2, ease: "power3.out", onUpdate: () => (b.textContent = Math.round(o.v).toLocaleString("en") + (b.dataset.s || "")) });
      });
    },
  });
  gsap.from(".console", { y: 100, rotateX: 18, opacity: 0, transformPerspective: 1200, duration: 1.4, ease: "power3.out", scrollTrigger: { trigger: ".engine", start: "top 60%" } });


  // 7. Son: dev başlık aşağıdan gelir.
  gsap.from(".mega", { y: 120, opacity: 0, duration: 1.4, ease: "power4.out", scrollTrigger: { trigger: ".contact", start: "top 70%" } });
}

// ---------------- Yükleme ve giriş ----------------
function intro() {
  const loader = $("#loader"), num = $("#ldN"), fill = $("#ldFill"), vid = $("#heroVid");
  // Giriş: kelebeğin SD logosuna dönüştüğü kendi AI videomuz (telefona 720p, 1,2 MB).
  // Büyük ekrana 1920'lik keskin sürüm (7,8 MB), orta ekrana 1280, telefona 720.
  const px = innerWidth * Math.min(2, devicePixelRatio || 1);
  vid.src = innerWidth < 700 ? "assets/film/sd-sm.mp4" : px >= 1700 ? "assets/film/sd-hd.mp4" : "assets/film/sd.mp4";
  let ready = false;
  vid.addEventListener("canplaythrough", () => (ready = true), { once: true });
  setTimeout(() => (ready = true), 3500);
  vid.load();
  new IntersectionObserver(([en]) => { if (!document.querySelector("#loader")) en.isIntersecting ? vid.play().catch(() => {}) : vid.pause(); }).observe(vid);

  if (!hasGsap) {
    loader.remove();
    document.body.classList.remove("loading");
    vid.play().catch(() => {});
    return;
  }
  const state = { p: 0 };
  const start = performance.now();
  let last = start, done = false;
  // Zamana bağlı ilerler: yavaş cihazda da takılmaz, en geç 5 saniyede açılır.
  const tick = () => {
    const now = performance.now(), dt = Math.min(0.5, (now - last) / 1000), elapsed = now - start;
    last = now;
    const target = ready && elapsed > 900 ? 100 : Math.min(88, elapsed / 30);
    state.p += (target - state.p) * Math.min(1, dt * 7);
    const p = elapsed > 5000 ? 100 : Math.min(100, Math.round(state.p + 0.4));
    num.textContent = p;
    fill.style.clipPath = `inset(${100 - p}% 0 0 0)`;
    if (p >= 100) return reveal();
    setTimeout(tick, 16);
  };
  const reveal = () => {
    if (done) return;
    done = true;
    vid.play().catch(() => {});
    const tl = gsap.timeline({ onComplete: () => { loader.remove(); document.body.classList.remove("loading"); ScrollTrigger.refresh(); } });
    tl.to(".ld-mark", { scale: 1.12, opacity: 0, duration: 0.8, ease: "power3.in" })
      .to(".ld-n, .ld-t", { opacity: 0, duration: 0.4 }, 0)
      .to(loader, { yPercent: -100, duration: 1.1, ease: "power4.inOut" }, 0.5)
      .from(".hero-media", { scale: 1.25, duration: 2.2, ease: "power3.out" }, 0.6)
      .from(".hero-title .w", { yPercent: 115, rotate: 4, duration: 1.4, ease: "power4.out", stagger: 0.09 }, 0.95)
      .from(".hero .eyebrow, .hero-sub, .cue", { y: 24, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.1 }, 1.3)
      .from(".hd", { y: -30, opacity: 0, duration: 1, ease: "power3.out" }, 1.4);
  };
  tick();
}

// ---------------- Başlangıç ----------------
// Bir görsel yüklenemezse bir kez daha dene (yavaş bağlantı / sunucu takılması).
document.addEventListener("error", (e) => {
  const img = e.target;
  if (img.tagName !== "IMG" || img.dataset.retry) return;
  img.dataset.retry = "1";
  setTimeout(() => { img.src = img.src.split("?")[0] + "?r=" + Date.now(); }, 600);
}, true);
document.body.classList.add("loading");
buildDuo();
buildTrack();
buildLab();
buildMarquee();
buildReels();
buildAccounts();
applyLang();
initCursor();
initTilt();
lazyVideos();
if (hasGsap) scenes();
else { startLog(); $$(".stat b").forEach((b) => (b.textContent = (+b.dataset.n).toLocaleString("en") + (b.dataset.s || ""))); }
intro();

$("#lang").addEventListener("click", () => { lang = lang === "tr" ? "en" : "tr"; store.set("om-lang", JSON.stringify(lang)); applyLang(); audio.blip(1200, 0.06, 0.05); });
$("#snd").addEventListener("click", () => audio.toggle());
$("#copyMail").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(CONTACT.email); } catch (_) {}
  const t = $("#toast");
  t.textContent = lang === "tr" ? "Mail adresi kopyalandı ✓" : "Email copied ✓";
  t.classList.add("on");
  audio.blip(1400, 0.08, 0.06);
  setTimeout(() => t.classList.remove("on"), 2200);
});
$$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
  const id = a.getAttribute("href");
  const target = id === "#top" ? 0 : $(id);
  if (target === null) return;
  e.preventDefault();
  if (lenis) lenis.scrollTo(target, { duration: 1.8 });
  else (target === 0 ? scrollTo({ top: 0, behavior: "smooth" }) : target.scrollIntoView({ behavior: "smooth" }));
}));
