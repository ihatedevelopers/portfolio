// Tüm metinler ve projeler (EN + TR). Yeni proje eklemek için PROJECTS'e bir kayıt eklemek yeterli.

export const CONTACT = {
  email: "itsomervural@gmail.com",
  whatsapp: "905317114577",
  whatsappLabel: "+90 531 711 45 77",
  linkedin: "https://www.linkedin.com/in/%C3%B6mer-vural-62b991200",
};

// kind: "site" = Rota'da (müşteri/işletme siteleri), "lab" = Atölye'de (kendi ürün ve araçlarımız).
// Görseller: assets/v4/cards/<id>-1200.webp ve -600.webp (3:2). video: assets/v4/reels/<video>.mp4
const C = (id) => `assets/v4/cards/${id}-1200.webp`;
// Rota siteleri: monitör çerçevesinde tam görünen 16:10 kareler (assets/v4/screens/<id>-1280/-640.webp)
const S = (id) => `assets/v4/screens/${id}-1280.webp`;
// Atölye kapakları: assets/v4/covers/<id>-l.webp (yatay 1920x1200) ve -p.webp (dikey 1080x1600)
export const PROJECTS = [
  {
    id: "loving", kind: "site", shot: S("loving"), color: "#7fb8c9", icon: "🏝️", url: "https://ihatedevelopers.github.io/loving-strangers/",
    title: "Loving Strangers",
    tag: { en: "Hostel · Pico, Azores", tr: "Hostel · Pico, Azorlar" },
    text: {
      en: "A hostel site drawn like the hostel's own tile art: you fly over an ink-style 3D island, visit four artist rooms, climb the summit and tear a ticket for a promo code.",
      tr: "Hostelin kendi çini çizimleri gibi çizilmiş bir site: mürekkep tarzı 3D adanın üstünden uçuyor, dört sanatçı odasını geziyor, zirveye tırmanıyor, bileti yırtıp indirim kodu alıyorsun.",
    },
    stack: ["Three.js", "GSAP", "Vite", "3D storytelling"],
  },
  {
    id: "ares", kind: "site", shot: S("ares"), color: "#e0a458", icon: "☕", url: "https://ares-house-cafe.netlify.app/",
    title: "Ares House Cafe",
    tag: { en: "Cafe · Konya", tr: "Kafe · Konya" },
    text: {
      en: "A cafe site with a marbling (ebru) effect, the full photographed menu of 146 items and QR labels for every table.",
      tr: "Ebru efektli bir kafe sitesi; 146 ürünlük fotoğraflı tam menü ve her masa için QR etiketi.",
    },
    stack: ["Three.js", "QR table labels", "Mobile-first"],
  },
  {
    id: "taxi", kind: "site", shot: S("taxi"), color: "#ffb627", icon: "🚕", url: "https://urgupterminaltaxi.com/",
    title: "Ürgüp Terminal Taksi",
    tag: { en: "Local business · Own domain", tr: "Yerel işletme · Özel alan adı" },
    text: {
      en: "A 24/7 taxi in the heart of Cappadocia: one tap to WhatsApp or call, a route price calculator, airport transfers and a site that ranks on Google for tourists landing in Ürgüp.",
      tr: "Kapadokya'nın kalbinde 7/24 taksi: tek dokunuşla WhatsApp ya da arama, rota hesaplayıcı, havalimanı transferi ve Ürgüp'e gelen turistlerin Google'da bulduğu bir site.",
    },
    stack: ["Custom domain", "WhatsApp CTA", "Route calculator", "Local SEO"],
  },
  {
    id: "kardesler", kind: "site", shot: S("kardesler"), color: "#ff8a5b", icon: "🍽️", url: "https://kardesler-restorant.lovable.app/",
    title: "Kardeşler Restaurant",
    tag: { en: "Restaurant · QR menu", tr: "Restoran · QR menü" },
    text: {
      en: "A fast mobile menu that opens instantly at the table from a QR code, with rich food photography and a strong local Google presence.",
      tr: "Masada QR koddan anında açılan hızlı mobil menü; iştah açan yemek fotoğrafları ve güçlü yerel Google görünürlüğü.",
    },
    stack: ["Mobile-first UI", "Dynamic QR menu", "Local SEO"],
  },
  {
    id: "artviva", kind: "site", shot: "assets/v4/promo/flipbook.webp", video: "assets/v4/promo/flipbook.mp4", color: "#c9a26b", icon: "📖", url: "",
    title: "Flipbook catalogues",
    titleTr: "Flipbook kataloglar",
    tag: { en: "We build these for you", tr: "Sizin için yapıyoruz" },
    text: {
      en: "Page-turning online brochures built straight from your spreadsheet: search, favourites, a map and a link for every tour. The clip is a 2027 catalogue we made for a tour operator in Florence.",
      tr: "Doğrudan Excel tablonuzdan üretilen, sayfaları çevrilen online broşürler: arama, favoriler, harita ve her tur için ayrı link. Videodaki, Floransa'daki bir tur şirketi için yaptığımız 2027 kataloğu.",
    },
    stack: ["Built from Excel", "Search & favourites", "Mobile page mode"],
  },
  {
    id: "mokissos", kind: "site", shot: "assets/v4/promo/mokissos-1280.webp", shotTr: "assets/v4/promo/mokissos-tr-1280.webp", color: "#9bb87a", icon: "🧾", url: "",
    title: "Mokissos Kasa",
    tag: { en: "Faculty cafe · Order system", tr: "Fakülte kafesi · Sipariş sistemi" },
    text: {
      en: "A free system for a faculty cafe: guests scan the QR at their table to see the menu and rate their visit, staff run 40 tables from one cashier screen that syncs live, with an end-of-day report and a monthly menu planner.",
      tr: "Bir fakülte kafesi için ücretsiz sistem: misafir masadaki QR'ı okutup menüyü görür ve ziyaretini puanlar; personel 40 masayı canlı eşitlenen tek bir kasa ekranından yönetir; gün sonu raporu ve aylık menü planlayıcı da var.",
    },
    stack: ["Supabase realtime", "Cloudflare Pages", "QR menu"],
  },
  {
    id: "lotus", kind: "site", shot: S("lotus"), color: "#e8a0b4", icon: "🏐", url: "https://lotus-voleybol.lovable.app/",
    title: "Lotus Voleybol",
    tag: { en: "Sports club · Enrolment", tr: "Spor kulübü · Kayıt" },
    text: {
      en: "A warm, parent-friendly site for a youth volleyball and basketball club in Aksaray, with branches, coaches, Google reviews and a free trial lesson sign-up.",
      tr: "Aksaray'da bir voleybol ve basketbol kulübü için velilere güven veren, sıcak bir site: branşlar, antrenörler, Google yorumları ve ücretsiz deneme antrenmanı kaydı.",
    },
    stack: ["Trial sign-up", "Google reviews", "Mobile-first", "Brand story"],
  },
  {
    id: "atikeler", kind: "site", shot: S("atikeler"), color: "#ff7eb6", icon: "✨", url: "https://atikeler-estetik.netlify.app/",
    title: "Atikeler Estetik",
    tag: { en: "Clinic · Booking funnel", tr: "Klinik · Randevu sistemi" },
    text: {
      en: "A clinic portal that turns visitors into consultations: multilingual treatment pages and a direct booking flow.",
      tr: "Ziyaretçiyi ön görüşmeye çeviren klinik portalı: çok dilli işlem sayfaları ve doğrudan randevu akışı.",
    },
    stack: ["Direct booking", "Lead funnel", "Multilingual"],
  },
  {
    id: "palace", kind: "site", shot: S("palace"), color: "#b48cff", icon: "🏛️", url: "https://palace-garden-aksaray.netlify.app/",
    title: "Palace Garden",
    tag: { en: "Event venue · Showcase", tr: "Davet mekanı · Vitrin" },
    text: {
      en: "A prestige venue site with immersive photo galleries and an automatic VIP enquiry flow for weddings and events.",
      tr: "Etkileyici fotoğraf galerileri ve düğün/davetler için otomatik VIP talep akışı olan prestijli mekan sitesi.",
    },
    stack: ["Luxury showcase", "VIP enquiries", "Gallery"],
  },
  {
    id: "forgeone", kind: "site", shot: S("forgeone"), color: "#b6f23a", icon: "🏋️", url: "https://forgeone-demo-suite.netlify.app/",
    title: "FORGEONE",
    tag: { en: "Gym · Sales demo", tr: "Spor salonu · Satış demosu" },
    text: {
      en: "A demo we show to gym owners: memberships, class booking, workout plans and progress tracking in one modern web app.",
      tr: "Spor salonu sahiplerine gösterdiğimiz demo: üyelikler, ders rezervasyonu, antrenman programları ve gelişim takibi tek bir modern web uygulamasında.",
    },
    stack: ["React", "TypeScript", "Class booking", "Member dashboard"],
  },
  {
    id: "vtdiag", kind: "lab", shot: C("vtdiag"), cover: "assets/v4/covers/vtdiag", color: "#ff4655", icon: "🩺", url: "https://github.com/ihatedevelopers/vtdiag",
    title: "VTDiag",
    tag: { en: "Windows tool · FPS games", tr: "Windows aracı · FPS oyunları" },
    text: {
      en: "A free tool that finds and fixes what makes FPS games stutter. It scans the PC, matches the symptoms against hundreds of solved cases and offers one-click fixes that ask first, back up and can be undone.",
      tr: "FPS oyunlarındaki takılmaların sebebini bulup çözen ücretsiz bir araç. Bilgisayarı tarar, belirtileri yüzlerce çözülmüş vakayla karşılaştırır ve önce soran, yedek alan, geri alınabilen tek tık düzeltmeler sunar.",
    },
    stack: [".NET 10", "C#", "Open source", "EN / TR"],
    linkLabel: { en: "See it on GitHub", tr: "GitHub'da gör" },
  },
  {
    id: "game", kind: "lab", shot: C("game"), cover: "assets/v4/covers/game", color: "#f2c14e", icon: "🎟️", url: "",
    title: "Milyonluk Bilet",
    tag: { en: "Game in development · Godot", tr: "Geliştirilen oyun · Godot" },
    text: {
      en: "We're building a 3D game: a winning lottery ticket is lost in a dump of two million pieces of trash, and you dig, sort and build machines until you find it. Currently in development.",
      tr: "Bir 3D oyun geliştiriyoruz: ikramiye çıkan bilet iki milyon parça çöpün arasında kaybolmuş; kazıyor, ayıklıyor, makineler kuruyor ve sonunda buluyorsun. Şu an geliştirme aşamasında.",
    },
    stack: ["Godot 4.7", "GDScript", "3D", "TR / EN"],
  },
  {
    id: "pilot", kind: "lab", shot: C("pilotapp"), cover: "assets/v4/covers/pilot", color: "#4fd1c5", icon: "✈️", url: "https://ihatedevelopers.github.io/erasmuspilot/",
    title: "Erasmus Pilot",
    tag: { en: "Our product · For students", tr: "Kendi ürünümüz · Öğrenciler için" },
    text: {
      en: "A service we built for Erasmus students who struggle to find a traineeship. The app finds host businesses across Europe, sends the applications and keeps track of every reply.",
      tr: "Staj yeri bulmakta zorlanan Erasmus öğrencileri için geliştirdiğimiz bir hizmet. Uygulama Avrupa'daki uygun işletmeleri bulur, başvuruları gönderir ve her cevabı takip eder.",
    },
    stack: ["Windows app", "Python", "Encrypted on your PC"],
    linkLabel: { en: "Product site", tr: "Ürün sitesi" },
  },
  {
    id: "fps", kind: "lab", shot: C("fps"), cover: "assets/v4/covers/fps", color: "#e5484d", icon: "🎮", url: "https://ihatedevelopers.github.io/fps-rehberi/",
    title: "FPS Rehberi",
    titleEn: "FPS Guide",
    tag: { en: "Free guide", tr: "Ücretsiz rehber" },
    text: {
      en: "A free step-by-step guide to more FPS and smoother games, on any PC: only settings that were measured, nothing that puts the system at risk.",
      tr: "Her bilgisayarda daha yüksek FPS ve daha akıcı oyun için ücretsiz, adım adım rehber: sadece ölçülmüş ayarlar, sisteme risk veren hiçbir şey yok.",
    },
    stack: ["Mobile friendly", "Step by step", "Free"],
    linkLabel: { en: "Open the guide", tr: "Rehberi aç" },
  },
  {
    id: "passaparola", kind: "lab", shot: C("passaparola"), cover: "assets/v4/covers/passaparola", color: "#7aa2f7", icon: "🔤", url: "",
    title: "Harf Çemberi",
    titleEn: "Letter Wheel",
    tag: { en: "Classroom game", tr: "Sınıf oyunu" },
    text: {
      en: "A letter-wheel quiz for language and gastronomy classes: a teacher screen for the projector, 2,551 words in levelled pools and tracking so no word repeats too soon.",
      tr: "Dil ve gastronomi dersleri için harf çemberi yarışması: projeksiyona öğretmen ekranı, seviyelere ayrılmış 2.551 kelime ve kelimeler erken tekrar etmesin diye takip.",
    },
    stack: ["One HTML file", "Teacher mode", "Offline"],
  },
  {
    id: "mezun", kind: "lab", shot: C("mezun"), cover: "assets/v4/covers/mezun", color: "#d4a373", icon: "🎓", url: "https://ihatedevelopers.github.io/asu-mezun-agi/",
    title: "Mezun Ağı",
    titleEn: "Alumni Network",
    tag: { en: "For universities", tr: "Üniversiteler için" },
    text: {
      en: "We build alumni networks for universities and graduates: sign-up, surveys, news and stories that keep a graduating class connected after the last exam.",
      tr: "Üniversiteler ve mezunlar için mezun ağları kuruyoruz: kayıt, anketler, duyurular ve son sınavdan sonra da bir mezun topluluğunu bir arada tutan hikayeler.",
    },
    stack: ["Web platform", "Surveys", "Mobile-first"],
    linkLabel: { en: "See a demo", tr: "Demoyu gör" },
  },
  {
    id: "sdweb", kind: "lab", shot: C("sdweb"), cover: "assets/v4/covers/sdweb", color: "#4c7cf0", icon: "🦋", url: "",
    title: "Studio Digitalist",
    tag: { en: "Our studio site · In progress", tr: "Stüdyo sitemiz · Yapım aşamasında" },
    text: {
      en: "Our studio site, still in the workshop: an AI-generated intro where a butterfly dissolves into our logo.",
      tr: "Stüdyo sitemiz, hâlâ atölyede: kelebeğin dağılıp logomuza dönüştüğü, yapay zekâyla üretilmiş bir giriş.",
    },
    stack: ["Google Flow", "Veo 3.1", "ffmpeg"],
  },
  {
    id: "engine", kind: "engine", shot: "assets/shots/engine.webp", color: "#7bd88f", icon: "🤖", url: "",
    title: "Outreach Engine",
    tag: { en: "Automation · Case study", tr: "Otomasyon · Vaka çalışması" },
    text: {
      en: "Our in-house Python system: it finds tourism businesses across Europe, checks every site and mail server, sends personalised outreach from 9 mailboxes, sorts every reply and drafts the next answer. 71,369 emails sent in 14 weeks.",
      tr: "Kendi Python sistemimiz: Avrupa'daki turizm işletmelerini bulur, her siteyi ve mail sunucusunu kontrol eder, 9 hesaptan kişiselleştirilmiş mail gönderir, her cevabı ayırır ve sıradaki cevabı hazırlar. 14 haftada 71.369 mail gönderildi.",
    },
    stack: ["Python", "SQLite", "Overture Maps", "Claude Code agents"],
  },
  {
    id: "studio", kind: "studio", shot: "assets/gallery/beauty-glow.webp", color: "#ff6b8b", icon: "🎬", url: "", gallery: true,
    title: "Müge's Studio",
    tag: { en: "Design · AI video", tr: "Tasarım · AI video" },
    text: {
      en: "Social media campaigns, price lists and branding for Beauty House, eye-catching YouTube thumbnails and cinematic AI short videos.",
      tr: "Beauty House için sosyal medya kampanyaları, fiyat listesi ve marka kimliği; dikkat çeken YouTube kapakları ve sinematik AI kısa videolar.",
    },
    stack: ["Social media", "Branding", "Thumbnails", "Higgsfield AI video"],
  },
];

// Stüdyo telefonundaki reeller (dikey). Drive "Social Media Content Samples" klasöründeki örnekler + PvP Radarı.
// assets/v4/reels/<id>.mp4 + .webp
export const REELS = [
  { id: "sdreel", en: "@studiodigitalist", tr: "@studiodigitalist" },
  { id: "ask", en: "@sinemaotag", tr: "@sinemaotag" },
  { id: "alcatraz", en: "Kusursuz Kurgu", tr: "Kusursuz Kurgu" },
  { id: "pvp", en: "PvP Radarı", tr: "PvP Radarı" },
  { id: "web", en: "Web & apps offer", tr: "Web ve uygulama" },
  { id: "florence", en: "Florence tour reel", tr: "Floransa tur reeli" },
  { id: "etnoland", en: "Croatia, hotel pitch", tr: "Hırvatistan, otel" },
  { id: "elmare", en: "Wine estate, Dutch", tr: "Şarap çiftliği, NL" },
  { id: "lapalma", en: "La Palma, German", tr: "La Palma, Almanca" },
  { id: "oneline", en: "Design agency spec", tr: "Ajans tanıtımı" },
  { id: "yb01", en: "Pet adoption page", tr: "Sahiplendirme sayfası" },
];

// Yönettiğimiz sayfalar (Stüdyo bölümünde liste)
export const ACCOUNTS = [
  { net: "ig", handle: "@studiodigitalist", url: "https://www.instagram.com/studiodigitalist/", en: "PC, FPS and web tips, our own studio", tr: "PC, FPS ve web ipuçları, kendi stüdyomuz" },
  { net: "ig", handle: "@sinemaotag", url: "https://www.instagram.com/sinemaotag/", en: "Film lists and \"what would you do?\" polls", tr: "Film listeleri ve \"sen olsan?\" anketleri" },
  { net: "ig", handle: "@kusursuzkurgu", url: "https://www.instagram.com/kusursuzkurgu/", en: "True stories, told like documentaries", tr: "Belgesel gibi anlatılan gerçek hikayeler" },
  { net: "ig", handle: "@pvpradari", url: "https://www.instagram.com/pvpradari/", en: "Weekly game server news", tr: "Haftalık oyun sunucusu haberleri" },
  { net: "yt", handle: "PvP Radarı", url: "https://www.youtube.com/@PvPRadar%C4%B1/videos", en: "Long-form weekly episodes and Shorts", tr: "Haftalık uzun bölümler ve Shorts" },
  { net: "yt", handle: "Kusursuz Kurgu", url: "https://www.youtube.com/@kusursuzkurgu", en: "15-minute documentaries and Shorts", tr: "15 dakikalık belgeseller ve Shorts" },
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
      en: "Builds websites, local SEO, AI agent systems and automations that remove boring, repetitive office work. Also ships an open-source tool and a Godot game. Tourist guiding graduate.",
      tr: "Sıkıcı, tekrar eden ofis işlerini ortadan kaldıran web siteleri, yerel SEO, AI ajan sistemleri ve otomasyonlar kurar. Açık kaynak bir araç ve bir Godot oyunu da yaptı. Turist rehberliği mezunu.",
    },
    skills: ["Python", "Web & SEO", "AI agents", "Automation", "Godot"],
  },
  {
    id: "muge", name: "Rabia Müge Emiroğlu", photo: "assets/muge_avatar.webp",
    role: { en: "Creative Director & Content", tr: "Kreatif Direktör & İçerik" },
    text: {
      en: "Creates scroll-stopping Reels and TikToks with AI video tools, designs brand visuals and knows hospitality from the inside. Tourism graduate.",
      tr: "AI video araçlarıyla akışı durduran Reels ve TikTok'lar üretir, marka görselleri tasarlar ve misafirperverliği içeriden bilir. Turizm mezunu.",
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
    hireTitle: "Studio Digitalist",
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
    hireTitle: "Studio Digitalist",
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
    omer: "Ömer is the automation wizard: Python, websites, SEO and AI agents. He made a system that has sent 71,000+ emails on its own!",
    muge: "Müge is the creative director: AI short videos, Reels, branding and photography. Check her studio screen!",
    services: "We build fast websites, local SEO, booking flows, AI automations for repetitive office work, and short videos for social media.",
    hire: "Ömer & Müge take on websites, automations and video projects. Write to them, they answer!",
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
    omer: "Ömer otomasyon büyücüsü: Python, web siteleri, SEO ve AI ajanları. Kendi kendine 71.000'den fazla mail gönderen bir sistem yaptı!",
    muge: "Müge kreatif direktör: AI kısa videolar, Reels, marka tasarımı ve fotoğraf. Stüdyo ekranına bir bak!",
    services: "Hızlı web siteleri, yerel SEO, rezervasyon akışları, tekrar eden ofis işleri için AI otomasyonları ve sosyal medya videoları yapıyoruz.",
    hire: "Ömer & Müge web sitesi, otomasyon ve video projeleri alıyor. Yazın, cevap veriyorlar!",
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
