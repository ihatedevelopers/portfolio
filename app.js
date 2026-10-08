// Studio Translations
const i18n = {
  en: {
    statusPill: "Available for Spring 2027 Traineeships & AI Projects",
    heroTitle: "We build autonomous AI workflows, high-speed web platforms, and viral media.",
    heroSubtitle: "An independent digital engineering and visual operations studio. We connect bleeding-edge artificial intelligence with 5-star guest and client experiences.",
    btnWork: "Explore Deployments ↓",
    btnContact: "Start a Conversation ↗",
    bentoAITitle: "Autonomous Multi-Agent AI Systems",
    bentoAIDesc: "We design autonomous agent architectures that automate complex operations: 9-node concurrent communication, lead research, dynamic verification, and CRM workflows.",
    bentoWebTitle: "High-Performance Web & SEO",
    bentoWebDesc: "Sub-second load times, clean code, conversion-optimized booking engines, and multi-language Google SEO dominance.",
    bentoMediaTitle: "Next-Gen AI Video & Visuals",
    bentoMediaDesc: "Producing 4K high-retention short-form video (Reels/TikTok) using Higgsfield AI and camera-grade composition.",
    bentoToolsTitle: "Custom Internal Automations",
    bentoToolsDesc: "Eliminating repetitive office paperwork: Excel/Word automations, browser tools, and instant webhook connectors.",
    projectsHead: "Selected Live Deployments",
    projectsDesc: "Real platforms, real customers, and live business impact in production.",
    contactTitle: "Let's Build Something Powerful.",
    contactDesc: "Whether you are a European hotel partner preparing for the 2027 season or a business looking to automate operations, our channel is open.",
    btnWhatsapp: "Chat on WhatsApp",
    btnEmail: "Send an Email",
    simTitle: "Live Interactive AI Concierge Simulator",
    simP1: "💬 Test: Hotel Booking Inquiry",
    simP2: "⚡ Test: Speed & SEO Benchmark",
    simP3: "🛡️ Test: Erasmus+ Zero-Risk Terms",
    simDefault: "Select a test scenario above to see our AI agent in action..."
  },
  tr: {
    statusPill: "2027 Bahar Stajı & Uzaktan AI Projeleri İçin Uygun",
    heroTitle: "Otonom yapay zeka sistemleri, hızlı web platformları ve viral medya üretiyoruz.",
    heroSubtitle: "Bağımsız dijital mühendislik ve yaratıcı operasyon stüdyosu. En son yapay zeka teknolojilerini 5 yıldızlı misafir ve müşteri deneyimleriyle buluşturuyoruz.",
    btnWork: "Projeleri İncele ↓",
    btnContact: "İletişime Geç ↗",
    bentoAITitle: "Otonom Çoklu Ajan AI Sistemleri",
    bentoAIDesc: "Karmaşık operasyonları otomatize eden yapay zeka mimarileri kuruyoruz: 9 kanallı eşzamanlı iletişim, veri madenciliği, anlık doğrulama ve CRM entegrasyonları.",
    bentoWebTitle: "Yüksek Hızlı Web & Yerel SEO",
    bentoWebDesc: "Saniyenin altında açılış hızları, tertemiz kod mimarisi, yüksek dönüşümlü rezervasyon altyapısı ve Google arama hakimiyeti.",
    bentoMediaTitle: "Yeni Nesil AI Video & Görsel İçerik",
    bentoMediaDesc: "Higgsfield AI ve profesyonel kurguyla yüksek izlenme oranlı 4K dikey videolar (Reels/TikTok) ve marka medyası üretimi.",
    bentoToolsTitle: "Özel Ofis & Süreç Otomasyonları",
    bentoToolsDesc: "Tekrarlayan ofis işlerini sıfırlıyoruz: Excel/Word otomasyonları, tarayıcı araçları ve akıllı bildirim botları.",
    projectsHead: "Canlı Müşteri Projeleri",
    projectsDesc: "Gerçek dünyada canlıda çalışan, ciro üreten ve kullanılan sistemler.",
    contactTitle: "Birlikte Güçlü Sistemler Kuralım.",
    contactDesc: "2027 sezonu için stajyer arayan Avrupalı bir turizm partneri veya işini dijitalleştirmek isteyen bir işletmeyseniz, kanalımız açık.",
    btnWhatsapp: "WhatsApp'tan Yazın",
    btnEmail: "E-Posta Gönderin",
    simTitle: "Canlı AI Concierge Simülatörü",
    simP1: "💬 Test: Çok Dilli Rezervasyon Sorusu",
    simP2: "⚡ Test: Hız & SEO Analizi",
    simP3: "🛡️ Test: Erasmus+ 2027 Şartları",
    simDefault: "Yapay zeka asistanımızın nasıl çalıştığını görmek için yukarıdaki senaryolardan birine tıklayın..."
  }
};

let currentLang = 'en';

// Simulator Simulation Outputs
const simResponses = {
  en: {
    p1: `[GUEST INQUIRY]: "Do you have pet-friendly garden suites with sea view for April 2027?"\n\n🤖 [AI CONCIERGE]: "Hello! Yes, our Private Garden Suites welcome pets and offer direct sea panorama. For April 2027, our best direct rate is €140/night including gourmet breakfast. Would you like me to reserve this directly with no booking fees?"`,
    p2: `[SYSTEM AUDIT]: Target: wilderose.gr\n\n⚡ Speed Benchmark: TTFB 280ms (Fast)\n🔍 SEO Scan: Missing OpenGraph WhatsApp cards & German hreflang tags.\n🛠️ Actionable Fix: Multi-language structured Schema deployed. Mobile booking conversion boosted by ~28%.`,
    p3: `[ERASMUS+ 2027 VERIFICATION]:\n\n✅ University Grant: €1,500/month combined EU funding.\n✅ Legal Status: Official EU educational mobility — zero host payroll tax.\n✅ Insurance: Comprehensive international health, accident & liability 100% pre-arranged.\n✅ Host Requirement: Private double staff room + meals.`
  },
  tr: {
    p1: `[MİSAFİR SORUSU]: "Nisan 2027 için evcil hayvan kabul eden deniz manzaralı süitiniz var mı?"\n\n🤖 [AI ASİSTAN]: "Merhabalar! Evet, Özel Bahçe Süitlerimiz evcil hayvan dostudur ve doğrudan deniz manzarasına sahiptir. Nisan 2027 için doğrudan rezervasyona özel kahvaltı dahil gecelik 140€'dur. Komisyonsuz ayıralım mı?"`,
    p2: `[SİSTEM DENETİMİ]: Hedef: wilderose.gr\n\n⚡ Hız Skoru: TTFB 280ms (Mükemmel)\n🔍 SEO Taraması: WhatsApp zengin kartları ve Almanca hreflang eksik.\n🛠️ Çözüm: Çok dilli Schema entegre edildi. Mobil rezervasyon dönüşümü %28 artırıldı.`,
    p3: `[ERASMUS+ 2027 GÜVENCE DOĞRULAMASI]:\n\n✅ Hibe Durumu: Üniversiteden aylık 1.500 € tam AB hibesi cepte.\n✅ Yasal Statü: AB eğitim stajı — işletmeye sıfır vergi ve sıfır çalışma izni yükü.\n✅ Sigortalar: Uluslararası kaza, sağlık ve mesuliyet sigortaları %100 hazır.\n✅ Tek Talep: Çift kişilik personel odası + yemek.`
  }
};

// Set Language
function setLanguage(lang) {
  currentLang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18n[lang] && i18n[lang][key]) {
      el.textContent = i18n[lang][key];
    }
  });
  
  const langBtn = document.getElementById('langToggle');
  if (langBtn) {
    langBtn.textContent = lang === 'en' ? 'TR 🌐' : 'EN 🌐';
  }

  // Reset simulator prompt text
  const simOutput = document.getElementById('simOutput');
  if (simOutput) {
    simOutput.textContent = i18n[lang].simDefault;
  }
}

// Interactive Simulator Logic
function runSim(scenario) {
  const outputEl = document.getElementById('simOutput');
  if (!outputEl) return;

  outputEl.textContent = "Connecting to agent...";
  setTimeout(() => {
    outputEl.textContent = simResponses[currentLang][scenario];
  }, 300);
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  const langBtn = document.getElementById('langToggle');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      setLanguage(currentLang === 'en' ? 'tr' : 'en');
    });
  }

  // Simulator Buttons
  document.querySelectorAll('[data-sim]').forEach(btn => {
    btn.addEventListener('click', () => {
      const scen = btn.getAttribute('data-sim');
      runSim(scen);
    });
  });

  setLanguage('en');
});
