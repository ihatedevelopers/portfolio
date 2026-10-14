// Ömer & Müge OS: masaüstü, pencere yöneticisi, dock, menü, arama, bildirimler, kedi.
import { sfx, unlock, isMuted, setMuted } from "./sfx.js";
import { ICONS, LOGO } from "./icons.js";
import { wallpaper, autoMode, MODES } from "./wall.js";
import { APPS } from "./apps.js";
import { PROJECTS } from "./content.js";

const $ = (s, r = document) => r.querySelector(s);
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (_) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) {} },
};
export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const T = {
  en: {
    about: "About this computer", quick: "Quick view (no games)", restart: "Restart", go: "Go", view: "View", help: "Help",
    wallpaper: "Wallpaper", auto: "Auto (follows your clock)", dawn: "Sunrise", day: "Day", sunset: "Sunset", night: "Night",
    arrange: "Clean up icons", search: "Search apps and projects…", shortcuts: "Keyboard shortcuts", open: "Open", finder: "Desktop",
    sticky: `Hi! 👋 This website is a tiny <b>computer</b>.<br><b>Double-click</b> anything, drag the windows, pet the cat.<small>psst… try <b>Ctrl + K</b> &nbsp;♥ Ömer & Müge</small>`,
    stickyTouch: `Hi! 👋 This website is a tiny <b>computer</b>. Tap anything!<small>♥ Ömer & Müge</small>`,
    welcomeT: "Welcome to Ömer & Müge OS", welcomeS: "Everything here is clickable. Start with the Projects folder.",
    hireT: "New message from Ömer & Müge", hireS: "We're looking for a 6-month Erasmus+ traineeship from Feb 2027. Open the boarding pass ✈️",
    popT: "Secret found! 🎈", popS: "You like popping balloons? Play Balloon Pop.",
    hello: "Good morning", hello2: "Good afternoon", hello3: "Good evening",
    phoneSub: "Web · Automation · Creative studio", phoneSub2: "Our portfolio is a phone today. Tap an app.",
    copied: "Copied!",
  },
  tr: {
    about: "Bu bilgisayar hakkında", quick: "Hızlı bakış (oyunsuz)", restart: "Yeniden başlat", go: "Git", view: "Görünüm", help: "Yardım",
    wallpaper: "Duvar kağıdı", auto: "Otomatik (saatine göre)", dawn: "Gün doğumu", day: "Gündüz", sunset: "Gün batımı", night: "Gece",
    arrange: "İkonları düzenle", search: "Uygulama ve proje ara…", shortcuts: "Klavye kısayolları", open: "Aç", finder: "Masaüstü",
    sticky: `Selam! 👋 Bu site minik bir <b>bilgisayar</b>.<br>Her şeye <b>çift tıkla</b>, pencereleri sürükle, kediyi sev.<small>psst… <b>Ctrl + K</b> dene &nbsp;♥ Ömer & Müge</small>`,
    stickyTouch: `Selam! 👋 Bu site minik bir <b>bilgisayar</b>. Her şeye dokun!<small>♥ Ömer & Müge</small>`,
    welcomeT: "Ömer & Müge OS'a hoş geldin", welcomeS: "Burada her şey tıklanabilir. Projeler klasörüyle başla.",
    hireT: "Ömer & Müge'den yeni mesaj", hireS: "Şubat 2027'den itibaren 6 aylık Erasmus+ stajı arıyoruz. Biniş kartını aç ✈️",
    popT: "Sır bulundu! 🎈", popS: "Balon patlatmayı sevdin mi? Balloon Pop'u oyna.",
    hello: "Günaydın", hello2: "İyi günler", hello3: "İyi akşamlar",
    phoneSub: "Web · Otomasyon · Kreatif stüdyo", phoneSub2: "Portfolyomuz bugün bir telefon. Bir uygulamaya dokun.",
    copied: "Kopyalandı!",
  },
};

const DESK = ["projects", "studio", "reel", "erasmus", "omer", "muge", "mail", "terminal", "paint", "game", "quick"];
const DOCK = ["projects", "studio", "reel", "erasmus", "mail", "terminal", "paint", "game"];
const PHONE = ["projects", "studio", "reel", "erasmus", "omer", "muge", "terminal", "paint", "game", "quick", "trash"];
const PHONE_DOCK = ["projects", "mail", "erasmus", "studio"];

const phoneMQ = matchMedia("(max-width: 720px)");
const isPhone = () => phoneMQ.matches;
const isTouch = matchMedia("(pointer: coarse)").matches;

// ---------------- Paylaşılan durum ----------------
export const os = {
  lang: store.get("om-lang", (navigator.language || "en").toLowerCase().startsWith("tr") ? "tr" : "en"),
  t(key) { return T[this.lang][key] ?? T.en[key] ?? key; },
  tx(obj) { return obj?.[this.lang] ?? obj?.en ?? ""; },
  open: (...a) => openApp(...a),
  close: (key) => { const w = wins.get(key); if (w) closeWin(w); },
  toast: (...a) => toast(...a),
  setLang: (l) => setLang(l),
  setWall: (m) => setWall(m),
  sfx, isPhone, isTouch, store, esc,
};

// ---------------- Duvar kağıdı ----------------
let wallMode = store.get("om-wall", "auto");
let pops = 0;
function setWall(mode) {
  wallMode = MODES.includes(mode) ? mode : "auto";
  store.set("om-wall", wallMode);
  const real = wallMode === "auto" ? autoMode() : wallMode;
  $("#wall").innerHTML = wallpaper(real);
  document.documentElement.dataset.theme = real === "night" ? "dark" : "light";
  document.querySelector('meta[name="theme-color"]').content = real === "night" ? "#1d1830" : "#fff3ea";
}

$("#wall").addEventListener("click", (e) => {
  const b = e.target.closest(".balloon");
  if (!b || b.classList.contains("popped")) return;
  b.classList.add("popped");
  sfx.pop();
  setTimeout(() => b.classList.remove("popped"), 7000);
  if (++pops === 3) toast({ icon: "game", title: os.t("popT"), text: os.t("popS"), onClick: () => openApp("game") });
});

// Fareyle hafif derinlik (paralaks).
let parRaf = 0;
addEventListener("pointermove", (e) => {
  if (isTouch || parRaf) return;
  parRaf = requestAnimationFrame(() => {
    parRaf = 0;
    const dx = e.clientX / innerWidth - 0.5, dy = e.clientY / innerHeight - 0.5;
    document.querySelectorAll("#wall .layer").forEach((g) => {
      const d = +g.dataset.depth;
      g.style.transform = `translate(${(-dx * d * 1.4).toFixed(1)}px, ${(-dy * d * 0.6).toFixed(1)}px)`;
    });
  });
});

// ---------------- Pencere yöneticisi ----------------
const wins = new Map();
let z = 10;
let cascade = 0;

function deskRect() { return $("#desktop").getBoundingClientRect(); }

function openApp(id, args = {}, fromEl = null) {
  const app = APPS[id];
  if (!app) return;
  unlock();
  const key = app.multi ? `${id}:${args.key ?? ""}` : id;
  const existing = wins.get(key);
  if (existing) {
    if (existing.min) restoreWin(existing);
    if (app.update) app.update(existing, args, os);
    focusWin(existing);
    return existing;
  }
  sfx.open();

  const el = document.createElement("section");
  el.className = "win";
  el.setAttribute("role", "dialog");
  const color = (typeof app.color === "function" ? app.color(args) : app.color) || "#ff8fb3";
  el.style.setProperty("--tb", color);
  el.innerHTML = `
    <div class="titlebar">
      <div class="lights"><button class="x" aria-label="Close">×</button><button class="m" aria-label="Minimize">–</button><button class="f" aria-label="Zoom">+</button></div>
      <button class="back" aria-label="Back">‹</button>
      <div class="ttl"></div>
    </div>
    <div class="win-body"></div>
    <div class="grip"></div>`;
  $("#windows").appendChild(el);

  const d = deskRect();
  const w = Math.min(app.w || 720, d.width - 30);
  const h = Math.min(app.h || 480, d.height - 110);
  let x = Math.max(10, (d.width - w) / 2 + (cascade % 6) * 28 - 60);
  let y = Math.max(8, (d.height - 96 - h) / 2 + (cascade % 6) * 24 - 30);
  cascade++;
  Object.assign(el.style, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px` });

  const win = { key, id, app, el, args, body: $(".win-body", el), min: false, max: false, cleanups: [] };
  win.onClose = (fn) => win.cleanups.push(fn);
  win.setTitle = (t) => { $(".ttl", el).textContent = t; };
  wins.set(key, win);
  renderWin(win);
  wireWin(win);
  focusWin(win);

  // Açılış animasyonu: tıklanan ikondan büyüyerek gelir.
  if (!isPhone()) {
    const r = el.getBoundingClientRect();
    let origin = "50% 50%";
    if (fromEl) {
      const f = fromEl.getBoundingClientRect();
      origin = `${f.left + f.width / 2 - r.left}px ${f.top + f.height / 2 - r.top}px`;
    }
    el.style.transformOrigin = origin;
    el.animate([{ transform: "scale(.15)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }], { duration: 280, easing: "cubic-bezier(.2,.9,.25,1.12)" });
  } else {
    el.animate([{ transform: "translateY(30px) scale(.96)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 240, easing: "cubic-bezier(.2,.9,.3,1)" });
  }
  updateChrome();
  return win;
}

function renderWin(win) {
  win.cleanups.splice(0).forEach((fn) => { try { fn(); } catch (_) {} });
  win.body.innerHTML = "";
  const title = win.app.title(win.args, os);
  win.setTitle(title);
  win.app.render(win.body, win, os);
}

function wireWin(win) {
  const { el } = win;
  const bar = $(".titlebar", el);
  el.addEventListener("pointerdown", () => focusWin(win), true);
  $(".x", el).onclick = () => closeWin(win);
  $(".back", el).onclick = () => closeWin(win);
  $(".m", el).onclick = () => minimizeWin(win);
  $(".f", el).onclick = () => toggleMax(win);
  bar.addEventListener("dblclick", (e) => { if (!e.target.closest("button")) toggleMax(win); });

  // Sürükleme
  bar.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button") || isPhone() || e.button !== 0) return;
    if (win.max) return;
    const sx = e.clientX, sy = e.clientY, ox = el.offsetLeft, oy = el.offsetTop;
    const d = deskRect();
    bar.setPointerCapture(e.pointerId);
    const move = (ev) => {
      const nx = Math.min(Math.max(ox + ev.clientX - sx, 60 - el.offsetWidth), d.width - 60);
      const ny = Math.min(Math.max(oy + ev.clientY - sy, 0), d.height - 40);
      el.style.left = `${nx}px`;
      el.style.top = `${ny}px`;
    };
    const up = () => { bar.removeEventListener("pointermove", move); bar.removeEventListener("pointerup", up); };
    bar.addEventListener("pointermove", move);
    bar.addEventListener("pointerup", up);
  });

  // Boyutlandırma
  const grip = $(".grip", el);
  grip.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    const sx = e.clientX, sy = e.clientY, ow = el.offsetWidth, oh = el.offsetHeight;
    grip.setPointerCapture(e.pointerId);
    const move = (ev) => {
      el.style.width = `${Math.max(300, ow + ev.clientX - sx)}px`;
      el.style.height = `${Math.max(200, oh + ev.clientY - sy)}px`;
    };
    const up = () => { grip.removeEventListener("pointermove", move); grip.removeEventListener("pointerup", up); };
    grip.addEventListener("pointermove", move);
    grip.addEventListener("pointerup", up);
  });
}

function focusWin(win) {
  if (!win || win.min) return;
  wins.forEach((w) => w.el.classList.toggle("focused", w === win));
  if (+win.el.style.zIndex !== z) win.el.style.zIndex = ++z;
  focused = win;
  updateChrome();
}
let focused = null;

function topWin() {
  let best = null;
  wins.forEach((w) => { if (!w.min && (!best || +w.el.style.zIndex > +best.el.style.zIndex)) best = w; });
  return best;
}

function closeWin(win) {
  sfx.close();
  win.cleanups.splice(0).forEach((fn) => { try { fn(); } catch (_) {} });
  wins.delete(win.key);
  const a = win.el.animate([{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(.94)" }], { duration: 150, easing: "ease-in" });
  a.onfinish = () => win.el.remove();
  if (focused === win) focused = null;
  const next = topWin();
  if (next) focusWin(next); else updateChrome();
}

function dockTarget(win) {
  return $(`.dock-item[data-app="${win.id}"]`) || $(".dock .dock-item:last-child");
}

function minimizeWin(win) {
  if (isPhone()) return closeWin(win);
  sfx.minimize();
  win.min = true;
  const r = win.el.getBoundingClientRect();
  const t = dockTarget(win).getBoundingClientRect();
  const dx = t.left + t.width / 2 - (r.left + r.width / 2);
  const dy = t.top + t.height / 2 - (r.top + r.height / 2);
  win.el.style.transformOrigin = "50% 50%";
  const a = win.el.animate([{ transform: "none", opacity: 1 }, { transform: `translate(${dx}px, ${dy}px) scale(.08)`, opacity: 0.2 }], { duration: 320, easing: "cubic-bezier(.5,0,.75,0)" });
  a.onfinish = () => { win.el.style.display = "none"; };
  win.el.classList.remove("focused");
  focused = null;
  const next = topWin();
  if (next) focusWin(next); else updateChrome();
}

function restoreWin(win) {
  win.min = false;
  win.el.style.display = "";
  win.el.animate([{ transform: "translateY(60px) scale(.3)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 260, easing: "cubic-bezier(.2,.9,.3,1.1)" });
}

function toggleMax(win) {
  if (isPhone()) return;
  const el = win.el;
  const from = el.getBoundingClientRect();
  if (!win.max) {
    win.prev = { left: el.style.left, top: el.style.top, width: el.style.width, height: el.style.height };
    const d = deskRect();
    Object.assign(el.style, { left: "0px", top: "0px", width: `${d.width}px`, height: `${d.height - 98}px` });
  } else {
    Object.assign(el.style, win.prev);
  }
  win.max = !win.max;
  el.classList.toggle("max", win.max);
  const to = el.getBoundingClientRect();
  el.style.transformOrigin = "0 0";
  el.animate([
    { transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})` },
    { transform: "none" },
  ], { duration: 240, easing: "cubic-bezier(.2,.8,.2,1)" });
}

// ---------------- Masaüstü ikonları ----------------
let iconPos = store.get("om-icons", null) || {};
function defaultPos(i, d) {
  const per = Math.max(3, Math.floor((d.height - 110) / 104));
  return { x: 14 + Math.floor(i / per) * 104, y: 12 + (i % per) * 104 };
}

function renderIcons() {
  const box = $("#icons");
  const d = deskRect();
  box.innerHTML = "";
  const all = [...DESK, "trash"];
  all.forEach((id, i) => {
    const app = APPS[id];
    const b = document.createElement("button");
    b.className = "icon";
    b.dataset.app = id;
    b.innerHTML = `${ICONS[app.icon || id]}<span>${esc(app.label(os))}</span>`;
    let p = iconPos[id];
    if (!p) p = id === "trash" ? { x: d.width - 112, y: d.height - 200 } : defaultPos(i, d);
    p = { x: Math.min(Math.max(0, p.x), d.width - 96), y: Math.min(Math.max(0, p.y), d.height - 190) };
    b.style.left = `${p.x}px`;
    b.style.top = `${p.y}px`;
    wireIcon(b, id);
    box.appendChild(b);
  });
  renderSticky();
}

function wireIcon(b, id) {
  b.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    unlock();
    document.querySelectorAll(".icon.sel").forEach((n) => n !== b && n.classList.remove("sel"));
    b.classList.add("sel");
    const sx = e.clientX, sy = e.clientY, ox = b.offsetLeft, oy = b.offsetTop;
    let moved = false;
    b.setPointerCapture(e.pointerId);
    const move = (ev) => {
      if (!moved && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 5) return;
      moved = true;
      b.classList.add("dragging");
      b.style.left = `${ox + ev.clientX - sx}px`;
      b.style.top = `${oy + ev.clientY - sy}px`;
    };
    const up = () => {
      b.removeEventListener("pointermove", move);
      b.removeEventListener("pointerup", up);
      b.classList.remove("dragging");
      if (moved) {
        iconPos[id] = { x: b.offsetLeft, y: b.offsetTop };
        store.set("om-icons", iconPos);
      } else if (e.pointerType !== "mouse") {
        openApp(id, {}, b);
      } else {
        sfx.click();
      }
    };
    b.addEventListener("pointermove", move);
    b.addEventListener("pointerup", up);
  });
  b.addEventListener("dblclick", () => openApp(id, {}, b));
  b.addEventListener("keydown", (e) => { if (e.key === "Enter") openApp(id, {}, b); });
}

function renderSticky() {
  const d = deskRect();
  const s = document.createElement("div");
  s.className = "sticky";
  s.innerHTML = isTouch ? os.t("stickyTouch") : os.t("sticky");
  const p = store.get("om-sticky", null) || { x: d.width - 300, y: 26 };
  s.style.left = `${Math.min(Math.max(0, p.x), d.width - 240)}px`;
  s.style.top = `${Math.min(Math.max(0, p.y), d.height - 220)}px`;
  s.addEventListener("pointerdown", (e) => {
    const sx = e.clientX, sy = e.clientY, ox = s.offsetLeft, oy = s.offsetTop;
    s.setPointerCapture(e.pointerId);
    const move = (ev) => { s.style.left = `${ox + ev.clientX - sx}px`; s.style.top = `${oy + ev.clientY - sy}px`; };
    const up = () => { s.removeEventListener("pointermove", move); s.removeEventListener("pointerup", up); store.set("om-sticky", { x: s.offsetLeft, y: s.offsetTop }); };
    s.addEventListener("pointermove", move);
    s.addEventListener("pointerup", up);
  });
  $("#icons").appendChild(s);
}

// ---------------- Kedi ----------------
const cat = {
  el: document.createElement("div"),
  x: 140, target: 400, dir: 1, sitUntil: 0, last: 0,
  init() {
    this.el.className = "cat walk";
    this.el.title = "Meow";
    this.el.innerHTML = `<svg viewBox="0 0 70 52" aria-hidden="true">
      <path class="tail" d="M10 30 C 0 26, 2 10, 10 8" stroke="#2b2340" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path class="tail" d="M10 30 C 0 26, 2 10, 10 8" stroke="#ffb38a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <rect class="leg" x="16" y="34" width="6" height="14" rx="3" fill="#ffb38a" stroke="#2b2340" stroke-width="2.2"/>
      <rect class="leg b" x="26" y="34" width="6" height="14" rx="3" fill="#ffb38a" stroke="#2b2340" stroke-width="2.2"/>
      <rect class="leg b" x="40" y="34" width="6" height="14" rx="3" fill="#ffb38a" stroke="#2b2340" stroke-width="2.2"/>
      <rect class="leg" x="50" y="34" width="6" height="14" rx="3" fill="#ffb38a" stroke="#2b2340" stroke-width="2.2"/>
      <rect x="10" y="20" width="44" height="22" rx="11" fill="#ffb38a" stroke="#2b2340" stroke-width="2.5"/>
      <path d="M22 22 v8 M30 21 v8" stroke="#e8875a" stroke-width="3" stroke-linecap="round"/>
      <path d="M44 14 L 46 2 L 53 10 L 60 2 L 62 14 Z" fill="#ffb38a" stroke="#2b2340" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="53" cy="20" r="11" fill="#ffb38a" stroke="#2b2340" stroke-width="2.5"/>
      <circle cx="49" cy="19" r="1.8" fill="#2b2340"/><circle cx="57.5" cy="19" r="1.8" fill="#2b2340"/>
      <path d="M51 24 q2 2 4 0" stroke="#2b2340" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <circle cx="47" cy="23" r="2" fill="#ff8fb3" opacity=".7"/><circle cx="60" cy="23" r="2" fill="#ff8fb3" opacity=".7"/>
    </svg>`;
    this.el.addEventListener("pointerdown", (e) => {
      e.stopPropagation();
      unlock();
      sfx.meow();
      const h = document.createElement("span");
      h.className = "heart";
      h.textContent = "♥";
      h.style.color = "#ff6b8b";
      this.el.appendChild(h);
      setTimeout(() => h.remove(), 1000);
      this.sitUntil = performance.now() + 2500;
      this.el.classList.remove("walk");
      this.el.animate([{ translate: "0 0" }, { translate: "0 -22px" }, { translate: "0 0" }], { duration: 380, easing: "ease-out" });
    });
    requestAnimationFrame((t) => this.tick(t));
  },
  tick(t) {
    const dt = Math.min(0.05, (t - (this.last || t)) / 1000);
    this.last = t;
    const W = innerWidth;
    if (t < this.sitUntil) {
      this.el.classList.remove("walk");
    } else {
      if (Math.abs(this.target - this.x) < 4) {
        this.sitUntil = t + 1800 + Math.random() * 4000;
        this.target = 40 + Math.random() * (W - 140);
      } else {
        this.dir = this.target > this.x ? 1 : -1;
        this.x += this.dir * 46 * dt;
        this.el.classList.add("walk");
        this.el.classList.toggle("left", this.dir < 0);
      }
    }
    this.el.style.transform = `translateX(${this.x.toFixed(1)}px)`;
    requestAnimationFrame((n) => this.tick(n));
  },
};

// ---------------- Dock ----------------
function renderDock() {
  const dock = $("#dock");
  dock.innerHTML = "";
  const add = (id) => {
    const app = APPS[id];
    const b = document.createElement("button");
    b.className = "dock-item";
    b.dataset.app = id;
    b.setAttribute("aria-label", app.label(os));
    b.innerHTML = `${ICONS[app.icon || id]}<span class="tip">${esc(app.label(os))}</span>`;
    b.onclick = () => {
      const w = [...wins.values()].find((x) => x.id === id);
      if (w) { if (w.min) restoreWin(w); focusWin(w); sfx.click(); }
      else { b.classList.remove("bounce"); void b.offsetWidth; b.classList.add("bounce"); openApp(id, {}, b); }
    };
    dock.appendChild(b);
  };
  DOCK.forEach(add);
  const sep = document.createElement("div");
  sep.className = "dock-sep";
  dock.appendChild(sep);
  add("trash");
  updateChrome();
}

const dockEl = $("#dock");
dockEl.addEventListener("pointermove", (e) => {
  if (e.pointerType !== "mouse") return;
  dockEl.querySelectorAll(".dock-item").forEach((it) => {
    const r = it.getBoundingClientRect();
    const dist = Math.abs(e.clientX - (r.left + r.width / 2));
    const s = 1 + 0.5 * Math.max(0, 1 - dist / 130);
    it.style.width = it.style.height = `${(54 * s).toFixed(1)}px`;
  });
});
dockEl.addEventListener("pointerleave", () => dockEl.querySelectorAll(".dock-item").forEach((it) => { it.style.width = it.style.height = ""; }));

// ---------------- Menü çubuğu ----------------
function clockText(withDate) {
  const d = new Date();
  const loc = os.lang === "tr" ? "tr-TR" : "en-GB";
  const time = d.toLocaleTimeString(loc, { hour: "2-digit", minute: "2-digit" });
  if (!withDate) return time;
  return `${d.toLocaleDateString(loc, { weekday: "short", day: "numeric", month: "short" })}  ${time}`;
}

function renderMenubar() {
  const mb = $("#menubar");
  const appName = focused ? focused.app.label(os) : os.t("finder");
  mb.innerHTML = `
    <button class="mb-btn mb-logo" data-menu="logo" aria-label="Menu">${LOGO}</button>
    <button class="mb-btn mb-app" data-menu="logo">${esc(appName)}</button>
    <button class="mb-btn" data-menu="go">${os.t("go")}</button>
    <button class="mb-btn" data-menu="view">${os.t("view")}</button>
    <button class="mb-btn" data-menu="help">${os.t("help")}</button>
    <span class="mb-spacer"></span>
    <div class="mb-right">
      <button class="mb-btn" id="mbSearch" aria-label="Search"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.6-4.6"/></svg></button>
      <button class="mb-btn" id="mbLang"><span class="mb-lang">${os.lang === "tr" ? "TR" : "EN"}</span></button>
      <button class="mb-btn" id="mbSound" aria-label="Sound">${isMuted() ? "🔇" : "🔊"}</button>
      <span class="mb-btn mb-clock" id="mbClock">${clockText(innerWidth > 900)}</span>
    </div>`;
  mb.querySelectorAll("[data-menu]").forEach((b) => b.addEventListener("click", (e) => { e.stopPropagation(); showMenu(b.dataset.menu, b); }));
  $("#mbSearch").onclick = (e) => { e.stopPropagation(); openSpot(); };
  $("#mbLang").onclick = () => setLang(os.lang === "tr" ? "en" : "tr");
  $("#mbSound").onclick = () => { setMuted(!isMuted()); unlock(); sfx.click(); renderMenubar(); };
}
setInterval(() => {
  const c = $("#mbClock");
  if (c) c.textContent = clockText(innerWidth > 900);
  const pc = $("#phClock");
  if (pc) pc.textContent = clockText(false);
}, 15000);

function updateChrome() {
  renderMenubar();
  document.querySelectorAll(".dock-item").forEach((b) => b.classList.toggle("running", [...wins.values()].some((w) => w.id === b.dataset.app)));
}

// ---------------- Açılır menüler ----------------
const ctx = $("#ctx");
function menuItems(kind) {
  const wallItems = [
    { lbl: os.t("wallpaper") },
    ...["auto", ...MODES].map((m) => ({ text: `${wallMode === m ? "✓ " : "   "}${os.t(m)}`, run: () => setWall(m) })),
  ];
  if (kind === "logo") return [
    { text: os.t("about"), run: () => openApp("about") },
    { text: os.t("quick"), run: () => openApp("quick") },
    "-",
    { text: "English", run: () => setLang("en") },
    { text: "Türkçe", run: () => setLang("tr") },
    "-",
    { text: os.t("restart"), run: restart },
    { text: os.lang === "tr" ? "← Balon yolculuğuna dön" : "← Back to the balloon flight", run: () => { location.href = "./"; } },
  ];
  if (kind === "go") return [
    ...DESK.map((id) => ({ text: APPS[id].label(os), icon: id, run: () => openApp(id) })),
    "-",
    { text: os.t("search"), kbd: "Ctrl K", run: openSpot },
  ];
  if (kind === "view") return [...wallItems, "-", { text: os.t("arrange"), run: () => { iconPos = {}; store.set("om-icons", {}); store.set("om-sticky", null); renderIcons(); } }];
  if (kind === "help") return [
    { text: os.t("shortcuts"), run: () => openApp("shortcuts") },
    { text: os.t("quick"), run: () => openApp("quick") },
  ];
  if (kind === "desk") return [
    { text: APPS.projects.label(os), run: () => openApp("projects") },
    { text: os.t("search"), kbd: "Ctrl K", run: openSpot },
    "-",
    ...wallItems,
    "-",
    { text: os.t("arrange"), run: () => { iconPos = {}; store.set("om-icons", {}); store.set("om-sticky", null); renderIcons(); } },
    { text: os.t("about"), run: () => openApp("about") },
  ];
  return [];
}

function showMenu(kind, anchor, x, y) {
  const items = menuItems(kind);
  ctx.innerHTML = "";
  items.forEach((it) => {
    if (it === "-") { ctx.appendChild(document.createElement("hr")); return; }
    if (it.lbl) { const d = document.createElement("div"); d.className = "lbl"; d.textContent = it.lbl; ctx.appendChild(d); return; }
    const b = document.createElement("button");
    b.innerHTML = `${it.icon ? ICONS[APPS[it.icon].icon || it.icon].replace('class="art"', 'class="art" style="width:20px;height:20px"') : ""}<span style="white-space:pre">${esc(it.text)}</span>${it.kbd ? `<kbd>${it.kbd}</kbd>` : ""}`;
    b.onclick = () => { hideMenu(); sfx.click(); it.run(); };
    ctx.appendChild(b);
  });
  ctx.hidden = false;
  document.querySelectorAll(".mb-btn.open").forEach((n) => n.classList.remove("open"));
  if (anchor) {
    anchor.classList.add("open");
    const r = anchor.getBoundingClientRect();
    x = r.left; y = r.bottom + 4;
  }
  const w = ctx.offsetWidth, h = ctx.offsetHeight;
  ctx.style.left = `${Math.min(x, innerWidth - w - 8)}px`;
  ctx.style.top = `${Math.min(y, innerHeight - h - 8)}px`;
}
function hideMenu() { ctx.hidden = true; document.querySelectorAll(".mb-btn.open").forEach((n) => n.classList.remove("open")); }
addEventListener("pointerdown", (e) => { if (!ctx.hidden && !ctx.contains(e.target) && !e.target.closest("[data-menu]")) hideMenu(); });

$("#os").addEventListener("contextmenu", (e) => {
  if (e.target.closest(".win, .dock, .menubar, .icon")) return;
  e.preventDefault();
  showMenu("desk", null, e.clientX, e.clientY);
});
$("#wall").addEventListener("pointerdown", () => document.querySelectorAll(".icon.sel").forEach((n) => n.classList.remove("sel")));

// ---------------- Arama (Ctrl+K) ----------------
const spot = $("#spot");
function spotItems() {
  const apps = Object.keys(APPS).filter((id) => !APPS[id].hidden).map((id) => ({ icon: APPS[id].icon || id, text: APPS[id].label(os), sub: os.lang === "tr" ? "Uygulama" : "App", run: () => openApp(id) }));
  const projects = PROJECTS.map((p) => ({ icon: "browser", text: p.title, sub: os.tx(p.tag), run: () => (p.gallery ? openApp("studio") : openApp("browser", { key: p.id, id: p.id })) }));
  const cmds = [
    { icon: "terminal", text: os.lang === "tr" ? "Switch to English" : "Türkçe'ye geç", sub: "⌘", run: () => setLang(os.lang === "tr" ? "en" : "tr") },
    ...MODES.map((m) => ({ icon: "paint", text: `${os.t("wallpaper")}: ${os.t(m)}`, sub: "⌘", run: () => setWall(m) })),
  ];
  return [...apps, ...projects, ...cmds];
}
function openSpot() {
  unlock();
  hideMenu();
  spot.hidden = false;
  spot.innerHTML = `<div class="spot-box"><input placeholder="${esc(os.t("search"))}" aria-label="Search"><div class="spot-res"></div></div>`;
  const input = $("input", spot), res = $(".spot-res", spot);
  let list = [], sel = 0;
  const norm = (s) => s.toLocaleLowerCase("tr").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ı/g, "i");
  const draw = () => {
    const q = norm(input.value.trim());
    list = spotItems().filter((it) => !q || norm(`${it.text} ${it.sub}`).includes(q)).slice(0, 9);
    sel = Math.min(sel, Math.max(0, list.length - 1));
    res.innerHTML = list.map((it, i) => `<button class="${i === sel ? "on" : ""}" data-i="${i}">${ICONS[it.icon]}<span>${esc(it.text)}</span><small>${esc(it.sub)}</small></button>`).join("");
  };
  res.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { closeSpot(); list[+b.dataset.i].run(); } });
  input.addEventListener("input", () => { sel = 0; draw(); sfx.key(); });
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { sel = Math.min(list.length - 1, sel + 1); draw(); e.preventDefault(); }
    else if (e.key === "ArrowUp") { sel = Math.max(0, sel - 1); draw(); e.preventDefault(); }
    else if (e.key === "Enter" && list[sel]) { closeSpot(); list[sel].run(); }
    else if (e.key === "Escape") closeSpot();
  });
  draw();
  input.focus();
}
function closeSpot() { spot.hidden = true; spot.innerHTML = ""; }
spot.addEventListener("pointerdown", (e) => { if (e.target === spot) closeSpot(); });

addEventListener("keydown", (e) => {
  const typing = e.target.closest?.("input, textarea, [contenteditable]");
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); spot.hidden ? openSpot() : closeSpot(); return; }
  if (typing) return;
  if (e.key === "/" ) { e.preventDefault(); openSpot(); }
  else if (e.key === "Escape") { if (!ctx.hidden) hideMenu(); else if (focused && !isPhone()) closeWin(focused); }
});

// ---------------- Bildirimler ----------------
function toast({ icon = "mail", title, text, onClick, ms = 7000 }) {
  sfx.notify();
  const t = document.createElement("button");
  t.className = "toast";
  t.innerHTML = `${ICONS[icon]}<div><b>${esc(title)}</b><span>${esc(text)}</span></div>`;
  const kill = () => { t.classList.add("out"); setTimeout(() => t.remove(), 300); };
  t.onclick = () => { kill(); onClick?.(); };
  $("#toasts").appendChild(t);
  setTimeout(kill, ms);
}

// ---------------- Telefon ana ekranı ----------------
function renderPhone() {
  const h = new Date().getHours();
  const hi = h < 12 ? os.t("hello") : h < 18 ? os.t("hello2") : os.t("hello3");
  const app = (id) => `<button class="ph-app" data-app="${id}">${ICONS[APPS[id].icon || id]}<span>${esc(APPS[id].label(os))}</span></button>`;
  $("#phoneHome").innerHTML = `
    <div class="ph-status"><span id="phClock">${clockText(false)}</span><span class="r"><button id="phLang">${os.lang === "tr" ? "EN" : "TR"}</button><button id="phSound">${isMuted() ? "🔇" : "🔊"}</button></span></div>
    <div class="ph-widget"><div class="t">${hi} 👋</div><div class="s">Ömer & Müge · ${esc(os.t("phoneSub"))}</div><div class="s2">${esc(os.t("phoneSub2"))}</div></div>
    <div class="ph-grid">${PHONE.map(app).join("")}</div>
    <div class="ph-dock">${PHONE_DOCK.map(app).join("")}</div>`;
  $("#phoneHome").querySelectorAll(".ph-app").forEach((b) => (b.onclick = () => openApp(b.dataset.app, {}, b)));
  $("#phLang").onclick = () => setLang(os.lang === "tr" ? "en" : "tr");
  $("#phSound").onclick = () => { setMuted(!isMuted()); unlock(); renderPhone(); };
}

// ---------------- Dil, yeniden başlatma ----------------
function setLang(l) {
  os.lang = l;
  store.set("om-lang", l);
  document.documentElement.lang = l;
  renderAll();
  wins.forEach((w) => renderWin(w));
}

function renderAll() {
  renderIcons();
  renderDock();
  renderPhone();
  updateChrome();
}

function restart() {
  wins.forEach((w) => closeWin(w));
  const boot = $("#boot");
  boot.classList.remove("done");
  const bar = $(".boot-bar i", boot);
  bar.style.animation = "none"; void bar.offsetWidth; bar.style.animation = "";
  sfx.chime();
  setTimeout(() => boot.classList.add("done"), 1500);
}

// ---------------- Başlangıç ----------------
// Açılış ekranı ne olursa olsun kalkar (bir hata masaüstünü kilitlemesin).
setTimeout(() => $("#boot").classList.add("done"), 1350);
if (os.lang !== "tr" && os.lang !== "en") os.lang = "en";
try {
  setWall(wallMode);
  document.documentElement.lang = os.lang;
  cat.init();
  $("#desktop").appendChild(cat.el);
  renderAll();
} catch (err) {
  console.error(err);
}
let resizeT;
addEventListener("resize", () => { clearTimeout(resizeT); resizeT = setTimeout(renderAll, 150); });
phoneMQ.addEventListener("change", renderAll);
addEventListener("pointerdown", () => unlock(), { once: true });
if (!isPhone()) setTimeout(() => toast({ icon: "projects", title: os.t("welcomeT"), text: os.t("welcomeS"), onClick: () => openApp("projects") }), 2600);
setTimeout(() => { if (!wins.has("erasmus")) toast({ icon: "erasmus", title: os.t("hireT"), text: os.t("hireS"), onClick: () => openApp("erasmus"), ms: 10000 }); }, 16000);

// Adres çubuğundan doğrudan uygulama açma: ?app=projects
const deep = new URLSearchParams(location.search).get("app");
if (deep && APPS[deep]) setTimeout(() => openApp(deep), 1500);
