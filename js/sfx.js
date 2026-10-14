// 8-bit ses efektleri: hepsi WebAudio ile anında sentezlenir (ses dosyası yok).
// Tarayıcılar sesi ancak bir kullanıcı tıklamasından sonra başlatır: unlock() o anda çağrılır.

let ctx = null;
let master = null;
let muted = false;
try { muted = localStorage.getItem("bmo-muted") === "1"; } catch (_) {}

export function unlock() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.5;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume();
}

export function isMuted() { return muted; }

export function setMuted(value) {
  muted = value;
  try { localStorage.setItem("bmo-muted", value ? "1" : "0"); } catch (_) {}
  if (master) master.gain.setTargetAtTime(value ? 0 : 0.5, ctx.currentTime, 0.05);
}

function tone(freq, start, dur, { type = "square", vol = 0.18, slide = 0, attack = 0.005 } = {}) {
  if (!ctx || muted) return;
  const t = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t + dur);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(vol, t + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(master);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

function noise(start, dur, { vol = 0.08, freq = 1800 } = {}) {
  if (!ctx || muted) return;
  const t = ctx.currentTime + start;
  const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const src = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  filter.type = "bandpass";
  filter.frequency.value = freq;
  gain.gain.value = vol;
  src.buffer = buffer;
  src.connect(filter).connect(gain).connect(master);
  src.start(t);
}

const NOTE = (n) => 440 * Math.pow(2, (n - 69) / 12);

export const sfx = {
  // Bilgisayar açılış akoru.
  chime() {
    [60, 64, 67, 72, 76].forEach((n) => tone(NOTE(n), 0, 1.4, { type: "sine", vol: 0.07, attack: 0.03 }));
    tone(NOTE(84), 0.05, 0.9, { type: "triangle", vol: 0.04, attack: 0.04 });
  },
  pop() { noise(0, 0.06, { vol: 0.14, freq: 1400 }); tone(520, 0, 0.09, { type: "sine", vol: 0.12, slide: -380 }); },
  meow() {
    tone(620, 0, 0.32, { type: "sawtooth", vol: 0.035, slide: 260, attack: 0.04 });
    tone(880, 0.3, 0.28, { type: "sine", vol: 0.05, slide: -420, attack: 0.03 });
  },
  notify() { tone(NOTE(88), 0, 0.12, { type: "sine", vol: 0.1 }); tone(NOTE(95), 0.1, 0.22, { type: "sine", vol: 0.09 }); },
  trash() { noise(0, 0.25, { vol: 0.09, freq: 900 }); tone(180, 0.02, 0.2, { type: "triangle", vol: 0.08, slide: -90 }); },
  minimize() { tone(700, 0, 0.16, { type: "sine", vol: 0.06, slide: -500 }); },
  // Konsol açılış melodisi.
  boot() {
    [72, 76, 79, 84].forEach((n, i) => tone(NOTE(n), i * 0.09, 0.16, { vol: 0.14 }));
    tone(NOTE(88), 0.38, 0.45, { type: "triangle", vol: 0.16 });
  },
  hover() { tone(NOTE(96), 0, 0.04, { vol: 0.05, type: "triangle" }); },
  click() { tone(NOTE(84), 0, 0.05, { vol: 0.1 }); tone(NOTE(91), 0.04, 0.06, { vol: 0.08 }); },
  open() { tone(300, 0, 0.22, { type: "sawtooth", vol: 0.06, slide: 900 }); noise(0, 0.18, { vol: 0.04, freq: 2600 }); },
  close() { tone(900, 0, 0.18, { type: "sawtooth", vol: 0.05, slide: -650 }); },
  // BMO konuşurken her harfte kısa, perdesi değişen bip.
  blip() { tone(NOTE(76 + Math.floor(Math.random() * 8)), 0, 0.035, { vol: 0.045 }); },
  key() { tone(NOTE(100 + Math.floor(Math.random() * 3)), 0, 0.02, { vol: 0.03, type: "triangle" }); },
  // Kaset yuvaya oturur: mekanik "çıt" + yükselen motor sesi.
  insert() {
    noise(0, 0.04, { vol: 0.12, freq: 3200 });
    tone(140, 0.03, 0.08, { vol: 0.12, type: "square" });
    tone(220, 0.12, 0.5, { vol: 0.05, type: "sawtooth", slide: 520 });
    [84, 88, 91].forEach((n, i) => tone(NOTE(n), 0.55 + i * 0.07, 0.1, { vol: 0.09 }));
  },
  step() { noise(0, 0.05, { vol: 0.05, freq: 500 + Math.random() * 200 }); },
  happy() { [79, 83, 86, 91].forEach((n, i) => tone(NOTE(n), i * 0.07, 0.12, { vol: 0.12 })); },
  error() { tone(NOTE(60), 0, 0.12, { vol: 0.1 }); tone(NOTE(55), 0.12, 0.2, { vol: 0.1 }); },
  dance() {
    const song = [72, 74, 76, 79, 76, 79, 81, 79, 76, 74, 72, 74, 76, 72];
    song.forEach((n, i) => tone(NOTE(n), i * 0.16, 0.14, { vol: 0.11 }));
    song.forEach((n, i) => i % 2 === 0 && tone(NOTE(n - 24), i * 0.16, 0.28, { vol: 0.07, type: "triangle" }));
  },
};
