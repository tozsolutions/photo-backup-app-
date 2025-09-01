import { useState, useCallback, useEffect } from 'react';
import { Device } from '@/types';

const mockDevices: Device[] = [
  {
    id: 'ios-device-1',
    name: 'iPhone 14 Pro',
    type: 'iOS',
    ipAddress: '192.168.1.101',
    lastSeen: new Date(),
    batteryLevel: 85,
    isConnected: true,
  },
  {
    id: 'android-device-1',
    name: 'Samsung Galaxy S23',
    type: 'Android',
    ipAddress: '192.168.1.102',
    lastSeen: new Date(Date.now() - 300000), // 5 minutes ago
    batteryLevel: 67,
    isConnected: true,
  },
  {
    id: 'ios-device-2',
    name: 'iPad Air',
    type: 'iOS',
    ipAddress: '192.168.1.103',
    lastSeen: new Date(Date.now() - 600000), // 10 minutes ago
    batteryLevel: 92,
    isConnected: false,
  },
];

export const useDeviceScanner = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanInterval, setScanInterval] = useState<number | null>(null);

  const scanForDevices = useCallback(async () => {
    if (!isScanning) return;

    try {
      // Simulate device discovery with some randomness
      const discoveredDevices = mockDevices
        .filter(() => Math.random() > 0.3) // Randomly filter devices
        .map(device => ({
          ...device,
          lastSeen: new Date(Date.now() - Math.random() * 300000), // Random last seen time
          isConnected: Math.random() > 0.2, // 80% chance of being connected
          batteryLevel: Math.max(20, Math.min(100, (device.batteryLevel || 50) + (Math.random() - 0.5) * 10)),
        }));

      setDevices(discoveredDevices);
    } catch (_error) {
      // eslint-disable-next-line no-console
      console.error('Error scanning for devices:', _error);
    }
  }, [isScanning]);

  const startScan = useCallback(() => {
    if (isScanning) return;

    setIsScanning(true);
    scanForDevices();

    const interval = setInterval(() => {
      scanForDevices();
    }, 5000); // Scan every 5 seconds

    setScanInterval(interval);
  }, [isScanning, scanForDevices]);

  const stopScan = useCallback(() => {
    setIsScanning(false);
    if (scanInterval) {
      clearInterval(scanInterval);
      setScanInterval(null);
    }
  }, [scanInterval]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (scanInterval) {
        clearInterval(scanInterval);
      }
    };
  }, [scanInterval]);

  // Auto-scan when online
  useEffect(() => {
    const handleOnline = () => {
      if (navigator.onLine && !isScanning) {
        startScan();
      }
    };

    const interval = setInterval(handleOnline, 10000); // Check every 10 seconds
    handleOnline(); // Initial check

    return () => clearInterval(interval);
  }, [isScanning, startScan]);

  return {
    devices,
    isScanning,
    startScan,
    stopScan,
    scanForDevices,
  };
};