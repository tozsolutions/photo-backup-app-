export interface Device {
  id: string;
  name: string;
  ip: string;
  type: 'computer' | 'phone';
  status: 'online' | 'offline';
  lastSeen: Date;
}

export interface Photo {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: Date;
  blob?: Blob;
}

export interface BackupProgress {
  current: number;
  total: number;
  currentFile: string;
  speed: number; // bytes per second
  timeRemaining: number; // seconds
}

export interface BackupSession {
  id: string;
  deviceId: string;
  startTime: Date;
  endTime?: Date;
  filesCount: number;
  filesTransferred: number;
  totalSize: number;
  transferredSize: number;
  status: 'preparing' | 'active' | 'completed' | 'error' | 'cancelled';
  error?: string;
}

export type TabType = 'devices' | 'backup' | 'history' | 'settings';