import { useState, useEffect } from 'react';
import { TabType, Device, BackupSession } from './types';
import { NetworkService } from './services/networkService';
import { PhotoService } from './services/photoService';
import DeviceList from './components/DeviceList';
import BackupProgress from './components/BackupProgress';
import BackupHistory from './components/BackupHistory';
import Settings from './components/Settings';
import TabNavigation from './components/TabNavigation';
import { Wifi, Camera, History, Settings as SettingsIcon } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('devices');
  const [devices, setDevices] = useState<Device[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [currentSession, setCurrentSession] = useState<BackupSession | null>(null);
  const [backupHistory, setBackupHistory] = useState<BackupSession[]>([]);

  const networkService = NetworkService.getInstance();
  const photoService = PhotoService.getInstance();

  useEffect(() => {
    // Load backup history from localStorage
    const savedHistory = localStorage.getItem('backup-history');
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory).map((session: any) => ({
          ...session,
          startTime: new Date(session.startTime),
          endTime: session.endTime ? new Date(session.endTime) : undefined
        }));
        setBackupHistory(history);
      } catch (error) {
        console.error('Geçmiş yüklenirken hata:', error);
      }
    }
  }, []);

  const handleScanDevices = async () => {
    setIsScanning(true);
    try {
      const discoveredDevices = await networkService.discoverDevices();
      setDevices(discoveredDevices);
    } catch (error) {
      console.error('Cihaz tarama hatası:', error);
      alert('Cihaz tarama sırasında hata oluştu. WiFi bağlantınızı kontrol edin.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleStartBackup = async (deviceId: string) => {
    try {
      const photos = await photoService.getPhotosFromDevice();
      
      if (photos.length === 0) {
        alert('Yedeklenecek fotoğraf bulunamadı.');
        return;
      }

      const session: BackupSession = {
        id: `session-${Date.now()}`,
        deviceId,
        startTime: new Date(),
        filesCount: photos.length,
        filesTransferred: 0,
        totalSize: photos.reduce((sum, photo) => sum + photo.size, 0),
        transferredSize: 0,
        status: 'preparing'
      };

      setCurrentSession(session);
      setActiveTab('backup');

      // Simulate backup progress
      session.status = 'active';
      setCurrentSession({ ...session });

      // In a real app, this would send photos to the target device
      for (let i = 0; i < photos.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate transfer time
        
        session.filesTransferred = i + 1;
        session.transferredSize += photos[i]?.size || 0;
        
        if (currentSession && currentSession.status === 'cancelled') {
          break;
        }
        
        setCurrentSession({ ...session });
      }

      if (currentSession && currentSession.status !== 'cancelled') {
        session.status = 'completed';
        session.endTime = new Date();
        
        const updatedHistory = [session, ...backupHistory];
        setBackupHistory(updatedHistory);
        localStorage.setItem('backup-history', JSON.stringify(updatedHistory));
      }

      setCurrentSession({ ...session });
      
    } catch (error) {
      console.error('Yedekleme hatası:', error);
      if (currentSession) {
        const errorSession = {
          ...currentSession,
          status: 'error' as const,
          error: error instanceof Error ? error.message : 'Bilinmeyen hata',
          endTime: new Date()
        };
        setCurrentSession(errorSession);
      }
    }
  };

  const handleCancelBackup = () => {
    if (currentSession && currentSession.status === 'active') {
      const cancelledSession = {
        ...currentSession,
        status: 'cancelled' as const,
        endTime: new Date()
      };
      setCurrentSession(cancelledSession);
    }
  };

  const tabs = [
    { id: 'devices' as TabType, label: 'Cihazlar', icon: Wifi },
    { id: 'backup' as TabType, label: 'Yedekleme', icon: Camera },
    { id: 'history' as TabType, label: 'Geçmiş', icon: History },
    { id: 'settings' as TabType, label: 'Ayarlar', icon: SettingsIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container py-4">
          <div className="flex items-center gap-3">
            <Camera className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Fotoğraf Yedekleme</h1>
              <p className="text-sm text-gray-600">WiFi üzerinden otomatik yedekleme</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-6">
        {activeTab === 'devices' && (
          <DeviceList
            devices={devices}
            isScanning={isScanning}
            onScanDevices={handleScanDevices}
            onStartBackup={handleStartBackup}
          />
        )}

        {activeTab === 'backup' && (
          <BackupProgress
            session={currentSession}
            onCancel={handleCancelBackup}
          />
        )}

        {activeTab === 'history' && (
          <BackupHistory
            sessions={backupHistory}
            onClearHistory={() => {
              setBackupHistory([]);
              localStorage.removeItem('backup-history');
            }}
          />
        )}

        {activeTab === 'settings' && <Settings />}
      </main>

      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}

export default App;