// Kapadokya duvar kağıdı: peri bacaları ve sıcak hava balonları. Günün saatine göre 4 farklı hal.
export const MODES = ["dawn", "day", "sunset", "night"];

export function autoMode(date = new Date()) {
  const h = date.getHours();
  if (h >= 5 && h < 9) return "dawn";
  if (h >= 9 && h < 17) return "day";
  if (h >= 17 && h < 20) return "sunset";
  return "night";
}

const PAL = {
  dawn: { sky: ["#ffc9d9", "#ffe3d3", "#fff4dc"], sun: "#ffb38a", sunY: 640, far: "#e7b4c6", mid: "#f2c3a6", cap: "#c98a74", near: "#eaa98c", ground: "#dd9a80", win: "#8c5a50" },
  day: { sky: ["#86ccff", "#b9e4ff", "#eaf7ff"], sun: "#ffe28a", sunY: 200, far: "#c7b6ea", mid: "#f5cfa8", cap: "#d39770", near: "#efbb92", ground: "#e6ac84", win: "#9a6448" },
  sunset: { sky: ["#4d3f8f", "#c9709c", "#ffad83"], sun: "#ffd166", sunY: 600, far: "#8b67a6", mid: "#e3967f", cap: "#9f5c74", near: "#cf7f7c", ground: "#b86a74", win: "#5a3550" },
  night: { sky: ["#0d0a22", "#1f1844", "#3a2c68"], sun: "#fff1c2", sunY: 170, far: "#2b2350", mid: "#463871", cap: "#2a2150", near: "#3a2d62", ground: "#2e2453", win: "#ffd166" },
};

// Basit, tekrarlanabilir rastgele sayı (her yüklemede aynı manzara).
function rng(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

function chimney(x, base, h, w, p, withWin) {
  const t = base - h;
  let s = `<path d="M${x - w} ${base} C ${x - w * 0.55} ${base - h * 0.3}, ${x - w * 0.38} ${t + h * 0.25}, ${x - w * 0.2} ${t + 4} L ${x + w * 0.2} ${t + 4} C ${x + w * 0.38} ${t + h * 0.25}, ${x + w * 0.55} ${base - h * 0.3}, ${x + w} ${base} Z" fill="${p.mid}"/>`;
  s += `<path d="M${x - w * 0.3} ${t + 6} Q ${x} ${t - w * 0.42} ${x + w * 0.3} ${t + 6} Z" fill="${p.cap}"/>`;
  if (withWin) {
    const wy = base - h * 0.45;
    s += `<path d="M${x - 6} ${wy + 14} v-8 a6 6 0 0 1 12 0 v8 z" fill="${p.win}" opacity=".9"/>`;
  }
  return s;
}

function balloon(x, y, s, a, b, i, night) {
  const env = "M0 -60 C 34 -60 44 -30 30 -5 C 22 10 11 18 8 26 L -8 26 C -11 18 -22 10 -30 -5 C -44 -30 -34 -60 0 -60 Z";
  const mid = "M0 -60 C 15 -52 16 -12 5 26 L -5 26 C -16 -12 -15 -52 0 -60 Z";
  const side = "M0 -60 C -24 -56 -30 -20 -16 14 L -10 20 C -22 -8 -18 -46 0 -60 Z M0 -60 C 24 -56 30 -20 16 14 L 10 20 C 22 -8 18 -46 0 -60 Z";
  const glow = night ? `<ellipse cx="0" cy="30" rx="7" ry="5" fill="#ffd166" opacity=".9"/><ellipse cx="0" cy="0" rx="26" ry="40" fill="#ffb347" opacity=".18"/>` : "";
  return `<g transform="translate(${x} ${y}) scale(${s})"><g class="balloon" data-i="${i}"><g class="balloon-float" style="--d:${7 + (i % 5) * 1.6}s;--delay:-${i * 1.3}s">
    <path d="M-8 26 L -6 40 M 8 26 L 6 40" stroke="#2b2340" stroke-width="1.6"/>
    <path d="${env}" fill="${a}" stroke="#2b2340" stroke-width="2.2"/>
    <path d="${side}" fill="${b}" opacity=".9"/>
    <path d="${mid}" fill="${b}"/>
    <path d="${env}" fill="none" stroke="#2b2340" stroke-width="2.2"/>
    <path d="M-16 -42 C -22 -32 -22 -20 -18 -12" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".55"/>
    ${glow}
    <rect x="-7" y="39" width="14" height="10" rx="2" fill="#c58b5a" stroke="#2b2340" stroke-width="2"/>
  </g></g></g>`;
}

export function wallpaper(mode) {
  const p = PAL[mode] || PAL.day;
  const night = mode === "night";
  const r = rng(7);
  let stars = "";
  if (night) {
    for (let i = 0; i < 90; i++) {
      const x = r() * 1600, y = r() * 520, rad = r() * 1.6 + 0.4;
      stars += `<circle class="twinkle" style="--d:${2 + r() * 4}s;animation-delay:-${r() * 4}s" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${rad.toFixed(1)}" fill="#fff"/>`;
    }
  }
  const sun = night
    ? `<circle cx="1260" cy="${p.sunY}" r="54" fill="${p.sun}"/><circle cx="1284" cy="${p.sunY - 14}" r="46" fill="${p.sky[0]}"/>`
    : `<circle cx="${mode === "day" ? 1250 : 820}" cy="${p.sunY}" r="${mode === "day" ? 70 : 110}" fill="${p.sun}" opacity=".95"/><circle cx="${mode === "day" ? 1250 : 820}" cy="${p.sunY}" r="${mode === "day" ? 120 : 190}" fill="${p.sun}" opacity=".18"/>`;
  const clouds = night ? "" : [0, 1, 2].map((i) =>
    `<g class="cloud" style="--d:${90 + i * 40}s;animation-delay:-${i * 35}s"><g transform="translate(${-200 + i * 120} ${120 + i * 70})" fill="#fff" opacity="${mode === "sunset" ? 0.35 : 0.75}"><ellipse cx="0" cy="0" rx="70" ry="22"/><ellipse cx="40" cy="-14" rx="44" ry="26"/><ellipse cx="-34" cy="-8" rx="36" ry="20"/></g></g>`).join("");

  // Balonlar: uzaktakiler küçük, yakındakiler büyük.
  const colors = night
    ? [["#ff8fb3", "#ffd166"], ["#b9a6ff", "#7fdcc0"], ["#ffb38a", "#ff6b8b"], ["#7fdcc0", "#fff3a8"]]
    : [["#ff8fb3", "#ffd166"], ["#7fdcc0", "#fff"], ["#b9a6ff", "#ffb3cb"], ["#ffb38a", "#ff6b6b"], ["#ffd166", "#ff8fb3"], ["#8fd3ff", "#fff3a8"]];
  const farB = [[330, 300, 0.42], [560, 210, 0.36], [980, 260, 0.4], [1420, 330, 0.38], [760, 390, 0.32], [1120, 150, 0.3], [200, 180, 0.3]];
  const nearB = [[1350, 520, 0.95], [470, 470, 0.8], [1030, 470, 0.7]];
  let i = 0;
  const far = farB.map(([x, y, s]) => { const c = colors[i % colors.length]; return balloon(x, y, s, c[0], c[1], i++, night); }).join("");
  const near = nearB.map(([x, y, s]) => { const c = colors[(i + 2) % colors.length]; return balloon(x, y, s, c[0], c[1], i++, night); }).join("");

  const farHills = `<path d="M0 640 C 160 590 300 610 420 585 C 560 555 700 600 860 575 C 1020 550 1180 600 1320 572 C 1440 552 1530 575 1600 565 V1000 H0Z" fill="${p.far}"/>`;
  let mids = "";
  [[90, 760, 210, 52, 1], [190, 770, 150, 40, 0], [330, 780, 250, 58, 1], [1180, 775, 240, 56, 1], [1290, 780, 170, 42, 0], [1430, 772, 280, 64, 1], [1540, 790, 160, 44, 0], [700, 790, 120, 36, 0], [840, 795, 160, 42, 1]]
    .forEach(([x, b, h, w, win]) => { mids += chimney(x, b, h, w, p, win); });
  const midGround = `<path d="M0 760 C 200 735 420 790 640 770 C 860 750 1080 795 1300 768 C 1440 752 1540 770 1600 762 V1000 H0Z" fill="${p.near}"/>`;
  let nears = "";
  [[40, 920, 300, 78, 1], [230, 940, 200, 60, 0], [1500, 930, 330, 84, 1], [1330, 950, 190, 56, 0]].forEach(([x, b, h, w, win]) => { nears += chimney(x, b, h, w, { ...p, mid: p.ground, cap: p.cap }, win); });
  const ground = `<path d="M0 900 C 300 870 600 920 900 895 C 1200 870 1400 905 1600 890 V1000 H0Z" fill="${p.ground}"/>`;

  return `<svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.sky[0]}"/><stop offset=".55" stop-color="${p.sky[1]}"/><stop offset="1" stop-color="${p.sky[2]}"/></linearGradient></defs>
  <rect width="1600" height="1000" fill="url(#sky)"/>
  ${stars}${sun}${clouds}
  <g class="layer" data-depth="4">${far}</g>
  <g class="layer" data-depth="6">${farHills}</g>
  <g class="layer" data-depth="10">${mids}${midGround}</g>
  <g class="layer" data-depth="16">${near}</g>
  <g class="layer" data-depth="20">${nears}${ground}</g>
</svg>`;
}
