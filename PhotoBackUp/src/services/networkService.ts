import { Device } from '../types';

export class NetworkService {
  private static instance: NetworkService;
  private discoveredDevices: Map<string, Device> = new Map();

  public static getInstance(): NetworkService {
    if (!NetworkService.instance) {
      NetworkService.instance = new NetworkService();
    }
    return NetworkService.instance;
  }

  async discoverDevices(): Promise<Device[]> {
    try {
      // Try to discover devices on the local network
      const devices: Device[] = [];
      
      // Check common local IP ranges
      const baseIPs = this.getLocalNetworkRanges();
      
      for (const baseIP of baseIPs) {
        const promises: Promise<Device | null>[] = [];
        
        // Check first 10 IPs in each range for demo
        for (let i = 1; i <= 10; i++) {
          const ip = `${baseIP}.${i}`;
          promises.push(this.pingDevice(ip));
        }
        
        const results = await Promise.allSettled(promises);
        
        results.forEach((result) => {
          if (result.status === 'fulfilled' && result.value) {
            devices.push(result.value);
            this.discoveredDevices.set(result.value.id, result.value);
          }
        });
      }
      
      return devices;
    } catch (error) {
      console.error('Cihaz keşfi hatası:', error);
      return [];
    }
  }

  private getLocalNetworkRanges(): string[] {
    // Common local network ranges
    return ['192.168.1', '192.168.0', '10.0.0', '172.16.0'];
  }

  private async pingDevice(ip: string): Promise<Device | null> {
    try {
      // Try to connect to a common service port
      await fetch(`http://${ip}:8080/ping`, {
        method: 'GET',
        mode: 'no-cors',
        signal: AbortSignal.timeout(2000)
      });
      
      return {
        id: `device-${ip}`,
        name: `Bilgisayar (${ip})`,
        ip,
        type: 'computer',
        status: 'online',
        lastSeen: new Date()
      };
    } catch {
      return null;
    }
  }

  async sendPhotos(deviceId: string, photos: File[]): Promise<void> {
    const device = this.discoveredDevices.get(deviceId);
    if (!device) {
      throw new Error('Cihaz bulunamadı');
    }

    const formData = new FormData();
    photos.forEach((photo, index) => {
      formData.append(`photo_${index}`, photo);
    });

    const response = await fetch(`http://${device.ip}:8080/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Fotoğraf gönderimi başarısız');
    }
  }

  async checkDeviceStatus(deviceId: string): Promise<'online' | 'offline'> {
    const device = this.discoveredDevices.get(deviceId);
    if (!device) {
      return 'offline';
    }

    try {
      const response = await fetch(`http://${device.ip}:8080/status`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000)
      });
      
      return response.ok ? 'online' : 'offline';
    } catch {
      return 'offline';
    }
  }
}