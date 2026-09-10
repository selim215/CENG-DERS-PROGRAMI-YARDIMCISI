# 🎓 Gazi Üniversitesi — Kendi Ders Programını Tasarla
### Bilgisayar Mühendisliği Sıfır Çakışmalı Ders Programı Optimizasyon ve Planlama Aracı

[![Gazi Üniversitesi](https://img.shields.io/badge/Gazi%20%C3%9Cniversitesi-M%C3%BChendislik%20Fak%C3%BCltesi-002d72?style=flat-square)](https://mf.gazi.edu.tr)
[![Lisans Programı](https://img.shields.io/badge/B%C3%B6l%C3%BCm-Bilgisayar%20M%C3%BChendisli%C4%9Fi-0ea5e9?style=flat-square)]()
[![React](https://img.shields.io/badge/React-18%20UMD-61dafb?style=flat-square&logo=react)]()
[![Tasarım](https://img.shields.io/badge/Design-SeHa%20Design-6366f1?style=flat-square)]()
[![Lisans](https://img.shields.io/badge/Lisans-MIT-10b981?style=flat-square)]()

**Gazi Üniversitesi Bilgisayar Mühendisliği** lisans öğrencileri için geliştirilmiş, ders kayıt dönemlerinde çakışmasız alternatif ders programları üreten, öğretim üyesi ve gün bazlı filtreleme sağlayan, yüksek performanslı ve modern bir web uygulamasıdır.

Herhangi bir sunucu veya derleme (build) bağımlılığı olmadan doğrudan tarayıcıda çalışır.

---

## 🚀 Öne Çıkan Özellikler

### 1. ⚡ Çakışmasız Otomatik Program Motoru (CSP & Backtracking)
- **Kombinasyon Optimizasyonu:** Bölüm dersleri, servis dersleri ve ortak zorunlu derslerin (teori ve laboratuvar şubeleri dahil) tüm olası kombinasyonlarını milisaniyeler içinde tarar.
- **Sıfır Çakışma:** Saat ve gün çakışması barındıran varyasyonları eler, yalnızca %100 uygulanabilir geçerli programları listeler.
- **Dinamik Yeniden Hesaplama:** Sol panelden filtreler veya tercihler değiştikçe arka planda programları anında yeniden üretir.

### 2. 👨‍🏫 Gelişmiş Filtreleme ve Kısıt Yönetimi
- **Öğretim Üyesi Filtreleri:** Her ders için şubeleri yürüten hocalar listelenir; dilediğiniz hocaları seçebilir veya devre dışı bırakabilirsiniz.
- **Boş Gün Kısıtı (Free Days):** Haftanın belirli günlerini (örn. Çarşamba veya Cuma) tamamen boş bırakacak program kombinasyonlarına tek tıkla odaklanabilirsiniz.
- **Akıllı Ön Ayarlar:**
  - 🍽️ *Öğle Arası Garantisi:* 12:20 - 13:30 saatleri arasına ders koymayan alternatifler.
  - 🌙 *Geç Başlangıç:* Sabah 08:30 derslerini içermeyen kombinasyonlar.
  - 🏛️ *Tarih Dersi Boşluksuz:* TAR101 dersini gün içi yüz yüze derslere bitişik veya en uygun zamana yerleştiren tercihler.

### 3. 🎯 Etkileşimli Şube Değiştirici & Manuel Çakışma Yönetimi
- **Ders Bloğu Etkileşimi:** Haftalık program tablosundaki herhangi bir ders bloğuna tıklayarak o dersin diğer şubelerini, hocalarını ve dersliklerini görebilirsiniz.
- **Akıllı Çakışma Analizi & Onay Modalı:** Eğer seçmek istediğiniz alternatif şube mevcut programdaki başka bir dersle çakışıyorsa buton **"Çakışıyor"** olarak işaretlenir. Tıklandığında onay penceresi açılır; **"Yine de Değiştir"** denildiğinde seçilen şube kilitlenir ve kalan dersler bu seçime uyacak şekilde otomatik olarak optimize edilir.

### 4. ⭐ State Snapshot Hydration (Kayıtlı Favori Programlar)
- **Derin Durum Kopyalama (Deep Snapshot):** Beğendiğiniz bir programı favorilere kaydettiğinizde, yalnızca indeks numarası değil; tüm ders, şube, hoca, derslik ve skor nesnesi tam bir kopya olarak saklanır.
- **Kusursuz Geri Çağırma (Hydration):** Sol paneldeki hoca/gün filtreleri ne kadar değişirse değişsin, kayıtlı karta tıkladığınızda o program hiçbir bozulmaya uğramadan doğrudan aktif tablo görünümüne enjekte edilir.
- **Otomatik Senkronizasyon:** Kayıtlı program yüklendiğinde sol paneldeki hoca seçimleri de kaydedilen programla birebir senkronize edilir.

### 5. ⏱️ Akıllı Gün İçi Blok Boşluğu ve Kompaktlık Rozeti
- **Asenkron/Online Ders İzolasyonu:** Uzaktan yürütülen `TAR101` dersleri gün içi kampüs boşluğu hesaplamalarından hariç tutulur; böylece yapay boşluk süreleri engellenir.
- **Yüz Yüze Blok İncelemesi & Rozetler:**
  - 🟢 **İyi Rozeti:** Ders blokları tamamen bitişikse veya ardışık dersler arasında en fazla 1 ders saati (≤ 85 dk) boşluk varsa.
  - 🟡 **Orta Rozeti:** İki yüz yüze ders arasında 2 ders saati (~100-120 dk) boşluk varsa.
  - 🔴 **Kötü Rozeti:** İki yüz yüze ders arasında 2 ders saatinden fazla (3 blok veya daha uzun / > 135 dk) boşluk varsa.
- **İstatistik Kartları:** Toplam gün içi boşluk süresi, kampüs aktif gün sayısı ve haftalık toplam ders yükü (saat) anlık gösterilir.

### 6. 🔢 Gelişmiş Numerik Pagination (Sayfalama)
- Hızlı geçiş butonları: İlk Program (`<<`), Önceki (`◀`), Sonraki (`▶`), Son Program (`>>`).
- **Strict Numeric Sanitization:** Program numarası giriş alanına alfabetik ve özel karakterler (örn: `9dv`) yazılamaz; sadece rakam kabul edilir.
- Toplam program sayısından büyük bir değer girildiğinde otomatik olarak üst sınıra yuvarlanır; alan boşaltıldığında görsel tablo bozulmaz.

### 7. 🔔 Toast Bildirimlerinde "Hover to Pause"
- Sistem uyarı ve onay toast bildirimleri fare ile üzerine gelindiğinde (`mouseenter`) otomatik kapanma sayacını durdurur.
- Fare bildirimden ayrıldığında (`mouseleave`) 3 saniyelik zamanlayıcı baştan başlar ve bildirim pürüzsüz animasyonla kaybolur.

### 8. 📤 Çoklu Format Dışa Aktarma (Export)
- 🖼️ **PNG Görseli:** Yüksek çözünürlüklü ve temiz ders programı tablosu görseli (`html2canvas`).
- 📄 **PDF Çıktısı:** Yatay/dikey formata uygun ders programı dökümü (`jsPDF`).
- 📊 **Excel (.xlsx):** Gün, saat, ders kodu, şube, hoca ve derslik bilgilerini içeren tablo tablosu (`SheetJS`).
- 📅 **iCalendar (.ics):** Google Takvim, Apple Takvim veya Outlook'a aktarılabilir ders takvim dosyası.

### 9. 🤖 Gazi Bot — Yapay Zeka Programlama Asistanı
- Çekmece (Drawer) formatında etkileşimli akıllı sohbet paneli.
- Yatay ve dikey kaydırılabilir hazır soru & eylem önerileri:
  - *"Çarşamba gününü tamamen boşalt"*
  - *"En az boşluklu / en kompakt programı bul"*
  - *"En az güne sıkıştırılmış programı göster"*
  - *"Tüm filtreleri ve seçimleri sıfırla"*

### 10. 🎨 Görsel Tasarım & Tema Desteği
- **SeHa Design** imzalı kurumsal, şık ve göz yormayan arayüz.
- **Koyu (Dark) ve Açık (Light)** tema desteği.
- Gazi Üniversitesi kurumsal laciverti ve altın sarısı vurguları.
- Tamamen responsive (mobil, tablet ve geniş ekran uyumlu).

---

## 🛠️ Kullanılan Teknolojiler

| Alan | Teknoloji / Kütüphane | Kullanım Amacı |
|---|---|---|
| **Çekirdek** | React 18 (Production UMD) | Bileşen tabanlı reaktif durum ve arayüz yönetimi |
| **Stil & Tasarım** | Vanilla CSS3 (Custom Design Tokens) | Dark/Light mod, CSS Grid, Flexbox, Glassmorphism, Responsive yapı |
| **Tipografi** | Google Fonts (Inter, Playfair Display, Caveat) | Modern ve estetik kurumsal tipografi |
| **Görsel Aktarım** | html2canvas v1.4.1 | Tablo alanını PNG görseli olarak render etme |
| **PDF Aktarım** | jsPDF v2.5.1 | Vektörel / döküman formatında program çıktısı oluşturma |
| **Tablo Aktarım** | SheetJS (xlsx) v0.18.5 | Excel uyumlu çalışma sayfası üretimi |
| **Çalışma Ortamı** | Zero-Build / Standalone HTML | `npm` veya derleyici gerektirmeyen bağımsız mimari |

---

## 📁 Dosya ve Dizin Yapısı

```plaintext
ders-programi-olusturucu/
│
├── index.html                  # Uygulamanın tüm UI ve mantığını içeren bağımsız üretim dosyası
├── app.jsx                     # Modüler geliştirme amaçlı React ana bileşen şablonu
├── styles.css                  # Ayrıştırılmış CSS stil dosyası
│
├── engine/                     # Çekirdek algoritma ve yardımcı fonksiyonlar
│   ├── scheduler.js            # Backtracking ve kısıt sağlama algoritması
│   ├── validator.js            # Çakışma kontrolü ve zaman aralığı doğrulayıcıları
│   └── types.js                # Veri modelleri ve tip tanımları
│
├── data/
│   └── courses.json            # Gazi BM lisans güz dönemi ders ve şube veritabanı
│
├── Gazi_Üniversitesi_logo.png   # Resmi Gazi Üniversitesi vektörel logosu
├── 162286.jpg                  # Koyu tema estetik arka plan kaplaması
│
└── PDF Dokümanları/            # Akademik takvim, müfredat ve resmi ders programı referansları
```

---

## 💻 Kurulum ve Çalıştırma

Uygulama herhangi bir harici paket yöneticisi (`npm`, `yarn`, `pnpm`) veya derleme adımı gerektirmez.

### Yöntem 1: Doğrudan Tarayıcı ile Açma (En Basit)
Dosya yöneticinizden `index.html` dosyasına çift tıklayarak varsayılan tarayıcınızda (Chrome, Edge, Firefox, Safari) hemen kullanmaya başlayabilirsiniz.

### Yöntem 2: Yerel HTTP Sunucusu ile Çalıştırma (Önerilen)
Dışa aktarma kütüphanelerinin (html2canvas, pdf) CORS kısıtlamalarına takılmaması için yerel bir sunucu önerilir:

**Python ile:**
```bash
# Proje dizininde terminali açın:
python -m http.server 8080
```
Ardından tarayıcınızda `http://localhost:8080` adresine gidin.

**Node.js / npx ile:**
```bash
npx serve .
```

---

## 🧠 Algoritma ve Skorlama Mantığı

### 1. Kısıt Çözümleme (CSP & Backtracking)
1. **Karar Birimleri (Decision Units):** Her ders teori ve laboratuvar bileşenlerine ayrılır.
2. **Kombinasyon Ağacı:** Her bileşen için filtrelerden geçen şubeler listelenir.
3. **Ön Eleme:** Seçilen boş günlere (`freeDays`) denk gelen şubeler önceden budanır.
4. **Geri İzleme (Backtracking):** Çakışan ders slotları karşılaşıldığı anda geri dönülür, gereksiz kombinasyonlar hesaplanmaz.

### 2. Yüz Yüze Gün İçi Kompaktlık Hesabı
```javascript
// Uzaktan / online dersler kampüs boşluğu hesabından çıkarılır
const f2fSlots = slots.filter(s => s.courseCode !== 'TAR101' && s.room !== 'UZAKTAN');

// Ardışık yüz yüze dersler arasındaki boş saat blokları hesaplanır:
// ≤ 85 dk  -> 0 veya 1 blok ara -> Rozet: "İyi" (Yeşil)
// 86-135 dk -> 2 blok ara (~2 saat) -> Rozet: "Orta" (Sarı)
// > 135 dk  -> 3+ blok ara (> 2 saat) -> Rozet: "Kötü" (Kırmızı)
```

---

## 👤 Geliştirici ve Telif Bilgisi

- **Tasarım & Geliştirme:** Selim Hadi Aytekin
- **Marka:** SeHa Design
- **Kurum:** Gazi Üniversitesi — Mühendislik Fakültesi / Bilgisayar Mühendisliği Bölümü
- **Lisans:** [MIT License](LICENSE)

---
*Bu araç Gazi Üniversitesi öğrencilerine ders kayıt ve planlama süreçlerinde kolaylık sağlamak amacıyla bağımsız olarak geliştirilmiştir.*
