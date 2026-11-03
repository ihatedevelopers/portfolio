# Portfolyo notları (Studio Digitalist: Ömer & Müge)

Bu dosya, portfolyo sitesini ileride değiştirmek isteyen herkes için (insan ya da AI) rehberdir.
Canlı adres: https://ihatedevelopers.github.io/portfolio (GitHub Pages, repo: `ihatedevelopers/portfolio`).

## Konsept

**"Bir Balon Yolculuğu"**: Kapadokya'dan sinematik, kaydırmaya bağlı bir hikaye.
Ziyaretçi aşağı kaydırdıkça kalkar, bulutların içinden geçer, işleri "durak" olarak gezer ve iletişime iner.
3 Kasım 2026'dan beri site **genel bir iş portfolyosu**: kişisel/Erasmus anlatımı yok (Ömer'in kararı).
Başlık "Studio Digitalist"; girişte kelebeğin toza dağılıp SD logosuna dönüştüğü kendi AI videomuz oynar.

Gizli bir ikinci site daha var: **Ömer & Müge OS** (`os.html`). Pastel, retro bir masaüstü
(pencereler, dock, kedi, terminal, Paint, Balloon Pop oyunu). Ana sitenin en altındaki
"💾 gizli bir bilgisayar var" linkiyle açılır. OS'un sol üst menüsünde ana siteye dönüş var.

## Sahneler (index.html, yukarıdan aşağı)

| # | Bölüm (id) | Ne oluyor |
|---|---|---|
| 0 | `#loader` | Balon dolarak yüklenir, en geç 5 sn'de açılır |
| 1 | `#top` (hero) | SD dönüşüm videosu (`assets/film/sd.mp4`, telefonda `sd-sm.mp4`), "Studio Digitalist" başlığı. Telefonda video geniş tutulup logoya kaydırılır. Kaydırınca yakınlaşır, bulutlar yükselir, sis ekranı kaplar (pinned) |
| 2 | `#about` (Biz) | Kelime kelime yanan cümle + iki dikdörtgen portre (SD camı tonlarında: Ömer mavi, Müge mor; üstüne gelince renkli) ve altında kişinin işlerine linkler (`MADE` flight.js) |
| 3 | `#route` (Rota) | Müşteri/işletme siteleri (`kind: "site"`) monitör çerçevesinde, 16:10 kareler kırpılmadan (`assets/v4/screens/`). Flipbook kartı video (`assets/v4/promo/flipbook.mp4`), Mokissos'un linki yok, tanıtım görseli var (TR/EN ayrı, `shotTr`) |
| 3b | `#lab` (Atölye) | Kendi ürün ve araçlarımız (`kind: "lab"`): VTDiag, Milyonluk Bilet (fragman videosu), Erasmus Pilot, FPS Rehberi, Harf Çemberi, Mezun Ağı, Studio Digitalist sitesi |
| 4 | `#studio` | Film şeridinde Müge'nin tasarımları + Instagram karuselleri; telefonda reel, altında reel seçici (`REELS` = Drive "Social Media Content Samples" örnekleri + PvP Radarı) ve "Yönettiğimiz sayfalar" (`ACCOUNTS`) |
| 5 | `#engine` | Outreach Engine: sayan istatistikler (71.369 mail, 27 ülke, 26.670 site, 9 hesap; 3 Kasım 2026) + "örnek kayıt" konsolu (gerçek veri DEĞİL) |
| 5b | `#crew` (AI ekibi) | Claude ile nasıl çalışıyoruz: Pilot, Ekip, Kontrol listesi, İkinci pilot, Yer kontrol + 4 kısa bilgi |
| 7 | `#contact` | Dev başlık, mail kopyala, WhatsApp, LinkedIn, gizli OS linki |

Ekstralar: balon şeklinde fare imleci (sadece fareli cihazlarda), sağda irtifa ölçer,
"Ses" düğmesi (rüzgar sesi, WebAudio ile üretiliyor, dosya yok), TR/EN düğmesi, Lenis ile akıcı kaydırma.

## Dosyalar

```
index.html            Ana site (balon yolculuğu). Sabit metinler burada, data-en / data-tr ile
css/flight.css        Ana sitenin tüm stili (renkler en üstte :root içinde)
js/flight.js          Ana sitenin tüm davranışı (GSAP sahneleri, yükleme, imleç, ses, bilet, dil)
js/content.js         ORTAK İÇERİK: iletişim, projeler, galeri, kişiler (iki site de buradan okur)

os.html               Gizli masaüstü sitesi
css/os.css            Masaüstü stili
js/os.js              Pencere yöneticisi, dock, menü, arama (Ctrl+K), bildirimler, kedi
js/apps.js            Masaüstü uygulamaları (Projeler, Stüdyo, Terminal, Paint, oyun…)
js/icons.js           Elle çizilmiş SVG ikonlar
js/wall.js            Kapadokya duvar kağıdı (saate göre gün doğumu/gündüz/gün batımı/gece)
js/sfx.js             Masaüstü sitesinin 8-bit ses efektleri

assets/film/          sd-hd.mp4 (1920, 7,8 MB, 2560 kaynaktan, büyük ekran) + sd.mp4 (1280, 2,8 MB) + sd-sm.mp4 (720, 1,1 MB), 18 sn: kaynağın 7-17,5. saniyesi (logo oturuşu ve bekleme) 2,5x/3,5x/2,5x hızlandırıldı + sd.jpg poster, cloud1-4.webp (Python ile üretilmiş bulutlar)
                      Kaynak: Desktop\Work\Genel\WEB\assets\hero\giris-1920.mp4 (Google Flow, Veo 3.1)
assets/v4/cards/      Proje görselleri 3:2, <id>-1200.webp ve <id>-600.webp (telefona küçüğü gider)
assets/v4/reels/      Reeller 540x960 (+ .webp poster), trailer.mp4 = Milyonluk Bilet fragmanı
assets/v4/carousel/   Karusel slaytları (valocar, win11car) 540x675
assets/shots/         engine.webp (gizli OS kullanıyor)
assets/gallery/       Müge'nin tasarımları + reel.mp4 (gizli OS kullanıyor)
assets/omer_card.webp, assets/muge_card.webp   Portreler (kare, 640px)
designs/              Müge'nin ham tasarım dosyaları (sitede kullanılmıyor)
```

Dış kütüphaneler (CDN, sabit sürüm): GSAP 3.12.5 + ScrollTrigger (cdnjs), Lenis 1.1.13 (unpkg).
Fontlar (Google Fonts): Instrument Serif, Inter, JetBrains Mono. Masaüstü sitesi: Pixelify Sans, Caveat.

## Sık yapılacak değişiklikler

### Yeni proje eklemek
1. Ekran görüntüsü al (1440x960), `assets/v4/cards/<id>-1200.webp` (1200x800) ve `<id>-600.webp` (600x400) kaydet, kalite ~78.
   Hızlı yol: Chrome headless
   `chrome --headless=new --hide-scrollbars --window-size=1440,900 --virtual-time-budget=9000 --screenshot=C:\temp\x.png <url>`
   (Boşluklu klasör yolunda çalışmıyor, önce TEMP'e kaydet, sonra taşı.)
2. `js/content.js` içindeki `PROJECTS` listesine bir kayıt ekle:
   `id, kind ("site" = Rota, "lab" = Atölye), shot: C("<id>"), color, icon, url, title, tag{en,tr}, text{en,tr}, stack[]`
   (+ isteğe bağlı `video`, `linkLabel`). Sıra = sayfadaki sıra. Gizli OS klasörleri de `kind`'a göre otomatik dolar.
3. Yeni reel: `assets/v4/reels/<id>.mp4` (540x960, crf 28, faststart) + `<id>.webp` poster, `REELS` listesine ekle.

### Metin değiştirmek
- Sabit metinler: `index.html` içinde, her elemanda `data-en="..."` ve `data-tr="..."`. İkisini de güncelle.
- Proje / kişi metinleri: `js/content.js`.
- "Biz" bölümündeki büyük cümle: `index.html` → `#statement` (kelimeler otomatik bölünür).

### Video değiştirmek
- Kaynak: Pexels (ücretsiz, ticari kullanım serbest, atıf zorunlu değil; yine de sitede "Footage: Pexels" yazıyor).
  Kullanılanlar: hero = Pexels video 35676034, dusk = 34889360, valley = 10745869.
- Sıkıştırma (ffmpeg kurulu):
  `ffmpeg -i in.mp4 -an -vf "scale=1600:-2,fps=30" -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -movflags +faststart out.mp4`
  Telefon için ayrıca `scale=720:-2` ile `hero-sm.mp4`.

### Renkler
`css/flight.css` en üstünde: `--sun` (turuncu vurgu), `--gold`, `--rose`, `--plum` (stüdyo), `--navy` (motor).

## Bilinmesi gereken kararlar ve tuzaklar

- **Hareket azaltma ayarı yok sayılıyor:** Ömer'in Windows'unda "animasyon efektleri" kapalı ve tarayıcı
  bunu `prefers-reduced-motion: reduce` olarak bildiriyor. Bu ayara uyulursa site tamamen düz görünür,
  bu yüzden animasyonlar bilerek her durumda açık.
- **Dil kaydı:** İki site de `localStorage["om-lang"]` kullanır. Masaüstü sitesi JSON olarak (`"tr"`) yazar,
  ana site her iki biçimi de okur ve JSON yazar. Bunu bozan değişiklik siteyi "UNDEFINED" ekranında kilitler.
- **GSAP lagSmoothing(0) KULLANMA:** Arka plan sekmesinden dönünce "from" animasyonları başlangıç
  halinde takılı kalıyordu (başlık görünmüyordu). Varsayılan ayarda kalmalı.
- **Masaüstü sitesi kayıtları:** `om-icons`, `om-sticky`, `om-wall`, `om-best` (oyun rekoru). Bozuk/null kayıtlara
  karşı korumalı; açılış ekranı hata olsa bile 1,35 sn'de kalkar.
- **Ö harfinin noktaları:** Instrument Serif'te büyük boyda yukarı taşar. Hero'da `.ln` satırlarına
  üst boşluk ve eyebrow altına margin verildi; başlık boyutunu büyütürsen tekrar kontrol et.
- **Outreach Engine konsolu** örnek satırlar gösterir, gerçek veri değildir (konsol başlığında "örnek kayıt" yazar).
- Sayılar (71.369 mail, 27 ülke, 26.670 site, 9 hesap) 3 Kasım 2026 itibarıyla veritabanından; güncellemek için
  `index.html` → `.stat b[data-n]`.
- Kişisel konu yok: Erasmus/staj/Estonya anlatımı bilerek çıkarıldı. Erasmus Pilot sadece ürün olarak duruyor.

## Yerelde çalıştırma

Videolar için Range destekli bir sunucu gerekir (Python'un düz `http.server`'ı videolarda bağlantı
koparıp görselleri bozabiliyor). Kolay yol:

```
npx http-server -p 5501 -c-1
```

Sonra http://localhost:5501 (ana site) ve http://localhost:5501/os.html (gizli masaüstü).

## Yayınlama

Statik site, derleme adımı yok. `main` dalına push edince GitHub Pages yayınlar.
Repo ayrı bir klasör: `Erasmus_Master/portfolio` (Erasmus sisteminin reposundan bağımsız).
Repoya kişisel belge, TC numarası vb. koyma; bu repo herkese açık.

## Geçmiş (kısaca)

1. 3D BMO (Three.js): BMO'ya benzemedi, ağır ve yavaştı, vazgeçildi.
2. 2D BMO (CSS/SVG konsol): yapay buldu.
3. Ömer & Müge OS (retro masaüstü): güzel ama tatmin etmedi, gizli sayfa olarak kaldı.
4. Balon yolculuğu (şimdiki): gerçek videolar + sinematik kaydırma. "Biz" bölümü klişe bulununca
   balona asılı kartlar kaldırılıp yuvarlak portrelere geçildi, metin sadeleştirildi.
5. 3 Kasım 2026: düzen aynen korunup içerik genişletildi (Atölye, reel seçici, karuseller, AI ekibi),
   başlık Studio Digitalist + SD dönüşüm videosu, Erasmus/Räpina bölümü kaldırıldı. Denenip reddedilen:
   tamamen yeni "kartpostal" tasarımı (Ömer düzenin değişmesini istemedi).

Projelerin güncel listesi: `js/content.js`. Tam envanter (gizlilik notlarıyla): Desktop\Work\Beyin\projeler\portfolyo-envanteri.md (repoda değil).
