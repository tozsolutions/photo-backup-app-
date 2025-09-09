// Device types
export interface Device {
  id: string;
  name: string;
  type: 'iOS' | 'Android';
  ipAddress: string;
  lastSeen: Date;
  batteryLevel?: number;
  isConnected: boolean;
}

// File types
export interface BackupFile {
  id: string;
  name: string;
  type: 'photo' | 'video';
  size: number;
  date: Date;
  deviceType: 'iOS' | 'Android';
  category: 'camera' | 'downloads' | 'sent' | 'deleted';
  path: string;
}

// Backup session types
export interface BackupSession {
  deviceId: string;
  deviceName: string;
  progress: number;
  totalFiles: number;
  completedFiles: number;
  isActive: boolean;
}

// Tab types
export type TabType = 'devices' | 'files' | 'settings';
