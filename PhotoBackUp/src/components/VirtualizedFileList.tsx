import React, { useState, useMemo, useCallback } from 'react';
import { BackupFile } from '@/types';
import { formatFileSize, getCategoryDisplayName } from '@/utils';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Eye, Share, Camera, Download, Send, Trash2, File } from 'lucide-react';

interface VirtualizedFileListProps {
  files: BackupFile[];
  onFileSelect?: (file: BackupFile) => void;
  onFileShare?: (file: BackupFile) => void;
  itemHeight?: number;
  containerHeight?: number;
}

export const VirtualizedFileList: React.FC<VirtualizedFileListProps> = ({
  files,
  onFileSelect,
  onFileShare,
  itemHeight = 80,
  containerHeight = 400,
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  const visibleItemsCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleItemsCount + 1, files.length);

  const visibleFiles = useMemo(() => {
    return files.slice(startIndex, endIndex);
  }, [files, startIndex, endIndex]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

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

  const getFileIcon = (file: BackupFile) => {
    return file.type === 'photo' ? '🖼️' : '🎬';
  };

  const handleFileSelect = (fileId: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId);
    } else {
      newSelected.add(fileId);
    }
    setSelectedFiles(newSelected);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">
          Dosya Listesi ({files.length} dosya)
        </h3>
        {selectedFiles.size > 0 && (
          <p className="text-sm text-blue-600 mt-1">
            {selectedFiles.size} dosya seçili
          </p>
        )}
      </div>

      <div
        className="overflow-auto"
        style={{ height: containerHeight }}
        onScroll={handleScroll}
      >
        {/* Virtual spacer for items above visible area */}
        <div style={{ height: startIndex * itemHeight }} />

        {/* Visible items */}
        <div>
          {visibleFiles.map((file) => {
            return (
              <div
                key={file.id}
                className={`flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  selectedFiles.has(file.id) ? 'bg-blue-50 border-blue-200' : ''
                }`}
                style={{ height: itemHeight }}
              >
                <div className="flex items-center flex-1 space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedFiles.has(file.id)}
                    onChange={() => handleFileSelect(file.id)}
                    className="rounded border-gray-300"
                  />
                  
                  <span className="text-2xl">{getFileIcon(file)}</span>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 truncate">
                      {file.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatFileSize(file.size)} • {file.deviceType}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    {format(file.date, 'dd.MM.yyyy', { locale: tr })}
                  </div>
                  
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    {getCategoryIcon(file.category)}
                    <span className="hidden md:inline">
                      {getCategoryDisplayName(file.category)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onFileSelect?.(file)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Görüntüle"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onFileShare?.(file)}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                      title="Paylaş"
                    >
                      <Share className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Virtual spacer for items below visible area */}
        <div style={{ height: (files.length - endIndex) * itemHeight }} />
      </div>

      {files.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <File className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Henüz dosya yok</p>
        </div>
      )}
    </div>
  );
};