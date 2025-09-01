import React from 'react';
import { Device } from '../types';
import { Monitor, Smartphone, Wifi, WifiOff, RefreshCw, Play } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

interface DeviceListProps {
  devices: Device[];
  isScanning: boolean;
  onScanDevices: () => void;
  onStartBackup: (deviceId: string) => void;
}

const DeviceList: React.FC<DeviceListProps> = ({ 
  devices, 
  isScanning, 
  onScanDevices, 
  onStartBackup 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cihazlar</h2>
          <p className="text-gray-600">WiFi ağındaki bilgisayarları keşfedin</p>
        </div>
        <button
          onClick={onScanDevices}
          disabled={isScanning}
          className="btn btn-primary"
        >
          {isScanning ? (
            <>
              <div className="loading" />
              Taranıyor...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Cihazları Tara
            </>
          )}
        </button>
      </div>

      {devices.length === 0 && !isScanning && (
        <div className="card text-center py-12">
          <WifiOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Cihaz Bulunamadı</h3>
          <p className="text-gray-600 mb-6">
            Aynı WiFi ağına bağlı bilgisayar bulunamadı. 
            <br />
            Bilgisayarınızın açık ve aynı WiFi'ye bağlı olduğundan emin olun.
          </p>
          <button onClick={onScanDevices} className="btn btn-primary">
            <RefreshCw className="w-4 h-4" />
            Tekrar Tara
          </button>
        </div>
      )}

      {isScanning && devices.length === 0 && (
        <div className="card text-center py-12">
          <div className="loading w-8 h-8 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Cihazlar Aranıyor...</h3>
          <p className="text-gray-600">
            WiFi ağında bilgisayar aranıyor. Bu işlem birkaç saniye sürebilir.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {devices.map((device) => (
          <DeviceCard
            key={device.id}
            device={device}
            onStartBackup={() => onStartBackup(device.id)}
          />
        ))}
      </div>

      {devices.length > 0 && (
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Wifi className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">WiFi Bağlantı İpucu</h3>
              <p className="text-sm text-blue-800">
                En iyi performans için telefonunuz ve bilgisayarınızın aynı WiFi ağına bağlı 
                olduğundan ve sinyal gücünün yeterli olduğundan emin olun.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface DeviceCardProps {
  device: Device;
  onStartBackup: () => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, onStartBackup }) => {
  const DeviceIcon = device.type === 'computer' ? Monitor : Smartphone;
  const StatusIcon = device.status === 'online' ? Wifi : WifiOff;

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gray-100 rounded-lg">
            <DeviceIcon className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{device.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <StatusIcon className={`w-4 h-4 ${
                device.status === 'online' ? 'status-online' : 'status-offline'
              }`} />
              <span className={device.status === 'online' ? 'status-online' : 'status-offline'}>
                {device.status === 'online' ? 'Çevrimiçi' : 'Çevrimdışı'}
              </span>
              <span>•</span>
              <span>{device.ip}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Son görülme: {formatDistanceToNow(device.lastSeen, { 
                addSuffix: true, 
                locale: tr 
              })}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {device.status === 'online' && (
            <button
              onClick={onStartBackup}
              className="btn btn-primary"
            >
              <Play className="w-4 h-4" />
              Yedekle
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeviceList;