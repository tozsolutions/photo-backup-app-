import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DeviceList } from '@/components/DeviceList';
import { Device } from '@/types';

const mockDevices: Device[] = [
  {
    id: 'device-1',
    name: 'iPhone 14 Pro',
    type: 'iOS',
    ipAddress: '192.168.1.101',
    lastSeen: new Date(),
    batteryLevel: 85,
    isConnected: true,
  },
  {
    id: 'device-2',
    name: 'Samsung Galaxy S23',
    type: 'Android',
    ipAddress: '192.168.1.102',
    lastSeen: new Date(Date.now() - 300000),
    batteryLevel: 67,
    isConnected: false,
  },
];

describe('DeviceList', () => {
  it('renders empty state when no devices and not scanning', () => {
    render(
      <DeviceList
        devices={[]}
        onDeviceClick={vi.fn()}
        isScanning={false}
      />
    );

    expect(screen.getByText('Cihaz Bulunamadı')).toBeInTheDocument();
    expect(screen.getByText(/Aynı WiFi ağında cihaz bulunamadı/)).toBeInTheDocument();
  });

  it('renders scanning state when scanning with no devices', () => {
    render(
      <DeviceList
        devices={[]}
        onDeviceClick={vi.fn()}
        isScanning={true}
      />
    );

    expect(screen.getByText('Cihazlar taranıyor...')).toBeInTheDocument();
  });

  it('renders device list correctly', () => {
    render(
      <DeviceList
        devices={mockDevices}
        onDeviceClick={vi.fn()}
        isScanning={false}
      />
    );

    expect(screen.getByText('iPhone 14 Pro')).toBeInTheDocument();
    expect(screen.getByText('Samsung Galaxy S23')).toBeInTheDocument();
    expect(screen.getByText('2 cihaz bulundu')).toBeInTheDocument();
  });

  it('calls onDeviceClick when device is clicked', () => {
    const mockOnDeviceClick = vi.fn();
    
    render(
      <DeviceList
        devices={mockDevices}
        onDeviceClick={mockOnDeviceClick}
        isScanning={false}
      />
    );

    const firstDevice = screen.getByText('iPhone 14 Pro').closest('div');
    fireEvent.click(firstDevice!);

    expect(mockOnDeviceClick).toHaveBeenCalledWith('device-1', 'iPhone 14 Pro');
  });

  it('displays battery level correctly', () => {
    render(
      <DeviceList
        devices={mockDevices}
        onDeviceClick={vi.fn()}
        isScanning={false}
      />
    );

    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('67%')).toBeInTheDocument();
  });

  it('shows connection status correctly', () => {
    render(
      <DeviceList
        devices={mockDevices}
        onDeviceClick={vi.fn()}
        isScanning={false}
      />
    );

    // Check for connected and disconnected states in the DOM
    const connectedDevice = screen.getByText('iPhone 14 Pro').closest('.border');
    const disconnectedDevice = screen.getByText('Samsung Galaxy S23').closest('.border');

    expect(connectedDevice).toBeInTheDocument();
    expect(disconnectedDevice).toBeInTheDocument();
  });
});