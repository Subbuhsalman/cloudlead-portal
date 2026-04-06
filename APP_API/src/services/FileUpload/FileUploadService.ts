import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';

export interface UploadedFile {
  filename: string;
  originalname: string;
  path: string;
  size: number;
  mimetype: string;
  url: string;
}

export class FileUploadService {
  private uploadDir: string;
  private uploadDirRelative: string; // Store the relative path for URL generation
  private maxSize: number;
  private allowedTypes: string[];

  constructor(
    uploadDir: string = 'uploads/documents',
    maxSize: number = 5 * 1024 * 1024, // 5MB
    allowedTypes: string[] = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  ) {
    this.uploadDir = path.join(process.cwd(), uploadDir);
    this.uploadDirRelative = uploadDir; // Store relative path for URL generation
    this.maxSize = maxSize;
    this.allowedTypes = allowedTypes;
    
    // Ensure upload directory exists
    this.ensureUploadDir();
  }

  private async ensureUploadDir(): Promise<void> {
    try {
      await fs.ensureDir(this.uploadDir);
    } catch (error) {
      console.error('Error creating upload directory:', error);
    }
  }

  private generateFileName(originalName: string): string {
    const ext = path.extname(originalName);
    const uniqueId = uuidv4();
    const timestamp = Date.now();
    return `logo_${timestamp}_${uniqueId}${ext}`;
  }

  public getMulterStorage(): multer.StorageEngine {
    return multer.diskStorage({
      destination: (req: Request, file: any, cb) => {
        cb(null, this.uploadDir);
      },
      filename: (req: Request, file: any, cb) => {
        const fileName = this.generateFileName(file.originalname);
        cb(null, fileName);
      }
    });
  }

  public getMulterFileFilter(): multer.Options['fileFilter'] {
    return (req: Request, file: any, cb) => {
      if (this.allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`Invalid file type. Allowed types: ${this.allowedTypes.join(', ')}`));
      }
    };
  }

  public getMulterConfig(): multer.Options {
    return {
      storage: this.getMulterStorage(),
      fileFilter: this.getMulterFileFilter(),
      limits: {
        fileSize: this.maxSize,
        files: 1, // Only allow one file at a time
      },
    };
  }

  public async deleteFile(filePath: string): Promise<boolean> {
    try {
      await fs.remove(path.join(process.cwd(), filePath));
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  public getFileUrl(filename: string, baseUrl?: string): string {
    // If baseUrl is not provided, use environment variable or default
    const host = baseUrl || process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    // Use the actual upload directory path instead of hardcoded 'documents'
    return `${host}/${this.uploadDirRelative}/${filename}`;
  }

  public formatUploadedFile(file: any, baseUrl?: string): UploadedFile {
    return {
      filename: file.filename,
      originalname: file.originalname,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype,
      url: this.getFileUrl(file.filename, baseUrl)
    };
  }

  public async getFileInfo(filename: string, baseUrl?: string): Promise<UploadedFile | null> {
    try {
      const filePath = path.join(this.uploadDir, filename);
      const stats = await fs.stat(filePath);
      
      return {
        filename: filename,
        originalname: filename,
        path: filePath,
        size: stats.size,
        mimetype: this.getMimeTypeFromExtension(filename),
        url: this.getFileUrl(filename, baseUrl)
      };
    } catch (error) {
      console.error('Error getting file info:', error);
      return null;
    }
  }

  private getMimeTypeFromExtension(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml'
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }
}
