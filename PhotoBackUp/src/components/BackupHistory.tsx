import React from 'react';
import { BackupSession } from '../types';
import { PhotoService } from '../services/photoService';
import { CheckCircle, XCircle, AlertCircle, Clock, Trash2, Calendar } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface BackupHistoryProps {
  sessions: BackupSession[];
  onClearHistory: () => void;
}

const BackupHistory: React.FC<BackupHistoryProps> = ({ sessions, onClearHistory }) => {
  const photoService = PhotoService.getInstance();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Yedekleme Geçmişi</h2>
          <p className="text-gray-600">Önceki yedekleme işlemlerini görüntüleyin</p>
        </div>
        {sessions.length > 0 && (
          <button
            onClick={onClearHistory}
            className="btn btn-secondary"
          >
            <Trash2 className="w-4 h-4" />
            Geçmişi Temizle
          </button>
        )}
      </div>

      {sessions.length === 0 && (
        <div className="card text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Geçmiş Bulunamadı</h3>
          <p className="text-gray-600">
            Henüz hiç yedekleme işlemi yapılmamış. 
            <br />
            İlk yedeklemenizi yapmak için "Cihazlar" sekmesini kullanın.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {sessions.map((session) => (
          <SessionCard key={session.id} session={session} photoService={photoService} />
        ))}
      </div>

      {sessions.length > 0 && (
        <div className="card bg-gray-50 border-gray-200">
          <div className="text-center text-sm text-gray-600">
            <p>Toplam {sessions.length} yedekleme işlemi gösteriliyor</p>
            <p className="mt-1">
              Başarılı: {sessions.filter(s => s.status === 'completed').length} • 
              Hatalı: {sessions.filter(s => s.status === 'error').length} • 
              İptal Edilen: {sessions.filter(s => s.status === 'cancelled').length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

interface SessionCardProps {
  session: BackupSession;
  photoService: PhotoService;
}

const SessionCard: React.FC<SessionCardProps> = ({ session, photoService }) => {
  const getStatusIcon = (status: BackupSession['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusText = (status: BackupSession['status']) => {
    switch (status) {
      case 'completed':
        return 'Tamamlandı';
      case 'error':
        return 'Hata';
      case 'cancelled':
        return 'İptal Edildi';
      case 'active':
        return 'Devam Ediyor';
      default:
        return 'Bilinmiyor';
    }
  };

  const getDuration = (session: BackupSession) => {
    if (!session.endTime) return 'Devam ediyor...';
    
    const duration = session.endTime.getTime() - session.startTime.getTime();
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    
    if (minutes > 0) {
      return `${minutes}d ${seconds}s`;
    }
    return `${seconds}s`;
  };

  const progress = session.filesCount > 0 ? (session.filesTransferred / session.filesCount) * 100 : 0;

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {getStatusIcon(session.status)}
          <div>
            <h3 className="font-medium text-gray-900">
              {format(session.startTime, 'dd MMMM yyyy, HH:mm', { locale: tr })}
            </h3>
            <p className="text-sm text-gray-600">
              {formatDistanceToNow(session.startTime, { addSuffix: true, locale: tr })}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          session.status === 'completed' 
            ? 'bg-green-100 text-green-800'
            : session.status === 'error'
            ? 'bg-red-100 text-red-800'
            : session.status === 'cancelled'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-blue-100 text-blue-800'
        }`}>
          {getStatusText(session.status)}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Dosya Sayısı</p>
          <p className="text-sm font-medium text-gray-900">
            {session.filesTransferred} / {session.filesCount}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Toplam Boyut</p>
          <p className="text-sm font-medium text-gray-900">
            {photoService.formatFileSize(session.totalSize)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Aktarılan</p>
          <p className="text-sm font-medium text-gray-900">
            {photoService.formatFileSize(session.transferredSize)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Süre</p>
          <p className="text-sm font-medium text-gray-900">{getDuration(session)}</p>
        </div>
      </div>

      {session.status !== 'completed' && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>İlerleme</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {session.error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            <strong>Hata:</strong> {session.error}
          </p>
        </div>
      )}
    </div>
  );
};

export default BackupHistory;