import React, { useState, useEffect } from 'react';
import { Wifi, Camera, Download, Trash2, Info, Shield, Smartphone } from 'lucide-react';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    autoBackup: false,
    compression: true,
    compressionQuality: 80,
    wifiOnly: true,
    storageLocation: 'browser',
    maxFileSize: 50,
    notifications: true,
    deleteAfterBackup: false
  });

  const [storageInfo, setStorageInfo] = useState({
    used: 0,
    quota: 0,
    available: 0
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('app-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Ayarlar yüklenirken hata:', error);
      }
    }

    // Get storage info
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then((estimate) => {
        setStorageInfo({
          used: estimate.usage || 0,
          quota: estimate.quota || 0,
          available: (estimate.quota || 0) - (estimate.usage || 0)
        });
      });
    }
  }, []);

  const updateSetting = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('app-settings', JSON.stringify(newSettings));
  };

  const clearCache = async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      alert('Önbellek temizlendi!');
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const storagePercentage = storageInfo.quota > 0 ? (storageInfo.used / storageInfo.quota) * 100 : 0;

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Ayarlar</h2>
        <p className="text-gray-600">Uygulama tercihlerini özelleştirin</p>
      </div>

      {/* Backup Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Camera className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Yedekleme Ayarları</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Otomatik Yedekleme</h4>
              <p className="text-sm text-gray-600">Fotoğrafları otomatik olarak yedekle</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoBackup}
                onChange={(e) => updateSetting('autoBackup', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Fotoğraf Sıkıştırma</h4>
              <p className="text-sm text-gray-600">Aktarım hızını artırmak için sıkıştır</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.compression}
                onChange={(e) => updateSetting('compression', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {settings.compression && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Sıkıştırma Kalitesi</h4>
              <input
                type="range"
                min="50"
                max="100"
                value={settings.compressionQuality}
                onChange={(e) => updateSetting('compressionQuality', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>Düşük (50%)</span>
                <span className="font-medium">{settings.compressionQuality}%</span>
                <span>Yüksek (100%)</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Sadece WiFi</h4>
              <p className="text-sm text-gray-600">Yalnızca WiFi bağlantısında yedekle</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.wifiOnly}
                onChange={(e) => updateSetting('wifiOnly', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Storage Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Download className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Depolama</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Depolama Kullanımı</h4>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(storagePercentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>Kullanılan: {formatBytes(storageInfo.used)}</span>
              <span>Toplam: {formatBytes(storageInfo.quota)}</span>
            </div>
          </div>

          <button
            onClick={clearCache}
            className="btn btn-secondary w-full"
          >
            <Trash2 className="w-4 h-4" />
            Önbelleği Temizle
          </button>
        </div>
      </div>

      {/* Network Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Wifi className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Ağ Ayarları</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Maksimum Dosya Boyutu (MB)</h4>
            <input
              type="number"
              min="1"
              max="500"
              value={settings.maxFileSize}
              onChange={(e) => updateSetting('maxFileSize', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-600 mt-1">
              Bu boyuttan büyük dosyalar yedeklenmeyecek
            </p>
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Info className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Uygulama Bilgileri</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Sürüm</span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Platform</span>
            <span className="font-medium">Progressive Web App</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tarayıcı</span>
            <span className="font-medium">{navigator.userAgent.split(' ')[0]}</span>
          </div>
        </div>
      </div>

      {/* PWA Install Prompt */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Smartphone className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900 mb-1">Ana Ekrana Ekle</h3>
            <p className="text-sm text-blue-800 mb-3">
              Daha iyi deneyim için uygulamayı ana ekranınıza ekleyin.
            </p>
            <div className="text-xs text-blue-700 space-y-1">
              <p><strong>iOS:</strong> Safari → Paylaş → Ana Ekrana Ekle</p>
              <p><strong>Android:</strong> Chrome → Menü → Ana ekrana ekle</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Privacy */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">Güvenlik ve Gizlilik</h3>
        </div>
        
        <div className="space-y-3 text-sm text-gray-600">
          <p>• Fotoğraflarınız sadece yerel ağda aktarılır</p>
          <p>• Hiçbir veri internet üzerinden gönderilmez</p>
          <p>• Uygulamanın sunucu erişimi yoktur</p>
          <p>• Verileriniz cihazınızda güvende saklanır</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;