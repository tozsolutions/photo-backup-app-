import { format } from 'date-fns';
import { validateFileName, sanitizeInput } from './security';

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
  return `device-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 50 * 1024 * 1024; // 50MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/mov'];
  
  // File size validation
  if (file.size > maxSize) {
    return { isValid: false, error: 'Dosya boyutu 50MB\'yi aşamaz' };
  }
  
  if (file.size === 0) {
    return { isValid: false, error: 'Dosya boş olamaz' };
  }
  
  // File type validation
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Desteklenmeyen dosya türü' };
  }
  
  // File name validation
  if (!validateFileName(file.name)) {
    return { isValid: false, error: 'Geçersiz dosya adı' };
  }
  
  // Additional security checks
  const sanitizedName = sanitizeInput(file.name);
  if (sanitizedName !== file.name) {
    return { isValid: false, error: 'Dosya adında geçersiz karakterler' };
  }
  
  return { isValid: true };
};

export const createBackupPath = (deviceType: string, date: Date, category: string, fileName: string): string => {
  const formattedDate = formatDate(date, 'yyyy-MM-dd');
  const categoryMap: { [key: string]: string } = {
    camera: 'Kamera_Fotograflari',
    downloads: 'Alinan_Dosyalar',
    sent: 'Gonderilen_Dosyalar',
    deleted: 'Silinmis_Ogeler'
  };
  
  const backupPath = import.meta.env.VITE_BACKUP_PATH || '/Users/Default/PhotoBackup';
  const separator = backupPath.includes('\\') ? '\\' : '/';
  
  return `${backupPath}${separator}${formattedDate}_${deviceType}${separator}${categoryMap[category] || 'Diger'}${separator}${fileName}`;
};