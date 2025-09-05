# Fotoğraf Yedekleme Sistemi / Photo Backup System

[![Build Status](https://github.com/tozsolutions/photo-backup-app-/workflows/CI/badge.svg)](https://github.com/tozsolutions/photo-backup-app-/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

Modern, güvenli ve kullanıcı dostu otomatik WiFi fotoğraf yedekleme uygulaması. Telefonlarınızdaki fotoğraf ve videoları bilgisayarınıza otomatik olarak yedekler.

## ✨ Özellikler

- 📱 **Çoklu Platform Desteği**: iOS ve Android cihazlar için tam destek
- 🔄 **Otomatik Yedekleme**: WiFi üzerinden otomatik dosya transferi
- 📁 **Akıllı Organizasyon**: Tarih ve cihaz türüne göre otomatik klasörleme
- 🌐 **PWA Desteği**: Mobil cihazlarda uygulama gibi çalışır
- 🔒 **Güvenli Transfer**: Yerel ağ üzerinden güvenli dosya transferi
- ⚡ **Hızlı Performans**: Optimize edilmiş dosya işleme
- 🎨 **Modern Arayüz**: Responsive ve kullanıcı dostu tasarım
- 📊 **Detaylı İstatistikler**: Yedekleme durumu ve dosya analizi

## 🚀 Hızlı Başlangıç

### Gereksinimler

- Node.js 18+ 
- npm, yarn veya pnpm
- Modern web tarayıcı

### Kurulum

```bash
# Repoyu klonlayın
git clone https://github.com/tozsolutions/photo-backup-app-.git
cd photo-backup-app-/PhotoBackUp

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Uygulama `http://localhost:3000` adresinde açılacaktır.

## 📦 Production Build

```bash
# Production build oluşturun
npm run build

# Build'i önizleyin
npm run preview
```

## 🧪 Test

```bash
# Unit testleri çalıştırın
npm test

# Test coverage raporu
npm run test:coverage

# Test UI
npm run test:ui
```

## 🛠️ Geliştirme

### Proje Yapısı

```
src/
├── components/          # React bileşenleri
│   ├── DeviceList.tsx   # Cihaz listesi
│   ├── FileManager.tsx  # Dosya yöneticisi
│   ├── BackupStatus.tsx # Yedekleme durumu
│   └── Settings.tsx     # Ayarlar
├── hooks/               # Custom React hooks
│   └── useDeviceScanner.ts
├── types/               # TypeScript tipleri
│   └── index.ts
├── utils/               # Yardımcı fonksiyonlar
│   └── index.ts
├── test/                # Test dosyaları
└── assets/              # Statik dosyalar
```

### Kod Kalitesi

```bash
# ESLint ile kod kontrolü
npm run lint

# Prettier ile kod formatlama
npm run format

# TypeScript tip kontrolü
npm run typecheck
```

## 🌐 Deployment

### Netlify ile Deploy

1. GitHub'a push yapın
2. Netlify'de projeyi bağlayın
3. Build ayarları:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

### Docker ile Deploy

```bash
# Docker image oluşturun
docker build -t photo-backup-app .

# Container çalıştırın (Nginx 80 portundan servis eder)
docker run -p 3000:80 photo-backup-app
```

## 📱 Kullanım

### Telefon Kurulumu

1. Web tarayıcısında uygulamayı açın
2. "Ana ekrana ekle" seçeneğini kullanın
3. WiFi bağlantınızı kontrol edin
4. Cihaz taramasını başlatın

### Bilgisayar Kurulumu

1. Yerel depolamayı etkinleştirin
2. Backup klasörlerini oluşturun
3. Güvenlik duvarı ayarlarını kontrol edin
4. Cihazları taramaya başlayın

## 🔧 Konfigürasyon

### Environment Variables

```bash
# .env.local
VITE_APP_TITLE="Photo Backup System"
VITE_API_URL="http://localhost:3000"
VITE_BACKUP_PATH="C:\\Users\\TOZ\\AppData\\Local\\PhotoBackup"
```

### PWA Ayarları

`vite.config.ts` dosyasında PWA ayarlarını düzenleyebilirsiniz:

```typescript
VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg}'],
  },
  manifest: {
    // Manifest ayarları
  }
})
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

### Geliştirme Kuralları

- TypeScript kullanın
- ESLint kurallarına uyun
- Test yazın
- Meaningful commit mesajları kullanın
- Türkçe dokümantasyon ekleyin

## 🐛 Sorun Giderme

### Yaygın Sorunlar

**Cihaz bulunamıyor**
- WiFi bağlantınızı kontrol edin
- Aynı ağda olduğunuzdan emin olun
- Güvenlik duvarı ayarlarını kontrol edin

**Yedekleme başarısız**
- Yerel depolamanın etkin olduğunu kontrol edin
- Disk alanınızı kontrol edin
- WiFi sinyalinin güçlü olduğundan emin olun

**Performance sorunları**
- Tarayıcı cache'ini temizleyin
- Güncellenmiş tarayıcı kullanın
- Diğer uygulamaları kapatın

## 📄 Lisans

Bu proje MIT lisansı ile lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 👨‍💻 Geliştirici

**TOZ Solutions**
- Website: https://tozsolutions.com
- Email: info@tozsolutions.com

## 🙏 Teşekkürler

- [React](https://reactjs.org/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide React](https://lucide.dev/) - Icon library
- [Date-fns](https://date-fns.org/) - Date utility library

---

📸 Fotoğraflarınız güvende! 🔒