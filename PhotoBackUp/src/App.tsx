import { useState, useEffect, useCallback, useMemo } from 'react';
import { TabType, BackupSession, BackupFile } from '@/types';
import { DeviceList } from '@/components/DeviceList';
import { FileManager } from '@/components/FileManager';
import { AdvancedFileManager } from '@/components/AdvancedFileManager';
import { VirtualizedFileList } from '@/components/VirtualizedFileList';
import { BackupStatus } from '@/components/BackupStatus';
import { Settings } from '@/components/Settings';
import { NotificationSystem, useNotifications } from '@/components/NotificationSystem';
import { PWAUpdatePrompt } from '@/components/PWAUpdatePrompt';
import { InstallPrompt } from '@/components/InstallPrompt';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { useDeviceScanner } from '@/hooks/useDeviceScanner';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import {
  Smartphone,
  Wifi,
  HardDrive,
  Settings as SettingsIcon,
  WifiOff,
  Signal,
} from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('devices');
  const [localStorageEnabled, setLocalStorageEnabled] = useState(false);
  const [backupSessions, setBackupSessions] = useState<BackupSession[]>([]);
  const [mockFiles, setMockFiles] = useState<BackupFile[]>([]);
  const [showInstallPrompt, setShowInstallPrompt] = useState(true);

  const { devices, isScanning, startScan, stopScan } = useDeviceScanner();
  const networkStatus = useNetworkStatus();
  const { notifications, addNotification, removeNotification } = useNotifications();
  const { metrics } = usePerformanceMonitor(
    import.meta.env.VITE_DEBUG_MODE
  );

  useEffect(() => {
    const savedLocalStorage = localStorage.getItem('localStorageEnabled');
    setLocalStorageEnabled(savedLocalStorage === 'true');

    // Load mock files
    loadMockFiles();

    // Start scanning on mount
    startScan();

    // Cleanup on unmount
    return () => stopScan();
  }, [startScan, stopScan]);

  // Network status notifications
  useEffect(() => {
    if (!networkStatus.isOnline) {
      addNotification('warning', 'Bağlantı Kesildi', 'İnternet bağlantınız kesildi. Yedekleme işlemleri duraklatıldı.', 0);
    } else if (networkStatus.effectiveType === 'slow-2g' || networkStatus.effectiveType === '2g') {
      addNotification('warning', 'Yavaş Bağlantı', 'İnternet bağlantınız yavaş. Yedekleme işlemleri uzun sürebilir.');
    }
  }, [networkStatus.isOnline, networkStatus.effectiveType, addNotification]);

  const loadMockFiles = () => {
    const files: BackupFile[] = [
      {
        id: '1',
        name: 'IMG_001.jpg',
        type: 'photo',
        size: 2048576,
        date: new Date(),
        deviceType: 'iOS',
        category: 'camera',
        path: 'PhotoBackup/2024-01-15_iOS/Kamera_Fotograflari/IMG_001.jpg',
      },
      {
        id: '2',
        name: 'VID_002.mp4',
        type: 'video',
        size: 15728640,
        date: new Date(Date.now() - 86400000),
        deviceType: 'Android',
        category: 'camera',
        path: 'PhotoBackup/2024-01-14_Android/Kamera_Fotograflari/VID_002.mp4',
      },
      {
        id: '3',
        name: 'download_image.png',
        type: 'photo',
        size: 1024000,
        date: new Date(Date.now() - 172800000),
        deviceType: 'iOS',
        category: 'downloads',
        path: 'PhotoBackup/2024-01-13_iOS/Alinan_Dosyalar/download_image.png',
      },
      {
        id: '4',
        name: 'screenshot_001.jpg',
        type: 'photo',
        size: 512000,
        date: new Date(Date.now() - 259200000),
        deviceType: 'Android',
        category: 'camera',
        path: 'PhotoBackup/2024-01-12_Android/Kamera_Fotograflari/screenshot_001.jpg',
      },
      {
        id: '5',
        name: 'shared_video.mp4',
        type: 'video',
        size: 25000000,
        date: new Date(Date.now() - 345600000),
        deviceType: 'iOS',
        category: 'sent',
        path: 'PhotoBackup/2024-01-11_iOS/Gonderilen_Dosyalar/shared_video.mp4',
      },
    ];
    setMockFiles(files);
  };

  const handleDeviceClick = useCallback(async (deviceId: string, deviceName: string) => {
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
              ? { ...session, progress, totalFiles: total, completedFiles: completed }
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

      // Show success notification
      addNotification('success', 'Yedekleme Tamamlandı', `${deviceName} cihazından dosyalar başarıyla yedeklendi.`);
    } catch {
      // Mark as failed
      setBackupSessions((prev) =>
        prev.map((session) =>
          session.deviceId === deviceId ? { ...session, isActive: false } : session
        )
      );

      // Show error notification
      addNotification('error', 'Yedekleme Başarısız', `${deviceName} cihazından yedekleme sırasında bir hata oluştu.`);
    }
  }, [backupSessions, addNotification]);

  const simulateBackup = async (
    _deviceId: string,
    onProgress: (progress: number, total: number, completed: number) => void
  ) => {
    const totalFiles = Math.floor(Math.random() * 50) + 10; // 10-60 files

    for (let i = 0; i <= totalFiles; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100 + Math.random() * 200));
      const progress = Math.floor((i / totalFiles) * 100);
      onProgress(progress, totalFiles, i);
    }
  };

  const handleEnableLocalStorage = useCallback(() => {
    setLocalStorageEnabled(true);
    localStorage.setItem('localStorageEnabled', 'true');
    
    // Set up backup directories
    const backupPath = import.meta.env.VITE_BACKUP_PATH || '/Users/Default/PhotoBackup';
    const separator = backupPath.includes('\\') ? '\\' : '/';
    
    localStorage.setItem(
      'backupDirectories',
      JSON.stringify([
        backupPath,
        `${backupPath}${separator}iOS`,
        `${backupPath}${separator}Android`,
      ])
    );
  }, []);

  // Memoized file handlers
  const handleFileSelect = useCallback((file: BackupFile) => {
    addNotification('info', 'Dosya Seçildi', `${file.name} dosyası seçildi.`);
  }, [addNotification]);

  const handleFileShare = useCallback((file: BackupFile) => {
    addNotification('success', 'Dosya Paylaşıldı', `${file.name} dosyası paylaşıldı.`);
  }, [addNotification]);

  // Memoized large files for virtualized list
  const largeFileList = useMemo(() => {
    if (mockFiles.length < 100) return mockFiles;
    // Generate more files for demonstration
    const additionalFiles: BackupFile[] = [];
    for (let i = 0; i < 1000; i++) {
      additionalFiles.push({
        id: `generated-${i}`,
        name: `file_${i}.jpg`,
        type: 'photo',
        size: Math.random() * 10000000,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        deviceType: Math.random() > 0.5 ? 'iOS' : 'Android',
        category: ['camera', 'downloads', 'sent'][Math.floor(Math.random() * 3)] as any,
        path: `PhotoBackup/generated/file_${i}.jpg`,
      });
    }
    return [...mockFiles, ...additionalFiles];
  }, [mockFiles]);

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
              {/* Network Status */}
              <div className="flex items-center space-x-2">
                {networkStatus.isOnline ? (
                  <Wifi className="w-5 h-5 text-green-500" />
                ) : (
                  <WifiOff className="w-5 h-5 text-red-500" />
                )}
                <span className="text-sm text-gray-600">
                  {networkStatus.isOnline ? 
                    `Bağlı (${networkStatus.effectiveType || 'unknown'})` : 
                    'Çevrimdışı'
                  }
                </span>
              </div>

              {/* Scanning Status */}
              <div className="flex items-center space-x-2">
                <Signal
                  className={`w-5 h-5 ${
                    isScanning ? 'text-blue-500 animate-pulse' : 'text-gray-400'
                  }`}
                />
                <span className="text-sm text-gray-600">
                  {isScanning ? 'Cihazlar taranıyor...' : 'Tarama durduruldu'}
                </span>
              </div>

              {/* Storage Status */}
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
            <div className="space-y-6">
              <FileManager localStorageEnabled={localStorageEnabled} />
              {localStorageEnabled && mockFiles.length > 0 && (
                <>
                  <AdvancedFileManager
                    files={mockFiles}
                    onFileSelect={handleFileSelect}
                    onFileShare={handleFileShare}
                  />
                  {largeFileList.length > 100 && (
                    <VirtualizedFileList
                      files={largeFileList}
                      onFileSelect={handleFileSelect}
                      onFileShare={handleFileShare}
                      containerHeight={500}
                    />
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <Settings
              localStorageEnabled={localStorageEnabled}
              onEnableLocalStorage={handleEnableLocalStorage}
            />
          )}
        </div>

        {/* Performance Debug Info */}
        {import.meta.env.VITE_DEBUG_MODE && (
          <div className="fixed bottom-4 left-4 bg-black bg-opacity-75 text-white p-3 rounded-lg text-xs font-mono">
            <div>FPS: {metrics.fps}</div>
            <div>Memory: {metrics.memoryUsage} MB</div>
            <div>Render: {metrics.renderTime.toFixed(2)}ms</div>
            <div>Load: {metrics.loadTime}ms</div>
          </div>
        )}

        {/* PWA Components */}
        <PWAUpdatePrompt
          onUpdate={() => addNotification('success', 'Güncelleme Tamamlandı', 'Uygulama başarıyla güncellendi.')}
        />
        
        {showInstallPrompt && (
          <InstallPrompt
            onDismiss={() => setShowInstallPrompt(false)}
          />
        )}
        
        <OfflineIndicator />

        {/* Notification System */}
        <NotificationSystem
          notifications={notifications}
          onRemove={removeNotification}
        />
      </div>
    </div>
  );
}

export default App;