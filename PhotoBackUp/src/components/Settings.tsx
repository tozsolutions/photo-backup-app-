import React from 'react';
import { HardDrive, AlertTriangle } from 'lucide-react';

interface SettingsProps {
  localStorageEnabled: boolean;
  onEnableLocalStorage: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  localStorageEnabled,
  onEnableLocalStorage,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Sistem Ayarları</h2>

      {localStorageEnabled ? (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <HardDrive className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">
                Yerel depolama aktif
              </span>
            </div>
            <p className="text-green-700 mt-2">
              Yedekleme konumu: C:\Users\TOZ\AppData\Local\PhotoBackup
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">
                Otomatik Yedekleme
              </h4>
              <p className="text-gray-600 text-sm">
                WiFi'ye bağlandığınızda otomatik olarak başlar
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">
                Dosya Organizasyonu
              </h4>
              <p className="text-gray-600 text-sm">
                Tarih ve cihaz türüne göre klasörlenir
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">
              Gelişmiş Ayarlar
            </h4>
            <div className="space-y-2 text-sm text-blue-700">
              <p>• Maksimum dosya boyutu: 50MB</p>
              <p>• Desteklenen formatlar: JPG, PNG, WebP, MP4, MOV</p>
              <p>• Otomatik sıkıştırma: Etkin</p>
              <p>• Tekrar yedekleme önleme: Etkin</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-800 mb-2">
                Yerel Depolamayı Etkinleştirin
              </h3>
              <p className="text-yellow-700 mb-4">
                Fotoğraflarınızın PC'nizde kalıcı olarak saklanması için yerel
                depolamayı etkinleştirmeniz gerekiyor. Bu işlem sonrasında tüm
                yedeklemeler C:\Users\TOZ\AppData\Local\PhotoBackup klasöründe
                saklanacak.
              </p>
              <button
                onClick={onEnableLocalStorage}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Yerel Depolamayı Etkinleştir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};