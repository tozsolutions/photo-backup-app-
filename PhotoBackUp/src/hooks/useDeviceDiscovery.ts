/**
 * Custom hook for device discovery and management
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { Device } from '../types';
import { NetworkService } from '../services/networkService';
import { logger } from '../utils/logger';
import { NetworkError } from '../utils/errors';

export function useDeviceDiscovery() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const networkService = useRef(NetworkService.getInstance());
  const scanTimeoutRef = useRef<NodeJS.Timeout>();

  const scanDevices = useCallback(async () => {
    if (isScanning) return;

    setIsScanning(true);
    setError(null);
    logger.info('Starting device discovery...');

    try {
      // Clear previous timeout
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }

      // Set a timeout for the scan operation
      const timeoutPromise = new Promise<never>((_, reject) => {
        scanTimeoutRef.current = setTimeout(() => {
          reject(new NetworkError('Tarama zaman aşımına uğradı'));
        }, 10000); // 10 second timeout
      });

      const scanPromise = networkService.current.discoverDevices();
      const discoveredDevices = await Promise.race([scanPromise, timeoutPromise]);

      setDevices(discoveredDevices);
      logger.info(`Discovered ${discoveredDevices.length} devices`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata';
      setError(errorMessage);
      logger.error('Device discovery failed:', err);
    } finally {
      setIsScanning(false);
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
    }
  }, [isScanning]);

  const refreshDeviceStatus = useCallback(async (deviceId: string) => {
    try {
      const status = await networkService.current.checkDeviceStatus(deviceId);
      setDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { ...device, status, lastSeen: new Date() }
          : device
      ));
    } catch (err) {
      logger.error(`Failed to refresh status for device ${deviceId}:`, err);
    }
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
    };
  }, []);

  return {
    devices,
    isScanning,
    error,
    scanDevices,
    refreshDeviceStatus,
    clearError: () => setError(null)
  };
}