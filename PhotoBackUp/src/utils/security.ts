// Security utilities for the application

/**
 * Sanitizes user input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validates file names to prevent path traversal attacks
 */
export const validateFileName = (fileName: string): boolean => {
  // Disallow path traversal patterns
  if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
    return false;
  }
  
  // Disallow system files
  const forbiddenNames = [
    'CON', 'PRN', 'AUX', 'NUL',
    'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
    'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'
  ];
  
  const baseName = fileName.split('.')[0].toUpperCase();
  if (forbiddenNames.includes(baseName)) {
    return false;
  }
  
  // Check for valid characters
  const validPattern = /^[a-zA-Z0-9._-]+$/;
  return validPattern.test(fileName) && fileName.length > 0 && fileName.length <= 255;
};

/**
 * Validates IP addresses
 */
export const validateIPAddress = (ip: string): boolean => {
  const ipv4Pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Pattern = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  
  return ipv4Pattern.test(ip) || ipv6Pattern.test(ip);
};

/**
 * Generates a secure random token
 */
export const generateSecureToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Validates device ID format
 */
export const validateDeviceId = (deviceId: string): boolean => {
  const pattern = /^device-\d{13}-[a-z0-9]{9}$/;
  return pattern.test(deviceId);
};

/**
 * Rate limiting utility
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  constructor(
    private maxRequests: number = 100,
    private windowMs: number = 60000 // 1 minute
  ) {}
  
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    return true;
  }
  
  reset(identifier?: string): void {
    if (identifier) {
      this.requests.delete(identifier);
    } else {
      this.requests.clear();
    }
  }
}

/**
 * Secure local storage wrapper
 */
export class SecureStorage {
  private static encrypt(data: string, key: string): string {
    // Simple XOR encryption (in production, use proper encryption)
    let result = '';
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(result);
  }
  
  private static decrypt(encryptedData: string, key: string): string {
    try {
      const data = atob(encryptedData);
      let result = '';
      for (let i = 0; i < data.length; i++) {
        result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      return result;
    } catch {
      return '';
    }
  }
  
  static setItem(key: string, value: string, encryptionKey?: string): void {
    const finalValue = encryptionKey ? this.encrypt(value, encryptionKey) : value;
    localStorage.setItem(key, finalValue);
  }
  
  static getItem(key: string, encryptionKey?: string): string | null {
    const value = localStorage.getItem(key);
    if (!value) return null;
    
    return encryptionKey ? this.decrypt(value, encryptionKey) : value;
  }
  
  static removeItem(key: string): void {
    localStorage.removeItem(key);
  }
  
  static clear(): void {
    localStorage.clear();
  }
}

/**
 * CSRF token management
 */
export const CSRFProtection = {
  generateToken(): string {
    return generateSecureToken();
  },
  
  setToken(token: string): void {
    SecureStorage.setItem('csrf_token', token);
  },
  
  getToken(): string | null {
    return SecureStorage.getItem('csrf_token');
  },
  
  validateToken(token: string): boolean {
    const storedToken = this.getToken();
    return storedToken !== null && storedToken === token;
  }
};