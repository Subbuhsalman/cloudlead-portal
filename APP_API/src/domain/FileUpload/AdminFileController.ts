import { Request, Response } from 'express';
import FileUploadService from './FileUploadService';
import { FileUploadService as FileService } from '../../services/FileUpload/FileUploadService';
import path from 'path';
import FileUploadController from './FileUploadController';

class AdminFileController {
  private service: FileUploadService;
  private fileService: FileService;

  constructor() {
    this.service = new FileUploadService();
    // Configure file service for processed documents
    this.fileService = new FileService(
      'uploads/processed',
      50 * 1024 * 1024, // 50MB max size
      [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'text/plain',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv',
        'image/jpeg',
        'image/jpg',
        'image/png'
      ]
    );
  }

  getAllPendingFiles = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const per_page = parseInt(req.query.per_page as string) || 10;

      const result = await this.service.getAllPendingFiles(page, per_page);

      res.status(200).json({
        success: true,
        message: 'Pending files retrieved successfully',
        data: result
      });
    } catch (error) {
      console.error('AdminFileController.getAllPendingFiles error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve pending files',
        data: null
      });
    }
  };

  updateFileStatus = async (req: Request | any, res: Response): Promise<void> => {
    try {
      const fileId = parseInt(req.params.id);
      const { status, admin_notes } = req.body;
      const adminId = req.admin?.admin_user_id;

      console.log('Update file status request:', { fileId, status, admin_notes, adminId });

      if (!fileId || !status) {
        res.status(400).json({
          success: false,
          message: 'File ID and status are required',
          data: null
        });
        return;
      }

      const validStatuses = ['UPLOADED', 'PROCESSING', 'COMPLETED', 'FAILED'];
      if (!validStatuses.includes(status)) {
        res.status(400).json({
          success: false,
          message: 'Invalid status value',
          data: null
        });
        return;
      }

      const updateData: any = {};
      if (admin_notes) updateData.admin_notes = admin_notes;
      if (adminId) updateData.processed_by = adminId;

      const result = await this.service.updateFileStatus(fileId, status, updateData);

      res.status(200).json({
        success: true,
        message: 'File status updated successfully',
        data: result
      });
    } catch (error) {
      console.error('AdminFileController.updateFileStatus error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update file status',
        data: null
      });
    }
  };

  uploadProcessedFile = async (req: Request | any, res: Response): Promise<void> => {
    try {
      const fileId = parseInt(req.params.id);
      const adminId = req.admin?.admin_user_id;
      const { admin_notes } = req.body;

      if (!fileId) {
        res.status(400).json({
          success: false,
          message: 'File ID is required',
          data: null
        });
        return;
      }

      // Check if original file exists
      const originalFile = await this.service.getFileById(fileId);
      if (!originalFile) {
        res.status(404).json({
          success: false,
          message: 'Original file not found',
          data: null
        });
        return;
      }

      // Use multer to handle processed file upload
      const upload = this.fileService.getMulterConfig();
      const multer = require('multer')(upload);

      multer.single('processed_file')(req, res, async (err: any) => {
        if (err) {
          console.error('AdminFileController.uploadProcessedFile multer error:', err);
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
            message: 'No processed file provided',
            data: null
          });
          return;
        }

        try {
          // Force HTTPS in production, use req.protocol in development
          const protocol = process.env.NODE_ENV === 'production' ? 'https' : req.protocol;
          const uploadedFile = this.fileService.formatUploadedFile(
            req.file,
            `${protocol}://${req.get('host')}`
          );
          const fileController = new FileUploadController();
          const csvRecordCount = await fileController.countCsvRecords(req.file.path);
          const creditCost = csvRecordCount;
       
          
          await this.service.deductCredits(originalFile.User.user_id, creditCost, `File upload: ${req.file.originalname}`);


          const updateData: any = {
            processed_file_path: req.file.path,
            processed_file_url: uploadedFile.url,
            admin_notes: admin_notes || null,
            processed_by: adminId
          };

          const result = await this.service.updateFileStatus(fileId, 'COMPLETED', updateData);

          res.status(200).json({
            success: true,
            message: 'Processed file uploaded and status updated successfully',
            data: result
          });
        } catch (error) {
          // Clean up uploaded file on database error
          if (req.file) {
            await this.fileService.deleteFile(req.file.path);
          }
          
          console.error('AdminFileController.uploadProcessedFile database error:', error);
          res.status(500).json({
            success: false,
            message: 'Failed to save processed file information',
            data: null
          });
        }
      });
    } catch (error) {
      console.error('AdminFileController.uploadProcessedFile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
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
      console.error('AdminFileController.getFileById error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve file',
        data: null
      });
    }
  };

  downloadFile = async (req: Request, res: Response): Promise<void> => {
    try {
      const fileId = parseInt(req.params.id);
      const fileType = req.query.type as string; // 'original' or 'processed'

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

      let filePath: string;
      let filename: string;

      if (fileType === 'processed' && file.processed_file_path) {
        filePath = file.processed_file_path;
        filename = `processed_${file.original_filename}`;
      } else {
        filePath = file.file_path;
        filename = file.original_filename;
      }

      // Check if file exists
      const fs = require('fs');
      if (!fs.existsSync(filePath)) {
        res.status(404).json({
          success: false,
          message: 'Physical file not found',
          data: null
        });
        return;
      }

      res.download(filePath, filename, (err) => {
        if (err) {
          console.error('File download error:', err);
          res.status(500).json({
            success: false,
            message: 'File download failed',
            data: null
          });
        }
      });
    } catch (error) {
      console.error('AdminFileController.downloadFile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to download file',
        data: null
      });
    }
  };
}

export default AdminFileController;
