// Uygulamalar: her biri bir pencerenin içini çizer. Metinler EN + TR.
import { PROJECTS, GALLERY, PEOPLE, CONTACT } from "./content.js";
import { ICONS, LOGO } from "./icons.js";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const L = (en, tr) => ({ en, tr });
const byId = (id) => PROJECTS.find((p) => p.id === id);
const host = (url) => { try { return new URL(url).host; } catch (_) { return url; } };

const GROUPS = [
  { id: "all", icon: "✦", name: L("All projects", "Tüm projeler"), ids: PROJECTS.map((p) => p.id) },
  { id: "web", icon: "🌐", name: L("Websites", "Web siteleri"), ids: ["taxi", "kardesler", "lotus", "doner", "atikeler", "palace", "forgeone"] },
  { id: "product", icon: "🚀", name: L("Our products", "Ürünlerimiz"), ids: ["pilot", "engine"] },
  { id: "creative", icon: "🎨", name: L("Creative", "Kreatif"), ids: ["studio"] },
];

function openProject(os, p, from) {
  if (p.gallery) os.open("studio", {}, from);
  else os.open("browser", { key: p.id, id: p.id }, from);
}

// ---------------- Projeler ----------------
const projects = {
  color: "#ffc46b", w: 860, h: 560,
  label: (os) => os.tx(L("Projects", "Projeler")),
  title: (a, os) => os.tx(L("Projects", "Projeler")),
  render(body, win, os) {
    let group = "all";
    body.innerHTML = `<div class="finder"><nav class="side"></nav><div class="tiles"></div></div>`;
    const side = body.querySelector(".side"), tiles = body.querySelector(".tiles");
    const draw = () => {
      side.innerHTML = `<small>${os.tx(L("Folders", "Klasörler"))}</small>` + GROUPS.map((g) =>
        `<button data-g="${g.id}" class="${g.id === group ? "on" : ""}"><span>${g.icon}</span>${esc(os.tx(g.name))}</button>`).join("");
      const g = GROUPS.find((x) => x.id === group);
      tiles.innerHTML = g.ids.map(byId).map((p) => `
        <button class="tile" data-id="${p.id}" style="--c:${p.color}">
          <div class="thumb"><img src="${p.shot}" alt="" loading="lazy"></div>
          <b>${p.icon} ${esc(p.title)}</b><i>${esc(os.tx(p.tag))}</i>
        </button>`).join("");
    };
    side.addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; group = b.dataset.g; os.sfx.click(); draw(); });
    tiles.addEventListener("click", (e) => { const b = e.target.closest(".tile"); if (b) openProject(os, byId(b.dataset.id), b); });
    tiles.addEventListener("pointerover", (e) => { if (e.target.closest(".tile") && e.pointerType === "mouse") os.sfx.hover(); });
    draw();
  },
};

// ---------------- Proje tarayıcısı ----------------
const LOGS = [
  ["dim", "› scanning 9 inboxes…"],
  ["ok", "✓ reply from hotel in Tyrol · classified: positive (de)"],
  ["", "› drafting answer in German…"],
  ["dim", "› bounce detected · address cleaned"],
  ["hot", "★ offer received · Algarve guesthouse · flagged for Ömer"],
  ["ok", "✓ 42 personalised applications sent today"],
  ["", "› reading reply in Italian · auto-reply ignored"],
  ["ok", "✓ site audit: 3 SEO quick wins found for agriturismo"],
  ["dim", "› next send window: 09:00 local time"],
  ["hot", "★ interview request · Greece · reply drafted"],
  ["ok", "✓ reply classified: negative (fr) · thank-you + collab offer drafted"],
  ["", "› queue: 22,217 tourism businesses across Europe"],
];

function counter(el, to, suffix = "") {
  const start = performance.now(), dur = 1400;
  const step = (t) => {
    const k = Math.min(1, (t - start) / dur);
    el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))).toLocaleString("en") + suffix;
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const browser = {
  icon: "browser", multi: true, hidden: true, w: 980, h: 600,
  color: (a) => byId(a.id)?.color,
  label: (os) => os.tx(L("Browser", "Tarayıcı")),
  title: (a) => byId(a.id)?.title || "Browser",
  render(body, win, os) {
    const p = byId(win.args.id);
    const live = p.url;
    const mailSubject = os.tx(L(`A website like ${p.title}`, `${p.title} gibi bir site`));
    let extra = "";
    if (p.id === "engine") {
      extra = `
        <div class="stats">
          <div class="stat"><b data-n="50000" data-s="+">0</b><span>${os.tx(L("emails handled", "mail yönetildi"))}</span></div>
          <div class="stat"><b data-n="9">0</b><span>${os.tx(L("mailboxes", "hesap"))}</span></div>
          <div class="stat"><b data-n="12">0</b><span>${os.tx(L("languages read", "dil okunuyor"))}</span></div>
          <div class="stat"><b data-n="22217">0</b><span>${os.tx(L("businesses in queue", "sıradaki işletme"))}</span></div>
        </div>
        <div class="livelog" aria-label="Live log"></div>`;
    }
    body.innerHTML = `
      <div class="browser" style="--c:${p.color}">
        <div class="addr">
          <span class="url">🔒 <span>${live ? esc(host(live)) : "localhost:8766 · outreach-engine"}</span> <em>${live ? "" : os.tx(L("· private", "· özel"))}</em></span>
          ${live ? `<a class="btn" href="${live}" target="_blank" rel="noopener">${os.tx(L("Open live ↗", "Canlı aç ↗"))}</a>` : ""}
        </div>
        <div class="page">
          <div class="device"><div class="dbar"><i></i><i></i><i></i></div><img src="${p.shot}" alt="${esc(p.title)}"></div>
          <div class="info">
            <span class="tag">${p.icon} ${esc(os.tx(p.tag))}</span>
            <h1 class="h1">${esc(p.title)}</h1>
            <p>${esc(os.tx(p.text))}</p>
            <ul class="chips">${p.stack.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
            ${extra}
            <div class="row" style="margin-top:14px">
              ${live ? `<a class="btn mint" href="${live}" target="_blank" rel="noopener">${os.tx(L("Visit the live site", "Canlı siteye git"))} ↗</a>` : `<span class="lead" style="margin:0">${os.tx(L("Private system · demo on request", "Özel sistem · istek üzerine demo"))}</span>`}
              <button class="btn alt" data-want>${os.tx(L("I want one like this", "Bana da böyle bir şey"))}</button>
            </div>
          </div>
        </div>
      </div>`;
    body.querySelector("[data-want]").onclick = () => os.open("mail", { subject: mailSubject });
    body.querySelectorAll("[data-n]").forEach((b) => counter(b, +b.dataset.n, b.dataset.s || ""));
    const log = body.querySelector(".livelog");
    if (log) {
      let i = 0;
      const add = () => {
        const [cls, text] = LOGS[i++ % LOGS.length];
        const d = document.createElement("div");
        d.className = cls;
        d.textContent = `${new Date().toLocaleTimeString("en-GB")}  ${text}`;
        log.appendChild(d);
        while (log.children.length > 9) log.firstChild.remove();
      };
      for (let k = 0; k < 5; k++) add();
      const t = setInterval(add, 1300);
      win.onClose(() => clearInterval(t));
    }
  },
};

// ---------------- Müge'nin stüdyosu ----------------
const studio = {
  color: "#ffb3cb", w: 820, h: 580,
  label: (os) => os.tx(L("Müge's Studio", "Müge'nin Stüdyosu")),
  title: (a, os) => os.tx(L("Müge's Studio · Photos", "Müge'nin Stüdyosu · Fotoğraflar")),
  render(body, win, os) {
    const p = byId("studio");
    body.innerHTML = `
      <div class="pad" style="padding-bottom:0">
        <h1 class="h1">🎬 ${os.tx(L("Müge's Studio", "Müge'nin Stüdyosu"))}</h1>
        <p class="lead">${esc(os.tx(p.text))}</p>
        <div class="row"><button class="btn sun" data-reel>▶ ${os.tx(L("Watch the AI reel", "AI videoyu izle"))}</button><button class="btn alt" data-muge>${os.tx(L("About Müge", "Müge hakkında"))}</button></div>
      </div>
      <div class="photos">${GALLERY.map((g, i) => `<button data-i="${i}" aria-label="${esc(g.cap)}"><img src="${g.src}" alt="${esc(g.cap)}" loading="lazy"></button>`).join("")}</div>`;
    body.querySelector("[data-reel]").onclick = (e) => os.open("reel", {}, e.currentTarget);
    body.querySelector("[data-muge]").onclick = (e) => os.open("muge", {}, e.currentTarget);
    let idx = -1, box = null;
    const show = (i) => {
      idx = (i + GALLERY.length) % GALLERY.length;
      if (!box) {
        box = document.createElement("div");
        box.className = "lightbox";
        body.appendChild(box);
        box.addEventListener("click", (e) => {
          const act = e.target.closest("[data-act]")?.dataset.act;
          if (act === "prev") show(idx - 1);
          else if (act === "next") show(idx + 1);
          else if (act === "close" || e.target === box) { box.remove(); box = null; }
        });
      }
      const g = GALLERY[idx];
      box.innerHTML = `<img src="${g.src}" alt="${esc(g.cap)}"><div class="cap"><button data-act="prev">‹</button><span>${esc(g.cap)} · ${idx + 1}/${GALLERY.length}</span><button data-act="next">›</button><button data-act="close">✕</button></div>`;
      body.scrollTop = 0;
      os.sfx.click();
    };
    body.querySelector(".photos").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) show(+b.dataset.i); });
    const key = (e) => {
      if (!box || !win.el.classList.contains("focused")) return;
      if (e.key === "ArrowRight") show(idx + 1);
      if (e.key === "ArrowLeft") show(idx - 1);
    };
    addEventListener("keydown", key);
    win.onClose(() => removeEventListener("keydown", key));
  },
};

// ---------------- Video ----------------
const reel = {
  color: "#b9a6ff", w: 420, h: 700,
  label: () => "reel.mp4",
  title: (a, os) => os.tx(L("Müge · AI short video", "Müge · AI kısa video")),
  render(body, win) {
    body.innerHTML = `<div class="player"><video src="assets/gallery/reel.mp4" autoplay muted loop playsinline controls preload="metadata"></video></div>`;
    const v = body.querySelector("video");
    win.onClose(() => { v.pause(); v.removeAttribute("src"); v.load(); });
  },
};

// ---------------- Erasmus 2027 ----------------
const erasmus = {
  color: "#8fd3ff", w: 760, h: 620,
  label: () => "Erasmus 2027",
  title: (a, os) => os.tx(L("Erasmus 2027 · Boarding pass", "Erasmus 2027 · Biniş kartı")),
  render(body, win, os) {
    const t = (en, tr) => os.tx(L(en, tr));
    body.innerHTML = `
      <div class="erasmus">
        <div class="pass">
          <div class="pass-main">
            <div class="pass-top"><span>ERASMUS+ AIRLINES</span><span>${t("BOARDING PASS", "BİNİŞ KARTI")}</span></div>
            <div class="route">
              <div><b>NEV</b><small>Nevşehir, Türkiye</small></div>
              <div class="plane"><span>✈️</span></div>
              <div style="text-align:right"><b>EU</b><small>${t("Your hotel?", "Sizin oteliniz?")}</small></div>
            </div>
            <div class="pass-grid">
              <div><small>${t("Passengers", "Yolcular")}</small><b>Ömer & Müge</b></div>
              <div><small>${t("Departure", "Kalkış")}</small><b>${t("Feb – Mar 2027", "Şubat – Mart 2027")}</b></div>
              <div><small>${t("Duration", "Süre")}</small><b>${t("6 months", "6 ay")}</b></div>
              <div><small>${t("Class", "Sınıf")}</small><b>Erasmus+ ${t("Traineeship", "Staj")}</b></div>
              <div><small>${t("Field", "Alan")}</small><b>${t("Tourism · Digital", "Turizm · Dijital")}</b></div>
              <div><small>${t("Travel · Visa · Insurance", "Yol · Vize · Sigorta")}</small><b>${t("On us ✓", "Bizden ✓")}</b></div>
            </div>
          </div>
          <div class="stub"><div><small>GATE</small><br><b>2027</b></div><div class="barcode"></div><small><b style="font-size:13px">${t("Boarding now", "Biniş başladı")}</b></small></div>
        </div>
        <h2 class="h2" style="margin-top:24px">${t("What we bring to your team", "Ekibinize kattıklarımız")}</h2>
        <div class="wants">
          <div class="want"><b>💻 Ömer</b><span>${t("Website, local SEO and AI automations that save your office hours.", "Web sitesi, yerel SEO ve ofis saatlerinizi kurtaran AI otomasyonları.")}</span></div>
          <div class="want"><b>🎬 Müge</b><span>${t("Reels, short videos and guest relations with a warm smile.", "Reels, kısa videolar ve sıcak bir gülümsemeyle misafir ilişkileri.")}</span></div>
          <div class="want"><b>🏡 ${t("Ideal host", "İdeal ev sahibi")}</b><span>${t("A hotel, guesthouse or agriturismo in Europe that offers accommodation and meals.", "Avrupa'da konaklama ve yemek sağlayan bir otel, pansiyon ya da agriturismo.")}</span></div>
        </div>
        <div class="row" style="margin-top:20px">
          <button class="btn" data-invite>✈️ ${t("Invite us", "Bizi davet edin")}</button>
          <a class="btn alt" href="${CONTACT.linkedin}" target="_blank" rel="noopener">LinkedIn ↗</a>
        </div>
      </div>`;
    body.querySelector("[data-invite]").onclick = () => os.open("mail", { subject: "Erasmus+ traineeship 2027" });
  },
};

// ---------------- Kişiler ----------------
const FACTS = {
  omer: [L("Two-time Erasmus student", "İki kez Erasmus yaptı"), L("Built a system that handled 50,000+ emails in 12 languages", "12 dilde 50.000+ maili yöneten bir sistem kurdu"), L("Turns boring office work into one-click automations", "Sıkıcı ofis işlerini tek tıklık otomasyonlara çevirir")],
  muge: [L("Erasmus alumna", "Erasmus mezunu"), L("Designs full brand kits: logo, price list, campaigns", "Logo, fiyat listesi, kampanya: komple marka kiti tasarlar"), L("Makes cinematic AI short videos", "Sinematik AI kısa videolar üretir")],
};
function person(id, color) {
  return {
    color, w: 600, h: 560,
    label: () => `${id === "omer" ? "Ömer" : "Müge"}.txt`,
    title: () => `${id === "omer" ? "Ömer" : "Müge"}.txt`,
    render(body, win, os) {
      const p = PEOPLE.find((x) => x.id === id);
      body.innerHTML = `
        <article class="doc">
          <div class="doc-head"><img src="${p.photo}" alt="${esc(p.name)}"><div><h1 class="h1">${esc(p.name)}</h1><p class="lead" style="margin:0">${esc(os.tx(p.role))}</p></div></div>
          <p>${esc(os.tx(p.text))}</p>
          <ul class="chips">${p.skills.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
          <ul class="facts">${FACTS[id].map((f) => `<li>${esc(os.tx(f))}</li>`).join("")}</ul>
          <div class="row" style="margin-top:18px">
            ${id === "muge" ? `<button class="btn" data-go="studio">🎬 ${os.tx(L("Open her studio", "Stüdyosunu aç"))}</button>` : `<button class="btn" data-go="projects">📁 ${os.tx(L("See his projects", "Projelerine bak"))}</button>`}
            <button class="btn alt" data-go="mail">✉️ ${os.tx(L("Say hi", "Merhaba de"))}</button>
          </div>
        </article>`;
      body.querySelectorAll("[data-go]").forEach((b) => (b.onclick = () => os.open(b.dataset.go, {}, b)));
    },
  };
}

// ---------------- Mail ----------------
const mail = {
  color: "#ff8fb3", w: 600, h: 520,
  label: (os) => os.tx(L("Mail", "Posta")),
  title: (a, os) => os.tx(L("New message", "Yeni mesaj")),
  update(win, args) { if (args.subject) { const s = win.body.querySelector("[name=subject]"); if (s) s.value = args.subject; } },
  render(body, win, os) {
    const t = (en, tr) => os.tx(L(en, tr));
    body.innerHTML = `
      <form class="mail">
        <div class="fld"><label>${t("To", "Kime")}</label><input value="Ömer & Müge <${CONTACT.email}>" readonly></div>
        <div class="fld"><label>${t("Subject", "Konu")}</label><input name="subject" value="${esc(win.args.subject || t("Hello from your website", "Web sitenizden merhaba"))}"></div>
        <textarea name="body" placeholder="${t("Hi Ömer & Müge, I'd like to talk about…", "Merhaba Ömer & Müge, şunun hakkında konuşmak istiyorum…")}"></textarea>
        <div class="mail-foot">
          <button class="btn" type="submit">${t("Send ✉️", "Gönder ✉️")}</button>
          <a class="btn mint" href="https://wa.me/${CONTACT.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>
          <a class="btn alt" href="${CONTACT.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
          <span class="grow"></span>
          <button class="btn alt" type="button" data-copy title="${CONTACT.email}">${t("Copy email", "Maili kopyala")}</button>
        </div>
      </form>`;
    const form = body.querySelector("form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const subject = form.subject.value, text = form.body.value;
      location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    });
    body.querySelector("[data-copy]").onclick = async () => {
      try { await navigator.clipboard.writeText(CONTACT.email); } catch (_) {}
      os.toast({ icon: "mail", title: os.t("copied"), text: CONTACT.email, ms: 3000 });
    };
    setTimeout(() => form.body.focus(), 300);
  },
};

// ---------------- Terminal ----------------
const NEOFETCH = String.raw`
   .-------.      <l>guest</l>@<l>omer-muge</l>
   |  o o  |      ----------------
   |  \_/  |      <y>OS</y>      Ömer & Müge OS 2.0
   '---+---'      <y>Host</y>    Nevşehir, Cappadocia 🎈
     __|__        <y>Team</y>    2 humans, 1 cat
                  <y>Skills</y>  Web · SEO · AI automation · Video
                  <y>Langs</y>   Türkçe, English
                  <y>Status</y>  <g>open to Erasmus+ 2027 ✓</g>`;
const terminal = {
  color: "#b9a6ff", w: 680, h: 440,
  label: () => "Terminal",
  title: () => "guest@omer-muge: ~",
  render(body, win, os) {
    const t = (en, tr) => os.tx(L(en, tr));
    body.innerHTML = `<div class="term"><div class="out"></div><div class="inrow"><span class="p">guest@omer-muge ~ %</span><input aria-label="Command" autocomplete="off" spellcheck="false" autocapitalize="off"></div></div>`;
    const out = body.querySelector(".out"), input = body.querySelector("input");
    const fmt = (s) => esc(s).replace(/&lt;(\/?)(l|y|g|p|d)&gt;/g, (m, c, k) => (c ? "</span>" : `<span class="${k}">`));
    const print = (s = "") => { const d = document.createElement("div"); d.className = "ln"; d.innerHTML = fmt(s); out.appendChild(d); body.scrollTop = body.scrollHeight; };
    const hist = []; let hi = 0;
    const CMDS = {
      help: () => print(t(
        "<y>help</y> this list   <y>about</y>   <y>projects</y>   <y>open</y> <d>app</d>\n<y>hire</y>   <y>contact</y>   <y>neofetch</y>   <y>lang</y> <d>tr|en</d>   <y>theme</y> <d>dawn|day|sunset|night</d>\n<y>ls</y>   <y>whoami</y>   <y>date</y>   <y>cat</y>   <y>coffee</y>   <y>sudo</y>   <y>clear</y>",
        "<y>help</y> bu liste   <y>about</y>   <y>projects</y>   <y>open</y> <d>uygulama</d>\n<y>hire</y>   <y>contact</y>   <y>neofetch</y>   <y>lang</y> <d>tr|en</d>   <y>theme</y> <d>dawn|day|sunset|night</d>\n<y>ls</y>   <y>whoami</y>   <y>date</y>   <y>cat</y>   <y>coffee</y>   <y>sudo</y>   <y>clear</y>")),
      about: () => print(t("Ömer builds websites and automations. Müge creates videos and designs.\nTogether: a tiny, very fast studio from Cappadocia.", "Ömer web siteleri ve otomasyonlar kurar. Müge video ve tasarım yapar.\nBirlikte: Kapadokya'dan minik ama çok hızlı bir stüdyo.")),
      projects: () => PROJECTS.forEach((p) => print(`${p.icon} <l>${p.title.padEnd(22)}</l><d>${p.url ? host(p.url) : t("private system", "özel sistem")}</d>`)),
      ls: () => print("<l>Projects/</l>  <l>Studio/</l>  reel.mp4  Ömer.txt  Müge.txt  Erasmus_2027.pass  <d>.secret_cat</d>"),
      open: (a) => {
        const map = { projects: "projects", studio: "studio", reel: "reel", erasmus: "erasmus", omer: "omer", ömer: "omer", muge: "muge", müge: "muge", mail: "mail", paint: "paint", game: "game", trash: "trash", quick: "quick" };
        const id = map[(a || "").toLowerCase()];
        if (id) { print(`<g>${t("opening", "açılıyor")} ${id}…</g>`); os.open(id); } else print(t("usage: open projects|studio|reel|erasmus|omer|muge|mail|paint|game", "kullanım: open projects|studio|reel|erasmus|omer|muge|mail|paint|game"));
      },
      hire: () => { print(t("<g>✈ Ömer & Müge are looking for a 6-month Erasmus+ traineeship from Feb–Mar 2027.</g>\nTourism or digital. Travel, visa and insurance are on us. Type <y>open erasmus</y>.", "<g>✈ Ömer & Müge, Şubat-Mart 2027'den itibaren 6 aylık Erasmus+ stajı arıyor.</g>\nTurizm ya da dijital. Yol, vize ve sigorta bizden. <y>open erasmus</y> yaz.")); },
      contact: () => print(`✉  ${CONTACT.email}\n☎  WhatsApp ${CONTACT.whatsappLabel}\nin LinkedIn: ${t("type", "yaz")} <y>open mail</y>`),
      neofetch: () => print(NEOFETCH),
      whoami: () => print(t("guest (a very welcome one)", "misafir (çok hoş gelmiş bir misafir)")),
      date: () => print(new Date().toString()),
      lang: (a) => { if (a === "tr" || a === "en") { os.setLang(a); } else print("lang tr | lang en"); },
      theme: (a) => { if (["dawn", "day", "sunset", "night", "auto"].includes(a)) { os.setWall(a); print(`<g>✓ ${a}</g>`); } else print("theme dawn|day|sunset|night|auto"); },
      cat: () => { os.sfx.meow(); print(" /\\_/\\\n( o.o )  meow!\n > ^ <"); },
      coffee: () => print(t("☕ brewing… done. Productivity +20%.", "☕ demleniyor… hazır. Verimlilik +%20.")),
      sudo: () => { os.sfx.error(); print(t("<p>Nice try 😄 We'd rather be hired than rooted.</p>", "<p>İyi denemeydi 😄 Root olmaktansa işe alınmayı tercih ederiz.</p>")); },
      clear: () => { out.innerHTML = ""; },
      echo: (...a) => print(a.join(" ")),
      exit: () => os.close(win.key),
    };
    const run = (line) => {
      print(`<p>guest@omer-muge ~ %</p> ${line}`);
      const [cmd, ...args] = line.trim().split(/\s+/);
      if (!cmd) return;
      const fn = CMDS[cmd.toLowerCase()];
      if (fn) fn(...args); else { os.sfx.error(); print(t(`command not found: ${cmd}. Type <y>help</y>.`, `komut bulunamadı: ${cmd}. <y>help</y> yaz.`)); }
    };
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { const v = input.value; input.value = ""; if (v.trim()) { hist.push(v); hi = hist.length; } run(v); }
      else if (e.key === "ArrowUp") { if (hi > 0) input.value = hist[--hi]; e.preventDefault(); }
      else if (e.key === "ArrowDown") { input.value = hi < hist.length - 1 ? hist[++hi] : (hi = hist.length, ""); e.preventDefault(); }
      else if (e.key.length === 1) os.sfx.key();
    });
    body.addEventListener("click", () => input.focus());
    CMDS.neofetch();
    print("");
    print(t("Type <y>help</y> to see what I can do.", "Neler yapabildiğimi görmek için <y>help</y> yaz."));
    if (!os.isTouch) setTimeout(() => input.focus(), 250);
  },
};

// ---------------- Paint ----------------
const paint = {
  color: "#fff3a8", w: 720, h: 520,
  label: () => "Paint",
  title: (a, os) => os.tx(L("Paint · draw us something", "Paint · bize bir şey çiz")),
  render(body, win, os) {
    const COLORS = ["#2b2340", "#ff6b6b", "#ff8fb3", "#ffd166", "#7fdcc0", "#8fd3ff", "#b9a6ff", "#ffffff"];
    let color = COLORS[1], size = 6;
    body.innerHTML = `<div class="paint"><div class="tools">
      ${COLORS.map((c) => `<button class="sw${c === color ? " on" : ""}" data-c="${c}" style="background:${c}" aria-label="${c}"></button>`).join("")}
      <span style="width:8px"></span>
      ${[3, 6, 14].map((s) => `<button class="btn alt" data-s="${s}">${s === 3 ? "S" : s === 6 ? "M" : "L"}</button>`).join("")}
      <span style="flex:1"></span>
      <button class="btn alt" data-clear>${os.tx(L("Clear", "Temizle"))}</button>
      <button class="btn mint" data-save>${os.tx(L("Save PNG", "PNG kaydet"))}</button>
    </div><canvas></canvas></div>`;
    const cv = body.querySelector("canvas"), g = cv.getContext("2d");
    const fit = () => {
      const r = { width: cv.clientWidth, height: cv.clientHeight }, dpr = devicePixelRatio || 1;
      if (!r.width || !r.height) return;
      const old = document.createElement("canvas");
      old.width = cv.width; old.height = cv.height;
      if (cv.width) old.getContext("2d").drawImage(cv, 0, 0);
      cv.width = r.width * dpr; cv.height = r.height * dpr;
      g.fillStyle = "#fff"; g.fillRect(0, 0, cv.width, cv.height);
      if (old.width) g.drawImage(old, 0, 0);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ro = new ResizeObserver(fit); ro.observe(cv);
    win.onClose(() => ro.disconnect());
    let last = null;
    cv.addEventListener("pointerdown", (e) => { cv.setPointerCapture(e.pointerId); last = [e.offsetX, e.offsetY]; dot(e); });
    cv.addEventListener("pointermove", (e) => {
      if (!last) return;
      g.strokeStyle = color; g.lineWidth = size * (e.pressure && e.pointerType === "pen" ? e.pressure * 2 : 1); g.lineCap = g.lineJoin = "round";
      g.beginPath(); g.moveTo(...last); g.lineTo(e.offsetX, e.offsetY); g.stroke();
      last = [e.offsetX, e.offsetY];
    });
    const dot = (e) => { g.fillStyle = color; g.beginPath(); g.arc(e.offsetX, e.offsetY, size / 2, 0, 7); g.fill(); };
    addEventListener("pointerup", () => { last = null; });
    body.querySelector(".tools").addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      os.sfx.click();
      if (b.dataset.c) { color = b.dataset.c; body.querySelectorAll(".sw").forEach((s) => s.classList.toggle("on", s === b)); }
      if (b.dataset.s) size = +b.dataset.s;
      if (b.hasAttribute("data-clear")) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = "#fff"; g.fillRect(0, 0, cv.width, cv.height); g.restore(); }
      if (b.hasAttribute("data-save")) { const a = document.createElement("a"); a.download = "for-omer-and-muge.png"; a.href = cv.toDataURL("image/png"); a.click(); }
    });
  },
};

// ---------------- Oyun: Balloon Pop ----------------
const game = {
  color: "#ffb38a", w: 520, h: 600,
  label: () => "Balloon Pop",
  title: () => "Balloon Pop · Cappadocia 🎈",
  render(body, win, os) {
    const t = (en, tr) => os.tx(L(en, tr));
    body.innerHTML = `<div class="game"><canvas></canvas><div class="hud"><span class="sc">0</span><span class="tm">30</span></div><div class="over"></div></div>`;
    const cv = body.querySelector("canvas"), g = cv.getContext("2d");
    const over = body.querySelector(".over"), sc = body.querySelector(".sc"), tm = body.querySelector(".tm");
    let W = 0, H = 0, balloons = [], score = 0, end = 0, raf = 0, spawnT = 0, playing = false, pops = [];
    const best = () => os.store.get("om-best", 0);
    const fit = () => { const d = devicePixelRatio || 1; W = cv.clientWidth; H = cv.clientHeight; if (!W || !H) return; cv.width = W * d; cv.height = H * d; g.setTransform(d, 0, 0, d, 0, 0); };
    const ro = new ResizeObserver(fit); ro.observe(cv);
    const COLS = ["#ff8fb3", "#7fdcc0", "#b9a6ff", "#ffd166", "#8fd3ff", "#ff6b6b"];
    const spawn = () => {
      const gold = Math.random() < 0.08;
      const r = gold ? 20 : 22 + Math.random() * 14;
      balloons.push({ x: r + Math.random() * (W - 2 * r), y: H + r + 20, r, v: 50 + Math.random() * 60 + (30 - Math.max(0, (end - performance.now()) / 1000)) * 3, c: gold ? "#ffc300" : COLS[(Math.random() * COLS.length) | 0], gold, ph: Math.random() * 6 });
    };
    const drawBalloon = (b, t) => {
      const x = b.x + Math.sin(t / 600 + b.ph) * 6, y = b.y;
      g.strokeStyle = "#2b2340"; g.lineWidth = 2;
      g.beginPath(); g.moveTo(x, y + b.r * 1.15); g.quadraticCurveTo(x - 6, y + b.r * 1.6, x, y + b.r * 2.1); g.stroke();
      g.fillStyle = b.c; g.beginPath(); g.ellipse(x, y, b.r, b.r * 1.18, 0, 0, 7); g.fill(); g.lineWidth = 2.5; g.stroke();
      g.fillStyle = "rgba(255,255,255,.6)"; g.beginPath(); g.ellipse(x - b.r * 0.35, y - b.r * 0.4, b.r * 0.18, b.r * 0.3, -0.5, 0, 7); g.fill();
      if (b.gold) { g.fillStyle = "#2b2340"; g.font = "bold 14px Pixelify Sans, sans-serif"; g.textAlign = "center"; g.fillText("+5", x, y + 5); }
      b.drawX = x;
    };
    const loop = (t) => {
      const dt = Math.min(0.05, (t - (loop.last || t)) / 1000); loop.last = t;
      g.clearRect(0, 0, W, H);
      if (playing) {
        spawnT -= dt;
        if (spawnT <= 0) { spawn(); spawnT = 0.35 + Math.random() * 0.4; }
        const left = Math.max(0, Math.ceil((end - t) / 1000));
        tm.textContent = `⏱ ${left}`;
        if (left <= 0) finish();
      }
      balloons = balloons.filter((b) => (b.y -= b.v * dt) > -b.r * 3);
      balloons.forEach((b) => drawBalloon(b, t));
      pops = pops.filter((p) => (p.k += dt * 3) < 1);
      pops.forEach((p) => {
        g.strokeStyle = p.c; g.lineWidth = 3;
        for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2, r1 = 10 + p.k * 30, r2 = r1 + 8; g.beginPath(); g.moveTo(p.x + Math.cos(a) * r1, p.y + Math.sin(a) * r1); g.lineTo(p.x + Math.cos(a) * r2, p.y + Math.sin(a) * r2); g.stroke(); }
        g.fillStyle = "#2b2340"; g.font = "bold 18px Pixelify Sans, sans-serif"; g.textAlign = "center"; g.fillText(p.txt, p.x, p.y - p.k * 30);
      });
      raf = requestAnimationFrame(loop);
    };
    cv.addEventListener("pointerdown", (e) => {
      if (!playing) return;
      const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      for (let i = balloons.length - 1; i >= 0; i--) {
        const b = balloons[i];
        if (Math.hypot(x - (b.drawX ?? b.x), (y - b.y) / 1.18) < b.r + 8) {
          balloons.splice(i, 1);
          const pts = b.gold ? 5 : 1;
          score += pts; sc.textContent = `🎈 ${score}`;
          pops.push({ x: b.drawX ?? b.x, y: b.y, c: b.c, k: 0, txt: `+${pts}` });
          os.sfx.pop();
          return;
        }
      }
    });
    const start = () => { score = 0; balloons = []; sc.textContent = "🎈 0"; end = performance.now() + 30000; playing = true; over.hidden = true; os.sfx.happy(); };
    const finish = () => {
      playing = false;
      const b = best(), record = score > b;
      if (record) os.store.set("om-best", score);
      over.hidden = false;
      over.innerHTML = `<b>${record ? t("New record! 🏆", "Yeni rekor! 🏆") : t("Time's up!", "Süre doldu!")}</b><div>${t("Score", "Skor")}: ${score} · ${t("Best", "En iyi")}: ${Math.max(score, b)}</div><button class="btn">${t("Play again", "Tekrar oyna")}</button>`;
      over.querySelector("button").onclick = start;
      os.sfx.dance();
    };
    over.innerHTML = `<b>Balloon Pop 🎈</b><div>${t("Pop as many balloons as you can in 30 seconds. Gold ones are worth 5!", "30 saniyede olabildiğince çok balon patlat. Altın balonlar 5 puan!")}</div><div style="opacity:.7">${t("Best", "En iyi")}: ${best()}</div><button class="btn">${t("Start", "Başla")}</button>`;
    over.querySelector("button").onclick = start;
    sc.textContent = "🎈 0"; tm.textContent = "⏱ 30";
    for (let i = 0; i < 6; i++) setTimeout(() => W && spawn(), 300 + i * 250);
    raf = requestAnimationFrame(loop);
    win.onClose(() => { cancelAnimationFrame(raf); ro.disconnect(); });
  },
};

// ---------------- Çöp kutusu ----------------
const TRASH = [
  { name: "old_portfolio.html", msg: L("Our old portfolio. It was… fine. This one is more fun, right?", "Eski portfolyomuz. Fena değildi… ama bu daha eğlenceli, değil mi?") },
  { name: "boring_cv.docx", msg: L("We replaced the boring CV with a whole operating system.", "Sıkıcı CV'yi koca bir işletim sistemiyle değiştirdik.") },
  { name: "excuses.txt", msg: L("This file is empty. We don't make excuses, we ship. 🚀", "Bu dosya boş. Bahane üretmeyiz, iş çıkarırız. 🚀") },
  { name: "lorem_ipsum_template.zip", msg: L("No templates here. Every pixel is handmade.", "Burada hazır şablon yok. Her piksel el yapımı.") },
];
const trash = {
  color: "#dfe6f0", w: 560, h: 340,
  label: (os) => os.tx(L("Trash", "Çöp Kutusu")),
  title: (a, os) => os.tx(L("Trash", "Çöp Kutusu")),
  render(body, win, os) {
    body.innerHTML = `<div class="trash">${TRASH.map((f, i) => `<button data-i="${i}">${ICONS.file}<span>${esc(f.name)}</span></button>`).join("")}
      <p class="trash-note">${os.tx(L("4 items · double-click to peek", "4 öğe · bakmak için tıkla"))}</p>
      <div style="grid-column:1/-1"><button class="btn alt" data-empty>🗑 ${os.tx(L("Empty trash", "Çöpü boşalt"))}</button></div></div>`;
    body.querySelectorAll("[data-i]").forEach((b) => (b.onclick = () => os.open("dialog", { key: b.dataset.i, title: TRASH[b.dataset.i].name, icon: "📄", text: TRASH[b.dataset.i].msg }, b)));
    body.querySelector("[data-empty]").onclick = (e) => { os.sfx.trash(); os.open("dialog", { key: "empty", title: os.tx(L("Trash", "Çöp Kutusu")), icon: "🥹", text: L("Nope. We keep our memories.", "Olmaz. Anılarımızı saklıyoruz.") }, e.currentTarget); };
  },
};

// ---------------- Küçük diyalog ----------------
const dialog = {
  color: "#ffd9e6", w: 400, h: 210, multi: true, hidden: true, icon: "file",
  label: (os) => os.tx(L("Message", "Mesaj")),
  title: (a) => a.title || "",
  render(body, win, os) {
    body.innerHTML = `<div class="dialog"><div class="big">${win.args.icon || "💬"}</div><div><p>${esc(os.tx(win.args.text))}</p><button class="btn">OK</button></div></div>`;
    body.querySelector("button").onclick = () => os.close(win.key);
  },
};

// ---------------- Hakkında ----------------
const about = {
  color: "#ffd9e6", w: 440, h: 400, hidden: true, icon: "quick",
  label: (os) => os.tx(L("About", "Hakkında")),
  title: (a, os) => os.tx(L("About this computer", "Bu bilgisayar hakkında")),
  render(body, win, os) {
    body.innerHTML = `<div class="pad" style="text-align:center">
      <div style="width:84px;margin:6px auto 10px;color:#2b2340">${LOGO}</div>
      <h1 class="h1">Ömer & Müge OS</h1><p class="lead">${os.tx(L("Version 2.0 · Cappadocia edition", "Sürüm 2.0 · Kapadokya sürümü"))}</p>
      <p>${os.tx(L("Handmade with plain HTML, CSS and JavaScript. No templates, no frameworks, every icon drawn by hand.", "Sade HTML, CSS ve JavaScript ile el yapımı. Şablon yok, framework yok, her ikon elle çizildi."))}</p>
      <p class="lead" style="font-size:13px">${os.tx(L("Wallpaper: the fairy chimneys of Cappadocia, our home. Try right-click → Wallpaper.", "Duvar kağıdı: evimiz Kapadokya'nın peri bacaları. Sağ tık → Duvar kağıdı'nı dene."))}</p>
      <button class="btn" data-q>${os.tx(L("Quick view", "Hızlı bakış"))}</button></div>`;
    body.querySelector("[data-q]").onclick = () => os.open("quick");
  },
};

const shortcuts = {
  color: "#ffd9e6", w: 420, h: 330, hidden: true, icon: "terminal",
  label: (os) => os.tx(L("Shortcuts", "Kısayollar")),
  title: (a, os) => os.tx(L("Keyboard shortcuts", "Klavye kısayolları")),
  render(body, win, os) {
    const rows = [["Ctrl / ⌘ + K", L("Search everything", "Her şeyi ara")], ["/", L("Search", "Ara")], ["Esc", L("Close window", "Pencereyi kapat")], [L("Double-click title", "Başlığa çift tık"), L("Maximize", "Büyüt")], [L("Right-click desktop", "Masaüstüne sağ tık"), L("Wallpaper menu", "Duvar kağıdı menüsü")], ["←  →", L("Browse photos", "Fotoğraflarda gez")]];
    body.innerHTML = `<div class="pad"><ul class="facts" style="gap:10px">${rows.map(([k, v]) => `<li><b>${esc(typeof k === "string" ? k : os.tx(k))}</b> · ${esc(os.tx(v))}</li>`).join("")}</ul></div>`;
  },
};

// ---------------- Hızlı bakış ----------------
const quick = {
  color: "#ffffff", w: 760, h: 620,
  label: (os) => os.tx(L("Quick view", "Hızlı bakış")),
  title: (a, os) => os.tx(L("Quick view · everything on one page", "Hızlı bakış · her şey tek sayfada")),
  render(body, win, os) {
    const t = (en, tr) => os.tx(L(en, tr));
    body.innerHTML = `<article class="quick">
      <h1 class="h1">Ömer & Müge</h1>
      <p class="lead">${t("Websites, local SEO, AI automations and short-form video. A two-person studio from Cappadocia, Türkiye.", "Web siteleri, yerel SEO, AI otomasyonları ve kısa video. Kapadokya'dan iki kişilik bir stüdyo.")}</p>
      <div class="row"><a class="btn" href="mailto:${CONTACT.email}">✉️ ${CONTACT.email}</a><a class="btn mint" href="https://wa.me/${CONTACT.whatsapp}" target="_blank" rel="noopener">WhatsApp</a><a class="btn alt" href="${CONTACT.linkedin}" target="_blank" rel="noopener">LinkedIn</a></div>
      <h2>${t("Projects", "Projeler")}</h2>
      <div class="plist">${PROJECTS.map((p) => `<div class="pitem"><img src="${p.shot}" alt="" loading="lazy"><div><b>${p.icon} ${esc(p.title)}</b><span>${esc(os.tx(p.text))}</span>${p.url ? ` <a href="${p.url}" target="_blank" rel="noopener">${host(p.url)} ↗</a>` : ""}</div></div>`).join("")}</div>
      <h2>${t("Team", "Ekip")}</h2>
      ${PEOPLE.map((p) => `<p><b>${esc(p.name)}</b> · ${esc(os.tx(p.role))}<br>${esc(os.tx(p.text))}</p>`).join("")}
      <h2>Erasmus+ 2027</h2>
      <p>${t("We're looking for a 6-month Erasmus+ traineeship in tourism or digital, starting Feb–Mar 2027. Travel, visa and insurance are covered by us.", "Şubat-Mart 2027'den itibaren turizm ya da dijital alanda 6 aylık Erasmus+ stajı arıyoruz. Yol, vize ve sigorta bizden.")}</p>
    </article>`;
  },
};

export const APPS = {
  projects, browser, studio, reel, erasmus,
  omer: person("omer", "#7fdcc0"), muge: person("muge", "#ffd166"),
  mail, terminal, paint, game, trash, quick, dialog, about, shortcuts,
};
