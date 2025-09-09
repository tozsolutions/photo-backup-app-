import { format } from 'date-fns';

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDate = (date: Date, formatStr: string): string => {
  return format(date, formatStr);
};

export const getRelativeTime = (date: Date): string => {
  const now = new Date().getTime();
  const diffInMinutes = Math.floor((now - date.getTime()) / 60000);

  if (diffInMinutes < 1) return 'Şimdi';
  if (diffInMinutes < 60) return `${diffInMinutes} dakika önce`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} saat önce`;

  return date.toLocaleDateString('tr-TR');
};

export const getCategoryDisplayName = (category: string): string => {
  switch (category) {
    case 'camera':
      return 'Kamera Fotoğrafları';
    case 'downloads':
      return 'Alınan Dosyalar';
    case 'sent':
      return 'Gönderilen Dosyalar';
    case 'deleted':
      return 'Silinmiş Öğeler';
    default:
      return 'Bilinmeyen';
  }
};

export const generateDeviceId = (): string => {
  return `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const validateFile = (
  file: File
): { isValid: boolean; error?: string } => {
  const maxSize = 50 * 1024 * 1024; // 50MB
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'video/mp4',
    'video/mov',
  ];

  if (file.size > maxSize) {
    return { isValid: false, error: "Dosya boyutu 50MB'yi aşamaz" };
  }

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Desteklenmeyen dosya türü' };
  }

  return { isValid: true };
};

export const createBackupPath = (
  deviceType: string,
  date: Date,
  category: string,
  fileName: string
): string => {
  const formattedDate = formatDate(date, 'yyyy-MM-dd');
  const categoryMap: { [key: string]: string } = {
    camera: 'Kamera_Fotograflari',
    downloads: 'Alinan_Dosyalar',
    sent: 'Gonderilen_Dosyalar',
    deleted: 'Silinmis_Ogeler',
  };

  return `C:\\Users\\TOZ\\AppData\\Local\\PhotoBackup\\${formattedDate}_${deviceType}\\${categoryMap[category] || 'Diger'}\\${fileName}`;
};
