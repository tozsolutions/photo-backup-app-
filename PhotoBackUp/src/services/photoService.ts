import { Photo } from '../types';

export class PhotoService {
  private static instance: PhotoService;

  public static getInstance(): PhotoService {
    if (!PhotoService.instance) {
      PhotoService.instance = new PhotoService();
    }
    return PhotoService.instance;
  }

  async getPhotosFromDevice(): Promise<Photo[]> {
    return new Promise((resolve, reject) => {
      if (!('mediaDevices' in navigator) || !('getUserMedia' in navigator.mediaDevices)) {
        reject(new Error('Bu tarayıcı kamera erişimini desteklemiyor'));
        return;
      }

      // Create file input for photo selection
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.accept = 'image/*,video/*';
      
      input.onchange = (event) => {
        const target = event.target as HTMLInputElement;
        const files = target.files;
        
        if (!files || files.length === 0) {
          resolve([]);
          return;
        }

        const photos: Photo[] = Array.from(files).map((file, index) => ({
          id: `photo-${Date.now()}-${index}`,
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: new Date(file.lastModified),
          blob: file
        }));

        resolve(photos);
      };

      input.onerror = () => {
        reject(new Error('Dosya seçimi sırasında hata oluştu'));
      };

      input.click();
    });
  }

  async getPhotosFromGallery(): Promise<Photo[]> {
    // This method simulates getting photos from gallery
    // In a real app, this would use the File System Access API or similar
    return this.getPhotosFromDevice();
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  isPhoto(file: Photo): boolean {
    return file.type.startsWith('image/');
  }

  isVideo(file: Photo): boolean {
    return file.type.startsWith('video/');
  }

  async compressImage(photo: Photo, quality: number = 0.8): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!photo.blob || !this.isPhoto(photo)) {
        reject(new Error('Geçersiz fotoğraf'));
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions (max 1920x1080)
        const maxWidth = 1920;
        const maxHeight = 1080;
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx!.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Sıkıştırma başarısız'));
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Fotoğraf yüklenemedi'));
      };

      img.src = URL.createObjectURL(photo.blob);
    });
  }

  async createThumbnail(photo: Photo): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!photo.blob || !this.isPhoto(photo)) {
        reject(new Error('Geçersiz fotoğraf'));
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const size = 150;
        canvas.width = size;
        canvas.height = size;

        // Calculate crop dimensions for square thumbnail
        const { width, height } = img;
        const minDimension = Math.min(width, height);
        const scale = size / minDimension;
        
        const scaledWidth = width * scale;
        const scaledHeight = height * scale;
        
        const offsetX = (size - scaledWidth) / 2;
        const offsetY = (size - scaledHeight) / 2;

        ctx!.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
        
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };

      img.onerror = () => {
        reject(new Error('Thumbnail oluşturulamadı'));
      };

      img.src = URL.createObjectURL(photo.blob);
    });
  }
}