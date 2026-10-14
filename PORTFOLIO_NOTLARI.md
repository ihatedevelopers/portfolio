# Portfolyo notları (Ömer & Müge)

Bu dosya, portfolyo sitesini ileride değiştirmek isteyen herkes için (insan ya da AI) rehberdir.
Canlı adres: https://ihatedevelopers.github.io/portfolio (GitHub Pages, repo: `ihatedevelopers/portfolio`).

## Konsept

**"Bir Balon Yolculuğu"**: Kapadokya'dan Avrupa'ya sinematik, kaydırmaya bağlı bir hikaye.
Ziyaretçi aşağı kaydırdıkça balonla kalkar, bulutların içinden geçer, projeleri "durak" olarak gezer
ve sonunda "Sıradaki durak: sizin oteliniz" sahnesine iner (Erasmus+ 2027 stajı çağrısı).

Gizli bir ikinci site daha var: **Ömer & Müge OS** (`os.html`). Pastel, retro bir masaüstü
(pencereler, dock, kedi, terminal, Paint, Balloon Pop oyunu). Ana sitenin en altındaki
"💾 gizli bir bilgisayar var" linkiyle açılır. OS'un sol üst menüsünde ana siteye dönüş var.

## Sahneler (index.html, yukarıdan aşağı)

| # | Bölüm (id) | Ne oluyor |
|---|---|---|
| 0 | `#loader` | Balon dolarak yüklenir, en geç 5 sn'de açılır |
| 1 | `#top` (hero) | Gerçek Kapadokya videosu, "Ömer & Müge" başlığı. Kaydırınca video yakınlaşır, bulutlar yükselir, sis ekranı kaplar (sabitlenmiş/pinned) |
| 2 | `#about` (Biz) | Kelime kelime yanan cümle + iki yuvarlak portre (etrafında dönen beceri yazısı, 01/02 numaraları) |
| 3 | `#route` (Rota) | Masaüstünde yatay kayan proje durakları, yol çizgisinde ilerleyen balon, durağa göre değişen arka plan rengi. Telefonda dikey liste |
| 4 | `#studio` | Müge'nin tasarımları iki sıra sonsuz film şeridinde, ortada telefon içinde reel videosu |
| 5 | `#engine` | Outreach Engine: sayan istatistikler + akan "örnek kayıt" konsolu (gerçek veri DEĞİL, gösterim) |
| 6 | `#landing` | Alacakaranlık videosu, "Sıradaki durak: sizin oteliniz", yırtılabilir biniş kartı (yırtınca mail/WhatsApp çıkar) |
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

assets/film/          hero.mp4 (+ hero-sm.mp4 telefon), dusk.mp4, valley.mp4 (şu an kullanılmıyor),
                      posterler (.jpg), cloud1-4.webp (Python ile üretilmiş bulutlar)
assets/shots/         Proje ekran görüntüleri (1280 genişlik webp)
assets/gallery/       Müge'nin tasarımları + reel.mp4
assets/omer_card.webp, assets/muge_card.webp   Portreler (kare, 640px)
designs/              Müge'nin ham tasarım dosyaları (sitede kullanılmıyor)
```

Dış kütüphaneler (CDN, sabit sürüm): GSAP 3.12.5 + ScrollTrigger (cdnjs), Lenis 1.1.13 (unpkg).
Fontlar (Google Fonts): Instrument Serif, Inter, JetBrains Mono. Masaüstü sitesi: Pixelify Sans, Caveat.

## Sık yapılacak değişiklikler

### Yeni proje eklemek
1. Ekran görüntüsü al (1440x900), `assets/shots/<id>.webp` olarak kaydet (1280 genişlik, kalite ~80).
   Hızlı yol: Chrome headless
   `chrome --headless=new --hide-scrollbars --window-size=1440,900 --virtual-time-budget=9000 --screenshot=C:\temp\x.png <url>`
   (Boşluklu klasör yolunda çalışmıyor, önce TEMP'e kaydet, sonra taşı.)
2. `js/content.js` içindeki `PROJECTS` listesine bir kayıt ekle:
   `id, shot, color, icon, url, title, tag{en,tr}, text{en,tr}, stack[]`.
3. Ana sitede görünmesi için `js/flight.js` içindeki `ROUTE` listesine `id`'yi ekle (sıra = durak sırası).
4. Masaüstü sitesinde klasör filtresi için `js/apps.js` içindeki `GROUPS` listesine ekle.
5. Ekran görüntüsünün altında boş/siyah alan varsa: görseli kırp ve `flight.js` içinde
   `natural` sınıfı verilen projelere ekle (şu an sadece `taxi`).

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
- Sayılar (50.000+ mail, 9 hesap, 12 dil, 22.217 işletme) Ekim 2026 itibarıyla; güncellemek için
  `index.html` → `.stat b[data-n]`.

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

Ekim 2026 itibarıyla projeler: Ürgüp Terminal Taksi, Kardeşler Restaurant, Lotus Voleybol, Bi Başka Döner,
Atikeler Estetik, Palace Garden, FORGEONE (satış demosu), Erasmus Pilot, Outreach Engine, Müge's Studio.
