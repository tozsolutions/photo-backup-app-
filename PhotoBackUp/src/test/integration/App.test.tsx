import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '@/App';

// Mock hooks
vi.mock('@/hooks/useDeviceScanner', () => ({
  useDeviceScanner: () => ({
    devices: [
      {
        id: 'device-1',
        name: 'Test Device',
        type: 'iOS',
        ipAddress: '192.168.1.100',
        lastSeen: new Date(),
        batteryLevel: 80,
        isConnected: true,
      },
    ],
    isScanning: false,
    startScan: vi.fn(),
    stopScan: vi.fn(),
  }),
}));

vi.mock('@/hooks/useNetworkStatus', () => ({
  useNetworkStatus: () => ({
    isOnline: true,
    connectionType: 'wifi',
    effectiveType: '4g',
    downlink: 10,
    rtt: 50,
  }),
}));

vi.mock('@/hooks/usePerformanceMonitor', () => ({
  usePerformanceMonitor: () => ({
    metrics: {
      renderTime: 16.5,
      memoryUsage: 25,
      fps: 60,
      loadTime: 1200,
    },
  }),
}));

describe('App Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should render main application', () => {
    render(<App />);

    expect(screen.getByText('Fotoğraf Yedekleme Sistemi')).toBeInTheDocument();
    expect(screen.getByText('Otomatik WiFi yedekleme sistemi')).toBeInTheDocument();
  });

  it('should display network status', () => {
    render(<App />);

    expect(screen.getByText(/Bağlı \(4g\)/)).toBeInTheDocument();
  });

  it('should show device list by default', () => {
    render(<App />);

    expect(screen.getByText('Test Device')).toBeInTheDocument();
    expect(screen.getByText('1 cihaz bulundu')).toBeInTheDocument();
  });

  it('should switch between tabs', async () => {
    render(<App />);

    // Switch to files tab
    const filesTab = screen.getByText('Dosya Yöneticisi');
    fireEvent.click(filesTab);

    await waitFor(() => {
      expect(screen.getByText(/Yerel depolamayı etkinleştirin/)).toBeInTheDocument();
    });

    // Switch to settings tab
    const settingsTab = screen.getByText('Ayarlar');
    fireEvent.click(settingsTab);

    await waitFor(() => {
      expect(screen.getByText(/Yerel Depolama/)).toBeInTheDocument();
    });
  });

  it('should enable local storage', async () => {
    render(<App />);

    // Go to settings
    const settingsTab = screen.getByText('Ayarlar');
    fireEvent.click(settingsTab);

    await waitFor(() => {
      const enableButton = screen.getByText('Etkinleştir');
      fireEvent.click(enableButton);
    });

    // Check if local storage is enabled
    expect(localStorage.getItem('localStorageEnabled')).toBe('true');
    expect(screen.getByText('Yerel depolama aktif')).toBeInTheDocument();
  });

  it('should handle device backup simulation', async () => {
    render(<App />);

    // Click on a device
    const device = screen.getByText('Test Device');
    fireEvent.click(device);

    // Should show backup status
    await waitFor(() => {
      expect(screen.getByText(/Yedekleme Durumu/)).toBeInTheDocument();
    });
  });

  it('should display notifications', async () => {
    render(<App />);

    // Enable local storage to trigger a notification
    const settingsTab = screen.getByText('Ayarlar');
    fireEvent.click(settingsTab);

    await waitFor(() => {
      const enableButton = screen.getByText('Etkinleştir');
      fireEvent.click(enableButton);
    });

    // Go to devices and click on one
    const devicesTab = screen.getByText('Cihaz Listesi');
    fireEvent.click(devicesTab);

    const device = screen.getByText('Test Device');
    fireEvent.click(device);

    // Should eventually show success notification
    await waitFor(
      () => {
        expect(screen.getByText('Yedekleme Tamamlandı')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  it('should show performance metrics in debug mode', () => {
    // Mock debug mode
    vi.stubEnv('VITE_DEBUG_MODE', 'true');

    render(<App />);

    expect(screen.getByText('FPS: 60')).toBeInTheDocument();
    expect(screen.getByText('Memory: 25 MB')).toBeInTheDocument();
    expect(screen.getByText('Render: 16.50ms')).toBeInTheDocument();
    expect(screen.getByText('Load: 1200ms')).toBeInTheDocument();
  });

  it('should handle file operations', async () => {
    render(<App />);

    // Enable local storage first
    const settingsTab = screen.getByText('Ayarlar');
    fireEvent.click(settingsTab);

    await waitFor(() => {
      const enableButton = screen.getByText('Etkinleştir');
      fireEvent.click(enableButton);
    });

    // Go to files tab
    const filesTab = screen.getByText('Dosya Yöneticisi');
    fireEvent.click(filesTab);

    await waitFor(() => {
      // Should show file manager with mock files
      expect(screen.getByText('Gelişmiş Dosya Yöneticisi')).toBeInTheDocument();
    });
  });
});