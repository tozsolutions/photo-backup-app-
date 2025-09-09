import React, { useState, useEffect } from 'react';
import { BackupFile } from '@/types';
import {
  File,
  Download,
  Camera,
  Send,
  Trash2,
  Calendar,
  FileX,
  Smartphone,
} from 'lucide-react';
import { formatFileSize, formatDate, getCategoryDisplayName } from '@/utils';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface FileManagerProps {
  localStorageEnabled: boolean;
}

export const FileManager: React.FC<FileManagerProps> = ({
  localStorageEnabled,
}) => {
  const [dateFilter, setDateFilter] = useState('');
  const [deviceFilter, setDeviceFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [files, setFiles] = useState<BackupFile[]>([]);
  const [totalSize, setTotalSize] = useState(0);

  useEffect(() => {
    if (localStorageEnabled) {
      loadMockFiles();
    }
  }, [localStorageEnabled]);

  const loadMockFiles = () => {
    const mockFiles: BackupFile[] = [
      {
        id: '1',
        name: 'IMG_001.jpg',
        type: 'photo',
        size: 2048576,
        date: new Date(),
        deviceType: 'iOS',
        category: 'camera',
        path: 'C:\\Users\\TOZ\\AppData\\Local\\PhotoBackup\\2024-01-15_iOS\\Kamera_Fotograflari\\IMG_001.jpg',
      },
      {
        id: '2',
        name: 'VID_002.mp4',
        type: 'video',
        size: 15728640,
        date: new Date(Date.now() - 86400000), // 1 day ago
        deviceType: 'Android',
        category: 'camera',
        path: 'C:\\Users\\TOZ\\AppData\\Local\\PhotoBackup\\2024-01-14_Android\\Kamera_Fotograflari\\VID_002.mp4',
      },
      {
        id: '3',
        name: 'download_image.png',
        type: 'photo',
        size: 1024000,
        date: new Date(Date.now() - 172800000), // 2 days ago
        deviceType: 'iOS',
        category: 'downloads',
        path: 'C:\\Users\\TOZ\\AppData\\Local\\PhotoBackup\\2024-01-13_iOS\\Alinan_Dosyalar\\download_image.png',
      },
    ];

    setFiles(mockFiles);
    setTotalSize(mockFiles.reduce((total, file) => total + file.size, 0));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'camera':
        return <Camera className="w-4 h-4" />;
      case 'downloads':
        return <Download className="w-4 h-4" />;
      case 'sent':
        return <Send className="w-4 h-4" />;
      case 'deleted':
        return <Trash2 className="w-4 h-4" />;
      default:
        return <File className="w-4 h-4" />;
    }
  };

  const filteredFiles = files.filter((file) => {
    const matchesDate =
      !dateFilter || formatDate(file.date, 'yyyy-MM-dd') === dateFilter;
    const matchesDevice =
      deviceFilter === 'all' || file.deviceType === deviceFilter;
    const matchesCategory =
      categoryFilter === 'all' || file.category === categoryFilter;

    return matchesDate && matchesDevice && matchesCategory;
  });

  const groupedFiles = filteredFiles.reduce(
    (groups, file) => {
      const dateKey = formatDate(file.date, 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(file);
      return groups;
    },
    {} as { [key: string]: BackupFile[] }
  );

  if (!localStorageEnabled) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <FileX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Yerel Depolama Devre Dışı
        </h3>
        <p className="text-gray-600">
          Dosyaları görüntülemek için önce yerel depolamayı etkinleştirin.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-2">
            <File className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">
              Toplam Dosya
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-1">
            {files.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">
              Toplam Boyut
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-1">
            {formatFileSize(totalSize)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">
              iOS Dosyaları
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-1">
            {files.filter((f) => f.deviceType === 'iOS').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">
              Android Dosyaları
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-1">
            {files.filter((f) => f.deviceType === 'Android').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Filtreler</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tarih
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cihaz Türü
            </label>
            <select
              value={deviceFilter}
              onChange={(e) => setDeviceFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tüm Cihazlar</option>
              <option value="iOS">iOS</option>
              <option value="Android">Android</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tüm Kategoriler</option>
              <option value="camera">Kamera Fotoğrafları</option>
              <option value="downloads">Alınan Dosyalar</option>
              <option value="sent">Gönderilen Dosyalar</option>
              <option value="deleted">Silinmiş Öğeler</option>
            </select>
          </div>
        </div>
      </div>

      {/* File List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Yedeklenen Dosyalar ({filteredFiles.length})
        </h3>

        {Object.keys(groupedFiles).length === 0 ? (
          <div className="text-center py-8">
            <File className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Henüz yedeklenmiş dosya bulunmuyor.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedFiles)
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .map(([date, dateFiles]) => (
                <div
                  key={date}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-800">
                        {format(new Date(date), 'dd MMMM yyyy', { locale: tr })}
                      </span>
                      <span className="text-sm text-gray-600">
                        ({dateFiles.length} dosya)
                      </span>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {dateFiles.map((file) => (
                      <div
                        key={file.id}
                        className="px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`p-2 rounded-lg ${
                                file.deviceType === 'iOS'
                                  ? 'bg-gray-100'
                                  : 'bg-green-100'
                              }`}
                            >
                              {getCategoryIcon(file.category)}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800">
                                {file.name}
                              </h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>
                                  {getCategoryDisplayName(file.category)}
                                </span>
                                <span>{file.deviceType}</span>
                                <span>{formatFileSize(file.size)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">
                              {formatDate(file.date, 'HH:mm')}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {file.type === 'photo' ? 'Fotoğraf' : 'Video'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
