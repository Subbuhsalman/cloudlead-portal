// File upload utility functions

export interface FileUploadOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  onProgress?: (progress: number) => void;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export class FileUploadUtil {
  static readonly DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5MB
  static readonly DEFAULT_ALLOWED_TYPES = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp'
  ];

  /**
   * Validate file before upload
   */
  static validateFile(
    file: File,
    options: FileUploadOptions = {}
  ): FileValidationResult {
    const {
      maxSize = FileUploadUtil.DEFAULT_MAX_SIZE,
      allowedTypes = FileUploadUtil.DEFAULT_ALLOWED_TYPES,
    } = options;

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
      };
    }

    // Check file size
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
      return {
        isValid: false,
        error: `File size must be less than ${maxSizeMB}MB`
      };
    }

    return { isValid: true };
  }

  /**
   * Create a preview URL for image files
   */
  static createPreviewUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsDataURL(file);
    });
  }

  /**
   * Format file size for display
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get file extension from filename
   */
  static getFileExtension(filename: string): string {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase();
  }

  /**
   * Check if file is an image
   */
  static isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
  }

  /**
   * Compress image file (basic canvas-based compression)
   */
  static compressImage(
    file: File, 
    quality: number = 0.8,
    maxWidth: number = 1024,
    maxHeight: number = 1024
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Failed to compress image'));
          }
        }, file.type, quality);
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }
}

// Export commonly used constants
export const LOGO_UPLOAD_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  quality: 0.9,
  maxWidth: 512,
  maxHeight: 512,
} as const;
