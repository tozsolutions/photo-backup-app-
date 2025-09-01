/**
 * Validation utilities
 */

import { config } from './config';

export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > config.files.maxSize) {
    return {
      valid: false,
      error: `Dosya boyutu çok büyük. Maksimum: ${formatBytes(config.files.maxSize)}`
    };
  }

  // Check file type
  const supportedTypes = config.files.supportedFormats.split(',');
  const isSupported = supportedTypes.some((type: string) => {
    if (type.endsWith('/*')) {
      return file.type.startsWith(type.replace('/*', '/'));
    }
    return file.type === type;
  });

  if (!isSupported) {
    return {
      valid: false,
      error: 'Desteklenmeyen dosya türü'
    };
  }

  return { valid: true };
}

export function validateDeviceId(deviceId: string): boolean {
  return /^device-[\d.]+$/.test(deviceId);
}

export function validateIP(ip: string): boolean {
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(ip);
}

export function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
}

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function validateSessionId(sessionId: string): boolean {
  return /^session-\d+$/.test(sessionId);
}