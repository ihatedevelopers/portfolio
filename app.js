/**
 * Ömer & Müge — Digital Systems & Creative Media Studio
 * Lightweight, zero-dependency client application
 */

(function () {
  'use strict';

  // Translations Dictionary
  const translations = {
    en: {
      navWork: "Deployments",
      navDuo: "The Duo",
      navMedia: "Media Lab",
      navServices: "Capabilities",
      navContact: "Contact",
      navCta: "Let's Talk",
      heroBadge: "Independent Digital & Creative Studio",
      heroTitle: "Where technical engineering meets visual storytelling.",
      heroDesc: "We are <strong>Ömer Vural</strong> and <strong>Rabia Müge Emiroğlu</strong>. We build high-speed web platforms, custom workflow automations, and cinematic short-form media for modern businesses, hospitality brands, and boutique operations.",
      heroBtnWork: "Explore Deployments",
      heroBtnContact: "Get in Touch",
      metric1: "Live Deployments",
      metric2: "Sub-Second Load Times",
      metric3: "AI Video Workflows",
      metric4: "Custom Engineering",
      deployTag: "PRODUCTION WORK",
      deployTitle: "Selected Client Deployments",
      deploySubtitle: "Real platforms, active clients, and measured business impact in production.",
      p1Cat: "Hospitality & Dining",
      p1Desc: "Modern digital menu platform featuring high-resolution food curation, instant table-side mobile browsing, and strong local search footprint.",
      p2Cat: "Food & Fast-Casual",
      p2Desc: "Ultra-fast mobile landing engine designed for instantaneous ordering decisions, dynamic pricing updates, and Google Business local dominance.",
      p3Cat: "Medical & Aesthetics",
      p3Desc: "High-conversion clinical portal with direct consultation booking funnels, multilingual aesthetic procedure showcase, and lead acquisition routes.",
      p4Cat: "Luxury Events & Venue",
      p4Desc: "Luxury wedding and event venue digital showcase with immersive architectural photography galleries and automated VIP reservation inquiry routing.",
      duoTag: "THE DUO",
      duoTitle: "Two Distinct Disciplines. One Unified Studio.",
      duoSubtitle: "We operate as an agile two-person powerhouse, combining rigorous software engineering with cinematic visual direction.",
      omerBadge: "Systems & Code",
      omerRole: "Technical Architect & Automation Engineer",
      omerBio: "Tenacious problem solver with deep expertise in Python, custom multi-inbox workflow automations, sub-second web architectures, and technical SEO. Eliminates manual operational drag by building custom tools, data pipelines, and responsive digital products.",
      mugeBadge: "Creative & Media",
      mugeRole: "Creative Director & Visual Strategist",
      mugeBio: "Visual storyteller leveraging Higgsfield AI and camera-grade composition to produce high-retention short-form video (Reels & TikTok). Crafts distinctive brand aesthetics, engages online audiences, and delivers warm, articulate guest relations in international environments.",
      mediaTag: "CREATIVE PRODUCTION",
      mediaTitle: "Visual Storytelling & AI Video Production",
      mediaSubtitle: "Crafting thumb-stopping short-form content and high-aesthetic brand assets that captivate audiences.",
      videoPill: "4K / 60 FPS • Higgsfield AI Production",
      videoTitle: "Next-Gen AI Short-Form Video",
      videoDesc: "Combining generative AI camera motion with precision pacing to create cinematic social media assets that convert viewers into loyal guests and customers.",
      vCard1Title: "Cinematic Short-Form Video",
      vCard1Desc: "High-retention Reels and TikTok content engineered to stop scrolling and build brand desire.",
      vCard2Title: "Brand Aesthetic Direction",
      vCard2Desc: "Refined color palettes, modern typography systems, and visual guidelines that exude quality.",
      vCard3Title: "Autonomous Workflow Tooling",
      vCard3Desc: "Custom Python backend scripts for multi-inbox synchronization, lead mining, and real-time operations.",
      capTag: "STUDIO SERVICES",
      capTitle: "Core Capabilities",
      capSubtitle: "Every solution is built from first principles — no bloated templates, no unnecessary dependencies.",
      c1Title: "High-Speed Web Platforms",
      c1Desc: "Sub-second page speeds, mobile-first responsive architecture, clean semantic code, and seamless conversion pathways.",
      c2Title: "Custom Workflow Automations",
      c2Desc: "Autonomous Python backends, multi-inbox synchronization engines, automated report builders, and data parsing pipelines.",
      c3Title: "AI Video & Visual Strategy",
      c3Desc: "4K high-retention video production utilizing Higgsfield AI, social storytelling, and distinct visual brand identities.",
      c4Title: "Technical & Local SEO",
      c4Desc: "Structured data markup, Google Maps ranking optimization, multi-language hreflang implementation, and search visibility.",
      contactBadge: "DIRECT INQUIRIES",
      contactTitle: "Let's build something exceptional together.",
      contactSubtitle: "Whether you are a European hospitality partner, a boutique hotel, or a business looking to upgrade your digital operations — our channel is direct and responsive.",
      btnWhatsapp: "WhatsApp: +90 531 711 45 77",
      btnEmail: "Email: itsomervural@gmail.com",
      contactNote: "Based in Aksaray, Turkey • Deploying Remotely & On-Site Worldwide",
      footerDesc: "Digital Systems & Creative Media Studio"
    },
    tr: {
      navWork: "Projeler",
      navDuo: "Hakkımızda",
      navMedia: "Medya & Video",
      navServices: "Yetkinlikler",
      navContact: "İletişim",
      navCta: "Görüşelim",
      heroBadge: "Bağımsız Dijital & Görsel Stüdyo",
      heroTitle: "Mühendislik ve görsel anlatının buluştuğu dijital stüdyo.",
      heroDesc: "Biz <strong>Ömer Vural</strong> ve <strong>Rabia Müge Emiroğlu</strong>. İşletmeler, butik turizm tesisleri ve modern markalar için yüksek hızlı web platformları, otonom yapay zeka iş akışları ve sinematik kısa video içerikleri üretiyoruz.",
      heroBtnWork: "Projeleri İncele",
      heroBtnContact: "İletişime Geç",
      metric1: "Canlı Proje",
      metric2: "Saniyenin Altında Açılış",
      metric3: "AI Video Üretimi",
      metric4: "Özel Yazılım & Mühendislik",
      deployTag: "CANLI PROJELER",
      deployTitle: "Canlı Müşteri Projeleri",
      deploySubtitle: "Gerçek işletmeler, yayında olan sistemler ve ölçülebilir dijital performans.",
      p1Cat: "Gastronomi & Dijital Menü",
      p1Desc: "Yüksek çözünürlüklü lezzet sunumu, masada anında açılan akıcı mobil menü deneyimi ve güçlü Google yerel arama varlığı.",
      p2Cat: "Hızlı Servis & Restoran",
      p2Desc: "Hızlı sipariş kararlarını kolaylaştıran, anlık fiyat güncelleme altyapısına sahip ve yerel Google harita sıralamasını güçlendiren mobil platform.",
      p3Cat: "Klinik & Medikal Estetik",
      p3Desc: "Doğrudan randevu ve ön görüşme dönüşümü sağlayan, çok dilli estetik işlem sunumu ve hasta kazanım altyapısına sahip klinik portalı.",
      p4Cat: "Lüks Etkinlik & Davet Alanı",
      p4Desc: "Etkileyici mimari fotoğraf galerileri ve otomatik VIP rezervasyon talep yönlendirme altyapısıyla donatılmış prestijli davet mekanı portalı.",
      duoTag: "KADRO",
      duoTitle: "İki Ayrı Uzmanlık. Tek Bir Güçlü Stüdyo.",
      duoSubtitle: "Yazılım mühendisliği, iş akışı otomasyonu ve sinematik görsel yönetmenliği bir araya getiren çevik iki kişilik stüdyo.",
      omerBadge: "Yazılım & Sistem",
      omerRole: "Sistem Mimarı & Otomasyon Geliştirici",
      omerBio: "Python, otonom iş akışı otomasyonları, yüksek hızlı web mimarileri ve teknik SEO konularında uzman, pes etmeyen problem çözücü. Rutin operasyonel yükleri sıfırlayan özel araçlar, veri hatları ve modern dijital platformlar inşa eder.",
      mugeBadge: "Kreatif & Medya",
      mugeRole: "Kreatif Direktör & Görsel Stratejist",
      mugeBio: "Higgsfield AI ve profesyonel kamera kompozisyonlarını harmanlayarak izlenme oranı yüksek dikey videolar (Reels/TikTok) üreten görsel hikaye anlatıcısı. Markalara özgün görsel kimlik kazandırır, sosyal kitleleri harekete geçirir ve sıcak misafir ilişkileri yürütür.",
      mediaTag: "GÖRSEL ÜRETİM",
      mediaTitle: "Görsel Hikaye Anlatımı & AI Video Üretimi",
      mediaSubtitle: "Sosyal medyada dikkatleri yakalayan, yüksek kaliteli kısa video ve görsel marka kimliği üretimi.",
      videoPill: "4K / 60 FPS • Higgsfield AI Prodüksiyonu",
      videoTitle: "Yeni Nesil Yapay Zeka Kısa Video",
      videoDesc: "Yapay zeka kamera hareketleri ve ritmik kurguyu birleştirerek izleyicileri gerçek misafir ve müşteriye dönüştüren sinematik sosyal medya içerikleri.",
      vCard1Title: "Sinematik Kısa Video (Reels/TikTok)",
      vCard1Desc: "Akışta dikkat çeken, markaya prestij ve ilgi kazandıran yüksek tutundurmalı dikey videolar.",
      vCard2Title: "Marka Kimliği & Görsel Tasarım",
      vCard2Desc: "Kalite hissi uyandıran renk paletleri, modern tipografi sistemleri ve marka estetiği rehberleri.",
      vCard3Title: "Özel Otomasyon Araçları",
      vCard3Desc: "Gereksiz el işlerini ortadan kaldıran Python arka plan otomasyonları ve veri eşitleme altyapıları.",
      capTag: "HİZMETLERİMİZ",
      capTitle: "Temel Yetkinliklerimiz",
      capSubtitle: "Tüm çözümler sıfırdan, amaca özel ve gereksiz kalıplardan uzak olarak inşa edilir.",
      c1Title: "Yüksek Hızlı Web Platformları",
      c1Desc: "Saniyeler içinde açılan sayfalar, mobil öncelikli arayüzler, temiz kod yapısı ve doğrudan dönüşüm kanalları.",
      c2Title: "Özel İş Akışı Otomasyonları",
      c2Desc: "Otonom Python altyapıları, çoklu gelen kutusu yönetimi, otomatik raporlama ve veri dönüştürme araçları.",
      c3Title: "AI Video & Görsel Strateji",
      c3Desc: "Higgsfield AI destekli 4K dikey video üretimi, sosyal medya hikaye anlatımı ve özgün görsel kimlik tasarımı.",
      c4Title: "Teknik & Yerel SEO",
      c4Desc: "Yapılandırılmış veri işaretlemeleri, Google Haritalar üst sıralama optimizasyonu ve çok dilli arama görünürlüğü.",
      contactBadge: "DOĞRUDAN İLETİŞİM",
      contactTitle: "Birlikte sıra dışı projeler üretelim.",
      contactSubtitle: "İster Avrupalı bir turizm partneri, ister bir butik işletme olun; dijital operasyonlarınızı ve görsel varlığınızı güçlendirmek için doğrudan bize ulaşabilirsiniz.",
      btnWhatsapp: "WhatsApp: +90 531 711 45 77",
      btnEmail: "E-posta: itsomervural@gmail.com",
      contactNote: "Aksaray, Türkiye merkezli • Uzaktan ve yerinde küresel iş birlikleri",
      footerDesc: "Dijital Sistemler & Kreatif Medya Stüdyosu"
    }
  };

  let currentLang = 'en';

  // Apply Language function
  function setLanguage(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    localStorage.setItem('om_studio_lang', lang);

    document.documentElement.lang = lang;

    // Update switcher UI
    const langEn = document.getElementById('langEn');
    const langTr = document.getElementById('langTr');
    if (langEn && langTr) {
      if (lang === 'en') {
        langEn.classList.add('active');
        langTr.classList.remove('active');
      } else {
        langTr.classList.add('active');
        langEn.classList.remove('active');
      }
    }

    // Replace all data-i18n elements
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang][key]) {
        el.innerHTML = translations[lang][key];
      }
    });
  }

  // Initialize Language
  function initLanguage() {
    const saved = localStorage.getItem('om_studio_lang');
    if (saved && translations[saved]) {
      setLanguage(saved);
    } else {
      // Check browser language
      const userLang = navigator.language || navigator.userLanguage;
      if (userLang && userLang.toLowerCase().startsWith('tr')) {
        setLanguage('tr');
      } else {
        setLanguage('en');
      }
    }

    const langSwitch = document.getElementById('langSwitch');
    if (langSwitch) {
      langSwitch.addEventListener('click', () => {
        setLanguage(currentLang === 'en' ? 'tr' : 'en');
      });
    }
  }

  // Video Controller
  function initVideo() {
    const video = document.getElementById('featuredVideo');
    const toggleBtn = document.getElementById('videoToggleBtn');
    const playIcon = document.getElementById('videoPlayIcon');

    if (!video || !toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
      if (video.paused) {
        video.play();
        if (playIcon) playIcon.textContent = '❚❚';
      } else {
        video.pause();
        if (playIcon) playIcon.textContent = '▶';
      }
    });

    video.addEventListener('play', () => {
      if (playIcon) playIcon.textContent = '❚❚';
    });

    video.addEventListener('pause', () => {
      if (playIcon) playIcon.textContent = '▶';
    });
  }

  // Navigation scroll observer
  function initNavScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.style.paddingTop = '8px';
        header.style.paddingBottom = '8px';
      } else {
        header.style.paddingTop = '16px';
        header.style.paddingBottom = '16px';
      }
    }, { passive: true });
  }

  // Initialize on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    initLanguage();
    initVideo();
    initNavScroll();
  });

})();
