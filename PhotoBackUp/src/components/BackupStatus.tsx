import React from 'react';
import { BackupSession } from '@/types';
import { Smartphone, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface BackupStatusProps {
  sessions: BackupSession[];
}

export const BackupStatus: React.FC<BackupStatusProps> = ({ sessions }) => {
  if (sessions.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Yedekleme Durumu</h2>
      
      <div className="space-y-4">
        {sessions.map((session) => (
          <div key={session.deviceId} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{session.deviceName}</h3>
                  <p className="text-sm text-gray-600">
                    {session.completedFiles} / {session.totalFiles} dosya
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {session.isActive ? (
                  <>
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    <span className="text-sm font-medium text-blue-600">
                      Yedekleniyor...
                    </span>
                  </>
                ) : session.progress === 100 ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-600">
                      Tamamlandı
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-medium text-red-600">Hata</span>
                  </>
                )}
              </div>
            </div>

            <div className="mb-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>İlerleme</span>
                <span>%{session.progress}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    session.isActive
                      ? 'bg-blue-600'
                      : session.progress === 100
                      ? 'bg-green-600'
                      : 'bg-red-600'
                  }`}
                  style={{ width: `${session.progress}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Toplam Dosya</span>
                  <span className="font-medium text-gray-800">
                    {session.totalFiles}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tamamlanan</span>
                  <span className="font-medium text-gray-800">
                    {session.completedFiles}
                  </span>
                </div>
              </div>
            </div>

            {session.isActive && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  📱 Cihazınızdan dosyalar yedekleniyor. Lütfen WiFi bağlantınızı kesmeyin.
                </p>
              </div>
            )}

            {!session.isActive && session.progress === 100 && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">
                  ✅ Yedekleme başarıyla tamamlandı! Dosyalarınız güvenle kaydedildi.
                </p>
              </div>
            )}

            {!session.isActive &&
              session.progress < 100 &&
              session.progress > 0 && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">
                    ❌ Yedekleme işlemi yarıda kesildi. WiFi bağlantınızı kontrol edin ve tekrar deneyin.
                  </p>
                </div>
              )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {sessions.filter((s) => s.isActive).length}
            </p>
            <p className="text-sm text-gray-600">Aktif Yedekleme</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {sessions.filter((s) => !s.isActive && s.progress === 100).length}
            </p>
            <p className="text-sm text-gray-600">Tamamlanan</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">
              {sessions.reduce((total, session) => total + session.totalFiles, 0)}
            </p>
            <p className="text-sm text-gray-600">Toplam Dosya</p>
          </div>
        </div>
      </div>
    </div>
  );
};