/**
 * Environment configuration utilities
 */

export const config = {
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Fotoğraf Yedekleme Sistemi',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  },
  network: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    timeout: parseInt(import.meta.env.VITE_NETWORK_TIMEOUT || '5000'),
    discoveryTimeout: parseInt(import.meta.env.VITE_DISCOVERY_TIMEOUT || '3000'),
  },
  files: {
    maxSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '52428800'), // 50MB
    compressionQuality: parseInt(import.meta.env.VITE_COMPRESSION_QUALITY || '80'),
    supportedFormats: import.meta.env.VITE_SUPPORTED_FORMATS || 'image/*,video/*',
  },
  debug: import.meta.env.VITE_DEBUG === 'true',
  pwa: {
    cacheName: import.meta.env.VITE_PWA_CACHE_NAME || 'photo-backup-cache',
    updateCheckInterval: parseInt(import.meta.env.VITE_PWA_UPDATE_CHECK_INTERVAL || '3600000'),
  }
};

export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;