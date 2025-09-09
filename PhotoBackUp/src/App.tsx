import { useState, useEffect } from 'react';
import { TabType, BackupSession } from '@/types';
import { DeviceList } from '@/components/DeviceList';
import { FileManager } from '@/components/FileManager';
import { BackupStatus } from '@/components/BackupStatus';
import { Settings } from '@/components/Settings';
import { useDeviceScanner } from '@/hooks/useDeviceScanner';
import {
  Smartphone,
  Wifi,
  HardDrive,
  Settings as SettingsIcon,
} from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('devices');
  const [localStorageEnabled, setLocalStorageEnabled] = useState(false);
  const [backupSessions, setBackupSessions] = useState<BackupSession[]>([]);

  const { devices, isScanning, startScan, stopScan } = useDeviceScanner();

  useEffect(() => {
    const savedLocalStorage = localStorage.getItem('localStorageEnabled');
    setLocalStorageEnabled(savedLocalStorage === 'true');

    // Start scanning on mount
    startScan();

    // Cleanup on unmount
    return () => stopScan();
  }, [startScan, stopScan]);

  const handleDeviceClick = async (deviceId: string, deviceName: string) => {
    // Check if device is already being backed up
    const existingSession = backupSessions.find(
      (session) => session.deviceId === deviceId && session.isActive
    );

    if (existingSession) {
      return; // Already backing up
    }

    // Create new backup session
    const newSession: BackupSession = {
      deviceId,
      deviceName,
      progress: 0,
      totalFiles: 0,
      completedFiles: 0,
      isActive: true,
    };

    // Add new session
    setBackupSessions((prev) => [
      ...prev.filter((session) => session.deviceId !== deviceId),
      newSession,
    ]);

    try {
      // Simulate backup process
      await simulateBackup(deviceId, (progress, total, completed) => {
        setBackupSessions((prev) =>
          prev.map((session) =>
            session.deviceId === deviceId
              ? {
                  ...session,
                  progress,
                  totalFiles: total,
                  completedFiles: completed,
                }
              : session
          )
        );
      });

      // Mark as completed
      setBackupSessions((prev) =>
        prev.map((session) =>
          session.deviceId === deviceId
            ? { ...session, isActive: false, progress: 100 }
            : session
        )
      );
    } catch {
      // Mark as failed
      setBackupSessions((prev) =>
        prev.map((session) =>
          session.deviceId === deviceId
            ? { ...session, isActive: false }
            : session
        )
      );
    }
  };

  const simulateBackup = async (
    _deviceId: string,
    onProgress: (progress: number, total: number, completed: number) => void
  ) => {
    const totalFiles = Math.floor(Math.random() * 50) + 10; // 10-60 files

    for (let i = 0; i <= totalFiles; i++) {
      await new Promise((resolve) =>
        setTimeout(resolve, 100 + Math.random() * 200)
      );
      const progress = Math.floor((i / totalFiles) * 100);
      onProgress(progress, totalFiles, i);
    }
  };

  const handleEnableLocalStorage = () => {
    setLocalStorageEnabled(true);
    localStorage.setItem('localStorageEnabled', 'true');

    // Set up backup directories
    localStorage.setItem(
      'backupDirectories',
      JSON.stringify([
        'C:\\Users\\TOZ\\AppData\\Local\\PhotoBackup',
        'C:\\Users\\TOZ\\AppData\\Local\\PhotoBackup\\iOS',
        'C:\\Users\\TOZ\\AppData\\Local\\PhotoBackup\\Android',
      ])
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-600 rounded-lg">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Fotoğraf Yedekleme Sistemi
                </h1>
                <p className="text-gray-600">Otomatik WiFi yedekleme sistemi</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Wifi
                  className={`w-5 h-5 ${
                    isScanning
                      ? 'text-green-500 animate-pulse'
                      : 'text-gray-400'
                  }`}
                />
                <span className="text-sm text-gray-600">
                  {isScanning ? 'Cihazlar taranıyor...' : 'Tarama durduruldu'}
                </span>
              </div>
              {localStorageEnabled && (
                <div className="flex items-center space-x-2 text-green-600">
                  <HardDrive className="w-5 h-5" />
                  <span className="text-sm">Yerel depolama aktif</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('devices')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'devices'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Smartphone className="w-5 h-5 mx-auto mb-1" />
              Cihaz Listesi
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'files'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <HardDrive className="w-5 h-5 mx-auto mb-1" />
              Dosya Yöneticisi
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <SettingsIcon className="w-5 h-5 mx-auto mb-1" />
              Ayarlar
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'devices' && (
            <>
              <DeviceList
                devices={devices}
                onDeviceClick={handleDeviceClick}
                isScanning={isScanning}
              />
              {backupSessions.length > 0 && (
                <BackupStatus sessions={backupSessions} />
              )}
            </>
          )}

          {activeTab === 'files' && (
            <FileManager localStorageEnabled={localStorageEnabled} />
          )}

          {activeTab === 'settings' && (
            <Settings
              localStorageEnabled={localStorageEnabled}
              onEnableLocalStorage={handleEnableLocalStorage}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
