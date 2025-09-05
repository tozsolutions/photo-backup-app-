import { describe, it, expect, beforeEach } from 'vitest';
import {
  sanitizeInput,
  validateFileName,
  validateIPAddress,
  generateSecureToken,
  validateDeviceId,
  RateLimiter,
  SecureStorage,
} from '@/utils/security';

describe('Security Utils', () => {
  describe('sanitizeInput', () => {
    it('should sanitize HTML characters', () => {
      const input = '<script>alert("xss")</script>';
      const result = sanitizeInput(input);
      expect(result).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
    });

    it('should handle empty string', () => {
      expect(sanitizeInput('')).toBe('');
    });

    it('should sanitize ampersands', () => {
      expect(sanitizeInput('Tom & Jerry')).toBe('Tom &amp; Jerry');
    });
  });

  describe('validateFileName', () => {
    it('should accept valid file names', () => {
      expect(validateFileName('document.pdf')).toBe(true);
      expect(validateFileName('image_001.jpg')).toBe(true);
      expect(validateFileName('file-name.txt')).toBe(true);
    });

    it('should reject path traversal attempts', () => {
      expect(validateFileName('../../../etc/passwd')).toBe(false);
      expect(validateFileName('folder/file.txt')).toBe(false);
      expect(validateFileName('folder\\file.txt')).toBe(false);
    });

    it('should reject system file names', () => {
      expect(validateFileName('CON.txt')).toBe(false);
      expect(validateFileName('PRN.pdf')).toBe(false);
      expect(validateFileName('COM1.doc')).toBe(false);
    });

    it('should reject invalid characters', () => {
      expect(validateFileName('file<name>.txt')).toBe(false);
      expect(validateFileName('file|name.txt')).toBe(false);
      expect(validateFileName('file:name.txt')).toBe(false);
    });

    it('should reject empty or too long names', () => {
      expect(validateFileName('')).toBe(false);
      expect(validateFileName('a'.repeat(256))).toBe(false);
    });
  });

  describe('validateIPAddress', () => {
    it('should validate IPv4 addresses', () => {
      expect(validateIPAddress('192.168.1.1')).toBe(true);
      expect(validateIPAddress('10.0.0.1')).toBe(true);
      expect(validateIPAddress('172.16.0.1')).toBe(true);
      expect(validateIPAddress('0.0.0.0')).toBe(true);
      expect(validateIPAddress('255.255.255.255')).toBe(true);
    });

    it('should reject invalid IPv4 addresses', () => {
      expect(validateIPAddress('256.1.1.1')).toBe(false);
      expect(validateIPAddress('192.168.1')).toBe(false);
      expect(validateIPAddress('192.168.1.1.1')).toBe(false);
      expect(validateIPAddress('abc.def.ghi.jkl')).toBe(false);
    });

    it('should validate IPv6 addresses', () => {
      expect(validateIPAddress('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe(true);
      expect(validateIPAddress('2001:db8:85a3::8a2e:370:7334')).toBe(false); // Simplified format not supported in this regex
    });
  });

  describe('generateSecureToken', () => {
    it('should generate tokens of correct length', () => {
      const token = generateSecureToken();
      expect(token).toHaveLength(64); // 32 bytes * 2 hex chars
    });

    it('should generate unique tokens', () => {
      const token1 = generateSecureToken();
      const token2 = generateSecureToken();
      expect(token1).not.toBe(token2);
    });

    it('should contain only hex characters', () => {
      const token = generateSecureToken();
      expect(/^[0-9a-f]+$/.test(token)).toBe(true);
    });
  });

  describe('validateDeviceId', () => {
    it('should validate correct device ID format', () => {
      const validId = 'device-1234567890123-abcdefghi';
      expect(validateDeviceId(validId)).toBe(true);
    });

    it('should reject invalid device ID formats', () => {
      expect(validateDeviceId('invalid-id')).toBe(false);
      expect(validateDeviceId('device-123-abc')).toBe(false);
      expect(validateDeviceId('device-1234567890123-ABCDEFGHI')).toBe(false);
    });
  });

  describe('RateLimiter', () => {
    let rateLimiter: RateLimiter;

    beforeEach(() => {
      rateLimiter = new RateLimiter(3, 1000); // 3 requests per second
    });

    it('should allow requests within limit', () => {
      expect(rateLimiter.isAllowed('user1')).toBe(true);
      expect(rateLimiter.isAllowed('user1')).toBe(true);
      expect(rateLimiter.isAllowed('user1')).toBe(true);
    });

    it('should block requests over limit', () => {
      rateLimiter.isAllowed('user1');
      rateLimiter.isAllowed('user1');
      rateLimiter.isAllowed('user1');
      expect(rateLimiter.isAllowed('user1')).toBe(false);
    });

    it('should handle different identifiers separately', () => {
      rateLimiter.isAllowed('user1');
      rateLimiter.isAllowed('user1');
      rateLimiter.isAllowed('user1');
      
      expect(rateLimiter.isAllowed('user2')).toBe(true);
    });

    it('should reset limits correctly', () => {
      rateLimiter.isAllowed('user1');
      rateLimiter.isAllowed('user1');
      rateLimiter.isAllowed('user1');
      
      rateLimiter.reset('user1');
      expect(rateLimiter.isAllowed('user1')).toBe(true);
    });
  });

  describe('SecureStorage', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('should store and retrieve data without encryption', () => {
      SecureStorage.setItem('test', 'value');
      expect(SecureStorage.getItem('test')).toBe('value');
    });

    it('should store and retrieve data with encryption', () => {
      SecureStorage.setItem('test', 'secret', 'password');
      const retrieved = SecureStorage.getItem('test', 'password');
      expect(retrieved).toBe('secret');
    });

    it('should return null for non-existent keys', () => {
      expect(SecureStorage.getItem('nonexistent')).toBe(null);
    });

    it('should handle decryption errors gracefully', () => {
      SecureStorage.setItem('test', 'value', 'password1');
      const result = SecureStorage.getItem('test', 'password2');
      expect(result).toBe('');
    });
  });
});