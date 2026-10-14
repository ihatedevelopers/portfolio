// Tüm metinler ve projeler (EN + TR). Yeni proje eklemek için PROJECTS'e bir kayıt eklemek yeterli.

export const CONTACT = {
  email: "itsomervural@gmail.com",
  whatsapp: "905317114577",
  whatsappLabel: "+90 531 711 45 77",
  linkedin: "https://www.linkedin.com/in/%C3%B6mer-vural-62b991200",
};

export const PROJECTS = [
  {
    id: "kardesler", shot: "assets/shots/kardesler.webp", color: "#ff8a5b", icon: "🍽️", url: "https://kardesler-restorant.lovable.app/",
    title: "Kardeşler Restaurant",
    tag: { en: "Restaurant · QR menu", tr: "Restoran · QR menü" },
    text: {
      en: "A fast mobile menu that opens instantly at the table from a QR code, with rich food photography and a strong local Google presence.",
      tr: "Masada QR koddan anında açılan hızlı mobil menü; iştah açan yemek fotoğrafları ve güçlü yerel Google görünürlüğü.",
    },
    stack: ["Mobile-first UI", "Dynamic QR menu", "Local SEO"],
  },
  {
    id: "doner", shot: "assets/shots/doner.webp", color: "#ffc93c", icon: "🥙", url: "https://bibaskadoner.netlify.app/",
    title: "Bi Başka Döner",
    tag: { en: "Fast food · Mobile site", tr: "Hızlı servis · Mobil site" },
    text: {
      en: "A lightning-fast menu site that makes ordering decisions easy, with instant price updates and better Google Maps ranking.",
      tr: "Sipariş kararını kolaylaştıran, fiyatları anında güncellenebilen ve Google Haritalar sıralamasını güçlendiren hızlı site.",
    },
    stack: ["Edge hosting", "Instant load", "Google Maps"],
  },
  {
    id: "atikeler", shot: "assets/shots/atikeler.webp", color: "#ff7eb6", icon: "✨", url: "https://atikeler-estetik.netlify.app/",
    title: "Atikeler Estetik",
    tag: { en: "Clinic · Booking funnel", tr: "Klinik · Randevu sistemi" },
    text: {
      en: "A clinic portal that turns visitors into consultations: multilingual treatment pages and a direct booking flow.",
      tr: "Ziyaretçiyi ön görüşmeye çeviren klinik portalı: çok dilli işlem sayfaları ve doğrudan randevu akışı.",
    },
    stack: ["Direct booking", "Lead funnel", "Multilingual"],
  },
  {
    id: "palace", shot: "assets/shots/palace.webp", color: "#b48cff", icon: "🏛️", url: "https://palace-garden-aksaray.netlify.app/",
    title: "Palace Garden",
    tag: { en: "Event venue · Showcase", tr: "Davet mekanı · Vitrin" },
    text: {
      en: "A prestige venue site with immersive photo galleries and an automatic VIP enquiry flow for weddings and events.",
      tr: "Etkileyici fotoğraf galerileri ve düğün/davetler için otomatik VIP talep akışı olan prestijli mekan sitesi.",
    },
    stack: ["Luxury showcase", "VIP enquiries", "Gallery"],
  },
  {
    id: "taxi", shot: "assets/shots/taxi.webp", color: "#ffb627", icon: "🚕", url: "https://urgupterminaltaxi.com/",
    title: "Ürgüp Terminal Taksi",
    tag: { en: "Local business · Own domain", tr: "Yerel işletme · Özel alan adı" },
    text: {
      en: "A 24/7 taxi in the heart of Cappadocia: one tap to WhatsApp or call, a route price calculator, airport transfers and a site that ranks on Google for tourists landing in Ürgüp.",
      tr: "Kapadokya'nın kalbinde 7/24 taksi: tek dokunuşla WhatsApp ya da arama, rota hesaplayıcı, havalimanı transferi ve Ürgüp'e gelen turistlerin Google'da bulduğu bir site.",
    },
    stack: ["Custom domain", "WhatsApp CTA", "Route calculator", "Local SEO"],
  },
  {
    id: "lotus", shot: "assets/shots/lotus.webp", color: "#e8a0b4", icon: "🏐", url: "https://lotus-voleybol.lovable.app/",
    title: "Lotus Voleybol",
    tag: { en: "Sports club · Enrolment", tr: "Spor kulübü · Kayıt" },
    text: {
      en: "A warm, parent-friendly site for a youth volleyball and basketball club in Aksaray, with branches, coaches, Google reviews and a free trial lesson sign-up.",
      tr: "Aksaray'da bir voleybol ve basketbol kulübü için velilere güven veren, sıcak bir site: branşlar, antrenörler, Google yorumları ve ücretsiz deneme antrenmanı kaydı.",
    },
    stack: ["Trial sign-up", "Google reviews", "Mobile-first", "Brand story"],
  },
  {
    id: "forgeone", shot: "assets/shots/forgeone.webp", color: "#b6f23a", icon: "🏋️", url: "https://forgeone-demo-suite.netlify.app/",
    title: "FORGEONE",
    tag: { en: "Gym · Sales demo", tr: "Spor salonu · Satış demosu" },
    text: {
      en: "A demo we show to gym owners: memberships, class booking, workout plans and progress tracking in one modern web app.",
      tr: "Spor salonu sahiplerine gösterdiğimiz demo: üyelikler, ders rezervasyonu, antrenman programları ve gelişim takibi tek bir modern web uygulamasında.",
    },
    stack: ["React", "TypeScript", "Class booking", "Member dashboard"],
  },
  {
    id: "pilot", shot: "assets/shots/pilot.webp", color: "#4fd1c5", icon: "✈️", url: "https://erasmuspilot.lovable.app/",
    title: "Erasmus Pilot",
    tag: { en: "Our own product", tr: "Kendi ürünümüz" },
    text: {
      en: "A platform that helps students find Erasmus+ traineeships with accommodation, meals and an allowance. Officially announced to students by Nevşehir University's International Office.",
      tr: "Öğrencilerin konaklama, yemek ve harçlık içeren Erasmus+ stajı bulmasına yardım eden platform. Nevşehir Üniversitesi Uluslararası İlişkiler Ofisi tarafından öğrencilere resmi olarak duyuruldu.",
    },
    stack: ["Product design", "AI matching", "Visa data"],
  },
  {
    id: "engine", shot: "assets/shots/engine.webp", color: "#7bd88f", icon: "🤖", url: "",
    title: "Outreach Engine",
    tag: { en: "Automation · Case study", tr: "Otomasyon · Vaka çalışması" },
    text: {
      en: "Our in-house Python system: it finds tourism businesses across Europe, sends personalised applications from 9 mailboxes, reads every reply in 12 languages and drafts the next answer. 50,000+ emails handled.",
      tr: "Kendi Python sistemimiz: Avrupa'daki turizm işletmelerini bulur, 9 hesaptan kişiselleştirilmiş başvuru gönderir, 12 dilde gelen her cevabı okur ve sıradaki cevabı hazırlar. 50.000+ mail yönetildi.",
    },
    stack: ["Python", "Gmail automation", "12-language classifier", "Live dashboard"],
  },
  {
    id: "studio", shot: "assets/gallery/beauty-glow.webp", color: "#ff6b8b", icon: "🎬", url: "", gallery: true,
    title: "Müge's Studio",
    tag: { en: "Design · AI video", tr: "Tasarım · AI video" },
    text: {
      en: "Social media campaigns, price lists and branding for Beauty House, eye-catching YouTube thumbnails and cinematic AI short videos.",
      tr: "Beauty House için sosyal medya kampanyaları, fiyat listesi ve marka kimliği; dikkat çeken YouTube kapakları ve sinematik AI kısa videolar.",
    },
    stack: ["Social media", "Branding", "Thumbnails", "Higgsfield AI video"],
  },
];

export const GALLERY = [
  { src: "assets/gallery/beauty-glow.webp", cap: "Beauty House · campaign" },
  { src: "assets/gallery/beauty-laser.webp", cap: "Beauty House · laser offer" },
  { src: "assets/gallery/beauty-makeup.webp", cap: "Beauty House · permanent make-up" },
  { src: "assets/gallery/beauty-health.webp", cap: "Beauty House · healthcare discount" },
  { src: "assets/gallery/beauty-prices.webp", cap: "Beauty House · price list" },
  { src: "assets/gallery/beauty-logo.webp", cap: "Beauty House · logo" },
  { src: "assets/gallery/yt-casino.webp", cap: "YouTube thumbnail", wide: true },
  { src: "assets/gallery/yt-cars.webp", cap: "YouTube thumbnail", wide: true },
  { src: "assets/gallery/yt-3.webp", cap: "YouTube thumbnail", wide: true },
];

export const PEOPLE = [
  {
    id: "omer", name: "Ömer Vural", photo: "assets/omer_avatar.webp",
    role: { en: "Automation & Web Developer", tr: "Otomasyon & Web Geliştirici" },
    text: {
      en: "Builds websites, local SEO and AI automations that remove boring, repetitive office work. Stubborn problem solver. Two-time Erasmus student.",
      tr: "Sıkıcı, tekrar eden ofis işlerini ortadan kaldıran web siteleri, yerel SEO ve AI otomasyonları kurar. Pes etmeyen bir problem çözücü. İki kez Erasmus yaptı.",
    },
    skills: ["Python", "Web & SEO", "AI agents", "Automation", "Booking flows"],
  },
  {
    id: "muge", name: "Rabia Müge Emiroğlu", photo: "assets/muge_avatar.webp",
    role: { en: "Creative Director & Content", tr: "Kreatif Direktör & İçerik" },
    text: {
      en: "Creates scroll-stopping Reels and TikToks with AI video tools, designs brand visuals and is great with guests. Erasmus alumna.",
      tr: "AI video araçlarıyla akışı durduran Reels ve TikTok'lar üretir, marka görselleri tasarlar ve misafirlerle harika iletişim kurar. Erasmus mezunu.",
    },
    skills: ["AI video", "Reels / TikTok", "Branding", "Photography", "Guest relations"],
  },
];

export const UI = {
  en: {
    title: "Ömer & Müge",
    subtitle: "Web · Automation · Creative studio",
    boot: "BMO is booting…",
    start: "Press start",
    startHint: "Sound on • best with headphones",
    classic: "Classic view",
    sound: "Sound",
    visit: "Visit live site",
    privateCase: "Private system · demo on request",
    close: "Close",
    hint: "←/→ choose · Enter send · type anything",
    placeholder: "Ask BMO something…",
    team: "Who we are",
    projects: "Projects",
    contact: "Contact",
    hireTitle: "Erasmus+ 2027",
    footer: "Made by Ömer & Müge with Three.js. BMO is a fan-made tribute.",
  },
  tr: {
    title: "Ömer & Müge",
    subtitle: "Web · Otomasyon · Kreatif stüdyo",
    boot: "BMO açılıyor…",
    start: "Başlat",
    startHint: "Ses açık • kulaklıkla daha güzel",
    classic: "Klasik görünüm",
    sound: "Ses",
    visit: "Canlı siteye git",
    privateCase: "Özel sistem · istek üzerine demo",
    close: "Kapat",
    hint: "←/→ seç · Enter gönder · istediğini yaz",
    placeholder: "BMO'ya bir şey sor…",
    team: "Biz kimiz",
    projects: "Projeler",
    contact: "İletişim",
    hireTitle: "Erasmus+ 2027",
    footer: "Ömer & Müge tarafından Three.js ile yapıldı. BMO bir hayran çalışmasıdır.",
  },
};

// BMO'nun sohbet cevapları. "chips": ok tuşlarıyla seçilebilen öneriler.
export const CHAT = {
  en: {
    chips: ["projects", "who are you?", "hire us", "contact", "dance!"],
    hello: "Hi! I'm BMO. Welcome to Ömer & Müge's treehouse! Click a floating screen or ask me anything.",
    help: "I know about: projects, Ömer, Müge, services, hire us, contact. I can also dance!",
    projects: "These floating screens are our projects! Websites for real businesses, our own Erasmus Pilot, our automation engine and Müge's design studio. Click one!",
    about: "Ömer builds websites and automations. Müge makes videos and designs. Together they're a tiny, very fast studio. And I'm BMO!",
    omer: "Ömer is the automation wizard: Python, websites, SEO and AI agents. He made a system that reads 50,000 emails in 12 languages!",
    muge: "Müge is the creative director: AI short videos, Reels, branding and photography. Check her studio screen!",
    services: "We build fast websites, local SEO, booking flows, AI automations for repetitive office work, and short videos for social media.",
    hire: "Ömer & Müge are looking for a 6-month Erasmus+ traineeship from Feb–Mar 2027 in tourism or digital. Travel, visa and insurance are covered by them!",
    contact: "Email itsomervural@gmail.com or WhatsApp +90 531 711 45 77. I'll open the contact card for you!",
    dance: "♪ Who wants to play video games? ♪",
    unknown: "Hmm, BMO doesn't know that yet! Try: projects, hire us or contact.",
    thanks: "You're welcome, friend!",
  },
  tr: {
    chips: ["projeler", "siz kimsiniz?", "staj", "iletişim", "dans et!"],
    hello: "Selam! Ben BMO. Ömer & Müge'nin ağaç evine hoş geldin! Havadaki bir ekrana tıkla ya da bana bir şey sor.",
    help: "Şunları biliyorum: projeler, Ömer, Müge, hizmetler, staj, iletişim. Bir de dans edebilirim!",
    projects: "Havada süzülen ekranlar projelerimiz! Gerçek işletmeler için siteler, kendi ürünümüz Erasmus Pilot, otomasyon sistemimiz ve Müge'nin tasarım stüdyosu. Birine tıkla!",
    about: "Ömer web siteleri ve otomasyonlar kurar. Müge video ve tasarım yapar. Birlikte minik ama çok hızlı bir stüdyolar. Ben de BMO'yum!",
    omer: "Ömer otomasyon büyücüsü: Python, web siteleri, SEO ve AI ajanları. 12 dilde 50.000 maili okuyan bir sistem yaptı!",
    muge: "Müge kreatif direktör: AI kısa videolar, Reels, marka tasarımı ve fotoğraf. Stüdyo ekranına bir bak!",
    services: "Hızlı web siteleri, yerel SEO, rezervasyon akışları, tekrar eden ofis işleri için AI otomasyonları ve sosyal medya videoları yapıyoruz.",
    hire: "Ömer & Müge, Şubat-Mart 2027'den itibaren turizm ya da dijital alanda 6 aylık Erasmus+ stajı arıyor. Yol, vize ve sigorta onlardan!",
    contact: "itsomervural@gmail.com adresine yaz ya da WhatsApp: +90 531 711 45 77. İletişim kartını açıyorum!",
    dance: "♪ Kim video oyunu oynamak ister? ♪",
    unknown: "Hmm, BMO bunu henüz bilmiyor! Şunları dene: projeler, staj, iletişim.",
    thanks: "Rica ederim dostum!",
  },
};

// Basit anahtar kelime eşlemesi (EN + TR karışık yazılsa da çalışır).
export const INTENTS = [
  { id: "help", words: ["help", "yardım", "yardim", "ne biliyorsun", "menu"] },
  { id: "projects", words: ["project", "proje", "work", "iş", "portfolio", "site"] },
  { id: "omer", words: ["ömer", "omer"] },
  { id: "muge", words: ["müge", "muge", "rabia"] },
  { id: "about", words: ["who", "kim", "about", "hakkında", "hakkinda", "you", "siz"] },
  { id: "services", words: ["service", "hizmet", "what do you do", "ne yapıyorsunuz", "price", "fiyat"] },
  { id: "hire", words: ["hire", "erasmus", "staj", "intern", "trainee", "job", "iş teklifi"] },
  { id: "contact", words: ["contact", "iletişim", "iletisim", "mail", "whatsapp", "phone", "telefon", "linkedin"] },
  { id: "dance", words: ["dance", "dans", "song", "şarkı", "play", "oyun"] },
  { id: "thanks", words: ["thank", "teşekkür", "tesekkur", "sağol", "sagol"] },
];
