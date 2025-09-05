import React, { useState, useMemo } from 'react';
import { BackupFile } from '@/types';
import {
  File,
  Download,
  Camera,
  Send,
  Trash2,
  FileX,
  Search,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Eye,
  Share,
} from 'lucide-react';
import { formatFileSize, getCategoryDisplayName } from '@/utils';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface AdvancedFileManagerProps {
  files: BackupFile[];
  onFileSelect?: (file: BackupFile) => void;
  onFileShare?: (file: BackupFile) => void;
}

type ViewMode = 'grid' | 'list';
type SortField = 'name' | 'date' | 'size' | 'type';
type SortDirection = 'asc' | 'desc';

export const AdvancedFileManager: React.FC<AdvancedFileManagerProps> = ({
  files,
  onFileSelect,
  onFileShare,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDeviceType, setSelectedDeviceType] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: '',
  });
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  const filteredAndSortedFiles = useMemo(() => {
    let filtered = files.filter((file) => {
      // Search filter
      if (searchTerm && !file.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && file.category !== selectedCategory) {
        return false;
      }

      // Device type filter
      if (selectedDeviceType !== 'all' && file.deviceType !== selectedDeviceType) {
        return false;
      }

      // Date range filter
      if (dateRange.start && file.date < new Date(dateRange.start)) {
        return false;
      }
      if (dateRange.end && file.date > new Date(dateRange.end + 'T23:59:59')) {
        return false;
      }

      return true;
    });

    // Sort files
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name, 'tr');
          break;
        case 'date':
          comparison = a.date.getTime() - b.date.getTime();
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [files, searchTerm, selectedCategory, selectedDeviceType, dateRange, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
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

  const handleSelectAll = () => {
    if (selectedFiles.size === filteredAndSortedFiles.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(filteredAndSortedFiles.map(f => f.id)));
    }
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

  const getFileIcon = (file: BackupFile) => {
    return file.type === 'photo' ? '🖼️' : '🎬';
  };

  const categories = Array.from(new Set(files.map(f => f.category)));
  const deviceTypes = Array.from(new Set(files.map(f => f.deviceType)));

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Gelişmiş Dosya Yöneticisi</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Dosya ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tüm Kategoriler</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {getCategoryDisplayName(category)}
              </option>
            ))}
          </select>

          {/* Device Type Filter */}
          <select
            value={selectedDeviceType}
            onChange={(e) => setSelectedDeviceType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tüm Cihazlar</option>
            {deviceTypes.map((deviceType) => (
              <option key={deviceType} value={deviceType}>
                {deviceType}
              </option>
            ))}
          </select>

          {/* Date Range */}
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Başlangıç tarihi"
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Bitiş tarihi"
          />
        </div>

        {/* Stats and Bulk Actions */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">
            {filteredAndSortedFiles.length} dosya ({formatFileSize(filteredAndSortedFiles.reduce((sum, f) => sum + f.size, 0))})
            {selectedFiles.size > 0 && ` • ${selectedFiles.size} seçili`}
          </div>
          
          {selectedFiles.size > 0 && (
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm">
                Seçilenleri Sil
              </button>
              <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                Seçilenleri Paylaş
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {viewMode === 'list' && (
          <div className="space-y-2">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 py-2 text-sm font-medium text-gray-600 border-b">
              <div className="col-span-1">
                <input
                  type="checkbox"
                  checked={selectedFiles.size === filteredAndSortedFiles.length && filteredAndSortedFiles.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
              </div>
              <div className="col-span-4 cursor-pointer flex items-center space-x-1" onClick={() => handleSort('name')}>
                <span>Dosya Adı</span>
                {sortField === 'name' && (sortDirection === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />)}
              </div>
              <div className="col-span-2 cursor-pointer flex items-center space-x-1" onClick={() => handleSort('size')}>
                <span>Boyut</span>
                {sortField === 'size' && (sortDirection === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />)}
              </div>
              <div className="col-span-2 cursor-pointer flex items-center space-x-1" onClick={() => handleSort('date')}>
                <span>Tarih</span>
                {sortField === 'date' && (sortDirection === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />)}
              </div>
              <div className="col-span-2">Kategori</div>
              <div className="col-span-1">İşlemler</div>
            </div>

            {/* Files */}
            {filteredAndSortedFiles.map((file) => (
              <div
                key={file.id}
                className={`grid grid-cols-12 gap-4 py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors ${
                  selectedFiles.has(file.id) ? 'bg-blue-50 border border-blue-200' : ''
                }`}
              >
                <div className="col-span-1">
                  <input
                    type="checkbox"
                    checked={selectedFiles.has(file.id)}
                    onChange={() => handleFileSelect(file.id)}
                    className="rounded border-gray-300"
                  />
                </div>
                <div className="col-span-4 flex items-center space-x-3">
                  <span className="text-2xl">{getFileIcon(file)}</span>
                  <div>
                    <div className="font-medium text-gray-800 truncate">{file.name}</div>
                    <div className="text-xs text-gray-500">{file.deviceType}</div>
                  </div>
                </div>
                <div className="col-span-2 text-sm text-gray-600">
                  {formatFileSize(file.size)}
                </div>
                <div className="col-span-2 text-sm text-gray-600">
                  {format(file.date, 'dd.MM.yyyy HH:mm', { locale: tr })}
                </div>
                <div className="col-span-2 flex items-center space-x-1 text-sm text-gray-600">
                  {getCategoryIcon(file.category)}
                  <span>{getCategoryDisplayName(file.category)}</span>
                </div>
                <div className="col-span-1 flex items-center space-x-1">
                  <button
                    onClick={() => onFileSelect?.(file)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    title="Görüntüle"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onFileShare?.(file)}
                    className="p-1 text-green-600 hover:bg-green-100 rounded"
                    title="Paylaş"
                  >
                    <Share className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'grid' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredAndSortedFiles.map((file) => (
              <div
                key={file.id}
                className={`bg-gray-50 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${
                  selectedFiles.has(file.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => handleFileSelect(file.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">{getFileIcon(file)}</span>
                  <input
                    type="checkbox"
                    checked={selectedFiles.has(file.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleFileSelect(file.id);
                    }}
                    className="rounded border-gray-300"
                  />
                </div>
                <div className="text-sm font-medium text-gray-800 truncate mb-1">
                  {file.name}
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  {formatFileSize(file.size)}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{file.deviceType}</span>
                  <span>{format(file.date, 'dd.MM', { locale: tr })}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredAndSortedFiles.length === 0 && (
          <div className="text-center py-12">
            <FileX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Dosya Bulunamadı
            </h3>
            <p className="text-gray-600">
              Arama kriterlerinize uygun dosya bulunamadı.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};