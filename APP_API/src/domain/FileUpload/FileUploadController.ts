import { Request, Response } from 'express';
import FileUploadService from './FileUploadService';
import { FileUploadService as FileService } from '../../services/FileUpload/FileUploadService';

class FileUploadController {
  private service: FileUploadService;
  private fileService: FileService;

  constructor() {
    this.service = new FileUploadService();
    // Configure file service for CSV uploads only
    this.fileService = new FileService(
      'uploads/documents',
      50 * 1024 * 1024, // 50MB max size
      [
        'text/csv',
        'application/csv'
      ]
    );
  }

  upload = async (req: Request | any, res: Response): Promise<void> => {
    try {
      const userId = req.user?.user_id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized - User ID not found',
          data: null
        });
        return;
      }

      // Use multer to handle file upload
      const upload = this.fileService.getMulterConfig();
      const multer = require('multer')(upload);

      multer.single('file')(req, res, async (err: any) => {
        if (err) {
          console.error('FileUploadController.upload multer error:', err);
          res.status(400).json({
            success: false,
            message: err.message || 'File upload failed',
            data: null
          });
          return;
        }

        if (!req.file) {
          res.status(400).json({
            success: false,
            message: 'No file provided',
            data: null
          });
          return;
        }

        try {
          // Count CSV records for credit calculation
          // const csvRecordCount = await this.countCsvRecords(req.file.path);
          // const creditCost = csvRecordCount; // 1 credit per row if email exists OR if any Direct dial has phone number
          
          // Check if user has enough credits
          // const userCredits = await this.service.getUserCredits(userId);
          // if (userCredits < creditCost) {
          //   // Clean up uploaded file
          //   await this.fileService.deleteFile(req.file.path);
          //   res.status(400).json({
          //     success: false,
          //     message: `Insufficient credits. You have ${userCredits} credits but need ${creditCost} credits for this file.`,
          //     data: null
          //   });
          //   return;
          // }

          // Force HTTPS in production, use req.protocol in development
          const protocol = process.env.NODE_ENV === 'production' ? 'https' : req.protocol;
          const uploadedFile = this.fileService.formatUploadedFile(
            req.file,
            `${protocol}://${req.get('host')}`
          );

          const fileData = {
            user_id: userId,
            original_filename: req.file.originalname,
            file_path: req.file.path,
            file_url: uploadedFile.url,
            file_size: req.file.size,
            file_type: this.service.getFileTypeFromMimetype(req.file.mimetype),
            mime_type: req.file.mimetype,
            status: 'UPLOADED'
          };

          const result = await this.service.createFileUpload(fileData);

          // Deduct credits after successful file creation
          // await this.service.deductCredits(userId, creditCost, `File upload: ${req.file.originalname}`);

          res.status(201).json({
            success: true,
            message: `File uploaded successfully.`,
            data: {
              ...result,
              // creditCost,
              // remainingCredits: userCredits - creditCost
            }
          });
        } catch (error) {
          // Clean up uploaded file on database error
          if (req.file) {
            await this.fileService.deleteFile(req.file.path);
          }
          
          console.error('FileUploadController.upload database error:', error);
          res.status(500).json({
            success: false,
            message: 'Failed to save file information',
            data: null
          });
        }
      });
    } catch (error) {
      console.error('FileUploadController.upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        data: null
      });
    }
  };

  getUserFiles = async (req: Request | any, res: Response): Promise<void> => {
    try {
      const userId = req.user?.user_id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized - User ID not found',
          data: null
        });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const per_page = parseInt(req.query.per_page as string) || 10;

      const result = await this.service.getUserFiles(userId, page, per_page);

      res.status(200).json({
        success: true,
        message: 'User files retrieved successfully',
        data: result
      });
    } catch (error) {
      console.error('FileUploadController.getUserFiles error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve user files',
        data: null
      });
    }
  };

  getFileById = async (req: Request, res: Response): Promise<void> => {
    try {
      const fileId = parseInt(req.params.id);
      if (!fileId) {
        res.status(400).json({
          success: false,
          message: 'Invalid file ID',
          data: null
        });
        return;
      }

      const file = await this.service.getFileById(fileId);
      if (!file) {
        res.status(404).json({
          success: false,
          message: 'File not found',
          data: null
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'File retrieved successfully',
        data: file
      });
    } catch (error) {
      console.error('FileUploadController.getFileById error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve file',
        data: null
      });
    }
  };

  deleteFile = async (req: Request | any, res: Response): Promise<void> => {
    try {
      const userId = req.user?.user_id;
      const fileId = parseInt(req.params.id);

      if (!userId || !fileId) {
        res.status(400).json({
          success: false,
          message: 'Invalid request parameters',
          data: null
        });
        return;
      }

      // Check if file belongs to user
      const file = await this.service.getFileById(fileId);
      if (!file) {
        res.status(404).json({
          success: false,
          message: 'File not found',
          data: null
        });
        return;
      }

      if (file.user_id !== userId) {
        res.status(403).json({
          success: false,
          message: 'Access denied - File does not belong to user',
          data: null
        });
        return;
      }

      // Delete physical files
      if (file.file_path) {
        await this.fileService.deleteFile(file.file_path);
      }
      if (file.processed_file_path) {
        await this.fileService.deleteFile(file.processed_file_path);
      }

      // Delete database record
      await this.service.deleteFile(fileId);

      res.status(200).json({
        success: true,
        message: 'File deleted successfully',
        data: null
      });
    } catch (error) {
      console.error('FileUploadController.deleteFile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete file',
        data: null
      });
    }
  };

  public async countCsvRecords(filePath: string): Promise<number> {
    try {
      const fs = require('fs');
      const csv = require('csv-parser');
      
      return new Promise((resolve, reject) => {
        let creditCount = 0;
        let isFirstRow = true;
        
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (row: any) => {
            if (!isFirstRow) {
              // Check if email exists and is not empty
              const hasEmail = row.Email && row.Email.trim() !== '';
              // console.log('Row Email:', row);
              // Check if any Direct dial has phone number
              const directDial1 = row['Direct dial 1'] && row['Direct dial 1'].trim() !== '';
              const directDial2 = row['Direct dial 2'] && row['Direct dial 2'].trim() !== '';
              const directDial3 = row['Direct dial 3'] && row['Direct dial 3'].trim() !== '';
              const directDial4 = row['Direct Dial 4'] && row['Direct Dial 4'].trim() !== '';
              const Mobile = row['Mobile'] && row['Mobile'].trim() !== '';
              const hasPhoneNumber = Mobile || directDial1 || directDial2 || directDial3 || directDial4;

                console.log('Row has phone number:', hasPhoneNumber);
                console.log('hasEmail :', hasEmail);
                                console.log('------');

              // Charge 1 credit if email exists OR if any direct dial has phone number
              if (hasEmail || hasPhoneNumber) {
                creditCount++;
              }
            }
            isFirstRow = false;
          })
          .on('end', () => {
            resolve(creditCount);
          })
          .on('error', (error: any) => {
            reject(error);
          });
      });
    } catch (error) {
      console.error('Error counting CSV records:', error);
      throw new Error('Failed to count CSV records');
    }
  }
}

export default FileUploadController;
