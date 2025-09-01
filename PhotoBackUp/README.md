# Fotoğraf Yedekleme Sistemi

WiFi üzerinden otomatik fotoğraf yedekleme uygulaması. Bu uygulama, telefon ve bilgisayar arasında güvenli ve hızlı fotoğraf transferi sağlar.

## 🌟 Özellikler

- **WiFi Üzerinden Yedekleme**: Kablo gerektirmez, sadece aynı WiFi ağında olmanız yeterli
- **PWA Desteği**: Ana ekrana eklenebilir, çevrimdışı çalışabilir
- **Otomatik Keşif**: Ağdaki bilgisayarları otomatik bulur
- **Gerçek Zamanlı İlerleme**: Yedekleme sürecini canlı takip edin
- **Türkçe Arayüz**: Tamamen Türkçe, kullanıcı dostu arayüz
- **Güvenli**: Veriler sadece yerel ağda, internetle paylaşılmaz
- **Çoklu Format**: Fotoğraf ve video desteği

## 📱 Kurulum

### Telefonda Kullanım
1. Tarayıcınızdan uygulamayı açın
2. "Ana ekrana ekle" seçeneğini kullanın
3. WiFi bağlantınızı kontrol edin
4. "Cihazları Tara" butonuna basın

### Bilgisayarda Sunucu Kurulumu
Detaylı kurulum talimatları için `kurulum.txt` dosyasına bakın.

## 🚀 Geliştirme

### Gereksinimler
- Node.js 18+
- npm veya pnpm

### Kurulum
```bash
npm install
```

### Geliştirme Sunucusu
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Önizleme
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## 📋 Teknolojiler

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **PWA**: Workbox
- **UI**: Tailwind CSS (özel stiller)
- **Icons**: Lucide React
- **Date**: date-fns

## 📁 Proje Yapısı

```
PhotoBackUp/
├── src/
│   ├── components/     # React bileşenleri
│   ├── services/       # API ve servis katmanı
│   ├── types/          # TypeScript tipler
│   ├── utils/          # Yardımcı fonksiyonlar
│   ├── App.tsx         # Ana uygulama
│   └── main.tsx        # Giriş noktası
├── public/             # Statik dosyalar
├── dist/              # Build çıktısı
└── docs/              # Dokümantasyon
```

## 🔧 Yapılandırma

### Ortam Değişkenleri
Gerekli ortam değişkenleri `.env` dosyasında tanımlanabilir:
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=Fotoğraf Yedekleme Sistemi
```

### PWA Ayarları
`vite.config.ts` dosyasında PWA yapılandırması bulunur.

## 📦 Deploy

### Netlify
1. GitHub repository'yi Netlify'e bağlayın
2. Build komutu: `npm run build`
3. Publish directory: `dist`

### Vercel
```bash
npm i -g vercel
vercel --prod
```

### GitHub Pages
```bash
npm run build
npm run deploy
```

## 🔒 Güvenlik

- Veriler sadece yerel ağda transfer edilir
- HTTPS zorunlu production'da
- No-CORS policy uygulanır
- İnternet bağlantısı gerektirmez

## 🐛 Sorun Giderme

### Yaygın Sorunlar

**Cihaz bulunamıyor:**
- Aynı WiFi ağında olduğunuzdan emin olun
- Firewall ayarlarını kontrol edin
- Router'ı yeniden başlatın

**Yedekleme yavaş:**
- WiFi sinyal gücünü kontrol edin
- Diğer ağ trafiğini azaltın
- Sıkıştırma ayarlarını değiştirin

**PWA yüklenmiyor:**
- HTTPS bağlantısı gerekli
- Service Worker destekli tarayıcı kullanın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Commit edin (`git commit -am 'Yeni özellik eklendi'`)
4. Push edin (`git push origin feature/yeni-ozellik`)
5. Pull Request oluşturun

## 📞 Destek

Sorularınız için:
- Issues sekmesini kullanın
- Dokümantasyonu kontrol edin
- Community Discord'umuza katılın