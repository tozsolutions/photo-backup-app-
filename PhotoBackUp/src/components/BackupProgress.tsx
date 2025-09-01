import React from 'react';
import { BackupSession } from '../types';
import { PhotoService } from '../services/photoService';
import { CheckCircle, XCircle, Clock, AlertCircle, X, Camera } from 'lucide-react';

interface BackupProgressProps {
  session: BackupSession | null;
  onCancel: () => void;
}

const BackupProgress: React.FC<BackupProgressProps> = ({ session, onCancel }) => {
  const photoService = PhotoService.getInstance();

  if (!session) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Yedekleme</h2>
          <p className="text-gray-600">Fotoğraf yedekleme işlemini takip edin</p>
        </div>
        
        <div className="card text-center py-12">
          <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aktif Yedekleme Yok</h3>
          <p className="text-gray-600">
            Yedekleme başlatmak için "Cihazlar" sekmesinden bir bilgisayar seçin.
          </p>
        </div>
      </div>
    );
  }

  const progress = session.filesCount > 0 ? (session.filesTransferred / session.filesCount) * 100 : 0;
  const sizeProgress = session.totalSize > 0 ? (session.transferredSize / session.totalSize) * 100 : 0;

  const getStatusIcon = () => {
    switch (session.status) {
      case 'completed':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'error':
        return <XCircle className="w-8 h-8 text-red-500" />;
      case 'cancelled':
        return <AlertCircle className="w-8 h-8 text-yellow-500" />;
      default:
        return <Clock className="w-8 h-8 text-blue-500" />;
    }
  };

  const getStatusText = () => {
    switch (session.status) {
      case 'preparing':
        return 'Hazırlanıyor...';
      case 'active':
        return 'Yedekleniyor...';
      case 'completed':
        return 'Tamamlandı';
      case 'error':
        return 'Hata Oluştu';
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return 'Bilinmeyen Durum';
    }
  };

  const getStatusColor = () => {
    switch (session.status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'cancelled':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Yedekleme Durumu</h2>
          <p className="text-gray-600">Fotoğraf aktarımı devam ediyor</p>
        </div>
        {session.status === 'active' && (
          <button
            onClick={onCancel}
            className="btn btn-danger"
          >
            <X className="w-4 h-4" />
            İptal Et
          </button>
        )}
      </div>

      <div className={`card border-2 ${getStatusColor()}`}>
        <div className="flex items-center gap-4 mb-6">
          {getStatusIcon()}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{getStatusText()}</h3>
            <p className="text-sm text-gray-600">
              Başlangıç: {session.startTime.toLocaleString('tr-TR')}
            </p>
            {session.endTime && (
              <p className="text-sm text-gray-600">
                Bitiş: {session.endTime.toLocaleString('tr-TR')}
              </p>
            )}
          </div>
        </div>

        {session.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="text-sm font-medium text-red-800 mb-1">Hata Detayı:</h4>
            <p className="text-sm text-red-700">{session.error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
              <span>Dosya İlerlemesi</span>
              <span>{session.filesTransferred} / {session.filesCount}</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{progress.toFixed(1)}% tamamlandı</p>
          </div>

          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
              <span>Boyut İlerlemesi</span>
              <span>
                {photoService.formatFileSize(session.transferredSize)} / {photoService.formatFileSize(session.totalSize)}
              </span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${sizeProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{sizeProgress.toFixed(1)}% tamamlandı</p>
          </div>
        </div>

        {session.status === 'active' && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">İpuçları:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Telefonunuzu şarjda tutun</li>
              <li>• WiFi bağlantısının stabil olduğundan emin olun</li>
              <li>• Uygulamayı kapatmayın veya telefonu kilitlemeyin</li>
              <li>• İlk yedekleme biraz uzun sürebilir</li>
            </ul>
          </div>
        )}

        {session.status === 'completed' && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="text-sm font-medium text-green-800 mb-1">Yedekleme Başarılı!</h4>
            <p className="text-sm text-green-700">
              {session.filesCount} adet fotoğraf başarıyla yedeklendi.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackupProgress;