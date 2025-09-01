import React from 'react';
import { Device } from '@/types';
import { Wifi, Clock, Battery, Smartphone } from 'lucide-react';
import { getRelativeTime } from '@/utils';

interface DeviceListProps {
  devices: Device[];
  onDeviceClick: (deviceId: string, deviceName: string) => void;
  isScanning: boolean;
}

export const DeviceList: React.FC<DeviceListProps> = ({
  devices,
  onDeviceClick,
  isScanning,
}) => {
  if (devices.length === 0 && !isScanning) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <Wifi className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Cihaz Bulunamadı
        </h3>
        <p className="text-gray-600">
          Aynı WiFi ağında cihaz bulunamadı. Telefonunuzun WiFi bağlantısını kontrol edin.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Tespit Edilen Cihazlar</h2>
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isScanning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            }`}
          />
          <span className="text-sm text-gray-600">
            {devices.length} cihaz bulundu
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map((device) => (
          <div
            key={device.id}
            onClick={() => onDeviceClick(device.id, device.name)}
            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-lg ${
                    device.type === 'iOS' ? 'bg-gray-600' : 'bg-green-600'
                  } text-white`}
                >
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {device.name}
                  </h3>
                  <p className="text-sm text-gray-600">{device.type}</p>
                </div>
              </div>
              <div
                className={`w-3 h-3 rounded-full ${
                  device.isConnected ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">IP Adresi:</span>
                <span className="font-mono text-gray-800">{device.ipAddress}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Son Görülme:</span>
                </span>
                <span className="text-gray-800">{getRelativeTime(device.lastSeen)}</span>
              </div>
              {device.batteryLevel && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center space-x-1">
                    <Battery className="w-3 h-3" />
                    <span>Batarya:</span>
                  </span>
                  <span className="text-gray-800">%{device.batteryLevel}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-center space-x-2 text-blue-600 group-hover:text-blue-700 transition-colors">
                <Wifi className="w-4 h-4" />
                <span className="text-sm font-medium">Yedekleme Başlat</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isScanning && devices.length === 0 && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cihazlar taranıyor...</p>
        </div>
      )}
    </div>
  );
};